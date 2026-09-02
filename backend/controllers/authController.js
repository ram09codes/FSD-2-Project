const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) return res.status(400).json({ message: 'User already exists with this email.' });

    const adminExists = await User.exists({ role: 'Admin' });
    const assignedRole = adminExists ? 'User' : 'Admin';

    const newUser = new User({ name, email: cleanEmail, password, role: assignedRole });
    await newUser.save();
    res.status(201).json({ userId: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail, password });
    if (!user) return res.status(400).json({ message: 'Invalid email or password credentials.' });

    res.json({ userId: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(404).json({ message: 'No registered account found with this email.' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name } = req.body;
    const user = await User.findByIdAndUpdate(userId, { name }, { new: true });
    res.json({ userId: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, resetPassword, updateProfile };