import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // อัพเดท state เพื่อแสดง fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // บันทึก error เพื่อการ debug
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // สามารถส่ง error ไปยัง error reporting service ได้ที่นี่
    // เช่น Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // รีโหลดหน้าเว็บ
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">⚠️</div>
            <h1>เกิดข้อผิดพลาด</h1>
            <p className="error-boundary-message">
              ขออภัย มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary>รายละเอียดข้อผิดพลาด (สำหรับนักพัฒนา)</summary>
                <div className="error-boundary-stack">
                  <strong>{this.state.error.toString()}</strong>
                  <pre>{this.state.errorInfo?.componentStack}</pre>
                </div>
              </details>
            )}
            
            <div className="error-boundary-actions">
              <button 
                onClick={this.handleReset}
                className="error-boundary-button primary"
              >
                🔄 รีโหลดหน้าเว็บ
              </button>
              <button 
                onClick={() => window.history.back()}
                className="error-boundary-button secondary"
              >
                ← ย้อนกลับ
              </button>
            </div>

            <div className="error-boundary-tips">
              <h3>💡 คำแนะนำ:</h3>
              <ul>
                <li>ตรวจสอบว่า Discord Bot ยังทำงานอยู่</li>
                <li>ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</li>
                <li>ลองรีเฟรชหน้าเว็บอีกครั้ง</li>
                <li>ตรวจสอบ Console เพื่อดูข้อผิดพลาดเพิ่มเติม</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
