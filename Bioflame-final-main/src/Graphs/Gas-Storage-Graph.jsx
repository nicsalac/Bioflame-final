import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import storageData from "../database/Storage";
import C           from "../theme/palette";

export default function GasStorageGraph() {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", border: `1px solid ${C.creamD}` }}>
      <h3 style={{ color: C.greenD, fontFamily: "'Georgia', serif", margin: "0 0 1rem", fontSize: 15 }}>
        🏭 Gas Storage (m³ / month)
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={storageData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ead6" />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.muted }} />
          <YAxis tick={{ fontSize: 10, fill: C.muted }} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Bar dataKey="stored" fill={C.brown} radius={[4, 4, 0, 0]} name="Stored m³" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
