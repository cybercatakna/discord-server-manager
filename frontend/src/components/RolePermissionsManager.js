import React, { useState } from 'react';

// รายการ Permissions หลักๆ ของ Discord
const PERMISSIONS = {
  general: [
    { name: 'Administrator', label: '👑 ผู้ดูแลระบบ (เข้าถึงทุกอย่าง)', description: 'มีสิทธิ์ทุกอย่าง รวมถึงข้ามการตั้งค่าช่อง' },
    { name: 'ViewAuditLog', label: '📋 ดู Audit Log', description: 'ดูประวัติการเปลี่ยนแปลงเซิร์ฟเวอร์' },
    { name: 'ManageGuild', label: '⚙️ จัดการเซิร์ฟเวอร์', description: 'เปลี่ยนชื่อเซิร์ฟเวอร์ ภูมิภาค และอื่นๆ' },
    { name: 'ManageRoles', label: '🎭 จัดการยศ', description: 'สร้าง แก้ไข และลบยศ' },
    { name: 'ManageChannels', label: '📁 จัดการช่อง', description: 'สร้าง แก้ไข และลบช่อง' },
    { name: 'KickMembers', label: '👢 เตะสมาชิก', description: 'เตะสมาชิกออกจากเซิร์ฟเวอร์' },
    { name: 'BanMembers', label: '🔨 แบนสมาชิก', description: 'แบนสมาชิกออกจากเซิร์ฟเวอร์' },
    { name: 'ManageNicknames', label: '✏️ จัดการชื่อเล่น', description: 'เปลี่ยนชื่อเล่นของสมาชิกคนอื่น' },
    { name: 'ManageEmojisAndStickers', label: '😀 จัดการ Emoji และ Sticker', description: 'เพิ่ม ลบ และแก้ไข emoji' },
    { name: 'ManageWebhooks', label: '🔗 จัดการ Webhook', description: 'สร้างและจัดการ webhook' },
    { name: 'ViewChannel', label: '👁️ เห็นช่อง', description: 'เห็นช่องต่างๆ (โดยปกติทุกคนมี)' }
  ],
  text: [
    { name: 'SendMessages', label: '💬 ส่งข้อความ', description: 'ส่งข้อความในช่อง text' },
    { name: 'SendMessagesInThreads', label: '🧵 ส่งข้อความใน Thread', description: 'ส่งข้อความใน thread' },
    { name: 'CreatePublicThreads', label: '📌 สร้าง Public Thread', description: 'สร้าง thread สาธารณะ' },
    { name: 'CreatePrivateThreads', label: '🔒 สร้าง Private Thread', description: 'สร้าง thread ส่วนตัว' },
    { name: 'EmbedLinks', label: '🔗 ฝัง Link', description: 'Link จะแสดงเป็น embed' },
    { name: 'AttachFiles', label: '📎 แนบไฟล์', description: 'แนบไฟล์และรูปภาพ' },
    { name: 'AddReactions', label: '👍 เพิ่ม Reaction', description: 'ใส่ reaction ในข้อความ' },
    { name: 'UseExternalEmojis', label: '😎 ใช้ Emoji จากเซิร์ฟอื่น', description: 'ใช้ emoji จากเซิร์ฟเวอร์อื่น' },
    { name: 'UseExternalStickers', label: '🎨 ใช้ Sticker จากเซิร์ฟอื่น', description: 'ใช้ sticker จากเซิร์ฟเวอร์อื่น' },
    { name: 'MentionEveryone', label: '📢 กล่าวถึง @everyone', description: 'แจ้งเตือนทุกคนด้วย @everyone' },
    { name: 'ManageMessages', label: '🗑️ จัดการข้อความ', description: 'ลบและปักหมุดข้อความของคนอื่น' },
    { name: 'ManageThreads', label: '🧵 จัดการ Thread', description: 'ลบและจัดการ thread' },
    { name: 'ReadMessageHistory', label: '📖 อ่านประวัติข้อความ', description: 'อ่านข้อความเก่าๆ' },
    { name: 'SendTTSMessages', label: '🔊 ส่งข้อความ TTS', description: 'ส่งข้อความที่อ่านออกเสียง' },
    { name: 'UseApplicationCommands', label: '⚡ ใช้คำสั่ง Slash', description: 'ใช้คำสั่ง slash และ context menu' }
  ],
  voice: [
    { name: 'Connect', label: '🔊 เชื่อมต่อ Voice', description: 'เข้าร่วมห้องเสียง' },
    { name: 'Speak', label: '🎤 พูด', description: 'พูดในห้องเสียง' },
    { name: 'Stream', label: '📺 Stream', description: 'แชร์หน้าจอ/stream' },
    { name: 'UseEmbeddedActivities', label: '🎮 ใช้ Activity', description: 'เริ่ม activity ในห้องเสียง' },
    { name: 'UseSoundboard', label: '🎵 ใช้ Soundboard', description: 'เล่นเสียงจาก soundboard' },
    { name: 'UseExternalSounds', label: '🎶 ใช้เสียงจากเซิร์ฟอื่น', description: 'ใช้เสียงจากเซิร์ฟเวอร์อื่น' },
    { name: 'UseVAD', label: '🎙️ ใช้ Voice Activity', description: 'ใช้ voice detection แทน push-to-talk' },
    { name: 'PrioritySpeaker', label: '📢 Priority Speaker', description: 'เสียงดังกว่าคนอื่นเมื่อพูด' },
    { name: 'MuteMembers', label: '🔇 ปิดเสียงสมาชิก', description: 'ปิดไมค์คนอื่น' },
    { name: 'DeafenMembers', label: '🔕 Deafen สมาชิก', description: 'ทำให้คนอื่นไม่ได้ยินเสียง' },
    { name: 'MoveMembers', label: '↔️ ย้ายสมาชิก', description: 'ย้ายคนอื่นไปห้องเสียงอื่น' }
  ]
};

