import C from "../theme/palette";

export default function Header({ title, subtitle, bg = C.greenD }) {
  return (
    <div style={{
      background: bg,
      color: "#fff",
      padding: "1.25rem 1rem",
      width: "100%",
      boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Georgia', serif",
          margin: 0,
          fontSize: "clamp(1.2rem, 4vw, 1.9rem)",
          lineHeight: 1.2,
        }}>{title}</h1>
        {subtitle && (
          <p style={{
            margin: "4px 0 0",
            opacity: 0.72,
            fontSize: "clamp(11px, 2.5vw, 13px)",
          }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
