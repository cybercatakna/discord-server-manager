import React, { useState, useEffect } from 'react';
import { useToast } from './ToastContext';

function MemberManager({ guildId, apiUrl }) {
  const toast = useToast();
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewMode, setViewMode] = useState('byRole'); // 'byRole' or 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [processingRole, setProcessingRole] = useState(null); // เก็บ roleId ที่กำลังประมวลผล

  useEffect(() => {
    if (guildId) {
      fetchMembers();
      fetchRoles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guildId]);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/members`);
      const data = await response.json();
      setMembers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching members:', error);
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/roles`);
      const data = await response.json();
      // เรียงตาม position (สูงไปต่ำ)
      const sortedRoles = data
        .filter(role => role.name !== '@everyone')
        .sort((a, b) => b.position - a.position);
      setRoles(sortedRoles);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const addRoleToMember = async (memberId, roleId) => {
    setProcessingRole(roleId);
    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/members/${memberId}/roles/${roleId}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add role');
      }
      
      await fetchMembers();
      toast.success('เพิ่มยศสำเร็จ!');
    } catch (error) {
      console.error('Error adding role:', error);
      toast.error(`ไม่สามารถเพิ่มยศได้: ${error.message}`);
    } finally {
      setProcessingRole(null);
    }
  };

  const removeRoleFromMember = async (memberId, roleId) => {
    setProcessingRole(roleId);
    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/members/${memberId}/roles/${roleId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove role');
      }
      
      await fetchMembers();
      toast.success('ลบยศสำเร็จ!');
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error(`ไม่สามารถลบยศได้: ${error.message}`);
    } finally {
      setProcessingRole(null);
    }
  };

  const getMemberRoles = (member) => {
    return roles.filter(role => member.roles.includes(role.id));
  };

  const getAvailableRoles = (member) => {
    return roles.filter(role => !member.roles.includes(role.id));
  };

  // ฟังก์ชันค้นหาสมาชิก
  const filterMembers = (membersList) => {
    if (!searchQuery.trim()) {
      return membersList;
    }
    
    const query = searchQuery.toLowerCase();
    return membersList.filter(member => 
      member.displayName.toLowerCase().includes(query) ||
      member.username.toLowerCase().includes(query)
    );
  };

  // จัดกลุ่มสมาชิกตามยศ
  const getMembersByRole = () => {
    const membersByRole = {};
    
    // สร้างกลุ่มสำหรับแต่ละยศ
    roles.forEach(role => {
      membersByRole[role.id] = {
        role: role,
        members: []
      };
    });
    
    // กลุ่มสำหรับคนที่ไม่มียศ
    membersByRole['no-role'] = {
      role: { name: 'ไม่มียศ', color: '#99aab5', id: 'no-role' },
      members: []
    };
    
    // กรองสมาชิกตามคำค้นหาก่อน
    const filteredMembers = filterMembers(members);
    
    // จัดสมาชิกเข้ากลุ่ม (ใช้ยศสูงสุดของแต่ละคน)
    filteredMembers.forEach(member => {
      const memberRolesList = getMemberRoles(member);
      
      if (memberRolesList.length === 0) {
        membersByRole['no-role'].members.push(member);
      } else {
        // ใช้ยศแรก (ยศสูงสุด) เพราะเรียงแล้ว
        const highestRole = memberRolesList[0];
        if (membersByRole[highestRole.id]) {
          membersByRole[highestRole.id].members.push(member);
        }
      }
    });
    
    return membersByRole;
  };

  // นับจำนวนสมาชิกออนไลน์ในแต่ละกลุ่ม
  const getOnlineCount = (membersList) => {
    return membersList.filter(m => m.status === 'online' || m.status === 'idle' || m.status === 'dnd').length;
  };

  const renderMemberCard = (member) => (
    <div key={member.id} className="member-card-inline">
      <div className="member-info-inline">
        <div className="member-avatar-wrapper">
          <img 
            src={member.avatar} 
            alt={member.username}
            className="member-avatar-small"
          />
          <span className={`status-indicator status-${member.status || 'offline'}`}></span>
        </div>
        <div className="member-details-inline">
          <div className="member-name-inline">{member.displayName}</div>
          <div className="member-username-small">@{member.username}</div>
        </div>
      </div>

      <div className="member-actions-inline">
        <div className="member-role-badges-small">
          {getMemberRoles(member).slice(0, 3).map(role => (
            <span 
              key={role.id}
              className="role-badge-tiny"
              style={{ backgroundColor: role.color }}
              title={role.name}
            />
          ))}
          {getMemberRoles(member).length > 3 && (
            <span className="role-badge-more">+{getMemberRoles(member).length - 3}</span>
          )}
        </div>
        <button
          onClick={() => setSelectedMember(selectedMember?.id === member.id ? null : member)}
          className="btn-manage-member"
          title="จัดการยศ"
        >
          ⚙️
        </button>
      </div>

      {selectedMember?.id === member.id && (
        <div className="member-role-manager">
          <div className="current-roles">
            <strong>ยศปัจจุบัน:</strong>
            <div className="roles-badges">
              {getMemberRoles(member).length === 0 ? (
                <span className="no-roles">ไม่มียศ</span>
              ) : (
                getMemberRoles(member).map(role => (
                  <span 
                    key={role.id}
                    className="role-badge"
                    style={{ backgroundColor: role.color }}
                  >
                    {role.name}
                    <button
                      onClick={() => removeRoleFromMember(member.id, role.id)}
                      className="remove-role-btn"
                      title="ลบยศ"
                      disabled={processingRole === role.id}
                    >
                      {processingRole === role.id ? '⏳' : '×'}
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="add-role-section">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addRoleToMember(member.id, e.target.value);
                  e.target.value = '';
                }
              }}
              className="role-select"
              disabled={processingRole !== null}
            >
              <option value="">{processingRole !== null ? '⏳ กำลังประมวลผล...' : '+ เพิ่มยศ'}</option>
              {getAvailableRoles(member).map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  const filteredMembersCount = filterMembers(members).length;

  return (
    <div className="member-manager">
      <div className="member-manager-header">
        <h3>👥 สมาชิก ({members.length})</h3>
        <div className="view-mode-toggle">
          <button
            className={`toggle-btn ${viewMode === 'byRole' ? 'active' : ''}`}
            onClick={() => setViewMode('byRole')}
          >
            📋 แยกตามยศ
          </button>
          <button
            className={`toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            📄 ทั้งหมด
          </button>
        </div>
      </div>

      {/* ช่องค้นหา */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 ค้นหาสมาชิก (ชื่อ Discord หรือ username)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="clear-search-btn"
            title="ล้างการค้นหา"
          >
            ✕
          </button>
        )}
        {searchQuery && (
          <div className="search-results-count">
            พบ {filteredMembersCount} คน
          </div>
        )}
      </div>

      {filteredMembersCount === 0 && searchQuery ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>ไม่พบสมาชิก</h3>
          <p>ไม่พบสมาชิกที่ตรงกับ "{searchQuery}"</p>
          <button onClick={() => setSearchQuery('')} className="btn-primary">
            ล้างการค้นหา
          </button>
        </div>
      ) : viewMode === 'byRole' ? (
        <div className="members-by-role">
          {Object.entries(getMembersByRole())
            .filter(([roleId, data]) => data.members.length > 0)
            .sort((a, b) => {
              // เรียง: ยศที่มี position สูงกว่าขึ้นก่อน, "ไม่มียศ" อยู่ท้ายสุด
              if (a[0] === 'no-role') return 1;
              if (b[0] === 'no-role') return -1;
              return b[1].role.position - a[1].role.position;
            })
            .map(([roleId, data]) => (
              <div key={roleId} className="role-group">
                <div className="role-group-header">
                  <div className="role-group-title">
                    <span 
                      className="role-color-dot" 
                      style={{ backgroundColor: data.role.color }}
                    />
                    <span className="role-group-name">
                      {data.role.name} — {data.members.length}
                    </span>
                  </div>
                  <span className="online-count">
                    {getOnlineCount(data.members)} ออนไลน์
                  </span>
                </div>
                <div className="role-members-list">
                  {data.members.map(member => renderMemberCard(member))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="members-grid">
          {filterMembers(members).map(member => (
            <div key={member.id} className="member-card">
              <div className="member-info">
                <img 
                  src={member.avatar} 
                  alt={member.username}
                  className="member-avatar"
                />
                <div className="member-details">
                  <div className="member-name">{member.displayName}</div>
                  <div className="member-username">@{member.username}</div>
                </div>
              </div>

              <div className="member-roles-section">
                <div className="current-roles">
                  <strong>ยศปัจจุบัน:</strong>
                  <div className="roles-badges">
                    {getMemberRoles(member).length === 0 ? (
                      <span className="no-roles">ไม่มียศ</span>
                    ) : (
                      getMemberRoles(member).map(role => (
                        <span 
                          key={role.id}
                          className="role-badge"
                          style={{ backgroundColor: role.color }}
                        >
                          {role.name}
                          <button
                            onClick={() => removeRoleFromMember(member.id, role.id)}
                            className="remove-role-btn"
                            title="ลบยศ"
                            disabled={processingRole === role.id}
                          >
                            {processingRole === role.id ? '⏳' : '×'}
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="add-role-section">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addRoleToMember(member.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="role-select"
                    disabled={processingRole !== null}
                  >
                    <option value="">{processingRole !== null ? '⏳ กำลังประมวลผล...' : '+ เพิ่มยศ'}</option>
                    {getAvailableRoles(member).map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MemberManager;
