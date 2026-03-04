const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: 'اسم المستخدم مستخدم بالفعل' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, username, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, username: user.username } });

  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'اسم المستخدم غير موجود' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'كلمة المرور غير صحيحة' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, username: user.username } });

  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;