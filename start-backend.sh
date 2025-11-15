#!/bin/bash

# สคริปต์สำหรับรัน Backend (Discord Bot)

echo "=========================================="
echo "🤖 Starting Discord Bot Backend..."
echo "=========================================="
echo ""

# ตรวจสอบว่าติดตั้ง dependencies แล้วหรือยัง
if [ ! -d "backend/node_modules" ]; then
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

echo "✅ เริ่มต้น Backend..."
echo "📡 API Server จะทำงานที่: http://localhost:3001"
echo ""
echo "กด Ctrl+C เพื่อหยุด"
echo ""

cd backend
npm start
