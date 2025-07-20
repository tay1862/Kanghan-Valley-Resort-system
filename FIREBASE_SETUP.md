# คู่มือการตั้งค่า Firebase สำหรับ Kanghan Valley Resort

## ขั้นตอนการตั้งค่า Firebase

### 1. สร้าง Firebase Project

1. ไปที่ https://console.firebase.google.com
2. คลิก "Create a project" หรือ "เพิ่มโปรเจกต์"
3. ใส่ชื่อโปรเจกต์: `kanghan-valley-resort`
4. เลือกการตั้งค่า Analytics (แนะนำให้เปิดใช้งาน)
5. คลิก "Create project"

### 2. ตั้งค่า Firestore Database

1. ในหน้า Firebase Console ไปที่ "Firestore Database"
2. คลิก "Create database"
3. เลือก "Start in test mode" (สำหรับการพัฒนา)
4. เลือก location ที่ใกล้ที่สุด (แนะนำ: asia-southeast1)
5. คลิก "Done"

### 3. สร้าง Service Account

1. ไปที่ "Project settings" (ไอคอนเฟือง)
2. เลือกแท็บ "Service accounts"
3. คลิก "Generate new private key"
4. ดาวน์โหลดไฟล์ JSON
5. เก็บไฟล์นี้ไว้ในที่ปลอดภัย

### 4. ตั้งค่า Security Rules

ไปที่ Firestore Database > Rules และใส่ rules ดังนี้:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents
    // ในการใช้งานจริง ควรปรับ rules ให้เข้มงวดมากขึ้น
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 5. อัปเดตไฟล์ Configuration

แทนที่ข้อมูลใน `backend/src/firebase_config.py`:

```python
import firebase_admin
from firebase_admin import credentials, firestore

# แทนที่ path นี้ด้วย path ของไฟล์ service account key ที่ดาวน์โหลด
cred = credentials.Certificate('path/to/your/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

def get_firestore_client():
    return firestore.client()
```

### 6. สร้าง Collections และ Documents เริ่มต้น

#### สร้าง Collection: settings

1. ไปที่ Firestore Database
2. คลิก "Start collection"
3. ใส่ Collection ID: `settings`

#### Document: resort_info
```json
{
  "name": "Kanghan Valley Resort & Camping",
  "phone": "+856 20 9674 8657, +856 20 9980 4879",
  "address": "Kanghan Valley, ລາວ",
  "email": "info@kanghanvalley.com"
}
```

#### Document: invoice_settings
```json
{
  "deposit_percentage": 30,
  "currency": "LAK",
  "terms": "ກະລຸນາຊໍາລະຄ່າມັດຈໍາກ່ອນລ່ວງຫນ້າ 1 ມື້, ຖ້າຫາກບໍ່ຊໍາລະເງິນຄ່າມັດຈໍາ ການຈອງຈະເປັນໂມຄະ.\nຄ່າທໍານຽມທີ່ໄດ້ຊໍາລະໄວ້ຈະບໍ່ສາມາດຂໍຄືນໄດ້ຖ້າຫາກຍົກເລີກການຈອງ\n**Check-in 14:00\n**Check-out 11:00"
}
```

#### สร้าง Collection: rooms

#### Document ตัวอย่าง:
```json
{
  "id": "R001",
  "name": "ເຮືອນສາມຫຼ່ຽມ A",
  "type": "villa",
  "price": 490000,
  "status": "available",
  "description": "ເຮືອນຮູບສາມຫຼ່ຽມທີ່ສະດວກສະບາຍພ້ອມວິວພູທີ່ສວຍງາມ",
  "amenities": ["ສະລອງນ້ຳສ່ວນຕົວ", "ວິວພູເຂົາ", "ເຕຍງຂະໜາດໃຫຍ່", "ຫ້ອງນ້ຳຫຼູຫຼາ"],
  "max_guests": 4,
  "created_at": "2024-07-18T00:00:00Z"
}
```

