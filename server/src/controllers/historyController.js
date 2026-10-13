import { isPostgresConnected, pool, inMemoryStore } from '../config/db.js';

export async function getHistory(req, res) {
  const { node, status } = req.query;

  try {
    if (isPostgresConnected && pool) {
      let queryText = 'SELECT * FROM history WHERE 1=1';
      const params = [];

      if (node && node !== 'all') {
        params.push(node);
        queryText += ` AND node = $${params.length}`;
      }

      if (status && status !== 'all') {
        params.push(status);
        queryText += ` AND status = $${params.length}`;
      }

      queryText += ' ORDER BY created_at DESC LIMIT 100';

      const result = await pool.query(queryText, params);
      const rows = result.rows.map(row => ({
        id: row.id,
        time: row.time,
        node: row.node,
        event: row.event,
        status: row.status,
        createdAt: row.created_at,
      }));
      return res.json(rows);
    }

    let rows = [...inMemoryStore.history];
    if (node && node !== 'all') {
      rows = rows.filter(r => r.node === node);
    }
    if (status && status !== 'all') {
      rows = rows.filter(r => r.status === status);
    }

    return res.json(rows);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
}
