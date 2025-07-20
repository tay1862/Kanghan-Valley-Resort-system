# Kanghan Valley Resort & Camping - ระบบจัดการรีสอร์ท

ระบบเว็บไซต์และการจัดการสำหรับ Kanghan Valley Resort & Camping ที่ประกอบด้วยหน้าบ้านสำหรับลูกค้าและระบบหลังบ้านสำหรับแอดมิน

## คุณสมบัติหลัก

### หน้าบ้าน (Frontend)
- เว็บไซต์ Single Page Application รองรับ 3 ภาษา (อังกฤษ, ลาว, ไทย)
- แสดงข้อมูลรีสอร์ท, ห้องพัก, สิ่งอำนวยความสะดวก
- Gallery รูปภาพ
- ฟอร์มติดต่อและลิงก์ Social Media
- Responsive Design รองรับทุกอุปกรณ์

### ระบบหลังบ้าน (Admin Dashboard)
- ระบบ Login สำหรับแอดมิน
- Dashboard ภาพรวม (ภาษาลาว 100%)
- การจัดการการจอง (เพิ่ม/แก้ไข/ลบ/เปลี่ยนสถานะ)
- การจัดการห้องพัก (เพิ่ม/แก้ไข/ลบ/เปลี่ยนสถานะ)
- การจัดการผู้ใช้งาน (Manager, Reception, Housekeeping)
- การจัดการเว็บไซต์ (Gallery, ข้อมูลติดต่อ)
- การตั้งค่าใบเสร็จ
- ระบบออกใบเสร็จ PDF

### ระบบ Backend API
- RESTful API สำหรับการจัดการข้อมูล
- Firebase Integration (พร้อมใช้งาน Mock Data)
- ระบบออกใบเสร็จ PDF
- CORS Support สำหรับ Frontend-Backend Communication

## โครงสร้างโปรเจกต์

```
kanghan_valley_resort/
├── frontend/          # หน้าบ้าน (React)
├── admin/            # ระบบหลังบ้าน (React)
├── backend/          # API Server (Flask)
├── assets/           # รูปภาพและไฟล์สื่อ
├── firebase/         # Firebase configuration และ schema
└── README.md         # คู่มือนี้
```

## การติดตั้งและใช้งาน

### ข้อกำหนดระบบ
- Node.js 18+ และ npm/pnpm
- Python 3.11+
- Firebase Project (สำหรับการใช้งานจริง)

### 1. ติดตั้ง Dependencies

#### Frontend (หน้าบ้าน)
```bash
cd frontend
pnpm install
```

#### Admin Dashboard
```bash
cd admin
pnpm install
```

#### Backend API
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# หรือ venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### 2. การตั้งค่า Firebase

#### สำหรับการใช้งานจริง:
1. สร้าง Firebase Project ใหม่ที่ https://console.firebase.google.com
2. เปิดใช้งาน Firestore Database
3. สร้าง Service Account Key
4. ดาวน์โหลดไฟล์ service account key (JSON)
5. แทนที่ข้อมูลใน `backend/src/firebase_config.py`

#### สำหรับการทดสอบ:
- ระบบใช้ Mock Data สำหรับการทดสอบ
- ไม่จำเป็นต้องตั้งค่า Firebase สำหรับการทดสอบเบื้องต้น

### 3. เริ่มต้นระบบ

#### เริ่ม Backend API
```bash
cd backend
source venv/bin/activate
python src/main.py
```
API จะทำงานที่ http://localhost:5000

#### เริ่ม Frontend (หน้าบ้าน)
```bash
cd frontend
pnpm run dev
```
เว็บไซต์จะทำงานที่ http://localhost:5173

#### เริ่ม Admin Dashboard
```bash
cd admin
pnpm run dev --port 5174
```
ระบบหลังบ้านจะทำงานที่ http://localhost:5174

### 4. การเข้าใช้งาน

#### หน้าบ้าน
- เปิด http://localhost:5173
- ทดสอบการเปลี่ยนภาษา
- ทดสอบฟอร์มติดต่อ

#### ระบบหลังบ้าน
- เปิด http://localhost:5174
- ใช้ข้อมูลใดๆ สำหรับ Login (Mock Authentication)
- ทดสอบฟีเจอร์ต่างๆ ในระบบ

## การ Deploy

### Frontend
```bash
cd frontend
pnpm run build
# อัปโหลดไฟล์ใน dist/ ไปยัง hosting service
```

### Admin Dashboard
```bash
cd admin
pnpm run build
# อัปโหลดไฟล์ใน dist/ ไปยัง hosting service
```

### Backend
```bash
cd backend
# อัปโหลดทั้งโฟลเดอร์ไปยัง server
# ติดตั้ง dependencies และเริ่มต้น Flask app
```

## Database Schema

### Collections ใน Firestore

