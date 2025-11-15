import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'ROLE';

function DraggableRole({ role, index, moveRole, isEditing, onEdit, onDelete, onPermissions, onUpdate }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { id: role.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item) => {
      if (item.index !== index) {
        moveRole(item.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`draggable-role ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-over' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="role-drag-handle">
        <span className="drag-icon">⋮⋮</span>
      </div>
      <div className="role-position">#{index + 1}</div>
      <div 
        className="role-color-indicator" 
        style={{ backgroundColor: role.color }}
      ></div>
      
      {isEditing ? (
        <div className="role-edit-inline">
          <input
            type="text"
            defaultValue={role.name}
            id={`edit-name-${role.id}`}
            className="input-field"
            placeholder="ชื่อยศ"
          />
          <input
            type="color"
            defaultValue={role.color}
            id={`edit-color-${role.id}`}
            className="color-picker"
          />
          <button
            onClick={() => {
              const name = document.getElementById(`edit-name-${role.id}`).value;
              const color = document.getElementById(`edit-color-${role.id}`).value;
              onUpdate(role.id, name, color);
            }}
            className="btn-success"
          >
            ✓
          </button>
          <button
            onClick={() => onEdit(null)}
            className="btn-secondary"
          >
            ✗
          </button>
        </div>
      ) : (
        <>
          <div className="role-info">
            <span className="role-name" style={{ color: role.color }}>
              {role.name}
            </span>
            <span className="role-members">{role.members || 0} สมาชิก</span>
          </div>
          <div className="role-actions">
            <button
              onClick={() => onPermissions(role)}
              className="btn-permissions"
              title="จัดการสิทธิ์"
            >
              🔐
            </button>
            <button
              onClick={() => onEdit(role)}
              className="btn-edit"
              title="แก้ไข"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(role.id)}
              className="btn-delete"
              title="ลบ"
            >
              🗑️
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default DraggableRole;
