const pool = require('../db');

// GET /api/fruits?category=&storage_location=
const getAllFruits = async (req, res) => {
  try {
    const { category = '', storage_location = '' } = req.query;
    const params = [];
    let where = 'WHERE 1=1';

    if (category) {
      params.push(category);
      where += ` AND category = $${params.length}`;
    }
    if (storage_location) {
      params.push(storage_location);
      where += ` AND storage_location = $${params.length}`;
    }

    const { rows } = await pool.query(
      `SELECT * FROM fruits ${where} ORDER BY created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/fruits/:id
const getFruitById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM fruits WHERE id = $1', [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'ไม่พบผลไม้นี้' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/fruits
const createFruit = async (req, res) => {
  try {
    const {
      name,
      category = 'other',
      quantity = 0,
      unit = 'kg',
      storage_location = 'cold_room',
      expiry_date = null,
      status = 'in_stock',
    } = req.body;

     if (!name) return res.status(400).json({ error: 'กรุณาระบุชื่อผลไม้ (name)' });
    if (isNaN(Number(quantity)) || Number(quantity) < 0) {
      return res.status(400).json({ error: 'quantity ต้องเป็นตัวเลขและไม่ติดลบ' });
    }
    if (expiry_date && isNaN(Date.parse(expiry_date))) {
      return res.status(400).json({ error: 'expiry_date รูปแบบไม่ถูกต้อง (ใช้ YYYY-MM-DD)' });
    }

    const { rows } = await pool.query(
      `INSERT INTO fruits (name, category, quantity, unit, storage_location, expiry_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name.trim(), category, quantity, unit, storage_location, expiry_date, status]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/fruits/:id
const updateFruit = async (req, res) => {
  try {
    const {
      name,
      category = 'other',
      quantity = 0,
      unit = 'kg',
      storage_location = 'cold_room',
      expiry_date = null,
      status = 'in_stock',
    } = req.body;

    const { rows } = await pool.query(
      `UPDATE fruits
       SET name=$1, category=$2, quantity=$3, unit=$4,
           storage_location=$5, expiry_date=$6, status=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [name, category, quantity, unit, storage_location, expiry_date, status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'ไม่พบผลไม้นี้' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/fruits/:id
const deleteFruit = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM fruits WHERE id=$1 RETURNING *', [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'ไม่พบผลไม้นี้' });
    res.json({ message: 'ลบผลไม้สำเร็จ', deleted: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllFruits,
  getFruitById,
  createFruit,
  updateFruit,
  deleteFruit,
};
