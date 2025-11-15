#!/bin/bash

# สคริปต์สำหรับรัน Backend และ Frontend พร้อมกัน

echo "=========================================="
echo "🎮 Discord Server Manager - Starting..."
echo "=========================================="
echo ""

# ตรวจสอบว่าติดตั้ง dependencies แล้วหรือยัง
if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "❌ ยังไม่ได้ติดตั้ง dependencies"
    echo "กรุณารันคำสั่ง: ./install.sh ก่อน"
    exit 1
fi

# ตรวจสอบไฟล์ .env
if [ ! -f "backend/.env" ]; then
    echo "❌ ไม่พบไฟล์ backend/.env"
    echo "กรุณาสร้างไฟล์และใส่ Discord Bot Token"
    exit 1
fi

if grep -q "your_discord_bot_token_here" backend/.env; then
    echo "❌ กรุณาแก้ไขไฟล์ backend/.env"
    echo "   เปลี่ยน DISCORD_TOKEN=your_discord_bot_token_here"
    echo "   เป็น Token ของ Bot ที่คุณสร้าง"
    exit 1
fi

echo "✅ กำลังเริ่มต้นทั้ง Backend และ Frontend..."
echo ""
echo "📡 Backend API: http://localhost:3001"
echo "🌐 Web Interface: http://localhost:3000"
echo ""
echo "⚠️  กด Ctrl+C เพื่อหยุดทั้งสองตัว"
echo ""

# สร้าง trap เพื่อจัดการกับการกด Ctrl+C
trap 'echo ""; echo "🛑 กำลังหยุดทั้ง Backend และ Frontend..."; kill 0' EXIT

# รัน Backend ใน background
cd backend
npm start &
BACKEND_PID=$!
cd ..

# รอให้ Backend เริ่มต้น
echo "⏳ รอ Backend เริ่มต้น (3 วินาที)..."
sleep 3

# รัน Frontend
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

# รอให้โปรเซสทั้งสองทำงาน
wait
