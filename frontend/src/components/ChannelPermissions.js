import React, { useState, useEffect } from 'react';
import AdvancedChannelPermissions from './AdvancedChannelPermissions';

function ChannelPermissions({ channelId, channelName, channelType, guildId, apiUrl, onClose }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/roles`);
      const data = await response.json();
      setRoles(data.filter(role => role.name !== '@everyone'));
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchCurrentPermissions = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/channels/${channelId}/permissions`);
      const data = await response.json();
      
      // หา roles ที่มี ViewChannel = true
      const visibleRoleIds = data
        .filter(perm => perm.type === 0 && perm.allow.includes('ViewChannel'))
        .map(perm => perm.id);
      
      setSelectedRoles(visibleRoleIds);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelId && guildId) {
      fetchRoles();
      fetchCurrentPermissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, guildId]);

  const toggleRole = (roleId) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const applyPermissions = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/guilds/${guildId}/channels/${channelId}/set-visible-roles`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roleIds: selectedRoles })
        }
      );
      
      if (response.ok) {
        alert('✅ ตั้งค่าสิทธิ์เรียบร้อย!');
        onClose();
      }
    } catch (error) {
      console.error('Error applying permissions:', error);
      alert('❌ เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  const resetPermissions = async () => {
    if (!window.confirm('คุณต้องการรีเซ็ตสิทธิ์ของช่องนี้หรือไม่?\n(ทุกคนจะเห็นช่องนี้เหมือนเดิม)')) {
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/api/guilds/${guildId}/channels/${channelId}/reset-permissions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if (response.ok) {
        alert('✅ รีเซ็ตสิทธิ์เรียบร้อย!');
        onClose();
      }
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="permissions-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🔒 ตั้งค่าสิทธิ์: {channelName}</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="modal-body">
          <div className="info-box">
            <p>💡 <strong>เลือกยศที่ต้องการให้เห็นช่องนี้</strong></p>
            <p>ยศที่ไม่ได้เลือกจะไม่เห็นช่องนี้</p>
          </div>

          <div className="roles-selection">
            <h4>เลือกยศที่มองเห็นได้:</h4>
            {roles.length === 0 ? (
              <p>ไม่มียศในเซิร์ฟเวอร์</p>
            ) : (
              <div className="roles-checkboxes">
                {roles.map(role => (
                  <label key={role.id} className="role-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => toggleRole(role.id)}
                    />
                    <span 
                      className="role-name"
                      style={{ color: role.color !== '#000000' ? role.color : '#99aab5' }}
                    >
                      {role.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="current-status">
            <h4>สถานะปัจจุบัน:</h4>
            {selectedRoles.length === 0 ? (
              <p className="status-text">🌐 ทุกคนเห็นช่องนี้ (ค่าเริ่มต้น)</p>
            ) : (
              <p className="status-text">
                🔒 เห็นได้เฉพาะ {selectedRoles.length} ยศที่เลือก
              </p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={resetPermissions} className="btn-reset">
            🔄 รีเซ็ตสิทธิ์
          </button>
          <button onClick={() => setShowAdvanced(true)} className="btn-advanced">
            🔐 ขั้นสูง
          </button>
          <button onClick={onClose} className="btn-cancel">
            ยกเลิก
          </button>
          <button onClick={applyPermissions} className="btn-apply">
            ✓ บันทึกการตั้งค่า
          </button>
        </div>
      </div>

      {showAdvanced && (
        <AdvancedChannelPermissions
          channelId={channelId}
          channelName={channelName}
          channelType={channelType}
          guildId={guildId}
          apiUrl={apiUrl}
          onClose={() => setShowAdvanced(false)}
        />
      )}
    </div>
  );
}

export default ChannelPermissions;
