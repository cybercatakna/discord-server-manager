import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ToastProvider } from './components/ToastContext';
import { ConfirmProvider } from './components/ConfirmContext';
import ErrorBoundary from './components/ErrorBoundary';
import ServerSelector from './components/ServerSelector';
import ChannelManager from './components/ChannelManager';
import RoleManager from './components/RoleManager';
import MemberManager from './components/MemberManager';
import './App.css';

const API_URL = 'http://localhost:3001';

function App() {
  const [selectedGuild, setSelectedGuild] = useState(null);
  const [activeTab, setActiveTab] = useState('channels');

  return (
    <ErrorBoundary>
      <ToastProvider>
        <ConfirmProvider>
          <DndProvider backend={HTML5Backend}>
          <div className="App">
          <header className="app-header">
            <h1>🎮 Discord Server Manager</h1>
            <ServerSelector 
              selectedGuild={selectedGuild} 
              setSelectedGuild={setSelectedGuild}
              apiUrl={API_URL}
            />
          </header>

        {selectedGuild && (
          <div className="main-container">
            <nav className="tab-navigation">
              <button 
                className={activeTab === 'channels' ? 'active' : ''}
                onClick={() => setActiveTab('channels')}
              >
                📁 ช่องและหมวดหมู่
              </button>
              <button 
                className={activeTab === 'roles' ? 'active' : ''}
                onClick={() => setActiveTab('roles')}
              >
                🎭 ยศ (Roles)
              </button>
              <button 
                className={activeTab === 'members' ? 'active' : ''}
                onClick={() => setActiveTab('members')}
              >
                👥 สมาชิก
              </button>
            </nav>

            <div className="content">
              {activeTab === 'channels' && (
                <ChannelManager guildId={selectedGuild} apiUrl={API_URL} />
              )}
              {activeTab === 'roles' && (
                <RoleManager guildId={selectedGuild} apiUrl={API_URL} />
              )}
              {activeTab === 'members' && (
                <MemberManager guildId={selectedGuild} apiUrl={API_URL} />
              )}
            </div>
          </div>
        )}

        {!selectedGuild && (
          <div className="welcome-screen">
            <h2>👋 ยินดีต้อนรับ</h2>
            <p>กรุณาเลือกเซิร์ฟเวอร์ที่ต้องการจัดการ</p>
          </div>
        )}
        </div>
        </DndProvider>
      </ConfirmProvider>
    </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
