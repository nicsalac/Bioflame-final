import C from "../theme/palette";

export default function Footer() {
  return (
    <footer style={{
      background: C.text, color: "rgba(255,255,255,0.6)",
      textAlign: "center", padding: "1.5rem 1rem", fontSize: 13,
    }}>
      © 2026 BioFlame — Animal Waste to Renewable Energy Monitoring System
    </footer>
  );
}
