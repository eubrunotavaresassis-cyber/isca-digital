const supabase = require('../_supabaseClient');
const jwt = require('jsonwebtoken');

function getUserIdFromHeader(req) {
  const header = req.headers.authorization;
  if (!header) return null;
  const token = header.replace('Bearer ', '');
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, JWT_SECRET);
    return payload.id;
  } catch (e) {
    return null;
  }
}

module.exports = async (req, res) => {
  const userId = getUserIdFromHeader(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    try {
      const { data: entries, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      let total_in = 0;
      let total_out = 0;
      let waste = 0;
      const categorySpend = {};

      for (const e of entries) {
        const val = Number(e.value) || 0;
        if (e.type === 'Entrada') {
          total_in += val;
        } else if (e.type === 'Saida') {
          total_out += val;
          categorySpend[e.category] = (categorySpend[e.category] || 0) + val;
          if (e.necessary == 0) {
            waste += val;
          }
        }
      }

      const balance = total_in - total_out;
      
      const top_categories = Object.entries(categorySpend)
        .map(([category, spent]) => ({ category, spent }))
        .sort((a, b) => b.spent - a.spent)
        .slice(0, 5);

      const summary = {
        total_in,
        total_out,
        balance,
        waste,
        potential_invest: waste,
        top_categories
      };

      return res.json({ summary });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
};
