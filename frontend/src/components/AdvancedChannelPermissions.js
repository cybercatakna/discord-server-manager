import React, { useState, useEffect } from 'react';

const CHANNEL_PERMISSIONS = {
  text: [
    { name: 'ViewChannel', label: '👁️ เห็นช่อง', description: 'สามารถเห็นช่องนี้' },
    { name: 'SendMessages', label: '💬 ส่งข้อความ', description: 'ส่งข้อความได้' },
    { name: 'ReadMessageHistory', label: '📖 อ่านประวัติ', description: 'อ่านข้อความเก่า' },
    { name: 'AddReactions', label: '👍 เพิ่ม Reaction', description: 'ใส่ reaction' },
    { name: 'AttachFiles', label: '📎 แนบไฟล์', description: 'แนบไฟล์และรูป' },
    { name: 'EmbedLinks', label: '🔗 ฝัง Link', description: 'แสดง link เป็น embed' },
    { name: 'MentionEveryone', label: '📢 Mention @everyone', description: 'แจ้งเตือนทุกคน' },
    { name: 'ManageMessages', label: '🗑️ จัดการข้อความ', description: 'ลบข้อความคนอื่น' },
    { name: 'UseExternalEmojis', label: '😎 Emoji จากเซิร์ฟอื่น', description: 'ใช้ emoji ภายนอก' },
    { name: 'CreatePublicThreads', label: '📌 สร้าง Thread', description: 'สร้าง public thread' },
    { name: 'SendTTSMessages', label: '🔊 TTS', description: 'ส่งข้อความอ่านเสียง' }
  ],
  voice: [
    { name: 'ViewChannel', label: '👁️ เห็นช่อง', description: 'สามารถเห็นช่องนี้' },
    { name: 'Connect', label: '🔊 เชื่อมต่อ', description: 'เข้าร่วมห้องเสียง' },
    { name: 'Speak', label: '🎤 พูด', description: 'พูดในห้องเสียง' },
    { name: 'Stream', label: '📺 Stream', description: 'แชร์หน้าจอ' },
    { name: 'UseVAD', label: '🎙️ Voice Activity', description: 'ใช้ voice detection' },
    { name: 'MuteMembers', label: '🔇 ปิดเสียงคนอื่น', description: 'ปิดไมค์คนอื่น' },
    { name: 'DeafenMembers', label: '🔕 Deafen คนอื่น', description: 'ทำให้คนอื่นไม่ได้ยิน' },
    { name: 'MoveMembers', label: '↔️ ย้ายคนอื่น', description: 'ย้ายคนไปห้องอื่น' },
    { name: 'PrioritySpeaker', label: '📢 Priority Speaker', description: 'เสียงดังกว่า' }
  ]
};

