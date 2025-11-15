import React, { createContext, useContext, useState, useCallback } from 'react';

const ConfirmContext = createContext();

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return context;
};

export const ConfirmProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: '',
    message: '',
    confirmText: 'ยืนยัน',
    cancelText: 'ยกเลิก',
    onConfirm: () => {},
    onCancel: () => {},
    type: 'warning' // 'warning', 'danger', 'info'
  });

  const confirm = useCallback(({
    title = 'ยืนยันการดำเนินการ',
    message,
    confirmText = 'ยืนยัน',
    cancelText = 'ยกเลิก',
    type = 'warning'
  }) => {
    return new Promise((resolve) => {
      setConfig({
        title,
        message,
        confirmText,
        cancelText,
        type,
        onConfirm: () => {
          setIsOpen(false);
          resolve(true);
        },
        onCancel: () => {
          setIsOpen(false);
          resolve(false);
        }
      });
      setIsOpen(true);
    });
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && <ConfirmDialog config={config} />}
    </ConfirmContext.Provider>
  );
};

const ConfirmDialog = ({ config }) => {
  const icons = {
    warning: '⚠️',
    danger: '🗑️',
    info: 'ℹ️'
  };

  return (
    <div className="confirm-overlay" onClick={config.onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-header confirm-header-${config.type}`}>
          <span className="confirm-icon">{icons[config.type]}</span>
          <h3>{config.title}</h3>
        </div>
        <div className="confirm-body">
          <p>{config.message}</p>
        </div>
        <div className="confirm-footer">
          <button onClick={config.onCancel} className="btn-secondary">
            {config.cancelText}
          </button>
          <button 
            onClick={config.onConfirm} 
            className={`btn-${config.type === 'danger' ? 'danger' : 'primary'}`}
          >
            {config.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
