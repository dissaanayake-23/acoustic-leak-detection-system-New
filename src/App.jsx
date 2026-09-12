import { useEffect, useState } from "react";
import "./App.css";
import compressedAirImage from "./assets/compressed-air-system.jpg";

import { ref, onValue, update } from "firebase/database";
import { database } from "./firebase";


import {
  LayoutDashboard,
  Activity,
  Bell,
  History,
  Cpu,
  Wifi,
  Mic2,
  Cloud,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";



function App() {

  const [activePage, setActivePage] = useState("dashboard");

  const [sensorData, setSensorData] = useState({
    soundLevel: 0,
    threshold: 70,
    status: "normal",
    leakDetected: false,
    timestamp: 0,
  });

  useEffect(() => {
    const sensorRef = ref(database, "sensor");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setSensorData(data);
      }
    });

    return () => unsubscribe();
  }, []);

  const soundLevel = sensorData.soundLevel;
  const threshold = sensorData.threshold;

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
    {
      id: "device",
      label: "Device",
      icon: Cpu,
    },
  ];

  return (
    <div className="app">
      {/* =========================
          SIDEBAR
      ========================== */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Activity size={23} />
          </div>

          <div>
            <h2>Compressed Air</h2>
            <h2>Leak Detection</h2>
            <p>Real-Time Monitoring</p>
          </div>
        </div>

        <p className="sidebar-title">MONITORING</p>

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
                <Icon size={18} />

                <span>{item.label}</span>

                {item.id === "alerts" && (
  <span className="alert-number">
    {sensorData.leakDetected ? 1 : 0}
  </span>
)}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-system">
          <p>SYSTEM STATUS</p>

          <SystemMini
            icon={<Cpu size={16} />}
            name="ESP32"
            status="Online"
          />

          <SystemMini
            icon={<Mic2 size={16} />}
            name="INMP441"
            status="Active"
          />

          <SystemMini
            icon={<Cloud size={16} />}
            name="Firebase"
            status="Connected"
          />
        </div>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main className="main-content">
        {activePage === "dashboard" && (
          <>
            <DashboardHero />

            <Dashboard
              soundLevel={soundLevel}
              threshold={threshold}
            />
          </>
        )}

        {activePage === "live" && (
          <>
            <SimplePageHeader
              page="Live Monitor"
              title="Compressed Air Leak Detection"
              subtitle="Real-Time Monitoring Dashboard"
            />

            <LiveMonitor
              soundLevel={soundLevel}
              threshold={threshold}
            />
          </>
        )}

        {activePage === "alerts" && (
          <>
            <SimplePageHeader
              page="Alerts"
              title="Compressed Air Leak Detection"
              subtitle="Real-Time Monitoring Dashboard"
            />

           <Alerts
  soundLevel={soundLevel}
  threshold={threshold}
  leakDetected={sensorData.leakDetected}
  status={sensorData.status}
  timestamp={sensorData.timestamp}
/>
          </>
        )}

        {activePage === "history" && (
          <>
            <SimplePageHeader
              page="History"
              title="Compressed Air Leak Detection"
              subtitle="Real-Time Monitoring Dashboard"
            />

            <HistoryPage />
          </>
        )}

        {activePage === "device" && (
          <>
            <SimplePageHeader
              page="Device"
              title="Compressed Air Leak Detection"
              subtitle="Real-Time Monitoring Dashboard"
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
            <span></span>
            ESP32 Online
          </div>
        </div>

        <div className="hero-monitoring">
          <span></span>
          System Monitoring
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SIMPLE HEADER FOR OTHER PAGES
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
        <span></span>
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
}) {
  const risk = Math.round(
    (soundLevel / threshold) * 100
  );

  return (
    <>
      {/* SOUND + LEAK */}
      <section className="hero-grid">
        <SoundMeter
          soundLevel={soundLevel}
        />

        <div className="panel leak-panel">
          <p className="small-title">
            LEAK ANALYSIS
          </p>

          <h3>Leak Risk</h3>

          <div className="risk-heading">
            <strong>LOW</strong>

            <span>
              {risk}% of threshold
            </span>
          </div>

          <div className="risk-track">
            <div
              className="risk-fill"
              style={{
                width: `${Math.min(
                  risk,
                  100
                )}%`,
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
              Leak Threshold
            </div>

            <strong>
              {threshold} dB
            </strong>
          </div>

          <div className="safe-message">
            <ShieldCheck size={22} />

            <div>
              <strong>
                No Leak Detected
              </strong>

              <span>
                System operating normally
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE WAVEFORM */}
      <section className="panel waveform-panel">
        <div className="panel-header">
          <div>
            <p className="small-title">
              ACOUSTIC SIGNAL
            </p>

            <h3>
              Live Sound Waveform
            </h3>

            <span>
              Real-time INMP441 microphone
              activity
            </span>
          </div>

          <div className="chart-legend">
            <span className="legend-live"></span>
            Live signal

            <span className="legend-threshold"></span>
            70 dB threshold
          </div>
        </div>

        <SoundWave />
      </section>

      {/* SYSTEM HEALTH + EVENTS */}
      <section className="bottom-grid">
        <div className="panel bottom-panel">
          <div className="panel-header">
            <div>
              <p className="small-title">
                SYSTEM
              </p>

              <h3>
                System Health
              </h3>
            </div>

            <Activity size={19} />
          </div>

          <div className="health-grid">
            <HealthItem
              icon={<Cpu size={18} />}
              name="ESP32"
              status="Online"
            />

            <HealthItem
              icon={<Mic2 size={18} />}
              name="INMP441"
              status="Active"
            />

            <HealthItem
              icon={<Wifi size={18} />}
              name="Wi-Fi"
              status="Good"
            />

            <HealthItem
              icon={<Cloud size={18} />}
              name="Firebase"
              status="Connected"
            />
          </div>
        </div>

        <div className="panel bottom-panel">
          <div className="panel-header">
            <div>
              <p className="small-title">
                EVENTS
              </p>

              <h3>
                Recent Activity
              </h3>
            </div>

            <History size={19} />
          </div>

          <div className="event">
            <div className="event-icon safe-event">
              <ShieldCheck size={18} />
            </div>

            <div>
              <strong>
                System Normal
              </strong>

              <span>
                No leak detected
              </span>
            </div>

            <small>
              Just now
            </small>
          </div>

          <div className="event">
            <div className="event-icon">
              <Mic2 size={18} />
            </div>

            <div>
              <strong>
                Sound Reading Updated
              </strong>

              <span>
                {soundLevel} dB recorded
              </span>
            </div>

            <small>
              5 sec ago
            </small>
          </div>
        </div>
      </section>
    </>
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
      <PageTitle
        label="LIVE MONITOR"
        title="Real-Time Acoustic Monitoring"
        description="Continuous sound monitoring from the INMP441 microphone."
      />

      <section className="hero-grid">
        <SoundMeter
          soundLevel={soundLevel}
        />

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
              value="Normal"
              green
            />

            <InfoRow
              label="Sensor"
              value="INMP441"
            />
          </div>
        </div>
      </section>

      <section className="panel waveform-panel">
        <div className="panel-header">
          <div>
            <p className="small-title">
              LIVE SIGNAL
            </p>

            <h3>
              Acoustic Waveform
            </h3>
          </div>

          <span className="live-text">
            ● LIVE
          </span>
        </div>

        <SoundWave />
      </section>
    </section>
  );
}

/* =========================================================
   ALERTS
========================================================= */

function Alerts({
  soundLevel,
  threshold,
  leakDetected,
  status,
  timestamp,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [alert, setAlert] = useState(null);

  // Listen to the saved alert from Firebase
  useEffect(() => {
    const alertRef = ref(database, "alerts/alert001");

    const unsubscribe = onValue(alertRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setAlert(data);
      }
    });

    return () => unsubscribe();
  }, []);

  // Create/update the alert lifecycle
  useEffect(() => {
    const alertRef = ref(database, "alerts/alert001");

    if (leakDetected === true) {
      // Create an active alert if one does not exist
      if (!alert) {
        update(alertRef, {
          node: "Node 03",
          soundLevel: soundLevel,
          threshold: threshold,
          severity: status === "critical" ? "critical" : "warning",
          state: "active",
          createdAt: timestamp || Date.now(),
          acknowledgedAt: null,
          resolvedAt: null,
        });
      }
    }

    // Sensor has returned to normal
    if (
      leakDetected === false &&
      alert &&
      alert.state !== "resolved"
    ) {
      update(alertRef, {
        state: "resolved",
        resolvedAt: Date.now(),
        resolvedSoundLevel: soundLevel,
      });
    }
  }, [
    leakDetected,
    soundLevel,
    threshold,
    status,
    timestamp,
    alert,
  ]);

  // Acknowledge the alert
  const handleAcknowledge = async () => {
    const alertRef = ref(database, "alerts/alert001");

    await update(alertRef, {
      state: "acknowledged",
      acknowledgedAt: Date.now(),
    });
  };

  if (!alert) {
    return (
      <section>
        <PageTitle
          label="ALERT CENTER"
          title="Leak Alerts"
          description="Abnormal acoustic activity and leak detection events."
        />

        <div className="small-alert-box no-alert-box">
          <div className="small-alert-icon safe-icon">
            <ShieldCheck size={20} />
          </div>

          <div className="small-alert-content">
            <strong>No Active Alerts</strong>
            <span>System is operating normally</span>
          </div>
        </div>
      </section>
    );
  }

  const alertState = alert.state || "active";

  const isActive = alertState === "active";
  const isAcknowledged = alertState === "acknowledged";
  const isResolved = alertState === "resolved";

  const displaySoundLevel = isResolved
    ? alert.resolvedSoundLevel ?? soundLevel
    : alert.soundLevel ?? soundLevel;

  const alertTime = alert.createdAt
    ? new Date(alert.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  const acknowledgedTime = alert.acknowledgedAt
    ? new Date(alert.acknowledgedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  const resolvedTime = alert.resolvedAt
    ? new Date(alert.resolvedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  return (
    <section>
      <PageTitle
        label="ALERT CENTER"
        title="Leak Alerts"
        description="Abnormal acoustic activity and leak detection events."
      />

      {/* LONG ALERT BOX */}
      <div
        className={`long-alert-box ${
          isAcknowledged
            ? "acknowledged"
            : isResolved
            ? "resolved"
            : ""
        }`}
        onClick={() => setShowDetails(true)}
      >
        {/* ICON */}
        <div className="long-alert-icon">
          {isResolved ? (
            <ShieldCheck size={22} />
          ) : isAcknowledged ? (
            <ShieldCheck size={22} />
          ) : (
            <AlertTriangle size={22} />
          )}
        </div>

        {/* MAIN INFORMATION */}
        <div className="long-alert-content">
          <strong>
            {isResolved
              ? "Node 03 — Air Leak Resolved"
              : `Node 03 — ${
                  alert.severity === "critical"
                    ? "Critical Air Leak Detected"
                    : "Air Leak Warning"
                }`}
          </strong>

          <span>
            {isResolved
              ? "Sound level returned below the leak threshold"
              : "Abnormal acoustic activity detected"}
          </span>
        </div>

        {/* SOUND LEVEL */}
        <div className="long-alert-reading">
          <strong>{displaySoundLevel} dB</strong>
          <span>Sound Level</span>
        </div>

        {/* STATUS */}
        <div
          className={`long-alert-status ${
            isAcknowledged
              ? "status-acknowledged"
              : isResolved
              ? "status-resolved"
              : ""
          }`}
        >
          {isResolved
            ? "✓ RESOLVED"
            : isAcknowledged
            ? "✓ ACKNOWLEDGED"
            : "● ACTIVE"}
        </div>

        {/* ARROW */}
        <div className="long-alert-arrow">
          →
        </div>
      </div>

      {/* POPUP */}
      {showDetails && (
        <div
          className="alert-popup-overlay"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="alert-popup"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="alert-popup-header">
              <div className="popup-alert-icon">
                {isResolved ? (
                  <ShieldCheck size={22} />
                ) : (
                  <AlertTriangle size={22} />
                )}
              </div>

              <div>
                <h3>
                  {isResolved
                    ? "Node 03 — Air Leak Resolved"
                    : "Node 03 — Critical Air Leak"}
                </h3>

                <span>
                  {isResolved
                    ? "Leak condition has been resolved"
                    : "Abnormal acoustic activity detected"}
                </span>
              </div>

              <button
                className="popup-close"
                onClick={() => setShowDetails(false)}
              >
                ×
              </button>
            </div>

            {/* DETAILS */}
            <div className="alert-popup-details">

              <div className="popup-detail">
                <span>Node</span>
                <strong>Node 03</strong>
              </div>

              <div className="popup-detail">
                <span>Sound Level</span>
                <strong>{displaySoundLevel} dB</strong>
              </div>

              <div className="popup-detail">
                <span>Threshold</span>
                <strong>{alert.threshold} dB</strong>
              </div>

              <div className="popup-detail">
                <span>Severity</span>
                <strong className="critical-text">
                  {alert.severity}
                </strong>
              </div>

              <div className="popup-detail">
                <span>State</span>
                <strong
                  className={
                    isResolved
                      ? "resolved-text"
                      : isAcknowledged
                      ? "acknowledged-text"
                      : "critical-text"
                  }
                >
                  {alertState.toUpperCase()}
                </strong>
              </div>

              <div className="popup-detail">
                <span>Detected At</span>
                <strong>{alertTime}</strong>
              </div>

              {isAcknowledged || isResolved ? (
                <div className="popup-detail">
                  <span>Acknowledged At</span>
                  <strong>{acknowledgedTime}</strong>
                </div>
              ) : null}

              {isResolved ? (
                <div className="popup-detail">
                  <span>Resolved At</span>
                  <strong>{resolvedTime}</strong>
                </div>
              ) : null}

            </div>

            {/* ACTION */}
            {isActive && (
              <button
                className="acknowledge-button"
                onClick={handleAcknowledge}
              >
                Acknowledge Alert
              </button>
            )}

            {isAcknowledged && (
              <div className="acknowledged-message">
                ✓ Alert Acknowledged
              </div>
            )}

            {isResolved && (
              <div className="resolved-message">
                ✓ Alert Resolved
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
/* =========================================================
   HISTORY
========================================================= */

function HistoryPage() {
  const rows = [
    [
      "10:20 AM",
      "42.6 dB",
      "No Leak",
      "Normal",
    ],
    [
      "10:15 AM",
      "45.2 dB",
      "No Leak",
      "Normal",
    ],
    [
      "10:10 AM",
      "40.8 dB",
      "No Leak",
      "Normal",
    ],
    [
      "10:05 AM",
      "43.1 dB",
      "No Leak",
      "Normal",
    ],
    [
      "10:00 AM",
      "41.7 dB",
      "No Leak",
      "Normal",
    ],
  ];

  return (
    <section>
      <PageTitle
        label="HISTORY"
        title="Monitoring History"
        description="Previous acoustic readings and leak detection events."
      />

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
      <PageTitle
        label="DEVICE CENTER"
        title="Connected Hardware"
        description="ESP32, sensor, Wi-Fi and Firebase connection information."
      />

      <div className="device-grid">
        <DeviceCard
          icon={<Cpu size={28} />}
          title="ESP32"
          subtitle="Main Controller"
          details={[
            ["Status", "Online"],
            ["Connection", "Wi-Fi"],
            ["Data Upload", "Active"],
          ]}
        />

        <DeviceCard
          icon={<Mic2 size={28} />}
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
          icon={<Cloud size={28} />}
          title="Firebase"
          subtitle="Cloud Data Platform"
          details={[
            ["Status", "Connected"],
            ["Sync", "Real-Time"],
            ["Frontend", "React"],
          ]}
        />
      </div>
    </section>
  );
}

/* =========================================================
   REUSABLE SOUND METER
========================================================= */

function SoundMeter({
  soundLevel,
}) {
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
          ● LIVE
        </span>
      </div>

      <div className="sound-meter">
        <div className="meter-ring meter-ring-1"></div>
        <div className="meter-ring meter-ring-2"></div>
        <div className="meter-ring meter-ring-3"></div>

        <div className="meter-center">
          <Mic2 size={25} />

          <strong>
            {soundLevel}
          </strong>

          <span>dB</span>

          <small>
            NORMAL
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
   SOUND WAVE
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
   SMALL COMPONENTS
========================================================= */

function SystemMini({
  icon,
  name,
  status,
}) {
  return (
    <div className="system-mini">
      <div className="system-mini-icon">
        {icon}
      </div>

      <div>
        <strong>
          {name}
        </strong>

        <span>
          <i></i>
          {status}
        </span>
      </div>
    </div>
  );
}

function HealthItem({
  icon,
  name,
  status,
}) {
  return (
    <div className="health-item">
      <div className="health-icon">
        {icon}
      </div>

      <div>
        <span>
          {name}
        </span>

        <strong>
          {status}
        </strong>
      </div>

      <i></i>
    </div>
  );
}

function InfoRow({
  label,
  value,
  green,
}) {
  return (
    <div className="info-row">
      <span>
        {label}
      </span>

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

function MetricCard({
  title,
  value,
}) {
  return (
    <div className="panel metric-card">
      <span>
        {title}
      </span>

      <strong>
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

      <h3>
        {title}
      </h3>

      <p>
        {subtitle}
      </p>

      <div className="device-details">
        {details.map(
          ([label, value]) => (
            <div key={label}>
              <span>
                {label}
              </span>

              <strong>
                {value}
              </strong>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function PageTitle({
  label,
  title,
  description,
}) {
  return (
    <div className="page-title">
      <p>
        {label}
      </p>

      <h2>
        {title}
      </h2>

      <span>
        {description}
      </span>
    </div>
  );
}

export default App;