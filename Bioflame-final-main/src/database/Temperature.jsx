import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; 

const TEMPERATURE_SENSOR_ID = 'T-01'; 

const calculateTimeRange = (filterPeriod) => {
    const now = new Date();
    let startTime = new Date(now);
    switch (filterPeriod) {
        case 'Hourly': startTime.setHours(now.getHours( - 11)); break;
        case 'Daily': startTime.setDate(now.getDate() - 1); break;
        case 'Weekly': startTime.setDate(now.getDate() - 7); break;
        case 'Monthly': startTime.setMonth(now.getMonth() - 1); break;
        case 'Yearly': startTime.setFullYear(now.getFullYear() - 1); break;
        default: startTime.setDate(now.getDate() - 7);
    }
    return startTime.toISOString();
};

export default function TemperatureComponent({ filterPeriod, selectedDate }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- UPDATED ALERT LOGIC TO MATCH TABLE SCHEMA ---
  const checkAndCreateAlert = async (value, readingId) => {
      let alertType = null;

      if (value > 40) {
          alertType = 'High_Temp';
      } else if (value < 25) {
          alertType = 'Low_Temp';
      }

      if (alertType) {
          // Check for existing 'New' alert of this type to prevent spam
          const { count } = await supabase
              .from('alertlog')
              .select('*', { count: 'exact', head: true })
              .eq('alert_type', alertType)
              .eq('status', 'New');

          if (count === 0) {
              await supabase.from('alertlog').insert({
                  timestamp: new Date().toISOString(),
                  alert_type: alertType,   // Matches your table column
                  sensor_id: TEMPERATURE_SENSOR_ID, // Matches your table column
                  reading_id: readingId,   // Links to the specific reading
                  status: 'New'
              });
          }
      }
  };

  useEffect(() => {
    async function getTemperature() {
      setLoading(true);
      setError(null);
      const startTime = calculateTimeRange(filterPeriod);

      // Fetch 'reading_id' as well
      const { data, error } = await supabase
        .from('sensorreading') 
        .select('value, reading_id')
        .eq('sensor_id', TEMPERATURE_SENSOR_ID) 
        .gte('timestamp', startTime) 
        .order('timestamp', { ascending: false }) 
        .limit(1); 

      if (error) {
        console.error("Error fetching Temperature:", error);
        setError("Data failed.");
      } else {
        const rawValue = data && data.length > 0 ? data[0].value : 0;
        const readingId = data && data.length > 0 ? data[0].reading_id : null;
        const latestValue = parseFloat(rawValue) || 0;
        
        setDisplayValue(latestValue);
        
        // Pass readingId to alert check
        if (readingId) checkAndCreateAlert(latestValue, readingId);
      }
      setLoading(false);
    }
    getTemperature();
  }, [filterPeriod, selectedDate]); 

  const formattedValue = displayValue.toFixed(2);
  const valueColor = (displayValue < 25 || displayValue > 40) ? "#A3362E" : "#6C8E3E";

  return (
    <div style={{ backgroundColor: "#23320F", borderRadius: "12px", padding: "20px", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "340px", boxSizing: "border-box" }}>
      <h3 style={{ marginBottom: "20px", textAlign: "center", color: "#ccc" }}>Temperature</h3>
      {loading && <div style={{ color: "#6C8E3E" }}>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && !error && (
        <>
            <div style={{ fontSize: "6em", fontWeight: "bold", color: valueColor, lineHeight: "1.2" }}>
                {formattedValue}
            </div>
            <p style={{ color: "#aaa", marginTop: "10px" }}> Latest Value (°C) </p>
        </>
      )}
    </div>
  );
}