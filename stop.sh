#!/bin/bash

# สคริปต์สำหรับหยุด Backend และ Frontend

echo "=========================================="
echo "🛑 Stopping Discord Server Manager..."
echo "=========================================="
echo ""

# หยุด Backend (Node.js processes ที่รัน bot.js)
BACKEND_PIDS=$(pgrep -f "node.*bot.js")
if [ ! -z "$BACKEND_PIDS" ]; then
    echo "🤖 หยุด Backend (PIDs: $BACKEND_PIDS)..."
    kill $BACKEND_PIDS 2>/dev/null
    echo "✅ Backend หยุดแล้ว"
else
    echo "ℹ️  Backend ไม่ได้ทำงานอยู่"
fi

# หยุด Frontend (react-scripts)
FRONTEND_PIDS=$(pgrep -f "react-scripts start")
if [ ! -z "$FRONTEND_PIDS" ]; then
    echo "🌐 หยุด Frontend (PIDs: $FRONTEND_PIDS)..."
    kill $FRONTEND_PIDS 2>/dev/null
    echo "✅ Frontend หยุดแล้ว"
else
    echo "ℹ️  Frontend ไม่ได้ทำงานอยู่"
fi

# หยุด node processes ที่เหลือ (ถ้ามี)
NODE_PIDS=$(pgrep -f "node.*discord")
if [ ! -z "$NODE_PIDS" ]; then
    echo "🔄 หยุด Node processes ที่เหลือ..."
    kill $NODE_PIDS 2>/dev/null
fi

echo ""
echo "✅ ทุกอย่างหยุดแล้ว"
