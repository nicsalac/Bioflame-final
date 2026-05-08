import C from "../theme/palette";

const swatches = [
  { name: "Green",  hex: C.green  },
  { name: "Brown",  hex: C.brown  },
  { name: "Gold",   hex: C.gold   },
  { name: "Red",    hex: C.red    },
  { name: "Cream",  hex: C.cream  },
];

export default function PalettePreview() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {swatches.map(s => (
        <div key={s.name} style={{ textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10,
            background: s.hex,
            border: `1px solid ${C.creamD}`,
            marginBottom: 4,
          }} />
          <div style={{ fontSize: 11, color: C.muted }}>{s.name}</div>
          <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace" }}>{s.hex}</div>
        </div>
      ))}
    </div>
  );
}
