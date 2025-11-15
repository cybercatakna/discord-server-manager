# Discord Server Manager 🎮

โปรเจคสำหรับการตั้งค่าและจัดการ Discord Server ผ่าน Web Interface ที่ใช้งานง่าย พัฒนาด้วย React และ Node.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)

## 📸 Screenshots

![Discord Server Manager](https://via.placeholder.com/800x400?text=Discord+Server+Manager+UI)

## ✨ ฟีเจอร์เด่น

### 🎯 การจัดการช่องและหมวดหมู่

### 🎯 การจัดการช่องและหมวดหมู่
- สร้างหมวดหมู่ (Categories) ใหม่
- สร้างห้อง Text Channel และ Voice Channel
- **ลากและวางเพื่อย้ายช่องระหว่างหมวดหมู่** (Drag & Drop)
- แก้ไขชื่อช่องและหมวดหมู่
- ลบช่องและหมวดหมู่
- **🔒 ตั้งค่าสิทธิ์ช่อง - กำหนดว่ายศไหนเห็นช่องได้บ้าง** ⭐ ใหม่!

### 🎭 การจัดการยศ (Roles)
- สร้างยศใหม่พร้อมกำหนดสี
- **ลากและวางเพื่อเรียงลำดับยศ** (Role Hierarchy) 🆕
- แก้ไขชื่อและสียศ inline
- ลบยศ
- **🔐 จัดการสิทธิ์ยศแบบครบถ้วน (40+ permissions)** 🆕
  - สิทธิ์ทั่วไป: Administrator, ManageGuild, ManageRoles, KickMembers, BanMembers
  - สิทธิ์ช่องข้อความ: SendMessages, AttachFiles, MentionEveryone, ManageMessages
  - สิทธิ์ช่องเสียง: Connect, Speak, MuteMembers, MoveMembers, Stream
- **🔒 จัดการสิทธิ์ช่องแบบขั้นสูง (Allow/Neutral/Deny)** 🆕

### 👥 การจัดการสมาชิก
- ดูรายชื่อสมาชิกทั้งหมดในเซิร์ฟเวอร์
- เพิ่มยศให้สมาชิก
- ลบยศจากสมาชิก
- แสดงยศปัจจุบันของแต่ละคน

## 🚀 การติดตั้ง

### ข้อกำหนดเบื้องต้น
- Node.js (เวอร์ชัน 16 ขึ้นไป)
- Discord Bot Token
- npm หรือ yarn

### 1. สร้าง Discord Bot

1. ไปที่ [Discord Developer Portal](https://discord.com/developers/applications)
2. คลิก "New Application" และตั้งชื่อ
3. ไปที่เมนู "Bot" และคลิก "Add Bot"
4. คัดลอก Token (จะใช้ในขั้นตอนถัดไป)
5. เปิดใช้งาน Privileged Gateway Intents:
   - ✅ PRESENCE INTENT
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT
6. ไปที่เมนู "OAuth2" > "URL Generator"
7. เลือก Scopes: `bot` และ `applications.commands`
8. เลือก Bot Permissions:
   - ✅ Manage Channels
   - ✅ Manage Roles
   - ✅ View Channels
   - ✅ Send Messages
   - ✅ Manage Server
9. คัดลอก URL ที่สร้างขึ้นและเปิดในเบราว์เซอร์เพื่อเชิญ Bot เข้า Server

### 2. ติดตั้ง Backend

```bash
cd backend
npm install
```

แก้ไขไฟล์ `.env`:
```env
DISCORD_TOKEN=ใส่_Token_ของคุณที่นี่
PORT=3001
```

### 3. ติดตั้ง Frontend

```bash
cd frontend
npm install
```

---

## ⚡ วิธีใช้งานแบบง่าย (ด้วย Bash Scripts)

### ติดตั้งครั้งแรก
```bash
./install.sh
```
จะติดตั้ง dependencies ทั้ง Backend และ Frontend อัตโนมัติ

### รันโปรเจค

**รันทั้งหมดพร้อมกัน (แนะนำ):**
```bash
./start.sh
```

**หรือรันแยกส่วน:**
```bash
# Terminal 1: รัน Backend
./start-backend.sh

# Terminal 2: รัน Frontend  
./start-frontend.sh
```

**รัน Backend แบบ Development (รีสตาร์ทอัตโนมัติ):**
```bash
./dev.sh
```

**หยุดทั้งหมด:**
```bash
./stop.sh
```

---

## 🎬 การรันโปรเจค (แบบปกติ)

### เริ่ม Backend (Terminal 1)
```bash
cd backend
npm start
```

Backend จะทำงานที่: `http://localhost:3001`

### เริ่ม Frontend (Terminal 2)
```bash
cd frontend
npm start
```

Frontend จะเปิดอัตโนมัติที่: `http://localhost:3000`

## 📖 วิธีใช้งาน

1. **เลือกเซิร์ฟเวอร์**: เลือกเซิร์ฟเวอร์ที่ต้องการจัดการจากดรอปดาวน์ด้านบน

2. **จัดการช่อง**:
   - สร้างหมวดหมู่และช่องใหม่จากฟอร์มด้านบน
   - ลากและวางช่องเพื่อย้ายไปยังหมวดหมู่อื่น
   - คลิกปุ่ม 🔒 เพื่อตั้งค่าสิทธิ์ (เลือกยศที่เห็นช่องได้)
   - คลิกปุ่มแก้ไข (✏️) เพื่อเปลี่ยนชื่อ
   - คลิกปุ่มลบ (🗑️) เพื่อลบ

3. **จัดการยศ**:
   - สร้างยศใหม่พร้อมเลือกสี
   - แก้ไขหรือลบยศที่มีอยู่

4. **จัดการสมาชิก**:
   - ดูรายชื่อสมาชิกทั้งหมด
   - เพิ่มหรือลบยศจากแต่ละคน

## 🛠️ เทคโนโลยีที่ใช้

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **Discord.js v14** - Discord API Library

### Frontend
- **React** - UI Library
- **React DnD** - Drag and Drop Library
- **HTML5 Drag and Drop API** - Native Browser API

## 📁 โครงสร้างโปรเจค

```
discord/
├── backend/
│   ├── bot.js           # Discord Bot และ API Server
│   ├── package.json     # Dependencies
│   └── .env            # ตัวแปรสภาพแวดล้อม
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── ServerSelector.js    # เลือกเซิร์ฟเวอร์
    │   │   ├── ChannelManager.js    # จัดการช่อง (Drag & Drop)
    │   │   ├── RoleManager.js       # จัดการยศ
    │   │   └── MemberManager.js     # จัดการสมาชิก
    │   ├── App.js          # หน้าหลัก
    │   ├── App.css         # สไตล์
    │   └── index.js        # Entry Point
    └── package.json
```

## 🔒 ความปลอดภัย

- ⚠️ **อย่าแชร์ Token** ของ Bot กับใครเป็นอันขาด
- ไฟล์ `.env` ถูกเพิ่มใน `.gitignore` แล้ว
- ควรรัน Backend และ Frontend ในเครือข่ายที่ปลอดภัย

## 🐛 การแก้ไขปัญหา

### Bot ไม่ออนไลน์
- ตรวจสอบว่า Token ถูกต้อง
- ตรวจสอบว่าเปิดใช้งาน Intents ครบถ้วน

### ไม่สามารถจัดการช่อง/ยศได้
- ตรวจสอบว่า Bot มีสิทธิ์เพียงพอ
- Role ของ Bot ต้องอยู่สูงกว่า Role ที่ต้องการจัดการ

### Drag & Drop ไม่ทำงาน
- ตรวจสอบว่าเบราว์เซอร์รองรับ HTML5 Drag and Drop
- ลองรีเฟรชหน้าเว็บ

## 📚 เอกสารประกอบ

### Bash Scripts
- `install.sh` - สคริปต์ติดตั้ง dependencies
- `start.sh` - รันทั้ง Backend และ Frontend พร้อมกัน
- `start-backend.sh` - รัน Backend อย่างเดียว
- `start-frontend.sh` - รัน Frontend อย่างเดียว
- `dev.sh` - รัน Backend แบบ Development Mode
- `stop.sh` - หยุดทุกอย่าง

### คู่มือการใช้งาน
- `QUICKSTART.md` - คู่มือเริ่มต้นด่วน (3 ขั้นตอน)
- `INSTALLATION.md` - คู่มือติดตั้งแบบละเอียด
- `SCRIPTS.md` - คู่มือ Bash Scripts แบบละเอียด
- `PERMISSIONS-GUIDE.md` - คู่มือสิทธิ์ช่องพื้นฐาน
- **`ROLE-PERMISSIONS-GUIDE.md` - คู่มือยศและสิทธิ์แบบครบถ้วน** 🆕
- `EXAMPLES.md` - ตัวอย่างการใช้งานจริง
- `CHEATSHEET.txt` - สรุปคำสั่งที่ใช้บ่อย

## 🆕 ฟีเจอร์ล่าสุด (v3.0)

- ✅ **Toast Notifications** - แจ้งเตือนแบบ popup สวยงาม แทนที่ alert()
- ✅ **Confirmation Dialogs** - กล่องยืนยันแบบ custom พร้อม animations
- ✅ **Error Boundary** - จัดการ error ที่ไม่คาดคิด แสดงหน้า error ที่เป็นมิตร
- ✅ **Member Search** - ค้นหาสมาชิกด้วยชื่อหรือ username แบบ real-time
- ✅ **Role Hierarchy Management** - จัดการลำดับยศด้วย drag-and-drop
- ✅ **Advanced Channel Permissions** - ระบบสิทธิ์แบบ Allow/Neutral/Deny

## 🏗️ เทคโนโลยีที่ใช้

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Discord.js v14** - Discord API wrapper
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **react-dnd** - Drag and drop functionality
- **Context API** - State management
- **CSS3** - Styling with animations

## 📊 โครงสร้างโปรเจค

```
discord-server-manager/
├── backend/              # Node.js + Express API
│   ├── bot.js           # Discord bot และ API endpoints
│   ├── .env.example     # ตัวอย่างการตั้งค่า
│   └── package.json
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── ChannelManager.js
│   │   │   ├── RoleManager.js
│   │   │   ├── MemberManager.js
│   │   │   ├── ToastContext.js
│   │   │   ├── ConfirmContext.js
│   │   │   └── ErrorBoundary.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
├── docs/                # เอกสารประกอบ
├── .gitignore
├── LICENSE
└── README.md
```

## 🤝 การมีส่วนร่วม

เรายินดีรับ contributions! กรุณาอ่าน [CONTRIBUTING.md](CONTRIBUTING.md) สำหรับรายละเอียด

### วิธีการมีส่วนร่วม:
1. Fork โปรเจค
2. สร้าง feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � ติดต่อและสนับสนุน

- � **Bug Reports**: เปิด [Issue](https://github.com/cybercatakna/discord-server-manager/issues)
- 💡 **Feature Requests**: เปิด [Issue](https://github.com/cybercatakna/discord-server-manager/issues) พร้อมป้ายกำกับ "enhancement"

## � Roadmap

### กำลังพัฒนา:
- [ ] Loading States - Skeleton loaders
- [ ] Activity Log - บันทึกประวัติการกระทำ

### วางแผนในอนาคต:
- [ ] 🔔 Real-time notifications
- [ ] 📊 Server statistics dashboard
- [ ] 🎨 Theme customization
- [ ] 🌐 Multi-language support
- [ ] 💾 Configuration backup/restore
- [ ] 📱 Mobile app
- [ ] 🔐 Two-factor authentication
- [ ] 📈 Analytics and insights

## ⭐ Star History

หากโปรเจคนี้มีประโยชน์กับคุณ กรุณากด ⭐ Star เพื่อสนับสนุนเรา!

---

<div align="center">

**สร้างด้วย ❤️ สำหรับชุมชน Discord**

[Report Bug](https://github.com/your-username/discord-server-manager/issues) · [Request Feature](https://github.com/your-username/discord-server-manager/issues) · [Documentation](https://github.com/your-username/discord-server-manager/wiki)

</div>
# discord-server-manager
