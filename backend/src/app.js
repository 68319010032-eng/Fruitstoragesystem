const express     = require('express');
const cors        = require('cors');
const fruitRoutes = require('./routes/fruitRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status:    'ok',
    service:   'Fruit Storage System API',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api/fruits', fruitRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'ไม่พบ endpoint นี้' });
});

module.exports = app;