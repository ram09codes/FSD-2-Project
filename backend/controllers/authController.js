const bcrypt = require('bcryptjs');
const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = String(password).trim();

    const existing = await User.findOne({ 
      email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } 
    });
    if (existing) return res.status(400).json({ message: 'User already exists with this email.' });

    const adminExists = await User.exists({ role: { $in: ['Admin', 'admin'] } });
    const assignedRole = adminExists ? 'user' : 'admin';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cleanPassword, salt);

    const newUser = new User({ 
      name: String(name).trim(), 
      username: String(name).trim(),
      email: cleanEmail, 
      password: hashedPassword, 
      role: assignedRole 
    });
    
    await newUser.save();
    res.status(201).json({ userId: newUser._id, name: newUser.name || newUser.username, email: newUser.email, role: newUser.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = String(password).trim();

    // Case-insensitive lookup for email
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password credentials.' });
    }

    const isMatch = (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')))
      ? await bcrypt.compare(cleanPassword, user.password)
      : (String(user.password).trim() === cleanPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password credentials.' });
    }

    res.json({ userId: user._id, name: user.name || user.username, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const passwordToSet = String(newPassword || password || '').trim();

    if (!passwordToSet) {
      return res.status(400).json({ message: 'New password is required.' });
    }

    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } 
    });

    if (!user) {
      return res.status(404).json({ message: 'No registered account found with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordToSet, salt);
    await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });
    
    res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { userId, name } = req.body;
    const user = await User.findByIdAndUpdate(userId, { name: String(name).trim() }, { new: true });
    
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({ userId: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, resetPassword, updateProfile };