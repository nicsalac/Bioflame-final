import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const RAW_CH4_ID    = 'CH4-DIG';
const STORED_CH4_ID = 'CH4-STO';

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

export default function CH4Component({ filterPeriod, selectedDate }) {
  const [rawCH4,    setRawCH4]    = useState(0);
  const [storedCH4, setStoredCH4] = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      setError(null);
      try {
        const [raw, stored] = await Promise.all([
          fetchLatest(RAW_CH4_ID),
          fetchLatest(STORED_CH4_ID),
        ]);
        setRawCH4(raw);
        setStoredCH4(stored);
      } catch (e) {
        setError("Failed to load CH₄ data.");
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [filterPeriod, selectedDate]);

  const toPercent = (v) => ((v / 10000) * 100).toFixed(2);
  // CH4 is GOOD when HIGH — alert if low (<30%)
  const isLow     = (v) => v < 3000;

  return (
    <div style={{
      backgroundColor: "#23320F", borderRadius: "12px", padding: "20px",
      color: "white", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "340px", boxSizing: "border-box",
    }}>
      <h3 style={{ marginBottom: "16px", textAlign: "center", color: "#ccc", fontSize: "16px" }}>
        CH₄ Level
      </h3>

      {loading && <div style={{ color: "#6C8E3E" }}>Loading...</div>}
      {error   && <div style={{ color: "red" }}>{error}</div>}

      {!loading && !error && (
        <div style={{ width: "100%" }}>

          {/* ── Digester CH₄ ── */}
          <div style={{ marginBottom: "18px" }}>
            <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "6px", textAlign: "center" }}>
              Digester (Raw Gas)
            </div>
            <div style={{
              fontSize: "2.8em", fontWeight: "bold", textAlign: "center", lineHeight: 1.1,
              color: isLow(rawCH4) ? "#A3362E" : "#6C8E3E",
            }}>
              {toPercent(rawCH4)}%
            </div>
            <div style={{ fontSize: "11px", color: "#777", textAlign: "center", marginTop: "2px" }}>
              {rawCH4.toFixed(0)} ppm
            </div>
            <div style={{
              position: "relative", width: "100%", height: "22px",
              backgroundColor: "#1a2a0f", borderRadius: "4px", overflow: "hidden", marginTop: "8px",
            }}>
              <div style={{
                height: "100%", borderRadius: "4px", transition: "width 0.5s ease",
                width: `${Math.min((rawCH4 / 10000) * 100, 100)}%`,
                backgroundColor: isLow(rawCH4) ? "#A3362E" : "#DDB7A0",
              }} />
              <div style={{
                position: "absolute", inset: 0, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: "bold", color: "#333",
              }}>CH₄ Digester</div>
            </div>
          </div>

          {/* ── Storage CH₄ ── */}
          <div>
            <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "6px", textAlign: "center" }}>
              Storage Tank
            </div>
            <div style={{
              fontSize: "2.8em", fontWeight: "bold", textAlign: "center", lineHeight: 1.1,
              color: isLow(storedCH4) ? "#A3362E" : "#6C8E3E",
            }}>
              {toPercent(storedCH4)}%
            </div>
            <div style={{ fontSize: "11px", color: "#777", textAlign: "center", marginTop: "2px" }}>
              {storedCH4.toFixed(0)} ppm
            </div>
            <div style={{
              position: "relative", width: "100%", height: "22px",
              backgroundColor: "#1a2a0f", borderRadius: "4px", overflow: "hidden", marginTop: "8px",
            }}>
              <div style={{
                height: "100%", borderRadius: "4px", transition: "width 0.5s ease",
                width: `${Math.min((storedCH4 / 10000) * 100, 100)}%`,
                backgroundColor: isLow(storedCH4) ? "#A3362E" : "#E5C16A",
              }} />
              <div style={{
                position: "absolute", inset: 0, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: "bold", color: "#333",
              }}>CH₄ Storage</div>
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
