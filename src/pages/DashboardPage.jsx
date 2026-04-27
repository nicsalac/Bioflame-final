import { useState } from "react";
import Header           from "../components/header";
import GlobalTimeFilter from "../components/GlobalTimeFilter";
import Footer           from "../components/footer";

import TemperatureComponent  from "../database/Temperature";
import AcidityComponent      from "../database/acidity";
import WaterLevelComponent   from "../database/Water";
import SlurryComponent       from "../database/Slurry";
import StorageComponent      from "../database/Storage";
import AlertComponent        from "../database/Alert";
import RetentionComponent    from "../database/Retention";
import CH4Component          from "../database/CH4";

import TemperatureGraph from "../Graphs/Temperature_graph";
import PhLevelGraph     from "../Graphs/Ph-Level-Graph";
import DigesterGraph    from "../Graphs/Digester-Graph";
import RawGasGraph      from "../Graphs/Raw-Gas-Graph";
import StoredGasGraph   from "../Graphs/Stored-Gas-Graph";

import C from "../theme/palette";

/* ── Small coloured label shown above each graph ── */
function SectionLabel({ icon, title, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.5rem" }}>
      <span style={{
        width: 3, height: 18, borderRadius: 2,
        background: color, display: "inline-block", flexShrink: 0,
      }} />
      <span style={{ color: "#ccc", fontSize: 13, fontWeight: 600 }}>
        {icon} {title}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const [timeRange,    setTimeRange]    = useState("Daily");
  const [selectedDate, setSelectedDate] = useState("");

  const sensorProps = { filterPeriod: timeRange, selectedDate };

  return (
    <div style={{ background: "#0d1a09", minHeight: "100vh", width: "100%" }}>
      <Header
        title="📊 Live Dashboard"
        subtitle="Real-time biogas digester monitoring"
        bg="#0d1a09"
      />

      <style>{`
        /* ── Sensor card grids ── */
        @media (max-width: 479px) {
          .db-row1, .db-row2 { grid-template-columns: 1fr !important; }
          .db-controls       { flex-direction: column !important; align-items: stretch !important; }
          .db-filter-group   { flex-direction: column !important; align-items: stretch !important; width: 100% !important; }
          .db-date-input     { width: 100% !important; }
          .db-time-filter    { width: 100%; }
          .db-time-filter button { flex: 1; }
        }
        @media (min-width: 480px) and (max-width: 767px) {
          .db-row1, .db-row2 { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (min-width: 768px) and (max-width: 1099px) {
          .db-row1 { grid-template-columns: repeat(2,1fr) !important; }
          .db-row2 { grid-template-columns: repeat(4,1fr) !important; }
        }
        @media (min-width: 1100px) {
          .db-row1 { grid-template-columns: repeat(4,1fr) !important; }
          .db-row2 { grid-template-columns: repeat(4,1fr) !important; }
        }
        /* ── Graph tab bar on mobile ── */
        .graphs-tab-bar { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .graphs-tab-bar::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{
        maxWidth: 1300, margin: "0 auto",
        padding: "1rem", width: "100%", boxSizing: "border-box",
      }}>

        {/* ══════════════════════════════════════════
            TOP CONTROLS — date picker + time filter
        ══════════════════════════════════════════ */}
        <div
          className="db-controls"
          style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap", gap: 10, marginBottom: "1.25rem",
          }}
        >
          {/* Live status pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(108,142,62,0.2)", padding: "6px 14px",
            borderRadius: 20, fontSize: 12, color: "#8fb050", flexShrink: 0,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#4cff7e", display: "inline-block",
              boxShadow: "0 0 6px #4cff7e",
            }} />
            System Online · Live Data
          </div>

          {/* Date + filter buttons */}
          <div
            className="db-filter-group"
            style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}
          >
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="db-date-input"
              style={{
                padding: "6px 10px", borderRadius: 8,
                border: "1px solid #3a5a20",
                background: "#1a2a0f", color: "#ccc",
                fontSize: 12, outline: "none", boxSizing: "border-box",
              }}
            />
            <div className="db-time-filter" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <GlobalTimeFilter selected={timeRange} onChange={setTimeRange} />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            ROW 1 — Temperature · pH · Water · Slurry
        ══════════════════════════════════════════ */}
        <div
          className="db-row1"
          style={{
            display: "grid", gridTemplateColumns: "repeat(4,1fr)",
            gap: "1rem", marginBottom: "1rem", width: "100%",
          }}
        >
          <TemperatureComponent {...sensorProps} />
          <AcidityComponent     {...sensorProps} />
          <WaterLevelComponent  {...sensorProps} />
          <SlurryComponent      {...sensorProps} />
        </div>

        {/* ══════════════════════════════════════════
            ROW 2 — CH4 · Storage · Alerts · Retention
        ══════════════════════════════════════════ */}
        <div
          className="db-row2"
          style={{
            display: "grid", gridTemplateColumns: "repeat(4,1fr)",
            gap: "1rem", marginBottom: "1rem", width: "100%",
          }}
        >
          <CH4Component       {...sensorProps} />
          <StorageComponent   {...sensorProps} />
          <AlertComponent     {...sensorProps} />
          <RetentionComponent {...sensorProps} />
        </div>

        {/* ══════════════════════════════════════════
            SENSOR HISTORY GRAPHS
        ══════════════════════════════════════════ */}
        <div style={{
          borderTop: "1px solid rgba(108,142,62,0.25)",
          paddingTop: "1.5rem",
        }}>

          {/* Section heading */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 10, marginBottom: "1.25rem",
          }}>
            <h2 style={{
              color: "#8fb050", margin: 0,
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
            }}>
              📈 Sensor History Graphs
            </h2>
            <span style={{
              background: "rgba(108,142,62,0.15)",
              border: "1px solid rgba(108,142,62,0.30)",
              color: "#8fb050", fontSize: 11,
              padding: "2px 10px", borderRadius: 12,
            }}>
              Viewing: {timeRange}
            </span>
          </div>

          {/* Sensor legend pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: "1.25rem" }}>
            {[
              { icon: "🌡️", label: "Temperature",    sensor: "T-01",    color: "#ff9944" },
              { icon: "🧪", label: "pH Level",        sensor: "PH-01",   color: "#c084fc" },
              { icon: "⚙️", label: "Digester Status", sensor: "US-01",   color: "#6C8E3E" },
              { icon: "🔥", label: "Raw CH₄",         sensor: "CH4-DIG", color: "#6C8E3E" },
              { icon: "🏭", label: "Stored CH₄",      sensor: "CH4-STO", color: "#4a9eff" },
            ].map(s => (
              <div key={s.sensor} style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 20, padding: "3px 11px", fontSize: 11,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, display: "inline-block" }} />
                <span style={{ color: "#ccc" }}>{s.icon} {s.label}</span>
                <span style={{ color: "#555", fontSize: 10 }}>· {s.sensor}</span>
              </div>
            ))}
          </div>

          {/* All 5 graphs stacked — share the same time filter from the top */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            <section>
              <SectionLabel icon="🌡️" title="Temperature" color="#ff9944" />
              <TemperatureGraph {...sensorProps} />
            </section>

            <section>
              <SectionLabel icon="🧪" title="pH Level" color="#c084fc" />
              <PhLevelGraph {...sensorProps} />
            </section>

            <section>
              <SectionLabel icon="⚙️" title="Digester Status" color="#6C8E3E" />
              <DigesterGraph {...sensorProps} />
            </section>

            <section>
              <SectionLabel icon="🔥" title="Raw Gas — Methane (CH₄)" color="#6C8E3E" />
              <RawGasGraph {...sensorProps} />
            </section>

            <section>
              <SectionLabel icon="🏭" title="Stored Gas — Methane (CH₄)" color="#4a9eff" />
              <StoredGasGraph {...sensorProps} />
            </section>

          </div>

          {/* Reading guide */}
          <div style={{
            marginTop: "1.5rem",
            background: "rgba(108,142,62,0.07)",
            border: "1px solid rgba(108,142,62,0.18)",
            borderRadius: 12, padding: "1rem 1.25rem",
          }}>
            <h4 style={{
              color: "#8fb050", margin: "0 0 0.75rem",
              fontSize: 12, textTransform: "uppercase", letterSpacing: 1,
            }}>
              📖 How to Read These Graphs
            </h4>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.6rem",
            }}>
              {[
                { label: "Brush / Zoom Bar", desc: "Drag the bottom slider to zoom into a specific time window." },
                { label: "Hover Tooltip",    desc: "Hover over any point to see the exact value and timestamp." },
                { label: "Legend",           desc: "Click a legend entry to show or hide a data series." },
                { label: "Time Filter",      desc: "Use the buttons at the top to switch between daily and yearly views." },
                { label: "Date Picker",      desc: "Select a specific date to jump to that day's readings." },
              ].map(g => (
                <div key={g.label}>
                  <div style={{ color: "#ccc", fontSize: 11.5, fontWeight: 600, marginBottom: 2 }}>• {g.label}</div>
                  <div style={{ color: "#555", fontSize: 11, lineHeight: 1.5 }}>{g.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
        {/* end graphs section */}

      </div>

      <Footer />
    </div>
  );
}