function RolePermissionsManager({ role, guildId, apiUrl, onClose, onUpdate }) {
  const [permissions, setPermissions] = useState(role.permissions || []);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const hasPermission = (permName) => {
    return permissions.includes(permName);
  };

  const togglePermission = (permName) => {
    if (permName === 'Administrator') {
      // ถ้าเปิด Administrator จะได้ทุก permission
      if (hasPermission('Administrator')) {
        setPermissions([]);
      } else {
        const allPerms = [
          ...PERMISSIONS.general.map(p => p.name),
          ...PERMISSIONS.text.map(p => p.name),
          ...PERMISSIONS.voice.map(p => p.name)
        ];
        setPermissions(allPerms);
      }
    } else {
      if (hasPermission(permName)) {
        setPermissions(permissions.filter(p => p !== permName));
      } else {
        setPermissions([...permissions, permName]);
      }
    }
  };

  const savePermissions = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/roles/${role.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: role.name,
          color: role.color,
          permissions: permissions
        })
      });
      
      if (response.ok) {
        alert('✅ บันทึกสิทธิ์เรียบร้อย!');
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('❌ เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const renderPermissionsList = (permList) => {
    return permList.map(perm => (
      <label key={perm.name} className="permission-item">
        <input
          type="checkbox"
          checked={hasPermission(perm.name)}
          onChange={() => togglePermission(perm.name)}
          disabled={hasPermission('Administrator') && perm.name !== 'Administrator'}
        />
        <div className="permission-info">
          <div className="permission-label">{perm.label}</div>
          <div className="permission-description">{perm.description}</div>
        </div>
      </label>
    ));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="permissions-manager-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🎭 จัดการสิทธิ์: {role.name}</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="modal-body">
          {hasPermission('Administrator') && (
            <div className="admin-warning">
              <strong>⚠️ โหมด Administrator เปิดอยู่</strong>
              <p>ยศนี้มีสิทธิ์ทุกอย่าง การเปลี่ยนแปลง permission อื่นจะไม่มีผล</p>
            </div>
          )}

          <div className="permissions-tabs">
            <button 
              className={activeTab === 'general' ? 'active' : ''}
              onClick={() => setActiveTab('general')}
            >
              ⚙️ ทั่วไป
            </button>
            <button 
              className={activeTab === 'text' ? 'active' : ''}
              onClick={() => setActiveTab('text')}
            >
              💬 Text Channel
            </button>
            <button 
              className={activeTab === 'voice' ? 'active' : ''}
              onClick={() => setActiveTab('voice')}
            >
              🔊 Voice Channel
            </button>
          </div>

          <div className="permissions-list">
            {activeTab === 'general' && renderPermissionsList(PERMISSIONS.general)}
            {activeTab === 'text' && renderPermissionsList(PERMISSIONS.text)}
            {activeTab === 'voice' && renderPermissionsList(PERMISSIONS.voice)}
          </div>

          <div className="permissions-summary">
            <strong>สิทธิ์ที่เลือก:</strong> {permissions.length} รายการ
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">
            ยกเลิก
          </button>
          <button 
            onClick={savePermissions} 
            className="btn-apply"
            disabled={saving}
          >
            {saving ? '⏳ กำลังบันทึก...' : '✓ บันทึกสิทธิ์'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RolePermissionsManager;
