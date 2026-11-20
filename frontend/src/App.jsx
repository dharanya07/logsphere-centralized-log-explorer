
import { useEffect, useState, useCallback } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./App.css";

const API =
  import.meta.env.VITE_API_URL ||
  "https://logsphere-backend-44qa.onrender.com";

const styles = `
* {
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
}

body {
  background: #080d19;
  color: #e8edf7;
  font-family: Inter, Arial, sans-serif;
  overflow-x: hidden;
}

button, input, select {
  font: inherit;
}

.app {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #080d19;
  overflow-x: hidden;
}

.sidebar {
  flex: 0 0 245px;
  width: 245px;
  min-height: 100vh;
  background: #101a2d;
  border-right: 1px solid #202c42;
  padding: 26px 18px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px 35px;
}

.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #2563eb;
  display: grid;
  place-items: center;
  font-size: 21px;
}

.brand-name {
  font-size: 21px;
  font-weight: 750;
  letter-spacing: -.5px;
}

.brand-name span {
  color: #60a5fa;
}

.nav-label {
  color: #77869e;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.4px;
  padding: 12px 10px;
}

.nav-button {
  width: 100%;
  border: 0;
  background: transparent;
  color: #aab7cb;
  display: flex;
  gap: 13px;
  align-items: center;
  padding: 13px 12px;
  border-radius: 9px;
  cursor: pointer;
  text-align: left;
  margin-bottom: 5px;
  font-size: 14px;
}

.nav-button:hover,
.nav-button.active {
  background: #1e3456;
  color: #fff;
}

.nav-button.active {
  box-shadow: inset 3px 0 #3b82f6;
}

.sidebar-bottom {
  margin-top: auto;
  border-top: 1px solid #26334a;
  padding: 20px 8px 0;
  color: #8493aa;
  font-size: 12px;
  line-height: 1.7;
}

.live-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  margin-right: 7px;
}

.main {
  flex: 1 1 0;
  width: 0;
  min-width: 0;
  min-height: 100vh;
  padding: 28px 34px 35px;
  overflow-x: hidden;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 30px;
  width: 100%;
}

.breadcrumb {
  color: #8492a8;
  font-size: 13px;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 13px;
}

.status {
  color: #4ade80;
  background: #123326;
  border: 1px solid #1c5b3d;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  white-space: nowrap;
}

.avatar {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #243d67;
  color: #bfdbfe;
  font-weight: 700;
  flex-shrink: 0;
}

.page-title {
  font-size: 27px;
  margin: 0 0 8px;
  letter-spacing: -.7px;
}

.subtitle {
  color: #8795ab;
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.welcome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 27px;
  width: 100%;
}

.primary {
  border: 0;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  padding: 11px 17px;
  font-weight: 600;
  cursor: pointer;
}

.primary:hover {
  background: #1d4ed8;
}

.secondary {
  border: 1px solid #34435d;
  border-radius: 8px;
  background: #17243a;
  color: #dce7f8;
  padding: 10px 14px;
  cursor: pointer;
}

.secondary:hover {
  background: #243652;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 27px;
  width: 100%;
}

.stat-card {
  background: #111d31;
  border: 1px solid #26364f;
  border-radius: 12px;
  padding: 19px;
  min-width: 0;
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.stat-label {
  color: #a4b1c5;
  font-size: 13px;
}

.stat-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  font-size: 17px;
  flex-shrink: 0;
}

.stat-value {
  font-size: 29px;
  font-weight: 750;
  margin-top: 14px;
}

.stat-note {
  color: #8190a7;
  font-size: 11px;
  margin-top: 5px;
}

.panel {
  background: #111d31;
  border: 1px solid #26364f;
  border-radius: 12px;
  padding: 21px;
  margin-bottom: 22px;
  min-width: 0;
  width: 100%;
}

.panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.panel-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.panel-description {
  font-size: 12px;
  color: #8593a9;
  margin-top: 5px;
}

/* ANALYTICS CHARTS */

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  width: 100%;
  margin-bottom: 22px;
}

.chart-panel {
  margin-bottom: 0;
  min-width: 0;
}

.chart-container {
  width: 100%;
  height: 310px;
  min-width: 0;
}

.chart-empty {
  height: 100%;
  display: grid;
  place-items: center;
  color: #8492a8;
  font-size: 13px;
}

.toolbar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 17px;
  width: 100%;
}

.search {
  flex: 1;
  min-width: 190px;
  border: 1px solid #34445e;
  background: #0b1425;
  color: #e7eefb;
  border-radius: 8px;
  padding: 11px 13px;
  outline: none;
}

.search:focus,
.select:focus {
  border-color: #3b82f6;
}

.select {
  border: 1px solid #34445e;
  background: #0b1425;
  color: #dce7f8;
  border-radius: 8px;
  padding: 10px 12px;
  outline: none;
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 700px;
}

th {
  color: #8291a9;
  font-size: 11px;
  letter-spacing: .7px;
  text-transform: uppercase;
  padding: 13px 12px;
  border-bottom: 1px solid #2a3850;
}

td {
  color: #d5deed;
  font-size: 13px;
  padding: 15px 12px;
  border-bottom: 1px solid #202e45;
  overflow-wrap: anywhere;
}

tr:last-child td {
  border-bottom: 0;
}

tbody tr:hover {
  background: #17263d;
}

.level {
  display: inline-block;
  border-radius: 5px;
  padding: 5px 8px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .4px;
}

.level-ERROR {
  color: #fca5a5;
  background: #4b202b;
}

.level-CRITICAL {
  color: #fda4af;
  background: #591b2d;
}

.level-WARNING {
  color: #fcd34d;
  background: #493817;
}

.level-INFO {
  color: #93c5fd;
  background: #18365a;
}

.level-DEBUG {
  color: #c4b5fd;
  background: #35265c;
}

.muted {
  color: #8492a8;
}

.empty {
  padding: 35px 10px;
  text-align: center;
  color: #8492a8;
}

.error-box {
  background: #401d28;
  border: 1px solid #87384a;
  color: #fecdd3;
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 18px;
  font-size: 13px;
}

.success-box {
  background: #143526;
  border: 1px solid #236345;
  color: #bbf7d0;
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 18px;
  font-size: 13px;
}

.activity-list {
  display: grid;
  gap: 0;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 14px 0;
  border-bottom: 1px solid #25344b;
  min-width: 0;
}

.activity-item:last-child {
  border: 0;
}

.activity-marker {
  width: 9px;
  height: 9px;
  margin-top: 5px;
  border-radius: 50%;
  background: #3b82f6;
  flex-shrink: 0;
}

.activity-message {
  font-size: 13px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.activity-meta {
  color: #8392a8;
  font-size: 11px;
  margin-top: 5px;
}

.settings-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #26364f;
  gap: 15px;
}

.settings-row:last-child {
  border: 0;
}

.footer {
  text-align: center;
  color: #64748b;
  font-size: 11px;
  padding: 18px;
}

.upload-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
}

.hidden-file {
  display: none;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .main {
    padding: 24px;
  }
}

@media (max-width: 900px) {
  .sidebar {
    flex-basis: 210px;
    width: 210px;
    padding: 22px 13px;
  }

  .main {
    padding: 22px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .analytics-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .app {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    min-height: auto;
    flex: none;
    padding: 14px;
    border-right: 0;
    border-bottom: 1px solid #202c42;
  }

  .brand {
    padding: 0 5px 14px;
  }

  .nav-label,
  .sidebar-bottom {
    display: none;
  }

  .sidebar nav {
    display: flex;
    overflow-x: auto;
    gap: 5px;
  }

  .nav-button {
    width: auto;
    white-space: nowrap;
    margin: 0;
    padding: 10px;
    flex-shrink: 0;
  }

  .main {
    width: 100%;
    min-height: auto;
    padding: 20px 14px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .stat-card {
    padding: 14px;
  }

  .welcome {
    align-items: flex-start;
    flex-direction: column;
  }

  .topbar {
    margin-bottom: 22px;
    flex-wrap: wrap;
  }

  .panel {
    padding: 15px;
  }

  .chart-container {
    height: 280px;
  }
}

@media (max-width: 380px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .top-actions {
    gap: 7px;
  }
}
`;

