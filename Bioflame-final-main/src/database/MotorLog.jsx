import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function formatDateTime(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleString("en-PH", {
    year: "numeric", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: true,
  });
}

export default function MotorLogComponent() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [showAll, setShowAll] = useState(false);

  async function fetchLogs() {
    const { data, error } = await supabase
      .from("motorlog")
      .select("log_id, started_at, stopped_at, status")
      .order("started_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("MotorLog fetch error:", error);
      setError("Failed to load motor log.");
    } else {
      setLogs(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchLogs();
    const id = setInterval(fetchLogs, 15000);
    return () => clearInterval(id);
  }, []);

  const badgeStyle = (status) => {
    const base = {
      display: "inline-block", padding: "2px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
    };
    if (status === "completed") return { ...base, background: "rgba(108,142,62,0.25)", color: "#8fb050", border: "1px solid rgba(108,142,62,0.4)" };
    if (status === "running")   return { ...base, background: "rgba(76,255,126,0.15)", color: "#4cff7e", border: "1px solid rgba(76,255,126,0.4)" };
    return                               { ...base, background: "rgba(163,54,46,0.2)",  color: "#ff8080", border: "1px solid rgba(163,54,46,0.4)" };
  };

  const visibleLogs = showAll ? logs : logs.slice(0, 4);

  return (
    <div style={{
      background: "#1a2a0f",
      border: "1px solid rgba(108,142,62,0.25)",
      borderRadius: 14,
      padding: "1.25rem 1.5rem",
      width: "100%", boxSizing: "border-box",
    }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap",
        gap: 8, marginBottom: "1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 3, height: 18, borderRadius: 2,
            background: "#8fb050", display: "inline-block",
          }} />
          <span style={{ color: "#ccc", fontSize: 14, fontWeight: 700 }}>
            ⚙️ Motor Log
          </span>
        </div>
        <span style={{
          background: "rgba(108,142,62,0.12)",
          border: "1px solid rgba(108,142,62,0.25)",
          color: "#8fb050", fontSize: 10,
          padding: "2px 10px", borderRadius: 12,
        }}>
          auto-refresh 15s
        </span>
      </div>

      {/* ── Loading / Error ── */}
      {loading && <div style={{ color: "#6C8E3E", padding: "1rem", textAlign: "center" }}>Loading motor log…</div>}
      {error   && <div style={{ color: "#ff8080", padding: "1rem", textAlign: "center" }}>{error}</div>}

      {/* ── Table ── */}
      {!loading && !error && (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, color: "#ccc" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(108,142,62,0.3)" }}>
                  {["Started At", "Stopped At", "Status"].map(h => (
                    <th key={h} style={{
                      padding: "8px 12px", textAlign: "left",
                      color: "#8fb050", fontWeight: 700, fontSize: 11,
                      textTransform: "uppercase", letterSpacing: 0.5,
                      whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleLogs.map((row, i) => (
                  <tr
                    key={row.log_id}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      background: i % 2 === 0 ? "rgba(0,0,0,0.15)" : "transparent",
                    }}
                  >
                    <td style={{ padding: "9px 12px", whiteSpace: "nowrap" }}>{formatDateTime(row.started_at)}</td>
                    <td style={{ padding: "9px 12px", whiteSpace: "nowrap" }}>
                      {row.stopped_at
                        ? formatDateTime(row.stopped_at)
                        : <span style={{ color: "#4cff7e", fontSize: 11 }}>● Running</span>}
                    </td>
                    <td style={{ padding: "9px 12px" }}>
                      <span style={badgeStyle(row.status)}>{row.status}</span>
                    </td>
                  </tr>
                ))}

                {logs.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ padding: "1.5rem", textAlign: "center", color: "#555" }}>
                      No motor log records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── See More / See Less button ── */}
          {logs.length > 4 && (
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                onClick={() => setShowAll(prev => !prev)}
                style={{
                  background: "rgba(108,142,62,0.15)",
                  border: "1px solid rgba(108,142,62,0.4)",
                  color: "#8fb050", fontSize: 12, fontWeight: 600,
                  padding: "7px 24px", borderRadius: 20,
                  cursor: "pointer", transition: "background .2s",
                }}
                onMouseEnter={e => e.target.style.background = "rgba(108,142,62,0.30)"}
                onMouseLeave={e => e.target.style.background = "rgba(108,142,62,0.15)"}
              >
                {showAll ? "▲ See Less" : `▼ See More (${logs.length - 4} more)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}