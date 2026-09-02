const express = require('express');
const router = express.Router();
const { getInventory, addInventoryItem, updateStock, deleteInventoryItem } = require('../controllers/inventoryController');

router.get('/', getInventory);
router.post('/', addInventoryItem);
router.patch('/:id/stock', updateStock);
router.delete('/:id', deleteInventoryItem);

module.exports = router;