# Firebase Database Schema for Kanghan Valley Resort & Camping

## 1. `users` Collection (สำหรับ Admin Dashboard)
- `uid` (Document ID): Firebase Authentication User ID
  - `email`: string (อีเมลผู้ใช้งาน)
  - `role`: string (บทบาท: 'manager', 'reception', 'housekeeping')
  - `name`: string (ชื่อผู้ใช้งาน)
  - `createdAt`: timestamp
  - `updatedAt`: timestamp

## 2. `rooms` Collection
- `roomId` (Document ID): string (Auto-generated)
  - `name`: string (ชื่อห้อง/หมายเลขห้อง เช่น 'Triagle House A', 'Villa 1')
  - `type`: string (ประเภทห้อง: 'villa', 'glamping_tent', 'camping_zone')
  - `description`: object (รายละเอียดห้อง, รองรับหลายภาษา)
    - `en`: string
    - `lo`: string
    - `th`: string
  - `amenities`: array of strings (สิ่งอำนวยความสะดวก เช่น ['private_pool', 'mountain_view'])
  - `price`: number (ราคาต่อคืน)
  - `images`: array of strings (URLs ของรูปภาพห้อง)
  - `status`: string (สถานะห้อง: 'available', 'occupied', 'maintenance') - สำหรับแม่บ้านดู
  - `createdAt`: timestamp
  - `updatedAt`: timestamp

## 3. `bookings` Collection
- `bookingId` (Document ID): string (Auto-generated)
  - `roomId`: string (Reference to `rooms` collection)
  - `guestName`: string (ชื่อลูกค้า)
  - `phoneNumber`: string
  - `email`: string
  - `checkInDate`: timestamp
  - `checkOutDate`: timestamp
  - `numberOfGuests`: number
  - `notes`: string (หมายเหตุเพิ่มเติม)
  - `depositPercentage`: number (เปอร์เซ็นต์เงินมัดจำที่ใช้ในการจองนี้)
  - `totalAmount`: number (ยอดรวมทั้งหมด)
  - `depositAmount`: number (ยอดเงินมัดจำ)
  - `remainingAmount`: number (ยอดค้างชำระ)
  - `status`: string (สถานะการจอง: 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled')
  - `createdAt`: timestamp
  - `updatedAt`: timestamp

## 4. `website_settings` Document (Single Document)
- `id`: 'main_settings'
  - `heroSection`: object
    - `title`: object (รองรับหลายภาษา)
    - `subtitle`: object (รองรับหลายภาษา)
    - `videoUrl`: string (URL ของวิดีโอพื้นหลัง)
  - `aboutUs`: object (รองรับหลายภาษา)
  - `contactInfo`: object
    - `facebookMessengerLink`: string
    - `whatsAppLink`: string
    - `emailAddress`: string
    - `googleMapsEmbedUrl`: string
  - `galleryImages`: array of strings (URLs ของรูปภาพใน Gallery)
  - `invoiceSettings`: object
    - `logoUrl`: string
    - `resortName`: string
    - `phoneNumbers`: array of strings
    - `address`: string
    - `defaultDepositPercentage`: number
    - `currency`: string
    - `notes`: object (รองรับหลายภาษา)
      - `en`: string
      - `lo`: string
      - `th`: string
    - `bankAccountInfo`: object
      - `bankName`: string
      - `accountName`: string
      - `accountNumber`: string

## 5. `languages` Collection (สำหรับจัดการข้อความ Multi-language)
- `key` (Document ID): string (เช่น 'welcome_title', 'about_us_paragraph_1')
  - `en`: string
  - `lo`: string
  - `th`: string



