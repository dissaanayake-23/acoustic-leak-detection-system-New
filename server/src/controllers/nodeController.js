import { isPostgresConnected, pool, inMemoryStore } from '../config/db.js';

export async function getNodes(req, res) {
  try {
    if (isPostgresConnected && pool) {
      const result = await pool.query('SELECT * FROM nodes ORDER BY id ASC');
      const nodes = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        status: row.status,
        soundLevel: parseFloat(row.sound_level) || 0,
        lastSeen: row.last_seen,
      }));
      return res.json(nodes);
    }

    const nodes = inMemoryStore.nodes.map(n => ({
      id: n.id,
      name: n.name,
      status: n.status,
      soundLevel: n.sound_level,
      lastSeen: n.last_seen,
    }));
    return res.json(nodes);
  } catch (err) {
    console.error('Error fetching nodes:', err);
    res.status(500).json({ error: 'Failed to fetch nodes' });
  }
}

export async function getNodeById(req, res) {
  const { id } = req.params;
  try {
    if (isPostgresConnected && pool) {
      const result = await pool.query('SELECT * FROM nodes WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Node not found' });
      }
      const row = result.rows[0];
      return res.json({
        id: row.id,
        name: row.name,
        status: row.status,
        soundLevel: parseFloat(row.sound_level) || 0,
        lastSeen: row.last_seen,
      });
    }

    const node = inMemoryStore.nodes.find(n => n.id.toLowerCase() === id.toLowerCase());
    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }
    return res.json(node);
  } catch (err) {
    console.error('Error fetching node:', err);
    res.status(500).json({ error: 'Failed to fetch node' });
  }
}
