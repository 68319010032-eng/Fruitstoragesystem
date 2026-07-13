# 🍎 Fruit Storage System

ระบบจัดการคลังผลไม้ (Fruit Storage System) — REST API ด้วย Express + PostgreSQL
พัฒนาแบบ MVC Pattern (Controller / Route แยกกัน) ตามมาตรฐานที่ใช้ในอุตสาหกรรม

## 📡 API Endpoints

| Method | Path              | คำอธิบาย                                      | Status  |
|--------|-------------------|-----------------------------------------------|---------|
| GET    | /health           | Health check                                  | 200     |
| GET    | /api/fruits       | ดึงผลไม้ทั้งหมด (filter `?category=&storage_location=`) | 200 |
| GET    | /api/fruits/:id   | ดึงผลไม้ตาม ID                                | 200/404 |
| POST   | /api/fruits       | เพิ่มผลไม้ใหม่                                | 201     |
| PUT    | /api/fruits/:id   | แก้ไขข้อมูลผลไม้                              | 200/404 |
| DELETE | /api/fruits/:id   | ลบผลไม้                                       | 200/404 |

## 🗂 โครงสร้างตาราง `fruits`

| Column           | Type          | คำอธิบาย                                   |
|-------------------|---------------|---------------------------------------------|
| id               | SERIAL PK     | รหัสผลไม้                                    |
| name             | VARCHAR(100)  | ชื่อผลไม้                                    |
| category         | VARCHAR(30)   | หมวดหมู่ เช่น tropical, citrus, pome, berry |
| quantity         | NUMERIC(10,2) | จำนวนคงเหลือ                                 |
| unit             | VARCHAR(10)   | หน่วย เช่น kg, box                          |
| storage_location | VARCHAR(30)   | ที่จัดเก็บ เช่น cold_room, room_temp        |
| expiry_date      | DATE          | วันหมดอายุ / ควรขายก่อน                     |
| status           | VARCHAR(20)   | in_stock / low_stock / expiring_soon        |
| created_at       | TIMESTAMPTZ   | วันที่สร้างเรคคอร์ด                          |
| updated_at       | TIMESTAMPTZ   | วันที่แก้ไขล่าสุด                            |

## 🚀 เริ่มต้นใช้งาน (Local)

```bash
cd backend
npm install
npm run dev
```

### รัน PostgreSQL ผ่าน Docker (ถ้ายังไม่มี)

```bash
docker run -d --name pglocal \
  -e POSTGRES_DB=fruitstorage \
  -e POSTGRES_USER=fruituser \
  -e POSTGRES_PASSWORD=fruitpass123 \
  -p 5432:5432 postgres:16-alpine
```

### ทดสอบ API ด้วย curl

```bash
curl http://localhost:3001/health

curl http://localhost:3001/api/fruits

curl -X POST http://localhost:3001/api/fruits \
  -H "Content-Type: application/json" \
  -d '{"name":"ทุเรียนหมอนทอง","category":"tropical","quantity":15,"unit":"kg","storage_location":"cold_room","expiry_date":"2026-07-30"}'

curl -X PUT http://localhost:3001/api/fruits/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"มะม่วงน้ำดอกไม้","category":"tropical","quantity":100,"unit":"kg","storage_location":"cold_room","status":"in_stock"}'

curl -X DELETE http://localhost:3001/api/fruits/1
```

## 🧪 Lint

```bash
npm run lint
```

## ⚠️ หมายเหตุเรื่อง .env

- `.env` — ไฟล์จริง มี password จริง อยู่ใน `.gitignore` ห้าม commit
- `.env.example` — template ไม่มี password จริง commit ได้ ให้คนอื่น copy ไปใช้
