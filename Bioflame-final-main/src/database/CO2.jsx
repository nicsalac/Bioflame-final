import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

// Sensor IDs from gasses.jsx
const RAW_CO2_ID    = 'CO2-DIG';
const STORED_CO2_ID = 'CO2-STO';

const fetchLatest = async (sensorId) => {
  const { data, error } = await supabase
    .from('sensorreading')
    .select('value')
    .eq('sensor_id', sensorId)
    .order('timestamp', { ascending: false })
    .limit(5);

  if (error || !data || data.length === 0) return 0;
  const first = data.find(d => d.value !== null);
  const val   = first ? parseFloat(first.value) : 0;
  return isNaN(val) ? 0 : val;
};

export default function CO2Component({ filterPeriod, selectedDate }) {
  const [rawCO2,    setRawCO2]    = useState(0);
  const [storedCO2, setStoredCO2] = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      setError(null);
      try {
        const [raw, stored] = await Promise.all([
          fetchLatest(RAW_CO2_ID),
          fetchLatest(STORED_CO2_ID),
        ]);
        setRawCO2(raw);
        setStoredCO2(stored);
      } catch (e) {
        setError("Failed to load CO₂ data.");
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [filterPeriod, selectedDate]);

  // 10,000 ppm = 100%
  const toPercent  = (v) => ((v / 10000) * 100).toFixed(2);
  const isHigh     = (v) => v > 5000; // alert threshold: >50% of limit

  return (
    <div style={{
      backgroundColor: "#23320F", borderRadius: "12px", padding: "20px",
      color: "white", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "340px", boxSizing: "border-box",
    }}>
      <h3 style={{ marginBottom: "16px", textAlign: "center", color: "#ccc", fontSize: "16px" }}>
        CO₂ Level
      </h3>

      {loading && <div style={{ color: "#6C8E3E" }}>Loading...</div>}
      {error   && <div style={{ color: "red" }}>{error}</div>}

      {!loading && !error && (
        <div style={{ width: "100%" }}>

          {/* ── Digester CO₂ ── */}
          <div style={{ marginBottom: "18px" }}>
            <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "6px", textAlign: "center" }}>
              Digester (Raw Gas)
            </div>
            <div style={{
              fontSize: "2.8em", fontWeight: "bold", textAlign: "center", lineHeight: 1.1,
              color: isHigh(rawCO2) ? "#A3362E" : "#6C8E3E",
            }}>
              {toPercent(rawCO2)}%
            </div>
            <div style={{ fontSize: "11px", color: "#777", textAlign: "center", marginTop: "2px" }}>
              {rawCO2.toFixed(0)} ppm
            </div>
            {/* Bar */}
            <div style={{
              position: "relative", width: "100%", height: "22px",
              backgroundColor: "#1a2a0f", borderRadius: "4px", overflow: "hidden", marginTop: "8px",
            }}>
              <div style={{
                height: "100%", borderRadius: "4px", transition: "width 0.5s ease",
                width: `${Math.min((rawCO2 / 10000) * 100, 100)}%`,
                backgroundColor: isHigh(rawCO2) ? "#A3362E" : "#6C8E3E",
              }} />
              <div style={{
                position: "absolute", inset: 0, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: "bold", color: "#fff",
              }}>CO₂ Digester</div>
            </div>
          </div>

          {/* ── Storage CO₂ ── */}
          <div>
            <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "6px", textAlign: "center" }}>
              Storage Tank
            </div>
            <div style={{
              fontSize: "2.8em", fontWeight: "bold", textAlign: "center", lineHeight: 1.1,
              color: isHigh(storedCO2) ? "#A3362E" : "#6C8E3E",
            }}>
              {toPercent(storedCO2)}%
            </div>
            <div style={{ fontSize: "11px", color: "#777", textAlign: "center", marginTop: "2px" }}>
              {storedCO2.toFixed(0)} ppm
            </div>
            {/* Bar */}
            <div style={{
              position: "relative", width: "100%", height: "22px",
              backgroundColor: "#1a2a0f", borderRadius: "4px", overflow: "hidden", marginTop: "8px",
            }}>
              <div style={{
                height: "100%", borderRadius: "4px", transition: "width 0.5s ease",
                width: `${Math.min((storedCO2 / 10000) * 100, 100)}%`,
                backgroundColor: isHigh(storedCO2) ? "#A3362E" : "#8B5A2B",
              }} />
              <div style={{
                position: "absolute", inset: 0, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: "bold", color: "#fff",
              }}>CO₂ Storage</div>
            </div>
          </div>

          <p style={{ color: "#666", fontSize: "10px", textAlign: "center", marginTop: "10px", fontStyle: "italic" }}>
            Limit: 10,000 ppm = 100%
          </p>
        </div>
      )}
    </div>
  );
}
