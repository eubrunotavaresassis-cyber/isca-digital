const bcrypt = require('bcrypt');
const supabase = require('../_supabaseClient');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).limit(1).single();
    if (error || !data) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, data.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign({ id: data.id, email: data.email }, JWT_SECRET);
    res.json({ token, user: { id: data.id, name: data.name, email: data.email } });
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
};
