const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');

// register
const { body, validationResult } = require('express-validator');

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid input', details: errors.array() })
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const created_at = new Date().toISOString();
    db.run(
      `INSERT INTO users (id, name, email, password, created_at) VALUES (?, ?, ?, ?, ?)`,
      [id, name || '', email, hashed, created_at],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        const token = jwt.sign({ id, email }, JWT_SECRET);
        res.json({ token, user: { id, name, email } });
      }
    );
});

// login
router.post('/login',
  body('email').isEmail(),
  body('password').isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid input', details: errors.array() })
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
      if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
});

// profile
const auth = require('../middleware/auth');
router.get('/profile', auth, (req, res) => {
  db.get(`SELECT id, name, email, created_at FROM users WHERE id = ?`, [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  });
});

module.exports = router;
