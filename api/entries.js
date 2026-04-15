const supabase = require('./_supabaseClient');
const { v4: uuidv4 } = require('uuid');
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
      const { data, error } = await supabase.from('entries').select('*').eq('user_id', userId).order('date', { ascending: false });
      if (error) throw error;
      return res.json({ entries: data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    const { date, category, description, type, value, payment_method, necessary, notes } = req.body || {};
    const id = uuidv4();
    try {
      const insert = { id, user_id: userId, date, category, description, type, value, payment_method, necessary: necessary ? 1 : 0, notes };
      const { data, error } = await supabase.from('entries').insert(insert).select('id').single();
      if (error) throw error;
      return res.json({ id: data.id });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // For simplicity, support PUT and DELETE via query param id
  if (req.method === 'PUT') {
    const { id } = req.query || {};
    if (!id) return res.status(400).json({ error: 'Missing id' });
    try {
      const { data, error } = await supabase.from('entries').update(req.body).eq('id', id).eq('user_id', userId).select('id').single();
      if (error) throw error;
      return res.json({ updated: 1 });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query || {};
    if (!id) return res.status(400).json({ error: 'Missing id' });
    try {
      const { data, error } = await supabase.from('entries').delete().eq('id', id).eq('user_id', userId).select('id');
      if (error) throw error;
      return res.json({ deleted: 1 });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
};
