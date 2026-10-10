import { useState } from "react";
import "./App.css";

import {
  LayoutDashboard,
  Activity,
  Bell,
  History,
  Cpu,
  Mic2,
  Cloud,
  ShieldCheck,
  AlertTriangle,
  Wifi,
  ChevronRight,
} from "lucide-react";


const mockAlerts = [
  {
    id: "alert003",
    node: "Node 03",
    title: "Critical Air Leak",
    severity: "critical",
    soundLevel: 88.2,
    threshold: 70,
    state: "active",
    createdAt: "Today, 01:05 PM",
    description: "Abnormal acoustic activity detected",
  },
  {
    id: "alert002",
    node: "Node 02",
    title: "Air Leak Warning",
    severity: "warning",
    soundLevel: 76.4,
    threshold: 70,
    state: "resolved",
    createdAt: "Today, 12:58 PM",
    description: "Sound level exceeded the warning threshold",
  },
  {
    id: "alert005",
    node: "Node 05",
    title: "Critical Air Leak",
    severity: "critical",
    soundLevel: 91.7,
    threshold: 70,
    state: "active",
    createdAt: "Today, 12:45 PM",
    description: "High acoustic activity detected",
  },
  {
    id: "alert004",
    node: "Node 04",
    title: "Air Leak Warning",
    severity: "warning",
    soundLevel: 73.1,
    threshold: 70,
    state: "resolved",
    createdAt: "Today, 12:32 PM",
    description: "Sound level slightly exceeded threshold",
  },
  {
    id: "alert001",
    node: "Node 01",
    title: "Critical Air Leak",
    severity: "critical",
    soundLevel: 84.6,
    threshold: 70,
    state: "resolved",
    createdAt: "Today, 12:20 PM",
    description: "Abnormal acoustic activity detected",
  },
];

/* =========================================================
   MOCK SENSOR DATA
   ========================================================= */

const SENSOR_DATA = {
  soundLevel: 88.2,
  threshold: 70,
  status: "critical",
  leakDetected: true,
};

/* =========================================================
   MOCK ALERT DATA
   ========================================================= */

const INITIAL_ALERTS = [
  {
    id: "alert008",
    node: "Node 03",
    severity: "critical",
    soundLevel: 88.2,
    threshold: 70,
    state: "active",
    createdAt: Date.now() - 2 * 60 * 1000,
  },
  {
    id: "alert007",
    node: "Node 02",
    severity: "warning",
    soundLevel: 76.4,
    threshold: 70,
    state: "active",
    createdAt: Date.now() - 5 * 60 * 1000,
  },
  {
    id: "alert006",
    node: "Node 05",
    severity: "critical",
    soundLevel: 91.7,
    threshold: 70,
    state: "active",
    createdAt: Date.now() - 9 * 60 * 1000,
  },
  {
    id: "alert005",
    node: "Node 04",
    severity: "warning",
    soundLevel: 73.1,
    threshold: 70,
    state: "resolved",
    createdAt: Date.now() - 16 * 60 * 1000,
  },
  {
    id: "alert004",
    node: "Node 01",
    severity: "critical",
    soundLevel: 84.6,
    threshold: 70,
    state: "resolved",
    createdAt: Date.now() - 25 * 60 * 1000,
  },
  {
    id: "alert003",
    node: "Node 03",
    severity: "critical",
    soundLevel: 88.2,
    threshold: 70,
    state: "resolved",
    createdAt: Date.now() - 40 * 60 * 1000,
  },
  {
    id: "alert002",
    node: "Node 02",
    severity: "warning",
    soundLevel: 74.5,
    threshold: 70,
    state: "resolved",
    createdAt: Date.now() - 55 * 60 * 1000,
  },
  {
    id: "alert001",
    node: "Node 01",
    severity: "critical",
    soundLevel: 82.6,
    threshold: 70,
    state: "resolved",
    createdAt: Date.now() - 75 * 60 * 1000,
  },
];

