const express = require('express');
const router  = express.Router();
const {
  getAllFruits,
  getExpiringSoon,
  getFruitById,
  createFruit,
  updateFruit,
  deleteFruit,
} = require('../controllers/fruitController');

router.get('/',               getAllFruits);
router.get('/expiring-soon',  getExpiringSoon);
router.get('/:id',            getFruitById);
router.post('/',              createFruit);
router.put('/:id',            updateFruit);
router.delete('/:id',         deleteFruit);

module.exports = router;