```json
{
  "id": "R002",
  "name": "ເຕັນຫຼູຫຼາ B",
  "type": "glamping",
  "price": 290000,
  "status": "available",
  "description": "ເຕັນຫຼູຫຼາພ້ອມສິ່ງອຳນວຍຄວາມສະດວກທັນສະໄໝ",
  "amenities": ["ເຕຍງສະດວກສະບາຍ", "ຫ້ອງນ້ຳສ່ວນຕົວ", "ເຄື່ອງປັບອາກາດ", "ວິວທິວທັດ"],
  "max_guests": 2,
  "created_at": "2024-07-18T00:00:00Z"
}
```

```json
{
  "id": "R003",
  "name": "ເຂດແຄມປິ້ງ C",
  "type": "camping",
  "price": 150000,
  "status": "available",
  "description": "ເຂດແຄມປິ້ງແບບດັ້ງເດີມພ້ອມສິ່ງອຳນວຍຄວາມສະດວກຮ່ວມ",
  "amenities": ["ຫ້ອງນ້ຳຮ່ວມ", "ບ່ອນຈູດໄຟ", "ໂຕະປິກນິກ", "ເສັ້ນທາງທ່ອງທິວທັດ"],
  "max_guests": 6,
  "created_at": "2024-07-18T00:00:00Z"
}
```

#### สร้าง Collection: users

#### Document ตัวอย่าง:
```json
{
  "id": "U001",
  "name": "ທ້າວ ບຸນມີ",
  "email": "bunmee@kanghanvalley.com",
  "role": "manager",
  "created_at": "2024-01-15T00:00:00Z"
}
```

```json
{
  "id": "U002",
  "name": "ນາງ ສີດາ",
  "email": "sida@kanghanvalley.com",
  "role": "reception",
  "created_at": "2024-02-01T00:00:00Z"
}
```

### 7. ตั้งค่า Authentication (ถ้าต้องการ)

1. ไปที่ "Authentication" ใน Firebase Console
2. เลือกแท็บ "Sign-in method"
3. เปิดใช้งาน "Email/Password"
4. สร้างผู้ใช้งานแอดมินใน "Users" tab

### 8. ทดสอบการเชื่อมต่อ

1. เริ่มต้น Backend server
2. ทดสอบ API endpoint: `GET /api/health`
3. ทดสอบการดึงข้อมูล: `GET /api/rooms`
4. ตรวจสอบ logs ใน console

### 9. การตั้งค่าเพิ่มเติม

#### Firebase Storage (สำหรับอัปโหลดรูปภาพ)
1. ไปที่ "Storage" ใน Firebase Console
2. คลิก "Get started"
3. ตั้งค่า Security Rules สำหรับ Storage

#### Firebase Hosting (สำหรับ deploy เว็บไซต์)
1. ติดตั้ง Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

### 10. การรักษาความปลอดภัย

#### อัปเดต Firestore Rules สำหรับ Production:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Settings - อ่านได้ทุกคน แต่เขียนได้เฉพาะ admin
    match /settings/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Rooms - อ่านได้ทุกคน แต่เขียนได้เฉพาะ admin
    match /rooms/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Bookings - เขียนได้ทุกคน แต่อ่านได้เฉพาะ admin
    match /bookings/{document} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
    
    // Users - เฉพาะ admin เท่านั้น
    match /users/{document} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### 11. การ Backup ข้อมูล

1. ตั้งค่า automatic backup ใน Firebase Console
2. Export ข้อมูลเป็น JSON เป็นระยะ
3. เก็บ backup ไว้ในที่ปลอดภัย

### 12. การ Monitor และ Analytics

1. ตั้งค่า Firebase Analytics
2. ใช้ Firebase Performance Monitoring
3. ตั้งค่า Alerts สำหรับ errors และ performance issues

## การแก้ไขปัญหาที่พบบ่อย

### ปัญหา Permission Denied
- ตรวจสอบ Firestore Rules
- ตรวจสอบ Authentication token
- ตรวจสอบ Service Account permissions

### ปัญหาการเชื่อมต่อ
- ตรวจสอบ internet connection
- ตรวจสอบ Firebase project configuration
- ตรวจสอบ API keys และ credentials

### ปัญหา Quota Exceeded
- ตรวจสอบ usage ใน Firebase Console
- อัปเกรด plan ถ้าจำเป็น
- ปรับปรุง queries ให้มีประสิทธิภาพมากขึ้น

## ข้อมูลเพิ่มเติม

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

