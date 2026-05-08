import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush,
} from "recharts";

const DIGESTER_STATUS_ID = 'US-01';

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
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

export default function DigesterGraph({ filterPeriod, selectedDate }) {
  const [graphData, setGraphData] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    async function fetchGraphData() {
      setLoading(true);
      setError(null);
      const startTime = calculateTimeRange(filterPeriod);

      const { data: fetchedData, error } = await supabase
        .from('sensorreading')
        .select('value, timestamp')
        .eq('sensor_id', DIGESTER_STATUS_ID)
        .gte('timestamp', startTime)
        .order('timestamp', { ascending: true })
        .limit(100);

      if (error) {
        console.error("Supabase Error fetching Digester Graph data:", error);
        setError("Failed to load graph data.");
      } else {
        setGraphData(
          fetchedData
            .filter(item => item.value !== null)
            .map(item => ({ name: formatTimeLabel(item.timestamp), value: parseFloat(item.value) || 0 }))
        );
      }
      setLoading(false);
    }
    fetchGraphData();
  }, [filterPeriod, selectedDate]);

  const chartData = graphData.length > 0 ? graphData : [{ name: "No Data", value: 0 }];

  return (
    <div style={{ backgroundColor: "#23320F", borderRadius: "12px", padding: "20px", color: "white" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: 'white' }}>
          Digester Status Overview&nbsp;
          <span style={{ fontSize: 13, fontWeight: 400, color: "#8fb050" }}>({filterPeriod})</span>
        </h3>
      </div>

      {loading && <div style={{ color: "#6C8E3E", textAlign: 'center' }}>Loading graph...</div>}
      {error   && <div style={{ color: "red",     textAlign: 'center' }}>{error}</div>}

      {!loading && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="name" stroke="#ccc" interval="preserveStartEnd" angle={-30} textAnchor="end" height={50} />
            <YAxis stroke="#ccc" domain={[0, 100]} label={{ value: 'Status Level (%)', angle: -90, position: 'insideLeft', fill: '#ccc' }} />
            <Tooltip />
            <Legend />
            <Brush dataKey="name" height={30} stroke="#6C8E3E" fill="#2E3F24" />
            <Line type="monotone" dataKey="value" stroke="#6C8E3E" strokeWidth={2} activeDot={{ r: 8 }} name="Digester Level (%)" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
