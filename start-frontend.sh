#!/bin/bash

# สคริปต์สำหรับรัน Frontend (Web Interface)

echo "=========================================="
echo "🌐 Starting Frontend Web Interface..."
echo "=========================================="
echo ""

# ตรวจสอบว่าติดตั้ง dependencies แล้วหรือยัง
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ ยังไม่ได้ติดตั้ง dependencies"
    echo "กรุณารันคำสั่ง: ./install.sh ก่อน"
    exit 1
fi

echo "✅ เริ่มต้น Frontend..."
echo "🌐 Web Interface จะเปิดที่: http://localhost:3000"
echo ""
echo "⚠️  ต้องรัน Backend ก่อน! (./start-backend.sh)"
echo ""
echo "กด Ctrl+C เพื่อหยุด"
echo ""

cd frontend
npm start
