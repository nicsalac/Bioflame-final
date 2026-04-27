import C from "../theme/palette";

export default function Menu({ items, selected, onSelect }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: "0.75rem",
      border: `1px solid ${C.creamD}`, position: "sticky", top: 72,
    }}>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          style={{
            display: "block", width: "100%", textAlign: "left",
            background: selected === item.id ? C.green : "transparent",
            color:      selected === item.id ? "#fff"  : C.muted,
            border: "none", padding: "10px 12px", borderRadius: 8,
            fontSize: 13, cursor: "pointer", marginBottom: 2,
            fontWeight: selected === item.id ? 700 : 400,
            transition: "all .15s",
          }}
        >{item.label}</button>
      ))}
    </div>
  );
}
