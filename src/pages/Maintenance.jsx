import { useState, useEffect } from "react";
import Header from "../components/header";
import Card   from "../components/Card";
import Footer from "../components/footer";
import { supabase } from "../supabaseClient";
import C from "../theme/palette";

/* ── Maintenance schedule (static — no Supabase table for this yet) ──────── */
const maintenanceTasks = [
  { id: 1, task: "Inspect digester seals & gaskets",        due: "Weekly",   status: "upcoming", priority: "high"   },
  { id: 2, task: "Flush slurry inlet pipe",                 due: "Bi-weekly",status: "overdue",  priority: "high"   },
  { id: 3, task: "Calibrate pH sensor (PH-01)",             due: "Monthly",  status: "upcoming", priority: "medium" },
  { id: 4, task: "Calibrate temperature sensor (T-01)",     due: "Monthly",  status: "done",     priority: "medium" },
  { id: 5, task: "Check gas storage tank pressure relief",  due: "Weekly",   status: "done",     priority: "high"   },
  { id: 6, task: "Clean ultrasonic level sensor (US-01)",   due: "Monthly",  status: "upcoming", priority: "low"    },
  { id: 7, task: "Inspect biogas piping for leaks",         due: "Weekly",   status: "overdue",  priority: "high"   },
  { id: 8, task: "Drain condensation trap",                 due: "Weekly",   status: "done",     priority: "medium" },
  { id: 9, task: "Lubricate agitator motor bearings",       due: "Monthly",  status: "upcoming", priority: "medium" },
  { id: 10, task: "Full system performance review",         due: "Quarterly",status: "upcoming", priority: "low"    },
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const statusBadge = (s) => ({
  overdue:  { bg: "#fde8e6", color: C.red,    label: "Overdue"  },
  upcoming: { bg: "#fff8e1", color: "#7a5c00", label: "Upcoming" },
  done:     { bg: "#e8f5d5", color: C.greenD,  label: "Done"     },
}[s]);

const priorityColor = (p) => ({ high: C.red, medium: C.brown, low: C.green }[p]);

/* ── Component ───────────────────────────────────────────────────────────── */
export default function Maintenance() {
  const [filter, setFilter] = useState("all");
  const [tasks, setTasks]   = useState(maintenanceTasks);

  /* Live operation data from Supabase */
  const [operationData, setOperationData] = useState([]);
  const [loadingOps, setLoadingOps]       = useState(true);
  const [opsError, setOpsError]           = useState(null);

  /* Retention days left */
  const [retentionDays, setRetentionDays] = useState(null);

  useEffect(() => {
    fetchOperationData();
    fetchRetentionDays();
  }, []);

  /* ── Fetch latest sensor readings ─────────────────────────────────────── */
  async function fetchOperationData() {
    setLoadingOps(true);
    setOpsError(null);

    try {
      const sensors = [
        { id: "T-01",  label: "Digester Temperature", unit: "°C", warnHigh: 40, warnLow: 25 },
        { id: "PH-01", label: "Slurry pH Level",      unit: "",   warnHigh: 7.5, warnLow: 6.0 },
        { id: "US-01", label: "Storage / Water Level", unit: "cm", warnHigh: 90, warnLow: null },
      ];

      const results = await Promise.all(
        sensors.map(async (s) => {
          const { data, error } = await supabase
            .from("sensorreading")
            .select("value")
            .eq("sensor_id", s.id)
            .order("timestamp", { ascending: false })
            .limit(1);

          if (error || !data || data.length === 0) {
            return { metric: s.label, value: "N/A", status: "ok" };
          }

          const val = parseFloat(data[0].value);
          const isWarning =
            (s.warnHigh != null && val > s.warnHigh) ||
            (s.warnLow  != null && val < s.warnLow);

          return {
            metric: s.label,
            value: `${val.toFixed(1)} ${s.unit}`.trim(),
            status: isWarning ? "warning" : "ok",
          };
        })
      );

      setOperationData(results);
    } catch (err) {
      console.error("Error fetching operation data:", err);
      setOpsError("Failed to load operation data.");
    }
    setLoadingOps(false);
  }

  /* ── Fetch retention days remaining ───────────────────────────────────── */
  async function fetchRetentionDays() {
    try {
      const { data, error } = await supabase
        .from("slurrylog")
        .select("release_date")
        .eq("transact_type", "IN")
        .not("release_date", "is", null)
        .order("timestamp", { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        const target = new Date(data[0].release_date);
        target.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
        setRetentionDays(diff);
      }
    } catch (err) {
      console.error("Error fetching retention:", err);
    }
  }

  /* ── Toggle task status locally ────────────────────────────────────────── */
  function cycleStatus(id) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = { overdue: "upcoming", upcoming: "done", done: "overdue" };
        return { ...t, status: next[t.status] };
      })
    );
  }

  /* ── Derived counts & filtered list ────────────────────────────────────── */
  const counts = {
    overdue:  tasks.filter((t) => t.status === "overdue").length,
    upcoming: tasks.filter((t) => t.status === "upcoming").length,
    done:     tasks.filter((t) => t.status === "done").length,
  };

  const filtered =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Header
        title="🔧 Maintenance"
        subtitle="System operation data & scheduled upkeep"
        bg={C.brown}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* ── Summary cards ─────────────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}>
          {[
            { label: "Overdue",   count: counts.overdue,  color: C.red,    bg: "#fde8e6" },
            { label: "Upcoming",  count: counts.upcoming, color: "#7a5c00", bg: "#fff8e1" },
            { label: "Completed", count: counts.done,     color: C.greenD,  bg: "#e8f5d5" },
          ].map((c) => (
            <Card key={c.label} style={{ textAlign: "center" }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%", background: c.bg,
                margin: "0 auto 10px", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 22, fontWeight: 700, color: c.color,
              }}>
                {c.count}
              </div>
              <div style={{ color: C.muted, fontSize: 13 }}>{c.label} Tasks</div>
            </Card>
          ))}

          {/* Retention card */}
          <Card style={{ textAlign: "center" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: retentionDays != null && retentionDays < 0 ? "#fde8e6" : "#e3f0ff",
              margin: "0 auto 10px", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 22, fontWeight: 700,
              color: retentionDays != null && retentionDays < 0 ? C.red : "#2b6cb0",
            }}>
              {retentionDays != null ? retentionDays : "–"}
            </div>
            <div style={{ color: C.muted, fontSize: 13 }}>Retention Days</div>
          </Card>
        </div>

        {/* ── Task list ─────────────────────────────────────────────────── */}
        <Card style={{ marginBottom: "1.5rem" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 8, marginBottom: "1rem",
          }}>
            <h3 style={{
              color: C.greenD, fontFamily: "'Georgia', serif",
              margin: 0, fontSize: 16,
            }}>
              Maintenance Schedule
            </h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["all", "overdue", "upcoming", "done"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    background: filter === f ? C.brown : C.cream,
                    color: filter === f ? "#fff" : C.muted,
                    border: "none", padding: "5px 12px", borderRadius: 20,
                    fontSize: 12, cursor: "pointer", textTransform: "capitalize",
                    transition: "all .15s",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 20, color: C.muted, fontSize: 13 }}>
                No tasks match this filter.
              </div>
            )}
            {filtered.map((t) => {
              const badge = statusBadge(t.status);
              return (
                <div
                  key={t.id}
                  onClick={() => cycleStatus(t.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px", borderRadius: 8, background: C.cream,
                    flexWrap: "wrap", cursor: "pointer",
                    transition: "box-shadow .15s",
                  }}
                  title="Click to cycle status"
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: priorityColor(t.priority), flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ color: C.text, fontSize: 14, fontWeight: 500 }}>{t.task}</div>
                    <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                      Frequency: {t.due}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                    <span style={{
                      fontSize: 11, padding: "3px 8px", borderRadius: 10,
                      background: badge.bg, color: badge.color, fontWeight: 600,
                    }}>
                      {badge.label}
                    </span>
                    <span style={{
                      fontSize: 11, padding: "3px 8px", borderRadius: 10,
                      background: "#f0f0f0", color: C.muted, textTransform: "capitalize",
                    }}>
                      {t.priority}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ── Live operation data ───────────────────────────────────────── */}
        <Card>
          <h3 style={{
            color: C.greenD, fontFamily: "'Georgia', serif",
            margin: "0 0 1rem", fontSize: 16,
          }}>
            ⚙️ Live Operation Data
          </h3>

          {loadingOps && (
            <div style={{ textAlign: "center", padding: 20, color: C.green, fontSize: 13 }}>
              Loading sensor data…
            </div>
          )}
          {opsError && (
            <div style={{ textAlign: "center", padding: 20, color: C.red, fontSize: 13 }}>
              {opsError}
            </div>
          )}

          {!loadingOps && !opsError && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}>
              {operationData.map((o) => (
                <div
                  key={o.metric}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", background: C.cream, borderRadius: 8,
                    border: `1px solid ${o.status === "warning" ? C.gold : C.creamD}`,
                  }}
                >
                  <div>
                    <div style={{ color: C.muted, fontSize: 11, marginBottom: 2 }}>{o.metric}</div>
                    <div style={{
                      color: C.text, fontSize: 15, fontWeight: 700,
                      fontFamily: "'Georgia', serif",
                    }}>
                      {o.value}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, padding: "3px 8px", borderRadius: 10, fontWeight: 600,
                    background: o.status === "warning" ? "#fff3cd" : "#e8f5d5",
                    color:      o.status === "warning" ? "#7a5c00" : C.greenD,
                  }}>
                    {o.status === "warning" ? "⚠ High" : "✓ OK"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Footer />
    </div>
  );
}
