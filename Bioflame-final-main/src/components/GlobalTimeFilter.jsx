import C from "../theme/palette";

const OPTIONS = ["Hourly", "Daily", "Weekly", "Monthly", "Yearly"];

export default function GlobalTimeFilter({ selected, onChange }) {
  return (
    <div style={{
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      width: "100%",
    }}>
      {OPTIONS.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            background: selected === opt ? C.green : "rgba(255,255,255,0.08)",
            color:      selected === opt ? "#fff"  : "#aaa",
            border: `1px solid ${selected === opt ? C.green : "rgba(255,255,255,0.15)"}`,
            padding: "6px 14px",
            borderRadius: 20,
            fontSize: 12,
            cursor: "pointer",
            fontWeight: selected === opt ? 700 : 400,
            transition: "all .15s",
            whiteSpace: "nowrap",
          }}
        >{opt}</button>
      ))}
    </div>
  );
}