function AdvancedChannelPermissions({ channelId, channelName, channelType, guildId, apiUrl, onClose }) {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (channelId && guildId) {
      fetchRoles();
      fetchPermissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, guildId]);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/roles`);
      const data = await response.json();
      setRoles(data);
      if (data.length > 0) {
        setSelectedRole(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/channels/${channelId}/permissions`);
      const data = await response.json();
      
      const permsMap = {};
      data.forEach(perm => {
        permsMap[perm.id] = {
          allow: perm.allow,
          deny: perm.deny
        };
      });
      
      setPermissions(permsMap);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setLoading(false);
    }
  };

  const getPermissionState = (permName) => {
    if (!selectedRole || !permissions[selectedRole]) return null;
    
    const rolePerms = permissions[selectedRole];
    if (rolePerms.allow.includes(permName)) return 'allow';
    if (rolePerms.deny.includes(permName)) return 'deny';
    return null;
  };

  const setPermissionState = (permName, state) => {
    const newPerms = { ...permissions };
    if (!newPerms[selectedRole]) {
      newPerms[selectedRole] = { allow: [], deny: [] };
    }

    const rolePerms = newPerms[selectedRole];
    
    // ลบออกจากทั้ง allow และ deny
    rolePerms.allow = rolePerms.allow.filter(p => p !== permName);
    rolePerms.deny = rolePerms.deny.filter(p => p !== permName);

    // เพิ่มใน state ที่เลือก
    if (state === 'allow') {
      rolePerms.allow.push(permName);
    } else if (state === 'deny') {
      rolePerms.deny.push(permName);
    }

    setPermissions(newPerms);
  };

  const savePermissions = async () => {
    if (!selectedRole) return;

    try {
      const rolePerms = permissions[selectedRole] || { allow: [], deny: [] };
      
      // แปลง permission arrays เป็น object
      const permObj = {};
      rolePerms.allow.forEach(perm => {
        permObj[perm] = true;
      });
      rolePerms.deny.forEach(perm => {
        permObj[perm] = false;
      });

      const response = await fetch(
        `${apiUrl}/api/guilds/${guildId}/channels/${channelId}/permissions/${selectedRole}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(permObj)
        }
      );

      if (response.ok) {
        alert('✅ บันทึกสิทธิ์เรียบร้อย!');
        onClose();
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('❌ เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  const resetPermissions = async () => {
    if (!window.confirm('ต้องการลบการตั้งค่าสิทธิ์ของยศนี้หรือไม่?')) return;

    try {
      await fetch(
        `${apiUrl}/api/guilds/${guildId}/channels/${channelId}/permissions/${selectedRole}`,
        { method: 'DELETE' }
      );
      
      // อัพเดท state
      const newPerms = { ...permissions };
      delete newPerms[selectedRole];
      setPermissions(newPerms);
      
      alert('✅ รีเซ็ตสิทธิ์เรียบร้อย!');
    } catch (error) {
      console.error('Error resetting permissions:', error);
      alert('❌ เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="permissions-modal">
          <div className="modal-header">
            <h3>กำลังโหลด...</h3>
          </div>
        </div>
      </div>
    );
  }

  const permList = channelType === 'voice' ? CHANNEL_PERMISSIONS.voice : CHANNEL_PERMISSIONS.text;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="advanced-permissions-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🔐 สิทธิ์ขั้นสูง: {channelName}</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="modal-body">
          <div className="info-box">
            <p>💡 <strong>ตั้งค่าสิทธิ์แบบละเอียด</strong></p>
            <p>เลือกยศและกำหนดสิทธิ์แต่ละอย่างได้</p>
          </div>

          <div className="role-selector">
            <label>เลือกยศที่ต้องการตั้งค่า:</label>
            <select 
              value={selectedRole || ''} 
              onChange={(e) => setSelectedRole(e.target.value)}
              className="input-field"
            >
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="advanced-permissions-list">
            <div className="permissions-header">
              <div className="perm-name">สิทธิ์</div>
              <div className="perm-state-header">
                <span>✓ อนุญาต</span>
                <span>/ ค่าเริ่มต้น</span>
                <span>✗ ห้าม</span>
              </div>
            </div>

            {permList.map(perm => {
              const state = getPermissionState(perm.name);
              return (
                <div key={perm.name} className="advanced-permission-item">
                  <div className="permission-info">
                    <div className="permission-label">{perm.label}</div>
                    <div className="permission-description">{perm.description}</div>
                  </div>
                  <div className="permission-state-controls">
                    <button
                      className={`perm-btn allow ${state === 'allow' ? 'active' : ''}`}
                      onClick={() => setPermissionState(perm.name, state === 'allow' ? null : 'allow')}
                      title="อนุญาต"
                    >
                      ✓
                    </button>
                    <button
                      className={`perm-btn neutral ${state === null ? 'active' : ''}`}
                      onClick={() => setPermissionState(perm.name, null)}
                      title="ค่าเริ่มต้น"
                    >
                      /
                    </button>
                    <button
                      className={`perm-btn deny ${state === 'deny' ? 'active' : ''}`}
                      onClick={() => setPermissionState(perm.name, state === 'deny' ? null : 'deny')}
                      title="ห้าม"
                    >
                      ✗
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={resetPermissions} className="btn-reset">
            🔄 รีเซ็ตยศนี้
          </button>
          <button onClick={onClose} className="btn-cancel">
            ยกเลิก
          </button>
          <button onClick={savePermissions} className="btn-apply">
            ✓ บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdvancedChannelPermissions;
