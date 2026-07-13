require('dotenv').config();
const pool = require('./src/db');
const app  = require('./src/app');

const PORT = process.env.PORT || 3001;

async function initDb() {
  // สร้าง table ถ้ายังไม่มี
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fruits (
      id                SERIAL PRIMARY KEY,
      name              VARCHAR(100) NOT NULL,
      category          VARCHAR(30)  NOT NULL DEFAULT 'other',
      quantity          NUMERIC(10,2) NOT NULL DEFAULT 0,
      unit              VARCHAR(10)  NOT NULL DEFAULT 'kg',
      storage_location  VARCHAR(30)  NOT NULL DEFAULT 'cold_room',
      expiry_date       DATE,
      status            VARCHAR(20)  NOT NULL DEFAULT 'in_stock',
      created_at        TIMESTAMPTZ  DEFAULT NOW(),
      updated_at        TIMESTAMPTZ  DEFAULT NOW()
    )
  `);
  console.log('✅ Table fruits ready');

  // Seed ถ้า table ว่าง
  const { rows } = await pool.query('SELECT COUNT(*) FROM fruits');
  if (parseInt(rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO fruits (name, category, quantity, unit, storage_location, expiry_date, status) VALUES
      ('มะม่วงน้ำดอกไม้', 'tropical', 120, 'kg', 'cold_room',   '2026-07-25', 'in_stock'),
      ('แอปเปิ้ลฟูจิ',     'pome',     80,  'kg', 'cold_room',   '2026-08-10', 'in_stock'),
      ('ส้มสายน้ำผึ้ง',    'citrus',   200, 'kg', 'cold_room',   '2026-07-20', 'in_stock'),
      ('กล้วยหอม',        'tropical', 60,  'kg', 'room_temp',   '2026-07-16', 'low_stock'),
      ('สับปะรดภูแล',     'tropical', 45,  'kg', 'room_temp',   '2026-07-18', 'in_stock'),
      ('องุ่นไร้เมล็ด',    'berry',    30,  'kg', 'cold_room',   '2026-07-15', 'expiring_soon')
    `);
    console.log('🌱 Seed data inserted (6 fruits)');
  }
}

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🍎 Fruit Storage System API running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB init failed:', err.message);
    process.exit(1);
  });