const NAV_ITEMS = [
  { id: "dashboard", icon: "▦", label: "Dashboard" },
  { id: "logs", icon: "▤", label: "Log Explorer" },
  { id: "activity", icon: "◷", label: "Recent Activity" },
  { id: "settings", icon: "⚙", label: "Settings" },
];

const STAT_CONFIG = [
  { key: "total", label: "Total Logs", icon: "▤", color: "#60a5fa", bg: "#1b3657" },
  { key: "error", label: "Errors", icon: "✕", color: "#f87171", bg: "#49252d" },
  { key: "warning", label: "Warnings", icon: "⚠", color: "#fbbf24", bg: "#493817" },
  { key: "info", label: "Information", icon: "ⓘ", color: "#38bdf8", bg: "#17394b" },
  { key: "critical", label: "Critical", icon: "⬆", color: "#fb7185", bg: "#4b2332" },
];

const CHART_COLORS = {
  CRITICAL: "#fb7185",
  ERROR: "#f87171",
  WARNING: "#fbbf24",
  INFO: "#38bdf8",
  DEBUG: "#a78bfa",
};

function getLogValue(log, keys, fallback = "—") {
  for (const key of keys) {
    if (
      log?.[key] !== undefined &&
      log?.[key] !== null &&
      log[key] !== ""
    ) {
      return log[key];
    }
  }

  return fallback;
}

