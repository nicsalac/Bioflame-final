import C from "../theme/palette";

export default function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: "1.25rem",
      border: `1px solid ${C.creamD}`,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      ...style,
    }}>
      {children}
    </div>
  );
}
