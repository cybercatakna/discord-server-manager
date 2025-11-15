const { Client, GatewayIntentBits, PermissionFlagsBits, ChannelType } = require('discord.js');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
    ]
});

const app = express();
app.use(cors());
app.use(express.json());

let currentGuild = null;

client.once('ready', () => {
    console.log(`✅ Bot เข้าสู่ระบบในนาม ${client.user.tag}`);
    console.log(`🔗 API Server กำลังทำงานที่ http://localhost:3001`);
});

client.login(process.env.DISCORD_TOKEN);

// API Endpoints

// ดึงข้อมูล Server
app.get('/api/guilds', async (req, res) => {
    try {
        const guilds = client.guilds.cache.map(guild => ({
            id: guild.id,
            name: guild.name,
            icon: guild.iconURL()
        }));
        res.json(guilds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ดึงข้อมูล Channels และ Categories
app.get('/api/guilds/:guildId/structure', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        currentGuild = guild;
        
        const channels = await guild.channels.fetch();
        const structure = {
            categories: [],
            channels: []
        };

        channels.forEach(channel => {
            if (channel.type === ChannelType.GuildCategory) {
                structure.categories.push({
                    id: channel.id,
                    name: channel.name,
                    position: channel.position,
                    type: 'category'
                });
            } else if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) {
                structure.channels.push({
                    id: channel.id,
                    name: channel.name,
                    type: channel.type === ChannelType.GuildText ? 'text' : 'voice',
                    parentId: channel.parentId,
                    position: channel.position
                });
            }
        });

        res.json(structure);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// สร้างหมวดหมู่ (Category)
app.post('/api/guilds/:guildId/categories', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const { name } = req.body;
        
        const category = await guild.channels.create({
            name: name,
            type: ChannelType.GuildCategory
        });
        
        res.json({ 
            id: category.id, 
            name: category.name, 
            type: 'category',
            position: category.position
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// สร้างห้อง Text Channel
app.post('/api/guilds/:guildId/channels/text', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const { name, parentId } = req.body;
        
        const channel = await guild.channels.create({
            name: name,
            type: ChannelType.GuildText,
            parent: parentId || null
        });
        
        res.json({ 
            id: channel.id, 
            name: channel.name, 
            type: 'text',
            parentId: channel.parentId,
            position: channel.position
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// สร้างห้อง Voice Channel
app.post('/api/guilds/:guildId/channels/voice', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const { name, parentId } = req.body;
        
        const channel = await guild.channels.create({
            name: name,
            type: ChannelType.GuildVoice,
            parent: parentId || null
        });
        
        res.json({ 
            id: channel.id, 
            name: channel.name, 
            type: 'voice',
            parentId: channel.parentId,
            position: channel.position
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ลบ Channel หรือ Category
app.delete('/api/guilds/:guildId/channels/:channelId', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const channel = await guild.channels.fetch(req.params.channelId);
        
        await channel.delete();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ย้ายช่อง/หมวดหมู่
app.patch('/api/guilds/:guildId/channels/:channelId/move', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const channel = await guild.channels.fetch(req.params.channelId);
        const { parentId, position } = req.body;
        
        await channel.edit({
            parent: parentId,
            position: position
        });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ดึงข้อมูล Roles
app.get('/api/guilds/:guildId/roles', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const roles = await guild.roles.fetch();
        
        const rolesList = roles.map(role => ({
            id: role.id,
            name: role.name,
            color: role.hexColor,
            position: role.position,
            permissions: role.permissions.toArray()
        }));
        
        res.json(rolesList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// สร้าง Role
app.post('/api/guilds/:guildId/roles', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const { name, color, permissions } = req.body;
        
        const role = await guild.roles.create({
            name: name,
            color: color || null,
            permissions: permissions || []
        });
        
        res.json({ 
            id: role.id, 
            name: role.name, 
            color: role.hexColor,
            position: role.position
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// แก้ไข Role
app.patch('/api/guilds/:guildId/roles/:roleId', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const role = await guild.roles.fetch(req.params.roleId);
        const { name, color, permissions } = req.body;
        
        await role.edit({
            name: name || role.name,
            color: color || role.color,
            permissions: permissions || role.permissions
        });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// เปลี่ยนตำแหน่งของ Role
app.patch('/api/guilds/:guildId/roles/:roleId/position', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const role = await guild.roles.fetch(req.params.roleId);
        const { position } = req.body;
        
        await role.setPosition(position);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ลบ Role
app.delete('/api/guilds/:guildId/roles/:roleId', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const role = await guild.roles.fetch(req.params.roleId);
        
        await role.delete();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ดึงข้อมูลสมาชิก
app.get('/api/guilds/:guildId/members', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const members = await guild.members.fetch();
        
        const membersList = members.map(member => ({
            id: member.id,
            username: member.user.username,
            displayName: member.displayName,
            avatar: member.user.displayAvatarURL(),
            roles: member.roles.cache.map(role => role.id)
        }));
        
        res.json(membersList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// เพิ่ม Role ให้สมาชิก
app.post('/api/guilds/:guildId/members/:memberId/roles/:roleId', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const member = await guild.members.fetch(req.params.memberId);
        const role = await guild.roles.fetch(req.params.roleId);
        
        // ตรวจสอบว่า bot มีสิทธิ์
        const botMember = await guild.members.fetch(client.user.id);
        if (!botMember.permissions.has('ManageRoles')) {
            return res.status(403).json({ error: 'Bot ไม่มีสิทธิ์ Manage Roles' });
        }
        
        // ตรวจสอบว่ายศของ bot สูงกว่ายศที่จะให้
        if (botMember.roles.highest.position <= role.position) {
            return res.status(403).json({ 
                error: `ยศของ Bot ต่ำกว่ายศ "${role.name}" - กรุณาย้ายยศ Bot ขึ้นไปด้านบน` 
            });
        }
        
        await member.roles.add(role);
        res.json({ success: true, message: 'เพิ่มยศสำเร็จ' });
    } catch (error) {
        console.error('Error adding role:', error);
        res.status(500).json({ error: error.message });
    }
});

// ลบ Role จากสมาชิก
app.delete('/api/guilds/:guildId/members/:memberId/roles/:roleId', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const member = await guild.members.fetch(req.params.memberId);
        const role = await guild.roles.fetch(req.params.roleId);
        
        // ตรวจสอบว่า bot มีสิทธิ์
        const botMember = await guild.members.fetch(client.user.id);
        if (!botMember.permissions.has('ManageRoles')) {
            return res.status(403).json({ error: 'Bot ไม่มีสิทธิ์ Manage Roles' });
        }
        
        // ตรวจสอบว่ายศของ bot สูงกว่ายศที่จะลบ
        if (botMember.roles.highest.position <= role.position) {
            return res.status(403).json({ 
                error: `ยศของ Bot ต่ำกว่ายศ "${role.name}" - กรุณาย้ายยศ Bot ขึ้นไปด้านบน` 
            });
        }
        
        await member.roles.remove(role);
        res.json({ success: true, message: 'ลบยศสำเร็จ' });
    } catch (error) {
        console.error('Error removing role:', error);
        res.status(500).json({ error: error.message });
    }
});

// แก้ไขชื่อ Channel/Category
app.patch('/api/guilds/:guildId/channels/:channelId', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const channel = await guild.channels.fetch(req.params.channelId);
        const { name } = req.body;
        
        await channel.edit({ name });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ดึง Permissions ของช่อง
app.get('/api/guilds/:guildId/channels/:channelId/permissions', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const channel = await guild.channels.fetch(req.params.channelId);
        
        const permissionOverwrites = [];
        channel.permissionOverwrites.cache.forEach(overwrite => {
            permissionOverwrites.push({
                id: overwrite.id,
                type: overwrite.type, // 0 = Role, 1 = Member
                allow: overwrite.allow.toArray(),
                deny: overwrite.deny.toArray()
            });
        });
        
        res.json(permissionOverwrites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ตั้งค่า Permission สำหรับ Role ในช่อง (รองรับทุก permission)
app.put('/api/guilds/:guildId/channels/:channelId/permissions/:roleId', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const channel = await guild.channels.fetch(req.params.channelId);
        
        // รับ permissions object จาก request body
        // format: { PermissionName: true/false, ... }
        const permissions = req.body;
        
        // แปลง true/false เป็น permission object สำหรับ Discord.js
        const permissionOverwrites = {};
        
        for (const [permName, value] of Object.entries(permissions)) {
            if (value !== undefined && value !== null) {
                permissionOverwrites[permName] = value;
            }
        }
        
        await channel.permissionOverwrites.edit(req.params.roleId, permissionOverwrites);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ลบ Permission Override ของ Role ในช่อง
app.delete('/api/guilds/:guildId/channels/:channelId/permissions/:roleId', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const channel = await guild.channels.fetch(req.params.channelId);
        
        await channel.permissionOverwrites.delete(req.params.roleId);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ตั้งค่าให้ช่องมองเห็นได้เฉพาะยศที่เลือก (ซ่อนจาก @everyone และแสดงเฉพาะยศที่เลือก)
app.post('/api/guilds/:guildId/channels/:channelId/set-visible-roles', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const channel = await guild.channels.fetch(req.params.channelId);
        const { roleIds } = req.body; // Array ของ Role IDs ที่ต้องการให้เห็น
        
        // 1. ซ่อนช่องจาก @everyone
        const everyoneRole = guild.roles.everyone;
        await channel.permissionOverwrites.edit(everyoneRole, {
            ViewChannel: false
        });
        
        // 2. ให้ role ที่เลือกมองเห็นได้
        for (const roleId of roleIds) {
            await channel.permissionOverwrites.edit(roleId, {
                ViewChannel: true
            });
        }
        
        res.json({ success: true, message: 'ตั้งค่าสิทธิ์เรียบร้อย' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// รีเซ็ต Permissions ของช่อง (ให้ทุกคนเห็นเหมือนเดิม)
app.post('/api/guilds/:guildId/channels/:channelId/reset-permissions', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(req.params.guildId);
        const channel = await guild.channels.fetch(req.params.channelId);
        
        // ลบ permission overwrites ทั้งหมด
        const overwrites = channel.permissionOverwrites.cache;
        for (const [id, overwrite] of overwrites) {
            await channel.permissionOverwrites.delete(id);
        }
        
        res.json({ success: true, message: 'รีเซ็ตสิทธิ์เรียบร้อย' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server กำลังทำงานที่พอร์ต ${PORT}`);
});
