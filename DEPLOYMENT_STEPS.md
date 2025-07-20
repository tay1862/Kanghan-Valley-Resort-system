# คู่มือการ Deploy Kanghan Valley Resort

## ขั้นตอนการ Deploy

### 1. Push Code ขึ้น GitHub

```bash
# เริ่มต้น Git repository
git init

# เพิ่มไฟล์ทั้งหมด
git add .

# Commit ครั้งแรก
git commit -m "Initial commit: Kanghan Valley Resort system"

# สร้าง repository บน GitHub แล้ว push
git remote add origin https://github.com/YOUR_USERNAME/kanghan-valley-resort.git
git branch -M main
git push -u origin main
```

### 2. Deploy Backend บน Railway

1. **ไปที่ https://railway.app**
2. **Sign up/Login** ด้วย GitHub
3. **คลิก "New Project"**
4. **เลือก "Deploy from GitHub repo"**
5. **เลือก repository `kanghan-valley-resort`**
6. **เลือกโฟลเดอร์ `backend`**
7. **Railway จะ auto-detect Python และ deploy**

### 3. Deploy Frontend บน Vercel

1. **ไปที่ https://vercel.com**
2. **Sign up/Login** ด้วย GitHub
3. **คลิก "New Project"**
4. **Import repository `kanghan-valley-resort`**
5. **เลือกโฟลเดอร์ `frontend`**
6. **ตั้งค่า Environment Variables:**
   - `VITE_API_URL` = URL ของ Railway backend
7. **คลิก "Deploy"**

### 4. Deploy Admin บน Vercel

1. **ใน Vercel dashboard คลิก "New Project"**
2. **Import repository เดิม**
3. **เลือกโฟลเดอร์ `admin`**
4. **ตั้งค่า Environment Variables:**
   - `VITE_API_URL` = URL ของ Railway backend
5. **คลิก "Deploy"**

## Environment Variables

### Railway (Backend)
```
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
FIREBASE_CREDENTIALS={"type":"service_account",...}
```

### Vercel (Frontend & Admin)
```
VITE_API_URL=https://your-railway-backend-url.com
```

## URLs ที่จะได้

- **Frontend**: https://your-frontend-url.vercel.app
- **Admin**: https://your-admin-url.vercel.app  
- **Backend**: https://your-backend-url.railway.app

## การทดสอบ

1. **ทดสอบ Frontend**: เปิด URL frontend และทดสอบการเปลี่ยนภาษา
2. **ทดสอบ Admin**: เปิด URL admin และ login ด้วยข้อมูลใดๆ
3. **ทดสอบ Backend**: เปิด URL backend + `/api/health`

## การแก้ไขปัญหา

### ถ้า Backend ไม่ทำงาน
- ตรวจสอบ Environment Variables ใน Railway
- ตรวจสอบ logs ใน Railway dashboard
- ตรวจสอบ Firebase credentials

### ถ้า Frontend/Admin ไม่เชื่อมต่อ Backend
- ตรวจสอบ VITE_API_URL ใน Vercel
- ตรวจสอบ CORS settings ใน backend
- ตรวจสอบ Network tab ใน browser

### ถ้า Build ล้มเหลว
- ตรวจสอบ package.json ใน frontend/admin
- ตรวจสอบ requirements.txt ใน backend
- ตรวจสอบ logs ใน deployment platform 