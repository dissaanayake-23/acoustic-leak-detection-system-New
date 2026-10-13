import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

let pool = null;
let isPostgresConnected = false;

// In-memory fallback store if PostgreSQL is not connected yet
const inMemoryStore = {
  nodes: [
    { id: "Node 01", name: "Node 01", status: "normal", sound_level: 42.1, last_seen: new Date() },
    { id: "Node 02", name: "Node 02", status: "normal", sound_level: 45.3, last_seen: new Date() },
    { id: "Node 03", name: "Node 03", status: "leak", sound_level: 88.2, last_seen: new Date() },
    { id: "Node 04", name: "Node 04", status: "normal", sound_level: 41.0, last_seen: new Date() },
    { id: "Node 05", name: "Node 05", status: "leak", sound_level: 91.7, last_seen: new Date() },
    { id: "Node 06", name: "Node 06", status: "normal", sound_level: 39.5, last_seen: new Date() },
    { id: "Node 07", name: "Node 07", status: "normal", sound_level: 43.2, last_seen: new Date() },
    { id: "Node 08", name: "Node 08", status: "normal", sound_level: 44.0, last_seen: new Date() },
    { id: "Node 09", name: "Node 09", status: "normal", sound_level: 38.6, last_seen: new Date() },
    { id: "Node 10", name: "Node 10", status: "normal", sound_level: 46.2, last_seen: new Date() },
    { id: "Node 11", name: "Node 11", status: "normal", sound_level: 40.8, last_seen: new Date() },
    { id: "Node 12", name: "Node 12", status: "normal", sound_level: 42.9, last_seen: new Date() },
  ],
  alerts: [
    {
      id: "alert008",
      node_id: "Node 03",
      title: "Critical Air Leak",
      severity: "critical",
      sound_level: 88.2,
      threshold: 70,
      state: "active",
      description: "Abnormal acoustic activity detected above 70dB threshold",
      created_at: new Date(Date.now() - 2 * 60 * 1000),
      resolved_at: null,
    },
    {
      id: "alert007",
      node_id: "Node 02",
      title: "Air Leak Warning",
      severity: "warning",
      sound_level: 76.4,
      threshold: 70,
      state: "active",
      description: "Sound level exceeded the warning threshold",
      created_at: new Date(Date.now() - 5 * 60 * 1000),
      resolved_at: null,
    },
    {
      id: "alert006",
      node_id: "Node 05",
      title: "Critical Air Leak",
      severity: "critical",
      sound_level: 91.7,
      threshold: 70,
      state: "active",
      description: "High acoustic activity detected in main pipeline",
      created_at: new Date(Date.now() - 9 * 60 * 1000),
      resolved_at: null,
    },
    {
      id: "alert005",
      node_id: "Node 04",
      title: "Air Leak Warning",
      severity: "warning",
      sound_level: 73.1,
      threshold: 70,
      state: "resolved",
      description: "Sound level slightly exceeded threshold",
      created_at: new Date(Date.now() - 16 * 60 * 1000),
      resolved_at: new Date(Date.now() - 10 * 60 * 1000),
    },
    {
      id: "alert004",
      node_id: "Node 01",
      title: "Critical Air Leak",
      severity: "critical",
      sound_level: 84.6,
      threshold: 70,
      state: "resolved",
      description: "Abnormal acoustic activity detected",
      created_at: new Date(Date.now() - 25 * 60 * 1000),
      resolved_at: new Date(Date.now() - 18 * 60 * 1000),
    },
  ],
  history: [
    { id: "h001", time: "Today, 01:05 PM", node: "Node 03", event: "Leak Event Detected", status: "leak", created_at: new Date() },
    { id: "h002", time: "Today, 12:58 PM", node: "Node 02", event: "Leak Event Detected", status: "leak", created_at: new Date() },
    { id: "h003", time: "Today, 12:45 PM", node: "Node 05", event: "Leak Event Detected", status: "leak", created_at: new Date() },
    { id: "h004", time: "Today, 12:32 PM", node: "Node 04", event: "Leak Alert Resolved", status: "normal", created_at: new Date() },
    { id: "h005", time: "Today, 12:20 PM", node: "Node 01", event: "Leak Alert Resolved", status: "normal", created_at: new Date() },
    { id: "h006", time: "Today, 11:45 AM", node: "Node 08", event: "Routine Operational Scan", status: "normal", created_at: new Date() },
    { id: "h007", time: "Today, 11:10 AM", node: "Node 12", event: "Routine Operational Scan", status: "normal", created_at: new Date() },
  ],
  sensorReadings: [],
  settings: {
    threshold: 70,
    esp32: { online: true, firmware: "v2.4.1 Stable", wifiRssi: "-58 dBm", uptime: "99.98%" },
    microphone: { name: "INMP441", active: true, samplingRate: "44.1 kHz", interface: "I2S Digital Signal" },
    gateway: { status: "Connected", protocol: "MQTT / WebSockets", encryption: "TLS 1.3" }
  }
};

