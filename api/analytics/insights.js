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
        .eq('user_id', userId)
        .eq('type', 'Saida');

      if (error) throw error;

      let waste = 0;
      const categorySpend = {};
      const recurringMap = {};

      for (const e of entries) {
        const val = Number(e.value) || 0;
        
        categorySpend[e.category] = (categorySpend[e.category] || 0) + val;
        
        if (e.necessary == 0) {
          waste += val;
        }

        const key = `${e.category}_${e.description}`;
        if (!recurringMap[key]) {
          recurringMap[key] = { description: e.description, category: e.category, cnt: 0, total: 0 };
        }
        recurringMap[key].cnt += 1;
        recurringMap[key].total += val;
      }

      const categories = Object.entries(categorySpend)
        .map(([category, spent]) => ({ category, spent }))
        .sort((a, b) => b.spent - a.spent);

      const top_category = categories[0] || { category: null, spent: 0 };

      const recurring = Object.values(recurringMap)
        .filter(r => r.cnt > 1)
        .sort((a, b) => b.total - a.total)
        .slice(0, 8);

      const investablePerMonth = waste;
      const investableYear = investablePerMonth * 12;
      const message = investablePerMonth > 0 
        ? `Se cortar R$ ${investablePerMonth.toFixed(2)}/mês, pode investir R$ ${investableYear.toFixed(2)}/ano` 
        : 'Nenhum gasto supérfluo detectado.';

      const insights = {
        categories,
        top_category,
        waste,
        recurring,
        potential_month: investablePerMonth,
        potential_year: investableYear,
        message
      };

      return res.json({ insights });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
};