function formatTime(value) {
  if (!value || value === "—") return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}

function App() {
  const [logs, setLogs] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    error: 0,
    warning: 0,
    info: 0,
    critical: 0,
    debug: 0,
  });

  const [level, setLevel] = useState("ALL");
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchLogs = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      params.set("level", level);

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const response = await fetch(
        `${API}/api/logs?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Logs request failed (${response.status})`);
      }

      const data = await response.json();

      setLogs(Array.isArray(data) ? data : (data.logs || []));
      setApiError("");
    } catch (error) {
      setApiError(
        error.message || "Could not connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  }, [level, search]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/stats`);

      if (!response.ok) {
        throw new Error("Statistics request failed");
      }

      const data = await response.json();

      setStats((previous) => ({
        ...previous,
        ...data,
      }));
    } catch (error) {
      console.error("Statistics error:", error);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [fetchLogs, fetchStats]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLogs();
      fetchStats();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchLogs, fetchStats]);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setNotice("");
    setApiError("");

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(`${API}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Upload failed"
        );
      }

      setNotice(
        data.message || "File uploaded successfully."
      );

      await fetchLogs();
      await fetchStats();
    } catch (error) {
      setApiError(
        error.message || "File upload failed."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const navigate = (page) => {
    setActivePage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const severityData = [
    {
      name: "Critical",
      value: Number(stats.critical) || 0,
      color: CHART_COLORS.CRITICAL,
    },
    {
      name: "Error",
      value: Number(stats.error) || 0,
      color: CHART_COLORS.ERROR,
    },
    {
      name: "Warning",
      value: Number(stats.warning) || 0,
      color: CHART_COLORS.WARNING,
    },
    {
      name: "Info",
      value: Number(stats.info) || 0,
      color: CHART_COLORS.INFO,
    },
    {
      name: "Debug",
      value: Number(stats.debug) || 0,
      color: CHART_COLORS.DEBUG,
    },
  ];

  const visiblePieData = severityData.filter(
    (item) => item.value > 0
  );

  const renderLogTable = (items) => (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Service</th>
            <th>Source</th>
            <th>Message</th>
            <th>Timestamp</th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty">
                {loading
                  ? "Loading logs..."
                  : "No logs found. Try changing your filters or uploading a log file."}
              </td>
            </tr>
          ) : (
            items.map((log, index) => {
              const logLevel = String(
                getLogValue(log, ["level", "severity"], "INFO")
              ).toUpperCase();

              return (
                <tr key={log.id || log.timestamp || index}>
                  <td>
                    <span className={`level level-${logLevel}`}>
                      {logLevel}
                    </span>
                  </td>

                  <td>
                    {getLogValue(log, [
                      "service",
                      "application",
                      "name",
                    ])}
                  </td>

                  <td className="muted">
                    {getLogValue(log, [
                      "source",
                      "file",
                      "filename",
                    ])}
                  </td>

                  <td>
                    {getLogValue(log, [
                      "message",
                      "description",
                      "text",
                    ])}
                  </td>

                  <td className="muted">
                    {formatTime(
                      getLogValue(log, [
                        "timestamp",
                        "time",
                        "date",
                      ])
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  const latestLogs = [...logs].reverse().slice(0, 6);

  return (
    <>
      <style>{styles}</style>

      <div className="app">

        {/* SIDEBAR */}

        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon">⌁</div>

            <div className="brand-name">
              Log<span>Sphere</span>
            </div>
          </div>

          <div className="nav-label">WORKSPACE</div>

          <nav>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`nav-button ${
                  activePage === item.id ? "active" : ""
                }`}
                onClick={() => navigate(item.id)}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div>
              <span className="live-dot"></span>
              System monitoring active
            </div>

            <div>LogSphere v1.0.0</div>
            <div>Centralized Log Management</div>
          </div>
        </aside>

        {/* MAIN CONTENT */}

        <main className="main">

          <header className="topbar">
            <div className="breadcrumb">
              Workspace /{" "}
              {NAV_ITEMS.find(
                (item) => item.id === activePage
              )?.label}
            </div>

            <div className="top-actions">
              <span className="status">
                <span className="live-dot"></span>
                System Online
              </span>

              <div className="avatar">LS</div>
            </div>
          </header>

          {apiError && (
            <div className="error-box">
              ⚠ {apiError} Make sure the backend is running and reachable.
            </div>
          )}

          {notice && (
            <div className="success-box">
              ✓ {notice}
            </div>
          )}

          {/* DASHBOARD PAGE */}

          {activePage === "dashboard" && (
            <>
              <section className="welcome">
                <div>
                  <h1 className="page-title">
                    Dashboard Overview
                  </h1>

                  <p className="subtitle">
                    Monitor, analyze, and manage your application logs in one place.
                  </p>
                </div>

                <label className="primary upload-label">
                  {uploading ? "Uploading..." : "＋ Upload Logs"}

                  <input
                    className="hidden-file"
                    type="file"
                    accept=".txt,.log,.csv"
                    onChange={handleUpload}
                    disabled={uploading}
                  />
                </label>
              </section>

              {/* STATISTICS CARDS */}

              <section className="stats-grid">
                {STAT_CONFIG.map((item) => (
                  <div className="stat-card" key={item.key}>
                    <div className="stat-top">
                      <span className="stat-label">
                        {item.label}
                      </span>

                      <span
                        className="stat-icon"
                        style={{
                          color: item.color,
                          background: item.bg,
                        }}
                      >
                        {item.icon}
                      </span>
                    </div>

                    <div className="stat-value">
                      {stats[item.key] ?? 0}
                    </div>

                    <div className="stat-note">
                      Current log records
                    </div>
                  </div>
                ))}
              </section>

              {/* ANALYTICS SECTION */}

              <section className="analytics-grid">

                {/* PIE CHART */}

                <div className="panel chart-panel">
                  <div className="panel-heading">
                    <div>
                      <h2 className="panel-title">
                        Log Severity Distribution
                      </h2>

                      <div className="panel-description">
                        Proportion of logs by severity level
                      </div>
                    </div>
                  </div>

                  <div className="chart-container">
                    {visiblePieData.length === 0 ? (
                      <div className="chart-empty">
                        No log data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={visiblePieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            outerRadius={95}
                            innerRadius={55}
                            paddingAngle={3}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {visiblePieData.map((entry) => (
                              <Cell
                                key={entry.name}
                                fill={entry.color}
                              />
                            ))}
                          </Pie>

                          <Tooltip
                            contentStyle={{
                              background: "#17243a",
                              border: "1px solid #34445e",
                              borderRadius: "8px",
                              color: "#fff",
                            }}
                          />

                          <Legend
                            wrapperStyle={{
                              fontSize: "12px",
                              color: "#aab7cb",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* BAR CHART */}

                <div className="panel chart-panel">
                  <div className="panel-heading">
                    <div>
                      <h2 className="panel-title">
                        Logs by Severity
                      </h2>

                      <div className="panel-description">
                        Comparison of log counts across severity levels
                      </div>
                    </div>
                  </div>

                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={severityData}
                        margin={{
                          top: 15,
                          right: 10,
                          left: -15,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#293750"
                        />

                        <XAxis
                          dataKey="name"
                          stroke="#8492a8"
                          tick={{
                            fill: "#aab7cb",
                            fontSize: 11,
                          }}
                        />

                        <YAxis
                          allowDecimals={false}
                          stroke="#8492a8"
                          tick={{
                            fill: "#aab7cb",
                            fontSize: 11,
                          }}
                        />

                        <Tooltip
                          contentStyle={{
                            background: "#17243a",
                            border: "1px solid #34445e",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                        />

                        <Bar
                          dataKey="value"
                          name="Log Count"
                          radius={[6, 6, 0, 0]}
                        >
                          {severityData.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={entry.color}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              {/* LOG EXPLORER */}

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2 className="panel-title">
                      Log Explorer
                    </h2>

                    <div className="panel-description">
                      Search and filter your application logs
                    </div>
                  </div>

                  <button
                    className="secondary"
                    onClick={() => {
                      fetchLogs();
                      fetchStats();
                    }}
                  >
                    ↻ Refresh
                  </button>
                </div>

                <div className="toolbar">
                  <input
                    className="search"
                    type="search"
                    placeholder="Search logs, services, messages..."
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                  />

                  <select
                    className="select"
                    value={level}
                    onChange={(event) =>
                      setLevel(event.target.value)
                    }
                  >
                    <option value="ALL">All Levels</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="ERROR">Error</option>
                    <option value="WARNING">Warning</option>
                    <option value="INFO">Info</option>
                    <option value="DEBUG">Debug</option>
                  </select>
                </div>

                {renderLogTable(logs)}
              </section>

              {/* RECENT ACTIVITY */}

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2 className="panel-title">
                      Recent Activity
                    </h2>

                    <div className="panel-description">
                      Latest events received by LogSphere
                    </div>
                  </div>

                  <button
                    className="secondary"
                    onClick={() => navigate("activity")}
                  >
                    View all
                  </button>
                </div>

                <div className="activity-list">
                  {latestLogs.length === 0 ? (
                    <div className="empty">
                      No recent activity available.
                    </div>
                  ) : (
                    latestLogs.map((log, index) => (
                      <div
                        className="activity-item"
                        key={log.id || index}
                      >
                        <span className="activity-marker"></span>

                        <div>
                          <div className="activity-message">
                            {getLogValue(log, [
                              "message",
                              "description",
                              "text",
                            ])}
                          </div>

                          <div className="activity-meta">
                            {getLogValue(log, [
                              "service",
                              "application",
                            ])}
                            {" · "}
                            {formatTime(
                              getLogValue(log, [
                                "timestamp",
                                "time",
                                "date",
                              ])
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </>
          )}

          {/* LOG EXPLORER PAGE */}

          {activePage === "logs" && (
            <>
              <section className="welcome">
                <div>
                  <h1 className="page-title">
                    Log Explorer
                  </h1>

                  <p className="subtitle">
                    Explore and filter all collected application logs.
                  </p>
                </div>

                <label className="primary upload-label">
                  {uploading ? "Uploading..." : "＋ Upload Logs"}

                  <input
                    className="hidden-file"
                    type="file"
                    accept=".txt,.log,.csv"
                    onChange={handleUpload}
                    disabled={uploading}
                  />
                </label>
              </section>

              <section className="panel">
                <div className="toolbar">
                  <input
                    className="search"
                    type="search"
                    placeholder="Search logs..."
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                  />

                  <select
                    className="select"
                    value={level}
                    onChange={(event) =>
                      setLevel(event.target.value)
                    }
                  >
                    <option value="ALL">All Levels</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="ERROR">Error</option>
                    <option value="WARNING">Warning</option>
                    <option value="INFO">Info</option>
                    <option value="DEBUG">Debug</option>
                  </select>

                  <button
                    className="secondary"
                    onClick={() => {
                      setSearch("");
                      setLevel("ALL");
                    }}
                  >
                    Clear filters
                  </button>
                </div>

                {renderLogTable(logs)}
              </section>
            </>
          )}

          {/* RECENT ACTIVITY PAGE */}

          {activePage === "activity" && (
            <>
              <section className="welcome">
                <div>
                  <h1 className="page-title">
                    Recent Activity
                  </h1>

                  <p className="subtitle">
                    A timeline of the latest events recorded by your system.
                  </p>
                </div>

                <button
                  className="secondary"
                  onClick={() => {
                    fetchLogs();
                    fetchStats();
                  }}
                >
                  ↻ Refresh
                </button>
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <h2 className="panel-title">
                    Latest Log Events
                  </h2>

                  <span className="muted">
                    {logs.length} records
                  </span>
                </div>

                <div className="activity-list">
                  {[...logs].reverse().map((log, index) => (
                    <div
                      className="activity-item"
                      key={log.id || index}
                    >
                      <span className="activity-marker"></span>

                      <div>
                        <div className="activity-message">
                          <strong>
                            {getLogValue(log, [
                              "level",
                              "severity",
                            ], "INFO")}
                          </strong>
                          {" — "}
                          {getLogValue(log, [
                            "message",
                            "description",
                            "text",
                          ])}
                        </div>

                        <div className="activity-meta">
                          {getLogValue(log, [
                            "service",
                            "application",
                          ])}
                          {" · "}
                          {formatTime(
                            getLogValue(log, [
                              "timestamp",
                              "time",
                              "date",
                            ])
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {logs.length === 0 && (
                    <div className="empty">
                      No activity to display.
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {/* SETTINGS PAGE */}

          {activePage === "settings" && (
            <>
              <section className="welcome">
                <div>
                  <h1 className="page-title">
                    Settings
                  </h1>

                  <p className="subtitle">
                    Application information and system status.
                  </p>
                </div>
              </section>

              <section className="panel">
                <h2 className="panel-title">
                  System Configuration
                </h2>

                <div className="settings-row">
                  <div>
                    <strong>Application</strong>
                    <div className="panel-description">
                      Centralized Log Explorer
                    </div>
                  </div>
                  <span className="status">Active</span>
                </div>

                <div className="settings-row">
                  <div>
                    <strong>Frontend</strong>
                    <div className="panel-description">
                      React + Vite + Nginx
                    </div>
                  </div>
                  <span className="status">Running</span>
                </div>

                <div className="settings-row">
                  <div>
                    <strong>Backend</strong>
                    <div className="panel-description">
                      Python Flask REST API
                    </div>
                  </div>
                  <span className="status">Connected</span>
                </div>

                <div className="settings-row">
                  <div>
                    <strong>Log storage</strong>
                    <div className="panel-description">
                      JSON-based storage
                    </div>
                  </div>
                  <span className="status">Enabled</span>
                </div>

                <div className="settings-row">
                  <div>
                    <strong>Automatic refresh</strong>
                    <div className="panel-description">
                      Dashboard refreshes every 10 seconds
                    </div>
                  </div>
                  <span className="status">Enabled</span>
                </div>
              </section>
            </>
          )}

          <footer className="footer">
            LogSphere · Centralized Log Explorer · Built for application monitoring
          </footer>

        </main>
      </div>
    </>
  );
}

export default App;
