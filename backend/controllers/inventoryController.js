const Inventory = require('../models/Inventory');

const calculateStockStatus = (qty) => {
  if (qty > 10) return 'Available';
  if (qty > 0) return 'Low Stock';
  return 'Out of Stock';
};

const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addInventoryItem = async (req, res) => {
  try {
    const { productName, category, quantity, unitPrice, supplierName } = req.body;
    const qty = Number(quantity);
    const newItem = new Inventory({
      productName,
      category,
      quantity: qty,
      unitPrice: Number(unitPrice),
      supplierName,
      stockStatus: calculateStockStatus(qty)
    });
    await newItem.save();
    const updated = await Inventory.find();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const qty = Number(req.body.quantity);
    await Inventory.findByIdAndUpdate(req.params.id, {
      quantity: qty,
      stockStatus: calculateStockStatus(qty)
    });
    const updated = await Inventory.find();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    const updated = await Inventory.find();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getInventory, addInventoryItem, updateStock, deleteInventoryItem };