const dns = require('dns');
// Override DNS resolution for MongoDB Atlas SRV connection
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Category = require('./models/Category');
const Inventory = require('./models/Inventory');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in your .env file.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((err) => {
    console.error('MongoDB Atlas Connection Error:', err);
  });

// ================= USER & AUTH ROUTES =================

// Register User / Admin
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const adminCount = await User.countDocuments({ role: 'admin' });
    const requestedRole = role ? role.toLowerCase() : 'user';

    if (requestedRole === 'admin' && adminCount > 0) {
      return res.status(400).json({
        message: 'An admin already exists. Multiple admin registrations are disabled.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: requestedRole,
    });

    res.status(201).json({
      message: `${newUser.role === 'admin' ? 'Admin' : 'User'} registered successfully!`,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// Login User / Admin
app.post(['/api/users/login', '/api/login'], async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({
      $or: [
        { email: cleanEmail },
        { email: { $regex: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')))
      ? await bcrypt.compare(password, user.password)
      : (user.password === password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful!',
      user: {
        id: user._id,
        username: user.username || user.name || 'User',
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// Reset Password
app.post(['/api/users/reset-password', '/api/reset-password'], async (req, res) => {
  try {
    const { email, newPassword, password } = req.body;
    const passToSet = newPassword || password;

    if (!email || !passToSet) {
      return res.status(400).json({ message: 'Please provide email and new password' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({
      $or: [
        { email: cleanEmail },
        { email: { $regex: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passToSet, salt);
    
    await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });

    res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
});


// ================= CATEGORY ROUTES =================

// Get All Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
});

// Add New Category
app.post('/api/categories', async (req, res) => {
  try {
    const { categoryName, description } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = await Category.create({ categoryName, description });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: 'Error creating category', error: err.message });
  }
});

// Delete Category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category', error: err.message });
  }
});

// ================= INVENTORY ROUTES =================

// Get All Inventory Items
app.get('/api/inventory', async (req, res) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inventory', error: err.message });
  }
});

// Add Inventory Item
app.post('/api/inventory', async (req, res) => {
  try {
    const { productName, category, quantity, unitPrice, supplierName } = req.body;

    if (!productName || !category || quantity === undefined || unitPrice === undefined || !supplierName) {
      return res.status(400).json({ message: 'All inventory fields are required' });
    }

    const newItem = await Inventory.create({
      productName,
      category,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      supplierName,
    });

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Error adding inventory item', error: err.message });
  }
});

// Update Stock Quantity
app.patch('/api/inventory/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      { quantity: Number(quantity) },
      { new: true }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: 'Error updating stock', error: err.message });
  }
});

// Delete Inventory Item
app.delete('/api/inventory/:id', async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item', error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});