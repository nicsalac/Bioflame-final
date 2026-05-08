import { useState } from "react";
import Header from "../components/header";
import Card   from "../components/Card";
import Footer from "../components/footer";
import C      from "../theme/palette";

const workflow = [
  { step: "01", title: "Waste Collection",    desc: "Animal waste is collected and mixed with water to form slurry at approximately a 1:1 ratio." },
  { step: "02", title: "Slurry Feeding",      desc: "Slurry enters the biodigester via the inlet pipe. The inlet valve controls flow rate automatically." },
  { step: "03", title: "Anaerobic Digestion", desc: "Methanogenic bacteria break down organic matter without oxygen, producing biogas (primarily CH₄)." },
  { step: "04", title: "Sensor Monitoring",   desc: "Temperature, pH, water level, and gas sensors continuously transmit data to the BioFlame dashboard." },
  { step: "05", title: "Gas Collection",      desc: "Biogas accumulates in the gas dome and is piped to storage or direct combustion applications." },
  { step: "06", title: "Effluent Output",     desc: "Digested slurry (bio-slurry) exits through the outlet pipe and is used as organic fertilizer." },
];

export default function Documentation() {
  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Header
        title="📚 Documentation"
        subtitle="System overview and biogas production workflow"
      />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>

        {/* ── PROJECT OVERVIEW ── */}
        <Card style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ color: C.greenD, fontFamily: "'Georgia', serif", margin: "0 0 1rem", fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)" }}>
            Project Overview
          </h2>
          <p style={{ color: C.muted, lineHeight: 1.85, fontSize: 14, marginBottom: 12 }}>
            <strong>BioFlame</strong> is a web-based monitoring system designed to optimize animal waste
            management and renewable biogas energy production at <strong>Hiraya Childhood Play Farm</strong>.
            It provides continuous, real-time monitoring of key digestion parameters including temperature,
            pH, water level, and methane gas composition.
          </p>
          <p style={{ color: C.muted, lineHeight: 1.85, fontSize: 14, margin: 0 }}>
            The system integrates hardware sensors with a React-based frontend dashboard, giving farm
            operators and researchers actionable insights to maximize biogas yield while maintaining
            safe and efficient digester conditions.
          </p>
        </Card>

        {/* ── KEY PARAMETERS & ARCHITECTURE ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}>
          {[
            {
              icon: "🔑", title: "Key Parameters",
              items: [
                "Temperature: 35–38°C",
                "pH Level: 6.5–7.5",
                "CH₄ Purity: ≥60%",
                "Water Level: ≥50%",
                "HRT: 20–30 days",
              ],
            },
            {
              icon: "🌿", title: "Tech Stack",
              items: [
                "React + Vite",
                "Recharts (graphs)",
                "Supabase (database)",
                "Node.js v18+",
                "Hosted via Vercel / Netlify",
              ],
            },
            {
              icon: "📁", title: "Project Structure",
              items: [
                "src/pages/ — Page views",
                "src/components/ — UI parts",
                "src/Graphs/ — Charts",
                "src/database/ — Data hooks",
                "src/context/ — Auth",
              ],
            },
          ].map(box => (
            <Card key={box.title}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{box.icon}</div>
              <h3 style={{ color: C.greenD, fontFamily: "'Georgia', serif", margin: "0 0 10px", fontSize: 14 }}>
                {box.title}
              </h3>
              {box.items.map(item => (
                <div key={item} style={{
                  color: C.muted, fontSize: 13,
                  padding: "4px 0",
                  borderBottom: `1px solid ${C.cream}`,
                  lineHeight: 1.5,
                }}>• {item}</div>
              ))}
            </Card>
          ))}
        </div>

        {/* ── WORKFLOW ── */}
        <Card style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ color: C.greenD, fontFamily: "'Georgia', serif", margin: "0 0 1.25rem", fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)" }}>
            🔄 Biogas Production Workflow
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {workflow.map((w, i) => (
              <div key={w.step} style={{
                display: "flex", gap: 16, padding: "1rem",
                background: C.cream, borderRadius: 10,
                borderLeft: `4px solid ${i % 2 === 0 ? C.green : C.brown}`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: i % 2 === 0 ? C.green : C.brown,
                  color: "#fff", display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0,
                }}>{w.step}</div>
                <div>
                  <div style={{ color: C.text, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{w.title}</div>
                  <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>{w.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── OPERATING PARAMETERS CALLOUT ── */}
        <div style={{
          background: C.greenD, color: "#fff",
          borderRadius: 12, padding: "1.5rem",
        }}>
          <h3 style={{ fontFamily: "'Georgia', serif", margin: "0 0 0.75rem", fontSize: 16 }}>
            💡 Key Operating Parameters
          </h3>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.9, lineHeight: 1.85 }}>
            Maintain digester temperature between <strong>35–38°C</strong> (mesophilic range) and pH
            between <strong>6.5–7.5</strong> for optimal methanogen activity. Hydraulic retention time
            (HRT) is typically <strong>20–30 days</strong>. Monitor daily gas production rates — sudden
            drops may indicate pH imbalance or toxic inhibition. All sensor readings are logged in
            real-time on the Dashboard and can be reviewed historically through the graph views.
          </p>
        </div>

      </div>

      <Footer />
    </div>
  );
}
