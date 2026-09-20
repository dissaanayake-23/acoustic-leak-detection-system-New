import { useState } from "react";
import "./App.css";
import compressedAirImage from "./assets/compressed-air-system.jpg";

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
      id: "live",
      label: "Live Monitor",
      icon: Activity,
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
            <DashboardHero />

            <Dashboard
              soundLevel={soundLevel}
              threshold={threshold}
              alerts={alerts}
            />
          </>
        )}

        {/* =================================================
            LIVE MONITOR
        ================================================= */}

        {activePage === "live" && (
          <>
            <SimplePageHeader
              page="Live Monitor"
              title="Real-Time Acoustic Monitoring"
              subtitle="Continuous sound monitoring from the INMP441 microphone."
            />

            <LiveMonitor
              soundLevel={soundLevel}
              threshold={threshold}
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
   DASHBOARD HERO
   ========================================================= */

function DashboardHero() {
  return (
    <section
      className="dashboard-hero"
      style={{
        backgroundImage: `url(${compressedAirImage})`,
      }}
    >
      <div className="dashboard-hero-overlay">

        <div className="hero-top">

          <div>
            <p className="hero-breadcrumb">
              Monitoring / Dashboard
            </p>

            <h1>Acoustic Leak Monitor</h1>

            <p className="hero-project-name">
              Compressed Air Leak Detection
            </p>

            <p className="hero-subtitle">
              Real-Time Monitoring Dashboard
            </p>
          </div>

          <div className="hero-online">
            <span className="online-dot"></span>
            <strong>ESP32 Online</strong>
          </div>

        </div>

        <div className="hero-monitoring">
          <span className="online-dot"></span>
          System Monitoring
        </div>

      </div>
    </section>
  );
}

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

      <div className="online-badge">
        <span className="online-dot"></span>
        ESP32 Online
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

  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === "critical"
  ).length;

  const risk = Math.round(
    (soundLevel / threshold) * 100
  );

  const riskStatus =
    soundLevel >= threshold
      ? "CRITICAL"
      : soundLevel >= threshold * 0.8
      ? "WARNING"
      : "NORMAL";

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

        <SummaryCard
          icon={<AlertTriangle size={21} />}
          title="Critical Alerts"
          value={criticalAlerts}
          text="High severity events"
          type="critical"
        />

      </section>

      {/* =================================================
          SOUND + LEAK
      ================================================= */}

      <section className="hero-grid">

  <div className="panel leak-panel">

    <p className="small-title">
      LEAK ANALYSIS
    </p>

          <h3>Leak Risk</h3>

          <div className="risk-heading">

            <strong
              className={`risk-status ${riskStatus.toLowerCase()}`}
            >
              {riskStatus}
            </strong>

            <span>
              {risk}% of threshold
            </span>

          </div>

          <div className="risk-track">

            <div
              className={`risk-fill ${riskStatus.toLowerCase()}`}
              style={{
                width: `${Math.min(risk, 100)}%`,
              }}
            ></div>

            <span className="risk-marker"></span>

          </div>

          <div className="risk-labels">
            <span>Normal</span>
            <span>Warning</span>
            <span>Leak</span>
          </div>

          <div className="threshold-row">

            <div>
              <AlertTriangle size={18} />
              <span>Leak Threshold</span>
            </div>

            <strong>
              {threshold} dB
            </strong>

          </div>

          <div
            className={`detection-message ${
              soundLevel >= threshold
                ? "danger"
                : ""
            }`}
          >

            {soundLevel >= threshold ? (
              <AlertTriangle size={22} />
            ) : (
              <ShieldCheck size={22} />
            )}

            <div>

              <strong>
                {soundLevel >= threshold
                  ? "Leak Detected"
                  : "No Leak Detected"}
              </strong>

              <span>
                {soundLevel >= threshold
                  ? "Sound level is above the threshold"
                  : "System operating normally"}
              </span>

            </div>

          </div>

        </div>

      </section>

      

      {/* =================================================
          RECENT ALERTS
      ================================================= */}

      <RecentAlerts alerts={alerts} />

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
   RECENT ALERTS
   ========================================================= */

function RecentAlerts({ alerts }) {
  return (
    <section className="panel recent-alerts-panel">

      <div className="panel-header">

        <div>
          <p className="small-title">
            ALERTS
          </p>

          <h3>Recent Alerts</h3>

          <span>
            Latest activity from monitoring nodes
          </span>
        </div>

        <Bell size={20} />

      </div>

      <div className="recent-alert-list">

        {alerts.slice(0, 5).map((alert) => {

          const resolved =
            alert.state === "resolved";

          return (
            <div
              key={alert.id}
              className={`recent-alert ${
                resolved
                  ? "resolved"
                  : "active"
              }`}
            >

              <div className="recent-alert-icon">

                {resolved ? (
                  <ShieldCheck size={19} />
                ) : (
                  <AlertTriangle size={19} />
                )}

              </div>

              <div className="recent-alert-info">

                <strong>
                  {alert.node} —{" "}
                  {alert.severity === "critical"
                    ? "Critical Air Leak"
                    : "Air Leak Warning"}
                </strong>

                <span>
                  Abnormal acoustic activity detected
                </span>

              </div>

              <div className="recent-alert-reading">

                <strong>
                  {alert.soundLevel}
                </strong>

                <span>
                  Sound Level
                </span>

              </div>

              <div
                className={`alert-status ${
                  resolved
                    ? "resolved-status"
                    : "active-status"
                }`}
              >
                <span></span>
                {resolved
                  ? "RESOLVED"
                  : "ACTIVE"}
              </div>

              <ChevronRight
                size={19}
                className="alert-chevron"
              />

            </div>
          );
        })}

      </div>

    </section>
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
   LIVE MONITOR
   ========================================================= */

function LiveMonitor({
  soundLevel,
  threshold,
}) {
  return (
    <section>

      <section className="hero-grid">

        

        <div className="panel leak-panel">

          <p className="small-title">
            CURRENT ANALYSIS
          </p>

          <h3>
            Detection Information
          </h3>

          <div className="info-list">

            <InfoRow
              label="Current Level"
              value={`${soundLevel} dB`}
            />

            <InfoRow
              label="Leak Threshold"
              value={`${threshold} dB`}
            />

            <InfoRow
              label="Status"
              value={
                soundLevel >= threshold
                  ? "Leak Detected"
                  : "Normal"
              }
              green={
                soundLevel < threshold
              }
            />

            <InfoRow
              label="Sensor"
              value="INMP441"
            />

          </div>

        </div>

      </section>

      

    </section>
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
  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter(
    (alert) => alert.state === "active"
  ).length;
  const resolvedAlerts = alerts.filter(
    (alert) => alert.state === "resolved"
  ).length;

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
      {/* PAGE HEADER */}
      <div className="page-header">
        

        <div className="online-badge">
          <span></span>
          ESP32 Online
        </div>
      </div>

      {/* STATISTICS */}
      <div className="alert-stats">
        <div className="alert-stat-card">
          <span>Total</span>
          <strong>{totalAlerts}</strong>
        </div>

        <div className="alert-stat-card active-stat">
          <span>Active</span>
          <strong>{activeAlerts}</strong>
        </div>

        <div className="alert-stat-card resolved-stat">
          <span>Resolved</span>
          <strong>{resolvedAlerts}</strong>
        </div>
      </div>

      {/* ALERT LIST + DETAILS */}
      <div className={`alerts-content ${selectedAlert ? "has-details" : ""}`}>
        <div className="alerts-list">
          {alerts.map((alert) => (
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
                {alert.state === "active" ? "⚠" : "✓"}
              </div>

              <div className="alert-info">
                <strong>
                  {alert.node} — {alert.title}
                </strong>
                <span>{alert.description}</span>
              </div>

              <div className="alert-reading">
                <strong>{alert.soundLevel.toFixed(1)} dB</strong>
                <small>Sound Level</small>
              </div>

              <div
                className={`status-badge ${
                  alert.state === "active"
                    ? "status-active"
                    : "status-resolved"
                }`}
              >
                ● {alert.state.toUpperCase()}
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
                <span>Sound Level</span>
                <strong>{selectedAlert.soundLevel.toFixed(1)} dB</strong>
              </div>

              <div className="detail-item">
                <span>Threshold</span>
                <strong>{selectedAlert.threshold} dB</strong>
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

            <div className="sound-level-detail">
              <div className="detail-section-title">Sound Level</div>

              <div className="sound-level-number">
                {selectedAlert.soundLevel.toFixed(1)}
                <span>dB</span>
              </div>

              <div className="sound-progress">
                <div
                  style={{
                    width: `${Math.min(
                      (selectedAlert.soundLevel / selectedAlert.threshold) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="sound-scale">
                <span>0 dB</span>
                <span>Threshold {selectedAlert.threshold} dB</span>
                <span>100+ dB</span>
              </div>
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

/* =========================================================
   HISTORY
   ========================================================= */

function HistoryPage() {
  const rows = [
    ["10:20 AM", "42.6 dB", "No Leak", "Normal"],
    ["10:15 AM", "45.2 dB", "No Leak", "Normal"],
    ["10:10 AM", "40.8 dB", "No Leak", "Normal"],
    ["10:05 AM", "43.1 dB", "No Leak", "Normal"],
    ["10:00 AM", "41.7 dB", "No Leak", "Normal"],
  ];

  return (
    <section>

      <div className="panel history-panel">

        <div className="history-row history-header">
          <span>Time</span>
          <span>Sound Level</span>
          <span>Detection</span>
          <span>Status</span>
        </div>

        {rows.map((row, index) => (
          <div
            className="history-row"
            key={index}
          >
            <span>{row[0]}</span>
            <span>{row[1]}</span>
            <span>{row[2]}</span>
            <span className="green-text">
              {row[3]}
            </span>
          </div>
        ))}

      </div>

    </section>
  );
}

/* =========================================================
   DEVICE
   ========================================================= */

function DevicePage({
  soundLevel,
  threshold,
}) {
  return (
    <section>

      <div className="device-grid">

        <DeviceCard
          icon={<Cpu size={27} />}
          title="ESP32"
          subtitle="Main Controller"
          details={[
            ["Status", "Online"],
            ["Connection", "Wi-Fi"],
            ["Data Upload", "Active"],
          ]}
        />

        <DeviceCard
          icon={<Mic2 size={27} />}
          title="INMP441"
          subtitle="Digital Microphone Sensor"
          details={[
            ["Status", "Active"],
            [
              "Current Reading",
              `${soundLevel} dB`,
            ],
            [
              "Threshold",
              `${threshold} dB`,
            ],
          ]}
        />

        <DeviceCard
          icon={<Cloud size={27} />}
          title="Demo Data"
          subtitle="Mock Data Source"
          details={[
            ["Status", "Active"],
            ["Mode", "Hardcoded"],
            ["Frontend", "React"],
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