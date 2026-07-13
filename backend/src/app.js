const express     = require('express');
const cors        = require('cors');
const fruitRoutes = require('./routes/fruitRoutes');

const app = express();

app.use(cors());
app.use(express.json());

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

module.exports = app;
