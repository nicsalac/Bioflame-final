import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";

// CO2 removed — only tracking CH4 in stored gas
const STORED_CH4_ID = "CH4-STO";

const calculateTimeRange = (filterPeriod) => {
  const now = new Date();
  let startTime = new Date(now);
  switch (filterPeriod) {
    case 'Hourly':  startTime.setHours(now.getHours() - 11); break;
    case 'Daily':   startTime.setDate(now.getDate() - 1);    break;
    case 'Weekly':  startTime.setDate(now.getDate() - 7);    break;
    case 'Monthly': startTime.setMonth(now.getMonth() - 1);  break;
    case 'Yearly':  startTime.setFullYear(now.getFullYear() - 1); break;
    default:        startTime.setDate(now.getDate() - 7);
  }
  return startTime.toISOString();
};

const formatTimeLabel = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
};

export default function StoredGasGraph({ filterPeriod, selectedDate }) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    async function fetchGraphData() {
      setLoading(true);
      setError(null);

      const startTime = calculateTimeRange(filterPeriod);

      const { data: ch4Data, error: ch4Error } = await supabase
        .from("sensorreading")
        .select("value, timestamp")
        .eq("sensor_id", STORED_CH4_ID)
        .gte("timestamp", startTime)
        .order("timestamp", { ascending: true })
        .limit(100);

      if (ch4Error) {
        console.error("Supabase Error fetching Stored Gas data:", ch4Error);
        setError("Failed to load stored gas graph data.");
        setLoading(false);
        return;
      }

      const formattedData = (ch4Data || [])
        .filter(item => item.value !== null)
        .map(item => ({
          name: formatTimeLabel(item.timestamp),
          ch4:  parseFloat(item.value) || 0,
        }));

      // Duplicate single point for line visibility
      if (formattedData.length === 1) {
        formattedData.push({ ...formattedData[0], name: formattedData[0].name + " " });
      }

      setData(formattedData);
      setLoading(false);
    }
    fetchGraphData();
  }, [filterPeriod, selectedDate]);

  const graphData = data.length > 0 ? data : [{ name: "No Data", ch4: 0 }];

  return (
    <div style={{ backgroundColor: "#23320F", borderRadius: "12px", padding: "20px", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ margin: 0, textAlign: "left", color: "white" }}>
          Stored Gas — Methane (CH₄) Overview&nbsp;
          <span style={{ fontSize: 13, fontWeight: 400, color: "#8fb050" }}>({filterPeriod})</span>
        </h3>
      </div>

      {loading && <div style={{ color: "#6C8E3E", textAlign: "center" }}>Loading graph...</div>}
      {error   && <div style={{ color: "red",     textAlign: "center" }}>{error}</div>}

      {!loading && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData} margin={{ top: 20, right: 40, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="name" stroke="#ccc" interval={0} angle={-30} textAnchor="end" height={60} tickLine={false} />
            <YAxis
              stroke="#ccc"
              domain={[dataMin => Math.floor(dataMin - 5), dataMax => Math.ceil(dataMax + 5)]}
              label={{ value: "Percentage (%)", angle: -90, position: "insideLeft", fill: "#ccc" }}
              tickLine={false}
            />
            <Tooltip />
            <Legend />
            <Brush dataKey="name" height={25} stroke="#6C8E3E" fill="#2E3F24" y={250} />
            <Line
              type="linear" dataKey="ch4" stroke="#4a9eff" strokeWidth={3}
              dot={{ r: 4 }} activeDot={{ r: 6 }}
              name="Stored Methane (CH₄)" isAnimationActive={false} connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
