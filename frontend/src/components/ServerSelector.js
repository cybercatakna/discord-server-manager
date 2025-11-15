import React, { useState, useEffect } from 'react';

function ServerSelector({ selectedGuild, setSelectedGuild, apiUrl }) {
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuilds();
  }, []);

  const fetchGuilds = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/guilds`);
      const data = await response.json();
      setGuilds(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching guilds:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="server-selector">กำลังโหลด...</div>;
  }

  return (
    <div className="server-selector">
      <select 
        value={selectedGuild || ''} 
        onChange={(e) => setSelectedGuild(e.target.value)}
        className="guild-select"
      >
        <option value="">เลือกเซิร์ฟเวอร์</option>
        {guilds.map(guild => (
          <option key={guild.id} value={guild.id}>
            {guild.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ServerSelector;
