const supabase = require('../_supabaseClient');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.replace('Bearer ', '');
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, JWT_SECRET);
    const { data, error } = await supabase.from('users').select('id,name,email,created_at').eq('id', payload.id).limit(1).single();
    if (error || !data) return res.status(404).json({ error: 'User not found' });
    res.json({ user: data });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
