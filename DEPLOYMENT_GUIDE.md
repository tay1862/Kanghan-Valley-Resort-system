# คู่มือการ Deploy - Kanghan Valley Resort & Camping

## ภาพรวมการ Deploy

ระบบประกอบด้วย 3 ส่วนหลัก:
1. **Frontend** - เว็บไซต์หน้าบ้าน (React)
2. **Admin Dashboard** - ระบบหลังบ้าน (React)
3. **Backend API** - เซิร์ฟเวอร์ API (Flask)

## ตัวเลือกการ Deploy

### ตัวเลือกที่ 1: Deploy แยกส่วน

#### Frontend (เว็บไซต์หน้าบ้าน)
**แนะนำ: Vercel, Netlify, หรือ GitHub Pages**

```bash
# Build frontend
cd frontend
pnpm install
pnpm run build

# Deploy ไฟล์ใน dist/ ไปยัง hosting service
```

#### Admin Dashboard
**แนะนำ: Vercel, Netlify (ใช้ subdomain หรือ path แยก)**

```bash
# Build admin
cd admin
pnpm install
pnpm run build

# Deploy ไฟล์ใน dist/ ไปยัง hosting service
```

#### Backend API
**แนะนำ: Railway, Render, Heroku, หรือ VPS**

```bash
# เตรียม backend
cd backend
pip install -r requirements.txt

# Deploy ทั้งโฟลเดอร์ไปยัง cloud service
```

### ตัวเลือกที่ 2: Deploy รวมกัน (Full-stack)

#### ใช้ Backend เป็นหลักและ serve Frontend

```bash
# Build frontend และ admin
cd frontend && pnpm run build
cd ../admin && pnpm run build

# คัดลอกไฟล์ build ไปยัง backend/src/static/
cp -r frontend/dist/* backend/src/static/
cp -r admin/dist/* backend/src/static/admin/

# Deploy backend ที่มี static files
cd backend
pip install -r requirements.txt
python src/main.py
```

## การ Deploy บน Cloud Services

### 1. Vercel (แนะนำสำหรับ Frontend)

#### Frontend
```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# ตั้งค่า environment variables ใน Vercel dashboard
# VITE_API_URL=https://your-backend-url.com
```

#### Admin Dashboard
```bash
cd admin
vercel

# ตั้งค่า environment variables
# VITE_API_URL=https://your-backend-url.com
```

### 2. Railway (แนะนำสำหรับ Backend)

#### สร้างไฟล์ railway.json
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && python src/main.py",
    "healthcheckPath": "/api/health"
  }
}
```

#### Deploy
```bash
# ติดตั้ง Railway CLI
npm install -g @railway/cli

# Login และ deploy
railway login
railway init
railway up
```

### 3. Render

#### สร้างไฟล์ render.yaml
```yaml
services:
  - type: web
    name: kanghan-valley-backend
    env: python
    buildCommand: "cd backend && pip install -r requirements.txt"
    startCommand: "cd backend && python src/main.py"
    envVars:
      - key: PORT
        value: 5000
```

### 4. Netlify (สำหรับ Frontend)

#### สร้างไฟล์ netlify.toml
```toml
[build]
  base = "frontend/"
  publish = "dist/"
  command = "pnpm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## การตั้งค่า Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=Kanghan Valley Resort
```

### Admin (.env)
```env
VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=Kanghan Valley Admin
```

### Backend
```env
FLASK_ENV=production
SECRET_KEY=your-secret-key
FIREBASE_PROJECT_ID=your-firebase-project-id
```

## การตั้งค่า Firebase สำหรับ Production

### 1. อัปเดต Firebase Configuration

แทนที่ไฟล์ `backend/src/firebase_config.py`:

```python
import firebase_admin
from firebase_admin import credentials, firestore
import os

# ใช้ environment variable หรือ service account file
if os.getenv('FIREBASE_CREDENTIALS'):
    # ใช้ environment variable (แนะนำสำหรับ cloud deployment)
    import json
    cred_dict = json.loads(os.getenv('FIREBASE_CREDENTIALS'))
    cred = credentials.Certificate(cred_dict)
else:
    # ใช้ service account file (สำหรับ local development)
    cred = credentials.Certificate('path/to/serviceAccountKey.json')

