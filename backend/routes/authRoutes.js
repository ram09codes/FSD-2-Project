const express = require('express');
const router = express.Router();
const { registerUser, loginUser, resetPassword, updateProfile } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);
router.patch('/profile', updateProfile);

module.exports = router;