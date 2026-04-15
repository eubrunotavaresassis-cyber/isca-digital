const express = require('express');
const router = express.Router();
const { db } = require('../db');
const auth = require('../middleware/auth');

// basic analytics: totals, top category, potential invest
router.get('/summary', auth, (req, res) => {
  const userId = req.user.id;
  const summary = {};
  db.get(`SELECT SUM(CASE WHEN type='Entrada' THEN value ELSE 0 END) as total_in, SUM(CASE WHEN type='Saida' THEN value ELSE 0 END) as total_out FROM entries WHERE user_id = ?`, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    summary.total_in = row.total_in || 0;
    summary.total_out = row.total_out || 0;
    summary.balance = summary.total_in - summary.total_out;

    db.all(`SELECT category, SUM(value) as spent FROM entries WHERE user_id = ? AND type='Saida' GROUP BY category ORDER BY spent DESC LIMIT 5`, [userId], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      summary.top_categories = rows || [];
      // simple 'waste' detection: sum of items marked necessary=0
      db.get(`SELECT SUM(value) as waste FROM entries WHERE user_id = ? AND necessary = 0 AND type='Saida'`, [userId], (err3, row3) => {
        summary.waste = (row3 && row3.waste) || 0;
        // potential invest estimate: if waste removed
        summary.potential_invest = summary.waste;
        res.json({ summary });
      });
    });
  });
});

// deeper insights: detect subscriptions, top waste categories, actionable message
router.get('/insights', auth, (req, res) => {
  const userId = req.user.id;
  const insights = {};
  // total per category (expenses)
  db.all(`SELECT category, SUM(value) as spent FROM entries WHERE user_id = ? AND type='Saida' GROUP BY category ORDER BY spent DESC`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const categories = rows || [];
    insights.categories = categories;
    insights.top_category = categories[0] || { category: null, spent: 0 };

    // waste (marked unnecessary)
    db.get(`SELECT SUM(value) as waste FROM entries WHERE user_id = ? AND necessary = 0 AND type='Saida'`, [userId], (err2, row2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      const waste = (row2 && row2.waste) || 0;
      insights.waste = waste;

      // detect recurring payments as simple heuristic: same description/category with monthly dates
      db.all(`SELECT description, category, COUNT(*) as cnt, SUM(value) as total FROM entries WHERE user_id = ? AND type='Saida' GROUP BY description, category HAVING cnt > 1 ORDER BY total DESC LIMIT 8`, [userId], (err3, recRows) => {
        if (err3) return res.status(500).json({ error: err3.message });
        insights.recurring = recRows || [];

        // actionable suggestion: if user cuts 'waste' per month, annual investable
        const investablePerMonth = waste;
        const investableYear = investablePerMonth * 12;
        insights.potential_month = investablePerMonth;
        insights.potential_year = investableYear;
        insights.message = investablePerMonth > 0 ? `Se cortar R$ ${investablePerMonth.toFixed(2)}/mês, pode investir R$ ${investableYear.toFixed(2)}/ano` : 'Nenhum gasto supérfluo detectado.';

        res.json({ insights });
      });
    });
  });
});

module.exports = router;
