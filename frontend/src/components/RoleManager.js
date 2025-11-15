import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useToast } from './ToastContext';
import { useConfirm } from './ConfirmContext';
import RolePermissionsManager from './RolePermissionsManager';
import DraggableRole from './DraggableRole';

function RoleManager({ guildId, apiUrl }) {
  const toast = useToast();
  const { confirm } = useConfirm();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#99aab5');
  const [editingRole, setEditingRole] = useState(null);
  const [permissionsRole, setPermissionsRole] = useState(null);

  useEffect(() => {
    if (guildId) {
      fetchRoles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guildId]);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/roles`);
      const data = await response.json();
      setRoles(data.filter(role => role.name !== '@everyone'));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setLoading(false);
    }
  };

  const createRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newRoleName,
          color: newRoleColor
        })
      });
      
      if (response.ok) {
        setNewRoleName('');
        setNewRoleColor('#99aab5');
        fetchRoles();
      }
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const deleteRole = async (roleId) => {
    const role = roles.find(r => r.id === roleId);
    const confirmed = await confirm({
      title: 'ยืนยันการลบยศ',
      message: `คุณต้องการลบยศ "${role?.name}" หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`,
      confirmText: 'ลบยศ',
      cancelText: 'ยกเลิก',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/roles/${roleId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast.success('ลบยศสำเร็จ!');
        fetchRoles();
      } else {
        throw new Error('Failed to delete role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('ไม่สามารถลบยศได้');
    }
  };

  const updateRole = async (roleId, name, color) => {
    try {
      await fetch(`${apiUrl}/api/guilds/${guildId}/roles/${roleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color })
      });
      setEditingRole(null);
      fetchRoles();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const moveRole = useCallback(async (dragIndex, hoverIndex) => {
    const dragRole = roles[dragIndex];
    const updatedRoles = [...roles];
    
    // ย้ายตำแหน่งใน array
    updatedRoles.splice(dragIndex, 1);
    updatedRoles.splice(hoverIndex, 0, dragRole);
    
    // อัพเดท state ทันที (optimistic update)
    setRoles(updatedRoles);
    
    try {
      // ส่งคำขอไปยัง backend เพื่ออัพเดทตำแหน่ง
      await fetch(`${apiUrl}/api/guilds/${guildId}/roles/${dragRole.id}/position`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: hoverIndex })
      });
    } catch (error) {
      console.error('Error updating role position:', error);
      // ถ้าเกิด error ให้โหลดข้อมูลใหม่
      fetchRoles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles, apiUrl, guildId]);

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div className="role-manager">
      <div className="create-form">
        <h3>🆕 สร้างยศใหม่</h3>
        <form onSubmit={createRole}>
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="ชื่อยศ"
            className="input-field"
          />
          <div className="color-picker-group">
            <label>สี:</label>
            <input
              type="color"
              value={newRoleColor}
              onChange={(e) => setNewRoleColor(e.target.value)}
              className="color-picker"
            />
          </div>
          <button type="submit" className="btn-primary">สร้างยศ</button>
        </form>
      </div>

      <div className="roles-list">
        <h3>📋 ยศทั้งหมด (ลาก-วางเพื่อเรียงลำดับ)</h3>
        {roles.length === 0 ? (
          <p>ยังไม่มียศ</p>
        ) : (
          <DndProvider backend={HTML5Backend}>
            <div className="roles-hierarchy">
              {roles.map((role, index) => (
                <DraggableRole
                  key={role.id}
                  role={role}
                  index={index}
                  moveRole={moveRole}
                  isEditing={editingRole?.id === role.id}
                  onEdit={setEditingRole}
                  onDelete={deleteRole}
                  onPermissions={setPermissionsRole}
                  onUpdate={updateRole}
                />
              ))}
            </div>
          </DndProvider>
        )}
      </div>

      {permissionsRole && (
        <RolePermissionsManager
          role={permissionsRole}
          guildId={guildId}
          apiUrl={apiUrl}
          onClose={() => setPermissionsRole(null)}
          onUpdate={fetchRoles}
        />
      )}
    </div>
  );
}

export default RoleManager;
