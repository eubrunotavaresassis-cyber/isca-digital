const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// list entries for user
router.get('/', auth, (req, res) => {
  db.all(`SELECT * FROM entries WHERE user_id = ? ORDER BY date DESC`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ entries: rows });
  });
});

// create
router.post('/', auth,
  body('date').isISO8601().withMessage('Data inválida'),
  body('category').isString().notEmpty(),
  body('type').isIn(['Entrada','Saida']),
  body('value').isNumeric(),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid input', details: errors.array() })
    const id = uuidv4();
    const { date, category, description, type, value, payment_method, necessary, notes } = req.body;
    db.run(
      `INSERT INTO entries (id, user_id, date, category, description, type, value, payment_method, necessary, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, req.user.id, date, category, description, type, value, payment_method, necessary ? 1 : 0, notes],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id });
      }
    );
});

// update
router.put('/:id', auth,
  body('date').optional().isISO8601(),
  body('category').optional().isString(),
  body('type').optional().isIn(['Entrada','Saida']),
  body('value').optional().isNumeric(),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid input', details: errors.array() })
    const { id } = req.params;
    const { date, category, description, type, value, payment_method, necessary, notes } = req.body;
    db.run(
      `UPDATE entries SET date=?, category=?, description=?, type=?, value=?, payment_method=?, necessary=?, notes=? WHERE id=? AND user_id=?`,
      [date, category, description, type, value, payment_method, necessary ? 1 : 0, notes, id, req.user.id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
      }
    );
});

// delete
router.delete('/:id', auth, (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM entries WHERE id=? AND user_id=?`, [id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
