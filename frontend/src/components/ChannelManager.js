import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useToast } from './ToastContext';
import { useConfirm } from './ConfirmContext';
import ChannelPermissions from './ChannelPermissions';

const ItemTypes = {
  CHANNEL: 'channel',
  CATEGORY: 'category'
};

function DraggableChannel({ channel, onMove, onDelete, onEdit, onPermissions, apiUrl, guildId }) {
  const { confirm } = useConfirm();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CHANNEL,
    item: { id: channel.id, type: channel.type, parentId: channel.parentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CHANNEL,
    drop: (item) => {
      if (item.id !== channel.id && channel.type === 'category') {
        onMove(item.id, channel.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const getChannelIcon = (type) => {
    if (type === 'text') return '💬';
    if (type === 'voice') return '🔊';
    return '📁';
  };

  const handleDelete = async () => {
    const channelType = channel.type === 'category' ? 'หมวดหมู่' : 'ช่อง';
    const confirmed = await confirm({
      title: `ยืนยันการลบ${channelType}`,
      message: `คุณต้องการลบ${channelType} "${channel.name}" หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`,
      confirmText: `ลบ${channelType}`,
      cancelText: 'ยกเลิก',
      type: 'danger'
    });
    
    if (confirmed) {
      onDelete(channel.id);
    }
  };

  const handleEdit = () => {
    const newName = prompt('ชื่อใหม่:', channel.name);
    if (newName && newName !== channel.name) {
      onEdit(channel.id, newName);
    }
  };

  const handlePermissions = () => {
    onPermissions(channel);
  };

  const ref = channel.type === 'category' ? (node) => drag(drop(node)) : drag;

  return (
    <div
      ref={ref}
      className={`channel-item ${channel.type} ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-target' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span className="channel-icon">{getChannelIcon(channel.type)}</span>
      <span className="channel-name">{channel.name}</span>
      <div className="channel-actions">
        {channel.type !== 'category' && (
          <button onClick={handlePermissions} className="btn-permissions" title="ตั้งค่าสิทธิ์">🔒</button>
        )}
        <button onClick={handleEdit} className="btn-edit" title="แก้ไข">✏️</button>
        <button onClick={handleDelete} className="btn-delete" title="ลบ">🗑️</button>
      </div>
    </div>
  );
}

function CategorySection({ category, channels, onMove, onDelete, onEdit, onPermissions, apiUrl, guildId }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CHANNEL,
    drop: (item) => {
      if (item.parentId !== category.id) {
        onMove(item.id, category.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div className="category-section">
      <DraggableChannel 
        channel={category} 
        onMove={onMove}
        onDelete={onDelete}
        onEdit={onEdit}
        onPermissions={onPermissions}
        apiUrl={apiUrl}
        guildId={guildId}
      />
      <div 
        ref={drop} 
        className={`category-channels ${isOver ? 'drop-zone-active' : ''}`}
      >
        {channels.length === 0 ? (
          <div className="empty-category">ลากช่องมาที่นี่</div>
        ) : (
          channels.map(channel => (
            <DraggableChannel 
              key={channel.id}
              channel={channel}
              onMove={onMove}
              onDelete={onDelete}
              onEdit={onEdit}
              onPermissions={onPermissions}
              apiUrl={apiUrl}
              guildId={guildId}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ChannelManager({ guildId, apiUrl }) {
  const toast = useToast();
  const [structure, setStructure] = useState({ categories: [], channels: [] });
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState('text');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [permissionsChannel, setPermissionsChannel] = useState(null);

  const fetchStructure = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/structure`);
      const data = await response.json();
      setStructure(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching structure:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (guildId) {
      fetchStructure();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guildId]);

  const createCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName })
      });
      
      if (response.ok) {
        setNewCategoryName('');
        fetchStructure();
        toast.success('สร้างหมวดหมู่สำเร็จ!');
      } else {
        throw new Error('Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('ไม่สามารถสร้างหมวดหมู่ได้');
    }
  };

  const createChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    try {
      const endpoint = newChannelType === 'text' ? 'text' : 'voice';
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/channels/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newChannelName,
          parentId: selectedCategory || null
        })
      });
      
      if (response.ok) {
        setNewChannelName('');
        fetchStructure();
        const channelType = newChannelType === 'text' ? 'ข้อความ' : 'เสียง';
        toast.success(`สร้างช่อง${channelType}สำเร็จ!`);
      } else {
        throw new Error('Failed to create channel');
      }
    } catch (error) {
      console.error('Error creating channel:', error);
      toast.error('ไม่สามารถสร้างช่องได้');
    }
  };

  const moveChannel = async (channelId, newParentId) => {
    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/channels/${channelId}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId: newParentId })
      });
      
      if (response.ok) {
        fetchStructure();
        toast.success('ย้ายช่องสำเร็จ!');
      } else {
        throw new Error('Failed to move channel');
      }
    } catch (error) {
      console.error('Error moving channel:', error);
      toast.error('ไม่สามารถย้ายช่องได้');
    }
  };

  const deleteChannel = async (channelId) => {
    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/channels/${channelId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchStructure();
        toast.success('ลบสำเร็จ!');
      } else {
        throw new Error('Failed to delete channel');
      }
    } catch (error) {
      console.error('Error deleting channel:', error);
      toast.error('ไม่สามารถลบได้');
    }
  };

  const editChannel = async (channelId, newName) => {
    try {
      const response = await fetch(`${apiUrl}/api/guilds/${guildId}/channels/${channelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });
      
      if (response.ok) {
        fetchStructure();
        toast.success('แก้ไขชื่อสำเร็จ!');
      } else {
        throw new Error('Failed to edit channel');
      }
    } catch (error) {
      console.error('Error editing channel:', error);
      toast.error('ไม่สามารถแก้ไขชื่อได้');
    }
  };

  const handlePermissions = (channel) => {
    setPermissionsChannel(channel);
  };

  const closePermissions = () => {
    setPermissionsChannel(null);
    fetchStructure(); // รีเฟรชข้อมูลหลังจากตั้งค่า
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CHANNEL,
    drop: (item) => {
      if (item.parentId !== null) {
        moveChannel(item.id, null);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  const channelsWithoutCategory = structure.channels.filter(ch => !ch.parentId);

  return (
    <div className="channel-manager">
      <div className="create-forms">
        <form onSubmit={createCategory} className="create-form">
          <h3>🆕 สร้างหมวดหมู่</h3>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="ชื่อหมวดหมู่"
            className="input-field"
          />
          <button type="submit" className="btn-primary">สร้าง</button>
        </form>

        <form onSubmit={createChannel} className="create-form">
          <h3>🆕 สร้างช่อง</h3>
          <input
            type="text"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            placeholder="ชื่อช่อง"
            className="input-field"
          />
          <select 
            value={newChannelType}
            onChange={(e) => setNewChannelType(e.target.value)}
            className="input-field"
          >
            <option value="text">💬 Text Channel</option>
            <option value="voice">🔊 Voice Channel</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            <option value="">ไม่มีหมวดหมู่</option>
            {structure.categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary">สร้าง</button>
        </form>
      </div>

      <div className="channels-structure">
        <h3>📋 โครงสร้างเซิร์ฟเวอร์</h3>
        <p className="hint">💡 ลากและวางช่องต่างๆ เพื่อย้ายไปยังหมวดหมู่อื่น</p>
        
        {structure.categories.map(category => {
          const categoryChannels = structure.channels.filter(ch => ch.parentId === category.id);
          return (
            <CategorySection
              key={category.id}
              category={category}
              channels={categoryChannels}
              onMove={moveChannel}
              onDelete={deleteChannel}
              onEdit={editChannel}
              onPermissions={handlePermissions}
              apiUrl={apiUrl}
              guildId={guildId}
            />
          );
        })}

        <div className="no-category-section">
          <h4>ช่องที่ไม่มีหมวดหมู่</h4>
          <div 
            ref={drop}
            className={`channels-list ${isOver ? 'drop-zone-active' : ''}`}
          >
            {channelsWithoutCategory.length === 0 ? (
              <div className="empty-section">ไม่มีช่อง</div>
            ) : (
              channelsWithoutCategory.map(channel => (
                <DraggableChannel
                  key={channel.id}
                  channel={channel}
                  onMove={moveChannel}
                  onDelete={deleteChannel}
                  onEdit={editChannel}
                  onPermissions={handlePermissions}
                  apiUrl={apiUrl}
                  guildId={guildId}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {permissionsChannel && (
        <ChannelPermissions
          channelId={permissionsChannel.id}
          channelName={permissionsChannel.name}
          channelType={permissionsChannel.type}
          guildId={guildId}
          apiUrl={apiUrl}
          onClose={closePermissions}
        />
      )}
    </div>
  );
}

export default ChannelManager;