/**
 * Initialize PostgreSQL Database Connection and Schema
 */
export async function initDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.trim() === '') {
    console.log('\n⚠️ [Database Notice]: No DATABASE_URL found in environment.');
    console.log('👉 Running in-memory mode with full functionality.');
    console.log('👉 To connect Railway PostgreSQL, set DATABASE_URL in server/.env or Railway variables.\n');
    isPostgresConnected = false;
    return;
  }

  try {
    const isProduction = process.env.NODE_ENV === 'production' || databaseUrl.includes('railway');
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    const client = await pool.connect();
    console.log(' Connected successfully to PostgreSQL database!');

    // Initialize Schema
    await client.query(`
      CREATE TABLE IF NOT EXISTS nodes (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        status VARCHAR(20) DEFAULT 'normal',
        sound_level NUMERIC(5, 2) DEFAULT 0.0,
        last_seen TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS alerts (
        id VARCHAR(50) PRIMARY KEY,
        node_id VARCHAR(50) REFERENCES nodes(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        severity VARCHAR(20) NOT NULL DEFAULT 'warning',
        sound_level NUMERIC(5, 2) NOT NULL,
        threshold NUMERIC(5, 2) NOT NULL DEFAULT 70.0,
        state VARCHAR(20) NOT NULL DEFAULT 'active',
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        resolved_at TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS history (
        id VARCHAR(50) PRIMARY KEY,
        time VARCHAR(100) NOT NULL,
        node VARCHAR(50) NOT NULL,
        event VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'normal',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sensor_readings (
        id SERIAL PRIMARY KEY,
        node_id VARCHAR(50) NOT NULL,
        sound_level NUMERIC(5, 2) NOT NULL,
        threshold NUMERIC(5, 2) NOT NULL DEFAULT 70.0,
        leak_detected BOOLEAN DEFAULT FALSE,
        status VARCHAR(20) DEFAULT 'normal',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS system_settings (
        key VARCHAR(50) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Check if initial seeding is needed
    const nodeCountResult = await client.query('SELECT COUNT(*) FROM nodes');
    if (parseInt(nodeCountResult.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial PostgreSQL data (nodes, alerts, history, settings)...');
      
      // Seed nodes
      for (const node of inMemoryStore.nodes) {
        await client.query(
          `INSERT INTO nodes (id, name, status, sound_level, last_seen) VALUES ($1, $2, $3, $4, $5)`,
          [node.id, node.name, node.status, node.sound_level, node.last_seen]
        );
      }

      // Seed alerts
      for (const alert of inMemoryStore.alerts) {
        await client.query(
          `INSERT INTO alerts (id, node_id, title, severity, sound_level, threshold, state, description, created_at, resolved_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            alert.id,
            alert.node_id,
            alert.title,
            alert.severity,
            alert.sound_level,
            alert.threshold,
            alert.state,
            alert.description,
            alert.created_at,
            alert.resolved_at
          ]
        );
      }

      // Seed history
      for (const h of inMemoryStore.history) {
        await client.query(
          `INSERT INTO history (id, time, node, event, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [h.id, h.time, h.node, h.event, h.status, h.created_at]
        );
      }

      // Seed settings
      await client.query(
        `INSERT INTO system_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2`,
        ['config', JSON.stringify(inMemoryStore.settings)]
      );

      console.log('✅ Initial PostgreSQL data seeded successfully!');
    }

    client.release();
    isPostgresConnected = true;
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL:', err.message);
    console.log('👉 Falling back to in-memory store so server continues running.');
    isPostgresConnected = false;
  }
}

export { isPostgresConnected, pool, inMemoryStore };

/**
 * Execute query safely against PostgreSQL or in-memory store
 */
export async function query(text, params = []) {
  if (isPostgresConnected && pool) {
    return pool.query(text, params);
  }
  return null;
}