firebase_admin.initialize_app(cred)

def get_firestore_client():
    return firestore.client()
```

### 2. ตั้งค่า Environment Variables สำหรับ Firebase

```bash
# สำหรับ cloud deployment
export FIREBASE_CREDENTIALS='{"type":"service_account","project_id":"your-project-id",...}'

# หรือใช้ไฟล์ service account key
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"
```

## การตั้งค่า Domain และ SSL

### 1. Custom Domain
- ตั้งค่า DNS records ให้ชี้ไปยัง hosting service
- Frontend: A record หรือ CNAME ไปยัง Vercel/Netlify
- Backend: A record ไปยัง Railway/Render

### 2. SSL Certificate
- Vercel, Netlify, Railway, Render มี SSL ให้อัตโนมัติ
- สำหรับ VPS ใช้ Let's Encrypt

## การ Monitor และ Maintenance

### 1. Health Checks
```bash
# ตรวจสอบ backend
curl https://your-backend-url.com/api/health

# ตรวจสอบ frontend
curl https://your-frontend-url.com
```

### 2. Logging
- ตั้งค่า logging ใน Flask app
- ใช้ cloud logging services (Railway Logs, Render Logs)

### 3. Backup
- Firebase มี automatic backup
- Export ข้อมูลเป็นระยะ
- Backup source code ใน Git repository

## การอัปเดตระบบ

### 1. อัปเดต Frontend
```bash
cd frontend
git pull
pnpm install
pnpm run build
# Deploy ใหม่
```

### 2. อัปเดต Backend
```bash
cd backend
git pull
pip install -r requirements.txt
# Restart service
```

### 3. Zero-downtime Deployment
- ใช้ blue-green deployment
- ใช้ load balancer
- ทดสอบใน staging environment ก่อน

## การแก้ไขปัญหา

### 1. CORS Issues
```python
# ใน backend/src/main.py
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["https://your-frontend-domain.com"])
```

### 2. API Connection Issues
- ตรวจสอบ URL ใน environment variables
- ตรวจสอบ network connectivity
- ตรวจสอบ SSL certificates

### 3. Firebase Connection Issues
- ตรวจสอบ service account key
- ตรวจสอบ Firestore rules
- ตรวจสอบ project ID

## Security Checklist

### 1. Environment Variables
- ไม่เก็บ secrets ใน source code
- ใช้ environment variables สำหรับ sensitive data
- ใช้ different keys สำหรับ production และ development

### 2. Firebase Security
- ตั้งค่า Firestore rules ให้เข้มงวด
- ใช้ Authentication สำหรับ admin functions
- จำกัด API access

### 3. HTTPS
- ใช้ HTTPS สำหรับทุก endpoints
- ตั้งค่า HSTS headers
- ใช้ secure cookies

## Performance Optimization

### 1. Frontend
- ใช้ code splitting
- Optimize images
- ใช้ CDN สำหรับ static assets

### 2. Backend
- ใช้ caching
- Optimize database queries
- ใช้ connection pooling

### 3. Database
- สร้าง indexes ใน Firestore
- ใช้ pagination สำหรับ large datasets
- Optimize query patterns

## Cost Optimization

### 1. Free Tiers
- Vercel: 100GB bandwidth/month
- Netlify: 100GB bandwidth/month
- Railway: $5/month สำหรับ hobby plan
- Firebase: 1GB storage, 10GB bandwidth/month

### 2. Scaling Strategy
- เริ่มด้วย free tiers
- Monitor usage และ upgrade เมื่อจำเป็น
- ใช้ auto-scaling features

## Backup และ Recovery Plan

### 1. Code Backup
- เก็บ source code ใน Git repository
- ใช้ multiple remotes (GitHub, GitLab)
- Tag releases สำหรับ rollback

### 2. Data Backup
- Firebase automatic backup
- Manual export เป็นระยะ
- เก็บ backup ในหลายที่

### 3. Recovery Procedures
- มี runbook สำหรับ common issues
- ทดสอบ recovery procedures
- มี contact information สำหรับ emergency

## การติดต่อและสนับสนุน

สำหรับความช่วยเหลือเพิ่มเติม:
- ดู documentation ของแต่ละ cloud service
- ใช้ community forums
- ติดต่อ technical support เมื่อจำเป็น

