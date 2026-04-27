import { useState } from "react";
import Header           from "../components/header";
import GlobalTimeFilter from "../components/GlobalTimeFilter";
import Footer           from "../components/footer";

import TemperatureGraph from "../Graphs/Temperature_graph";
import PhLevelGraph     from "../Graphs/Ph-Level-Graph";
import DigesterGraph    from "../Graphs/Digester-Graph";
import RawGasGraph      from "../Graphs/Raw-Gas-Graph";
import StoredGasGraph   from "../Graphs/Stored-Gas-Graph";

import C from "../theme/palette";

const SENSOR_INFO = [
  { icon: "🌡️", label: "Temperature",      unit: "°C",  sensor: "T-01",    color: "#ff9944" },
  { icon: "🧪", label: "pH Level",          unit: "pH",  sensor: "PH-01",   color: "#c084fc" },
  { icon: "⚙️", label: "Digester Status",  unit: "%",   sensor: "US-01",   color: "#6C8E3E" },
  { icon: "🔥", label: "Raw CH₄",          unit: "%",   sensor: "CH4-DIG", color: "#6C8E3E" },
  { icon: "🏭", label: "Stored CH₄",        unit: "%",   sensor: "CH4-STO", color: "#4a9eff" },
];

export default function GraphsPage() {
  const [timeRange,    setTimeRange]    = useState("Weekly");
  const [selectedDate, setSelectedDate] = useState("");
  const [activeGraph,  setActiveGraph]  = useState("all");

  const sensorProps = { filterPeriod: timeRange, selectedDate };

  const tabs = [
    { key: "all",       label: "All Graphs" },
    { key: "temp",      label: "🌡️ Temperature" },
    { key: "ph",        label: "🧪 pH Level" },
    { key: "digester",  label: "⚙️ Digester" },
    { key: "rawgas",    label: "🔥 Raw CH₄" },
    { key: "storedgas", label: "🏭 Stored CH₄" },
  ];

  const showAll  = activeGraph === "all";

  return (
    <div style={{ background: "#0d1a09", minHeight: "100vh", width: "100%" }}>
      <Header
        title="📈 Sensor History Graphs"
        subtitle="Visualize historical sensor data from the biogas digester"
        bg="#0d1a09"
      />

      <style>{`
        .graphs-tab-bar { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .graphs-tab-bar::-webkit-scrollbar { display: none; }
        @media (max-width: 600px) {
          .graphs-controls { flex-direction: column !important; align-items: stretch !important; }
          .graphs-date     { width: 100% !important; box-sizing: border-box; }
        }
      `}</style>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "1rem", width: "100%", boxSizing: "border-box" }}>

        {/* ── Sensor legend pills ── */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8,
          marginBottom: "1rem",
        }}>
          {SENSOR_INFO.map(s => (
            <div key={s.sensor} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 20, padding: "4px 12px", fontSize: 12,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, display: "inline-block" }} />
              <span style={{ color: "#ccc" }}>{s.icon} {s.label}</span>
              <span style={{ color: "#666", fontSize: 10 }}>· {s.sensor}</span>
            </div>
          ))}
          {/* CO2 removed notice */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(163,54,46,0.10)", border: "1px solid rgba(163,54,46,0.25)",
            borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#c9a245",
          }}>
            ⚠️ CO₂ monitoring removed from study
          </div>
        </div>

        {/* ── Controls bar ── */}
        <div
          className="graphs-controls"
          style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap", gap: 10,
            marginBottom: "1rem",
          }}
        >
          {/* Live indicator */}
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
            Live Sensor History
          </div>

          {/* Date + time filter */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="graphs-date"
              style={{
                padding: "6px 10px", borderRadius: 8,
                border: "1px solid #3a5a20",
                background: "#1a2a0f", color: "#ccc",
                fontSize: 12, outline: "none",
              }}
            />
            <GlobalTimeFilter selected={timeRange} onChange={setTimeRange} />
          </div>
        </div>

        {/* ── Tab selector ── */}
        <div
          className="graphs-tab-bar"
          style={{
            display: "flex", gap: 6, marginBottom: "1.5rem",
            padding: "2px 0",
          }}
        >
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveGraph(t.key)}
              style={{
                padding: "7px 16px", borderRadius: 8,
                border: activeGraph === t.key
                  ? "1px solid #6C8E3E"
                  : "1px solid rgba(255,255,255,0.10)",
                background: activeGraph === t.key
                  ? "rgba(108,142,62,0.30)"
                  : "rgba(255,255,255,0.04)",
                color: activeGraph === t.key ? "#8fb050" : "#aaa",
                fontSize: 13, fontWeight: activeGraph === t.key ? 700 : 400,
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "all .15s",
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* ── Graph grid ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {(showAll || activeGraph === "temp") && (
            <section>
              {showAll && <SectionLabel icon="🌡️" title="Temperature" color="#ff9944" />}
              <TemperatureGraph {...sensorProps} />
            </section>
          )}

          {(showAll || activeGraph === "ph") && (
            <section>
              {showAll && <SectionLabel icon="🧪" title="pH Level" color="#c084fc" />}
              <PhLevelGraph {...sensorProps} />
            </section>
          )}

          {(showAll || activeGraph === "digester") && (
            <section>
              {showAll && <SectionLabel icon="⚙️" title="Digester Status" color="#6C8E3E" />}
              <DigesterGraph {...sensorProps} />
            </section>
          )}

          {(showAll || activeGraph === "rawgas") && (
            <section>
              {showAll && <SectionLabel icon="🔥" title="Raw Gas — Methane (CH₄)" color="#6C8E3E" />}
              <RawGasGraph {...sensorProps} />
            </section>
          )}

          {(showAll || activeGraph === "storedgas") && (
            <section>
              {showAll && <SectionLabel icon="🏭" title="Stored Gas — Methane (CH₄)" color="#4a9eff" />}
              <StoredGasGraph {...sensorProps} />
            </section>
          )}

        </div>

        {/* ── Reading guide ── */}
        <div style={{
          marginTop: "2rem",
          background: "rgba(108,142,62,0.08)",
          border: "1px solid rgba(108,142,62,0.20)",
          borderRadius: 12, padding: "1rem 1.25rem",
        }}>
          <h4 style={{ color: "#8fb050", margin: "0 0 0.75rem", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>
            📖 How to Read These Graphs
          </h4>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "0.75rem",
          }}>
            {[
              { label: "Brush / Zoom Bar",  desc: "Drag the bottom slider to zoom into a specific time window." },
              { label: "Hover Tooltip",      desc: "Hover over any point to see the exact value and timestamp." },
              { label: "Legend",             desc: "Click a legend entry to show or hide a data series." },
              { label: "Time Filter",        desc: "Use the buttons above to change from daily to yearly view." },
              { label: "Date Picker",        desc: "Select a specific date to jump to that day's readings." },
              { label: "Tab Selector",       desc: "Switch tabs to focus on one sensor at a time." },
            ].map(g => (
              <div key={g.label}>
                <div style={{ color: "#ccc", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>• {g.label}</div>
                <div style={{ color: "#666", fontSize: 11, lineHeight: 1.5 }}>{g.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Small section divider used in "all" view
function SectionLabel({ icon, title, color }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      marginBottom: "0.6rem",
    }}>
      <span style={{
        width: 3, height: 20, borderRadius: 2,
        background: color, display: "inline-block",
      }} />
      <span style={{ color: "#ccc", fontSize: 13, fontWeight: 600 }}>
        {icon} {title}
      </span>
    </div>
  );
}