/* =========================================================
   APP
   ========================================================= */

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  const soundLevel = SENSOR_DATA.soundLevel;
  const threshold = SENSOR_DATA.threshold;

  const activeAlerts = alerts.filter(
    (alert) => alert.state === "active"
  );

  const resolvedAlerts = alerts.filter(
    (alert) => alert.state === "resolved"
  );

  const totalAlerts = alerts.length;

  const [selectedAlert, setSelectedAlert] = useState(null);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: Bell,
    },
    {
      id: "history",
      label: "History",
      icon: History,
    },
  ];

  /* =======================================================
     RESOLVE ALERT
     ======================================================= */

  function resolveAlert(id) {
    setAlerts((currentAlerts) =>
      currentAlerts.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              state: "resolved",
            }
          : alert
      )
    );
  }

  return (
    <div className="app">

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">
            <Activity size={24} />
          </div>

          <div>
            <h2>Compressed Air</h2>
            <h2>Leak Detection</h2>
            <p>Real-Time Monitoring</p>
          </div>
        </div>

        <div className="sidebar-section-title">
          MONITORING
        </div>

        <nav className="nav-menu">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`nav-item ${
                  activePage === item.id ? "active" : ""
                }`}
                onClick={() => setActivePage(item.id)}
              >
                <Icon size={19} />

                <span>{item.label}</span>

                {item.id === "alerts" &&
                  activeAlerts.length > 0 && (
                    <span className="alert-number">
                      {activeAlerts.length}
                    </span>
                  )}
              </button>
            );
          })}

        </nav>

      </aside>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="main-content">

        {/* =================================================
            DASHBOARD
        ================================================= */}

        {activePage === "dashboard" && (
          <>
            <SimplePageHeader
              page="Dashboard"
              title="Acoustic Leak Dashboard"
              subtitle="Real-time monitoring across 12 connected detection nodes."
            />

            <Dashboard
              soundLevel={soundLevel}
              threshold={threshold}
              alerts={alerts}
              resolveAlert={resolveAlert}
            />
          </>
        )}

        {/* =================================================
            ALERTS
        ================================================= */}

        {activePage === "alerts" && (
          <>
            <SimplePageHeader
              page="Alerts"
              title="Leak Alerts"
              subtitle="Monitor active and resolved acoustic leak events."
            />

            <AlertsPage
              alerts={alerts}
              selectedAlert={selectedAlert}
              setSelectedAlert={setSelectedAlert}
              resolveAlert={resolveAlert}
            />
          </>
        )}

        {/* =================================================
            HISTORY
        ================================================= */}

        {activePage === "history" && (
          <>
            <SimplePageHeader
              page="History"
              title="Monitoring History"
              subtitle="Previous acoustic readings and detection events."
            />

            <HistoryPage />
          </>
        )}

        {/* =================================================
            DEVICE
        ================================================= */}

        {activePage === "device" && (
          <>
            <SimplePageHeader
              page="Device"
              title="Connected Hardware"
              subtitle="ESP32 and INMP441 monitoring components."
            />

            <DevicePage
              soundLevel={soundLevel}
              threshold={threshold}
            />
          </>
        )}

      </main>
    </div>
  );
}



/* =========================================================
   MOCK NODES DATA
   ========================================================= */

const NODES_DATA = [
  { id: "Node 01", name: "Node 01" },
  { id: "Node 02", name: "Node 02" },
  { id: "Node 03", name: "Node 03" },
  { id: "Node 04", name: "Node 04" },
  { id: "Node 05", name: "Node 05" },
  { id: "Node 06", name: "Node 06" },
  { id: "Node 07", name: "Node 07" },
  { id: "Node 08", name: "Node 08" },
  { id: "Node 09", name: "Node 09" },
  { id: "Node 10", name: "Node 10" },
  { id: "Node 11", name: "Node 11" },
  { id: "Node 12", name: "Node 12" },
];