#### bookings
```json
{
  "id": "BK001",
  "guest_name": "ชื่อแขก",
  "phone_number": "เบอร์โทร",
  "email": "อีเมล",
  "room_name": "ชื่อห้อง",
  "check_in": "วันที่เช็คอิน",
  "check_out": "วันที่เช็คเอาท์",
  "guests": "จำนวนผู้เข้าพัก",
  "status": "สถานะ",
  "total_amount": "จำนวนเงินรวม",
  "deposit_amount": "เงินมัดจำ",
  "remaining_amount": "เงินคงเหลือ",
  "created_at": "วันที่สร้าง"
}
```

#### rooms
```json
{
  "id": "R001",
  "name": "ชื่อห้อง",
  "type": "ประเภทห้อง",
  "price": "ราคา",
  "status": "สถานะ",
  "description": "รายละเอียด",
  "amenities": ["สิ่งอำนวยความสะดวก"],
  "max_guests": "จำนวนผู้เข้าพักสูงสุด"
}
```

#### users
```json
{
  "id": "U001",
  "name": "ชื่อผู้ใช้",
  "email": "อีเมล",
  "role": "บทบาท",
  "created_at": "วันที่สร้าง"
}
```

#### settings
```json
{
  "resort_info": {
    "name": "ชื่อรีสอร์ท",
    "phone": "เบอร์โทร",
    "address": "ที่อยู่",
    "email": "อีเมล"
  },
  "invoice_settings": {
    "deposit_percentage": "เปอร์เซ็นต์เงินมัดจำ",
    "currency": "สกุลเงิน",
    "terms": "เงื่อนไขการชำระเงิน"
  }
}
```

## API Endpoints

### Bookings
- `GET /api/bookings` - ดึงรายการการจองทั้งหมด
- `POST /api/bookings` - สร้างการจองใหม่
- `GET /api/bookings/{id}` - ดึงข้อมูลการจองตาม ID
- `PUT /api/bookings/{id}` - อัปเดตการจอง
- `DELETE /api/bookings/{id}` - ลบการจอง
- `PUT /api/bookings/{id}/status` - อัปเดตสถานะการจอง

### Rooms
- `GET /api/rooms` - ดึงรายการห้องพักทั้งหมด
- `POST /api/rooms` - สร้างห้องพักใหม่
- `GET /api/rooms/{id}` - ดึงข้อมูลห้องพักตาม ID
- `PUT /api/rooms/{id}` - อัปเดตห้องพัก
- `DELETE /api/rooms/{id}` - ลบห้องพัก
- `PUT /api/rooms/{id}/status` - อัปเดตสถานะห้องพัก
- `GET /api/rooms/available` - ดึงห้องพักที่ว่าง

### Settings
- `GET /api/settings` - ดึงการตั้งค่าทั้งหมด
- `PUT /api/settings/resort` - อัปเดตข้อมูลรีสอร์ท
- `PUT /api/settings/invoice` - อัปเดตการตั้งค่าใบเสร็จ
- `PUT /api/settings/website` - อัปเดตการตั้งค่าเว็บไซต์

### Invoice
- `GET /api/invoice/{booking_id}` - ดาวน์โหลดใบเสร็จ PDF
- `GET /api/invoice/{booking_id}/preview` - ดูตัวอย่างใบเสร็จ
- `GET /api/invoices` - ดึงรายการใบเสร็จทั้งหมด

## การปรับแต่ง

### เปลี่ยนภาษา
- แก้ไขไฟล์ `frontend/src/App.jsx` ในส่วน `translations`
- เพิ่มภาษาใหม่ในอาร์เรย์ `languages`

### เปลี่ยนสีธีม
- แก้ไขไฟล์ `frontend/src/App.css` และ `admin/src/App.css`
- ปรับค่าสี CSS variables

### เพิ่มห้องพักใหม่
- ใช้ระบบหลังบ้านในหน้า "การจัดการห้องพัก"
- หรือเพิ่มผ่าน API `/api/rooms`

## การแก้ไขปัญหา

### ปัญหาการเชื่อมต่อ Firebase
1. ตรวจสอบการตั้งค่าใน `firebase_config.py`
2. ตรวจสอบ Service Account Key
3. ตรวจสอบ Firestore Rules

### ปัญหา CORS
- ตรวจสอบการตั้งค่า CORS ใน `backend/src/main.py`
- ตรวจสอบ URL ของ API ใน Frontend

### ปัญหาการสร้าง PDF
- ตรวจสอบการติดตั้ง reportlab
- ตรวจสอบ fonts และ encoding

## การสนับสนุน

สำหรับการสนับสนุนและคำถาม:
- ตรวจสอบ logs ใน console
- ตรวจสอบ Network tab ใน Developer Tools
- ตรวจสอบ Firebase Console สำหรับข้อมูล

## License

โปรเจกต์นี้สร้างขึ้นสำหรับ Kanghan Valley Resort & Camping

