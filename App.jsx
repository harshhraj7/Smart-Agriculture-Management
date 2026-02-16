import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:3001/api";

function getSensorColor(type, value) {
  const n = parseInt(String(value).replace(/[^\d]/g, ""), 10);
  if (Number.isNaN(n)) return "neutral";

  if (type === "Soil Moisture") {
    if (n < 40) return "danger";
    if (n < 50) return "warn";
    return "ok";
  }
  if (type === "Temperature") {
    if (n > 35) return "danger";
    if (n > 30) return "warn";
    return "ok";
  }
  if (type === "Humidity") {
    if (n > 80) return "danger";
    if (n > 70) return "warn";
    return "ok";
  }
  return "neutral";
}

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [backendStatus, setBackendStatus] = useState("Checking backend...");
  const [sensors, setSensors] = useState([]);
  const [market, setMarket] = useState([]);
  const [loadingSensors, setLoadingSensors] = useState(true);
  const [loadingMarket, setLoadingMarket] = useState(true);

  useEffect(() => {
    // Health
    axios
      .get(`${API}/health`)
      .then((res) =>
        setBackendStatus(res.data?.message || res.data?.status || "OK")
      )
      .catch(() => setBackendStatus("Backend not reachable"));

    // Sensors
    setLoadingSensors(true);
    axios
      .get(`${API}/sensors`)
      .then((res) => setSensors(res.data || []))
      .catch(() => setSensors([]))
      .finally(() => setLoadingSensors(false));

    // Market
    setLoadingMarket(true);
    axios
      .get(`${API}/market`)
      .then((res) => setMarket(res.data || []))
      .catch(() => setMarket([]))
      .finally(() => setLoadingMarket(false));
  }, []);

  const healthPill = useMemo(() => {
    const text = String(backendStatus || "");
    const ok =
      text.toLowerCase().includes("healthy") || text.toLowerCase() === "ok";
    return ok ? { text: "Healthy", tone: "ok" } : { text: "Down", tone: "danger" };
  }, [backendStatus]);

  return (
    <div className="appShell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brandLogo">🌾</div>
          <div className="brandText">
            <div className="brandTitle">Smart Agri</div>
            <div className="brandSub">Integrated Platform</div>
          </div>
        </div>

        <nav className="nav">
          <button
            className={`navItem ${active === "dashboard" ? "active" : ""}`}
            onClick={() => setActive("dashboard")}
          >
            📊 Dashboard
          </button>

          <button
            className={`navItem ${active === "sensors" ? "active" : ""}`}
            onClick={() => setActive("sensors")}
          >
            📡 Sensor Data
          </button>

          <button
            className={`navItem ${active === "market" ? "active" : ""}`}
            onClick={() => setActive("market")}
          >
            🛒 Market
          </button>

          <button
            className={`navItem ${active === "advisory" ? "active" : ""}`}
            onClick={() => setActive("advisory")}
          >
            🤖 Advisory
          </button>
        </nav>

        <div className="sidebarFooter">
          <div className="miniLabel">Backend</div>
          <div className={`pill ${healthPill.tone}`}>{healthPill.text}</div>
          <div className="miniHint">{backendStatus}</div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="topbar">
          <div>
            <h1 className="pageTitle">
              Smart Agriculture Integrated Management Platform
            </h1>
            <p className="pageSubtitle">
              A unified platform connecting soil to sale
            </p>
          </div>

          <div className="topbarRight">
            <div className="statusRow">
              <span className="statusLabel">Backend Status</span>
              <span className={`pill ${healthPill.tone}`}>{healthPill.text}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        {active === "dashboard" && (
          <section className="grid">
            <div className="card">
              <div className="cardHead">
                <div className="icon">🌱</div>
                <div>
                  <div className="cardTitle">Farm & Crop Management</div>
                  <div className="cardSub">
                    Manage crops, land details and farming cycles.
                  </div>
                </div>
              </div>
              <div className="cardBody">
                <ul className="list">
                  <li>Crop records (basic)</li>
                  <li>Season planning (simple)</li>
                  <li>Scalable modules for future DB</li>
                </ul>
              </div>
            </div>

            <div className="card">
              <div className="cardHead">
                <div className="icon">📡</div>
                <div>
                  <div className="cardTitle">Real-Time Sensor Data</div>
                  <div className="cardSub">Live readings & thresholds</div>
                </div>
              </div>
              <div className="cardBody">
                {loadingSensors ? (
                  <div className="muted">Loading sensor data…</div>
                ) : sensors.length === 0 ? (
                  <div className="muted">No sensor data available.</div>
                ) : (
                  <div className="kvGrid">
                    {sensors.map((s) => {
                      const tone = getSensorColor(s.type, s.value);
                      return (
                        <div key={s.id} className={`kv ${tone}`}>
                          <div className="kvKey">{s.type}</div>
                          <div className="kvVal">{s.value}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="cardHead">
                <div className="icon">🤖</div>
                <div>
                  <div className="cardTitle">Smart Advisory</div>
                  <div className="cardSub">
                    Simple rule-based advice (scalable to ML)
                  </div>
                </div>
              </div>
              <div className="cardBody">
                <div className="notice ok">✅ Field conditions are optimal.</div>
                <div className="muted">
                  Next: add crop-based suggestions using sensor thresholds.
                </div>
              </div>
            </div>

            <div className="card">
              <div className="cardHead">
                <div className="icon">🛒</div>
                <div>
                  <div className="cardTitle">Market Access</div>
                  <div className="cardSub">Latest crop prices</div>
                </div>
              </div>
              <div className="cardBody">
                {loadingMarket ? (
                  <div className="muted">Loading market prices…</div>
                ) : market.length === 0 ? (
                  <div className="muted">No market data available.</div>
                ) : (
                  <div className="table">
                    {market.map((m, idx) => (
                      <div className="row" key={idx}>
                        <div className="cell strong">{m.crop}</div>
                        <div className="cell">{m.price}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {active === "sensors" && (
          <section className="panel">
            <h2 className="sectionTitle">Sensor Data</h2>
            <p className="muted">Shows sensor readings with health colors.</p>

            <div className="card">
              <div className="cardBody">
                {loadingSensors ? (
                  <div className="muted">Loading…</div>
                ) : sensors.length === 0 ? (
                  <div className="muted">No data.</div>
                ) : (
                  <div className="kvGrid">
                    {sensors.map((s) => {
                      const tone = getSensorColor(s.type, s.value);
                      return (
                        <div key={s.id} className={`kv ${tone}`}>
                          <div className="kvKey">{s.type}</div>
                          <div className="kvVal">{s.value}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {active === "market" && (
          <section className="panel">
            <h2 className="sectionTitle">Market Prices</h2>
            <p className="muted">Simple, scalable market module.</p>

            <div className="card">
              <div className="cardBody">
                {loadingMarket ? (
                  <div className="muted">Loading…</div>
                ) : market.length === 0 ? (
                  <div className="muted">No market data.</div>
                ) : (
                  <div className="table">
                    {market.map((m, idx) => (
                      <div className="row" key={idx}>
                        <div className="cell strong">{m.crop}</div>
                        <div className="cell">{m.price}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {active === "advisory" && (
          <section className="panel">
            <h2 className="sectionTitle">Advisory</h2>
            <p className="muted">
              Currently rule-based. Upgrade later to ML/LLM suggestions.
            </p>

            <div className="card">
              <div className="cardBody">
                <div className="notice ok">✅ Irrigation: Normal schedule</div>
                <div className="notice warn">
                  ⚠️ If moisture drops below 40%, recommend watering.
                </div>
                <div className="notice danger">
                  🚨 If temperature rises above 35°C, show heat-stress alert.
                </div>
              </div>
            </div>
          </section>
        )}

        <footer className="footer">
          <span>© Smart Agri • Minimal UI • Scalable Design</span>
        </footer>
      </main>
    </div>
  );
}