/* =========================================================
   SIMPLE HEADER
   ========================================================= */

function SimplePageHeader({
  page,
  title,
  subtitle,
}) {
  return (
    <header className="topbar">

      <div>
        <p className="breadcrumb">
          Monitoring / {page}
        </p>

        <h1>{title}</h1>

        <p className="subtitle">
          {subtitle}
        </p>
      </div>

    </header>
  );
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function Dashboard({
  soundLevel,
  threshold,
  alerts,
}) {
  const totalAlerts = alerts.length;

  const activeAlerts = alerts.filter(
    (alert) => alert.state === "active"
  ).length;

  const resolvedAlerts = alerts.filter(
    (alert) => alert.state === "resolved"
  ).length;

  return (
    <div className="dashboard">

      {/* =================================================
          SUMMARY
      ================================================= */}

      <section className="summary-grid">

        <SummaryCard
          icon={<Bell size={21} />}
          title="Total Alerts"
          value={totalAlerts}
          text="Recorded events"
        />

        <SummaryCard
          icon={<AlertTriangle size={21} />}
          title="Active Alerts"
          value={activeAlerts}
          text="Require attention"
          type="active"
        />

        <SummaryCard
          icon={<ShieldCheck size={21} />}
          title="Resolved Alerts"
          value={resolvedAlerts}
          text="Issues cleared"
          type="resolved"
        />

      </section>

      {/* =================================================
          NODES SECTION
      ================================================= */}

      <section className="nodes-section">

        <div className="nodes-section-header">
          <p className="small-title">MONITORING NODES</p>
          <h3>Connected Detection Nodes</h3>
          <p>Real-time leak status for all monitoring nodes across the system.</p>
        </div>

        <div className="nodes-grid">
          {NODES_DATA.map((node) => {
            const hasLeak = alerts.some(
              (a) => a.node === node.id && a.state === "active"
            );

            return (
              <div
                key={node.id}
                className={`node-card ${hasLeak ? "has-leak" : ""}`}
              >
                <div className="node-card-top">
                  <div className="node-icon-box">
                    <Cpu size={20} />
                  </div>

                  <span
                    className={`node-status-badge ${
                      hasLeak ? "leak" : "normal"
                    }`}
                  >
                    <span className="node-status-dot"></span>
                    {hasLeak ? "LEAK DETECTED" : "NORMAL"}
                  </span>
                </div>

                <h4 className="node-title">{node.name}</h4>
              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
}

/* =========================================================
   SUMMARY CARD
   ========================================================= */

function SummaryCard({
  icon,
  title,
  value,
  text,
  type = "",
}) {
  return (
    <div className={`summary-card ${type}`}>

      <div className="summary-icon">
        {icon}
      </div>

      <div className="summary-content">

        <span>{title}</span>

        <strong>{value}</strong>

        <small>{text}</small>

      </div>

    </div>
  );
}



/* =========================================================
   SOUND METER
   ========================================================= */

function SoundMeter({
  soundLevel,
  threshold,
}) {
  const isLeak =
    soundLevel >= threshold;

  return (
    <div className="panel sound-panel">

      <div className="panel-header">

        <div>
          <p className="small-title">
            LIVE ACOUSTIC LEVEL
          </p>

          <h3>
            Current Sound Reading
          </h3>
        </div>

        <span className="live-text">
          <span></span>
          LIVE
        </span>

      </div>

      <div className="sound-meter">

        <div className="meter-ring ring-1"></div>
        <div className="meter-ring ring-2"></div>
        <div className="meter-ring ring-3"></div>

        <div className="meter-center">

          <Mic2 size={28} />

          <strong>
            {soundLevel}
          </strong>

          <span>dB</span>

          <small
            className={
              isLeak
                ? "meter-danger"
                : ""
            }
          >
            {isLeak
              ? "LEAK"
              : "NORMAL"}
          </small>

        </div>

      </div>

      <div className="meter-labels">
        <span>0</span>
        <span>50</span>
        <span>70</span>
        <span>100 dB</span>
      </div>

    </div>
  );
}

/* =========================================================
   WAVEFORM
   ========================================================= */

function SoundWave() {
  return (
    <div className="wave-container">

      <div className="horizontal-line line1"></div>
      <div className="horizontal-line line2"></div>
      <div className="horizontal-line line3"></div>
      <div className="horizontal-line line4"></div>

      <div className="threshold-line"></div>

      <svg
        className="wave-svg"
        viewBox="0 0 1000 250"
        preserveAspectRatio="none"
      >
        <defs>

          <linearGradient
            id="waveColor"
            x1="0%"
            x2="100%"
          >
            <stop
              offset="0%"
              stopColor="#756dff"
            />

            <stop
              offset="50%"
              stopColor="#55b5ff"
            />

            <stop
              offset="100%"
              stopColor="#8d72ff"
            />
          </linearGradient>

        </defs>

        <polyline
          points="
          0,165
          40,150
          80,172
          120,138
          160,158
          200,130
          240,160
          280,118
          320,150
          360,132
          400,164
          440,126
          480,148
          520,120
          560,155
          600,132
          640,158
          680,117
          720,147
          760,128
          800,153
          840,114
          880,142
          920,124
          960,150
          1000,130
          "
          fill="none"
          stroke="url(#waveColor)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

      </svg>

      <div className="wave-time">
        <span>-60s</span>
        <span>-45s</span>
        <span>-30s</span>
        <span>-15s</span>
        <span>Now</span>
      </div>

    </div>
  );
}



/* =========================================================
   ALERTS PAGE
   ========================================================= */
function AlertsPage({
  alerts,
  selectedAlert,
  setSelectedAlert,
  resolveAlert,
}) {
  const [filterState, setFilterState] = useState("all");

  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter(
    (alert) => alert.state === "active"
  ).length;
  const resolvedAlerts = alerts.filter(
    (alert) => alert.state === "resolved"
  ).length;

  const filteredAlerts = alerts.filter((alert) => {
    if (filterState === "active") return alert.state === "active";
    if (filterState === "resolved") return alert.state === "resolved";
    return true;
  });

  const formatCreatedAt = (value) => {
    if (typeof value === "string") return value;
    return new Date(value).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="alerts-page">

      {/* STATISTICS */}
      <div className="alert-stats">
        <div className="alert-stat-card">
          <span>Total Alerts</span>
          <strong>{totalAlerts}</strong>
        </div>

        <div className="alert-stat-card active-stat">
          <span>Active Leaks</span>
          <strong>{activeAlerts}</strong>
        </div>

        <div className="alert-stat-card resolved-stat">
          <span>Resolved</span>
          <strong>{resolvedAlerts}</strong>
        </div>
      </div>

      {/* TABS FILTER */}
      <div className="history-filter-bar" style={{ marginBottom: "20px" }}>
        <div className="filter-group">
          <label>Show Alerts:</label>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
          >
            <option value="all">All Alerts ({totalAlerts})</option>
            <option value="active">Active Leaks ({activeAlerts})</option>
            <option value="resolved">Resolved ({resolvedAlerts})</option>
          </select>
        </div>
      </div>

      {/* ALERT LIST + DETAILS */}
      <div className={`alerts-content ${selectedAlert ? "has-details" : ""}`}>
        <div className="alerts-list">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className={`alert-card ${
                selectedAlert?.id === alert.id ? "selected" : ""
              } ${
                alert.state === "active"
                  ? "alert-active"
                  : "alert-resolved"
              }`}
            >
              <div className="alert-icon">
                {alert.state === "active" ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
              </div>

              <div className="alert-info">
                <strong>
                  {alert.node} — {alert.title}
                </strong>
                <span>{alert.description}</span>
              </div>

              <div
                className={`status-badge ${
                  alert.state === "active"
                    ? "status-active"
                    : "status-resolved"
                }`}
              >
                ● {alert.state === "active" ? "LEAK DETECTED" : "RESOLVED"}
              </div>
            </div>
          ))}
        </div>

        {/* DETAILS PANEL ONLY APPEARS AFTER CLICKING AN ALERT */}
        {selectedAlert && (
          <aside className="alert-details">
            <div className="details-header">
              <div>
                <p className="small-title">ALERT DETAILS</p>
                <h2>{selectedAlert.node}</h2>
                <p>{selectedAlert.title}</p>
              </div>

              <button
                type="button"
                className="close-details"
                onClick={() => setSelectedAlert(null)}
                aria-label="Close alert details"
              >
                ×
              </button>
            </div>

            <div
              className={`details-status ${
                selectedAlert.state === "active"
                  ? "details-active"
                  : "details-resolved"
              }`}
            >
              <span>
                {selectedAlert.state === "active" ? "⚠" : "✓"}
              </span>
              <div>
                <strong>
                  {selectedAlert.state === "active"
                    ? "Active Alert"
                    : "Alert Resolved"}
                </strong>
                <small>
                  {selectedAlert.state === "active"
                    ? "Requires attention"
                    : "No action required"}
                </small>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <span>Node</span>
                <strong>{selectedAlert.node}</strong>
              </div>

              <div className="detail-item">
                <span>Severity</span>
                <strong>
                  {selectedAlert.severity.charAt(0).toUpperCase() +
                    selectedAlert.severity.slice(1)}
                </strong>
              </div>

              <div className="detail-item">
                <span>Status</span>
                <strong>
                  {selectedAlert.state.charAt(0).toUpperCase() +
                    selectedAlert.state.slice(1)}
                </strong>
              </div>

              <div className="detail-item">
                <span>Created</span>
                <strong>{formatCreatedAt(selectedAlert.createdAt)}</strong>
              </div>
            </div>

            <div className="detail-message">
              <strong>Detection Information</strong>
              <p>{selectedAlert.description}</p>
            </div>

            {selectedAlert.state === "active" && (
              <button
                type="button"
                className="resolve-alert-button"
                onClick={() => resolveAlert(selectedAlert.id)}
              >
                ✓ Resolve Alert
              </button>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

const MOCK_HISTORY = [
  { id: "h001", time: "Today, 01:05 PM", node: "Node 03", event: "Leak Event Detected", status: "leak" },
  { id: "h002", time: "Today, 12:58 PM", node: "Node 02", event: "Leak Event Detected", status: "leak" },
  { id: "h003", time: "Today, 12:45 PM", node: "Node 05", event: "Leak Event Detected", status: "leak" },
  { id: "h004", time: "Today, 12:32 PM", node: "Node 04", event: "Leak Alert Resolved", status: "normal" },
  { id: "h005", time: "Today, 12:20 PM", node: "Node 01", event: "Leak Alert Resolved", status: "normal" },
  { id: "h006", time: "Today, 11:45 AM", node: "Node 08", event: "Routine Operational Scan", status: "normal" },
  { id: "h007", time: "Today, 11:10 AM", node: "Node 12", event: "Routine Operational Scan", status: "normal" },
  { id: "h008", time: "Today, 10:30 AM", node: "Node 06", event: "Routine Operational Scan", status: "normal" },
  { id: "h009", time: "Today, 09:50 AM", node: "Node 07", event: "Routine Operational Scan", status: "normal" },
  { id: "h010", time: "Today, 09:15 AM", node: "Node 09", event: "Routine Operational Scan", status: "normal" },
  { id: "h011", time: "Yesterday, 05:20 PM", node: "Node 10", event: "Routine Operational Scan", status: "normal" },
  { id: "h012", time: "Yesterday, 04:10 PM", node: "Node 11", event: "Routine Operational Scan", status: "normal" },
];

function HistoryPage() {
  const [filterNode, setFilterNode] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredRows = MOCK_HISTORY.filter((item) => {
    if (filterNode !== "all" && item.node !== filterNode) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <section className="history-section">

      {/* FILTER BAR */}
      <div className="history-filter-bar">
        <div className="filter-group">
          <label htmlFor="history-node-filter">Filter by Node:</label>
          <select
            id="history-node-filter"
            value={filterNode}
            onChange={(e) => setFilterNode(e.target.value)}
          >
            <option value="all">All Nodes</option>
            {NODES_DATA.map((node) => (
              <option key={node.id} value={node.id}>
                {node.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="history-status-filter">Filter by Status:</label>
          <select
            id="history-status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="leak">Leak Detected</option>
            <option value="normal">Normal</option>
          </select>
        </div>
      </div>

      {/* TABLE PANEL */}
      <div className="panel history-panel">

        <div className="history-row history-header">
          <span>Timestamp</span>
          <span>Node</span>
          <span>Event / Activity</span>
          <span>Status</span>
        </div>

        {filteredRows.length > 0 ? (
          filteredRows.map((row) => {
            const isLeak = row.status === "leak";
            return (
              <div className="history-row" key={row.id}>
                <span className="history-time">{row.time}</span>
                <span className="history-node-badge">
                  <Cpu size={14} />
                  <strong>{row.node}</strong>
                </span>
                <span className="history-event">{row.event}</span>
                <span>
                  <span
                    className={`node-status-badge ${
                      isLeak ? "leak" : "normal"
                    }`}
                  >
                    <span className="node-status-dot"></span>
                    {isLeak ? "LEAK DETECTED" : "NORMAL"}
                  </span>
                </span>
              </div>
            );
          })
        ) : (
          <div className="history-empty">
            <p>No history records match the selected filters.</p>
          </div>
        )}

      </div>

    </section>
  );
}

/* =========================================================
   DEVICE
   ========================================================= */

function DevicePage() {
  return (
    <section>

      <div className="device-grid">

        <DeviceCard
          icon={<Cpu size={27} />}
          title="ESP32 Microcontroller"
          subtitle="Main Processing & Wireless Unit"
          details={[
            ["Hardware Status", "Online & Operational"],
            ["System Uptime", "99.98%"],
            ["Firmware", "v2.4.1 Stable"],
            ["Wi-Fi Connectivity", "Connected (-58 dBm)"],
          ]}
        />

        <DeviceCard
          icon={<Mic2 size={27} />}
          title="INMP441 Sensor Array"
          subtitle="Digital Acoustic Microphones"
          details={[
            ["Sensor Status", "Active Sampling"],
            ["Sampling Frequency", "44.1 kHz"],
            ["Audio Interface", "I2S Digital Signal"],
            ["Array Sensitivity", "Omnidirectional"],
          ]}
        />

        <DeviceCard
          icon={<Cloud size={27} />}
          title="System Gateway"
          subtitle="Real-time Data Pipeline"
          details={[
            ["Gateway Status", "Connected"],
            ["Protocol", "MQTT / WebSockets"],
            ["Cloud Sync", "Active"],
            ["Encryption", "TLS 1.3 Secure"],
          ]}
        />

      </div>

    </section>
  );
}

/* =========================================================
   SMALL COMPONENTS
   ========================================================= */

function InfoRow({
  label,
  value,
  green,
}) {
  return (
    <div className="info-row">

      <span>{label}</span>

      <strong
        className={
          green ? "green-text" : ""
        }
      >
        {value}
      </strong>

    </div>
  );
}

function DeviceCard({
  icon,
  title,
  subtitle,
  details,
}) {
  return (
    <div className="panel device-card">

      <div className="device-main-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{subtitle}</p>

      <div className="device-details">

        {details.map(
          ([label, value]) => (
            <div key={label}>

              <span>{label}</span>

              <strong>{value}</strong>

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default App;