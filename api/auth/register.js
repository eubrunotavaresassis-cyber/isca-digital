const bcrypt = require('bcrypt');
const supabase = require('../_supabaseClient');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const { data: existing } = await supabase.from('users').select('id').eq('email', email).limit(1);
    if (existing && existing.length) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    const insert = { name: name || '', email, password: hashed, created_at: now };
    const { data, error } = await supabase.from('users').insert(insert).select('id,email,name').single();
    if (error) throw error;

    const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign({ id: data.id, email: data.email }, JWT_SECRET);
    res.json({ token, user: { id: data.id, name: data.name, email: data.email } });
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
};
