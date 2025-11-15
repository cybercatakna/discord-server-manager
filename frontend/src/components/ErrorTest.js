import React, { useState } from 'react';

/**
 * Component สำหรับทดสอบ Error Boundary
 * ใช้เพื่อจำลอง error และดูว่า Error Boundary ทำงานได้ถูกต้อง
 */
function ErrorTest() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    // จำลอง error ที่ไม่คาดคิด
    throw new Error('🧪 นี่คือ error ทดสอบจาก ErrorTest component');
  }

  return (
    <div style={{ padding: '20px', background: '#fff3cd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>🧪 ทดสอบ Error Boundary</h3>
      <p>คลิกปุ่มด้านล่างเพื่อจำลอง error และดู Error Boundary ทำงาน</p>
      <button
        onClick={() => setShouldThrow(true)}
        style={{
          padding: '10px 20px',
          background: '#f04747',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px',
          fontWeight: 'bold'
        }}
      >
        ⚠️ สร้าง Error ทดสอบ
      </button>
      <p style={{ marginTop: '10px', fontSize: '14px', color: '#856404' }}>
        💡 หลังจากคลิก component จะ throw error และ Error Boundary จะแสดงหน้า error
      </p>
    </div>
  );
}

export default ErrorTest;
