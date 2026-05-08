import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; 

// Mapping confirmed sensor ID for Storage/Water Level (US-01)
const STORAGE_SENSOR_ID = 'US-01'; 

// Helper function to define the time range
const calculateTimeRange = (filterPeriod) => {
    const now = new Date();
    let startTime = new Date(now);

    switch (filterPeriod) {
        case 'Hourly':
            startTime.setHours(now.getHours( - 11));
        case 'Daily':
            startTime.setDate(now.getDate() - 1); // Last 24 hours
            break;
        case 'Weekly':
            startTime.setDate(now.getDate() - 7); // Last 7 days
            break;
        case 'Monthly':
            startTime.setMonth(now.getMonth() - 1); // Last 30 days
            break;
        case 'Yearly':
            startTime.setFullYear(now.getFullYear() - 1); // Last 365 days
            break;
        default:
            startTime.setDate(now.getDate() - 7); // Default to Weekly
    }
    return startTime.toISOString();
};

export default function DataOverviewComponent({ filterPeriod, selectedDate }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getStorageLevel() {
      setLoading(true);
      setError(null);
      
      const startTime = calculateTimeRange(filterPeriod);

      const { data, error } = await supabase
        .from('sensorreading') // Targeting the sensorreading table
        .select('value, unit, timestamp')
        .eq('sensor_id', STORAGE_SENSOR_ID) // Filtering for the US-01 sensor
        .gte('timestamp', startTime) // Filter records greater than or equal to startTime
        .order('timestamp', { ascending: false }) // Ensures newest data is fetched first
        .limit(5); // Check top 5 records for non-NULL value

      if (error) {
        console.error("Supabase Error fetching Storage data:", error);
        setError("Data failed to load.");
        setDisplayValue(0);
      } else {
        // Find the first record with a non-null value for robustness
        const firstValidRecord = data.find(item => item.value !== null);

        // Extract the value, defaulting to 0 if no valid record is found
        const rawValue = firstValidRecord ? firstValidRecord.value : 0;
        
        // Explicitly parse the raw value as a float
        const latestValue = parseFloat(rawValue); 
        
        // Handle NaN/Invalid parse by falling back to 0
        setDisplayValue(isNaN(latestValue) ? 0 : latestValue);
      }
      setLoading(false);
    }
    getStorageLevel();
  }, [filterPeriod, selectedDate]); 

  // Function to format the number
  const formattedValue = typeof displayValue === 'number' ? displayValue.toFixed(2) : displayValue;

  return (
    <div
      style={{
        backgroundColor: "#23320F",
        borderRadius: "12px",
        padding: "20px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "340px", 
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ marginBottom: "20px", textAlign: "center", color: "#ccc" }}>
        Storage
      </h3>
      
      {loading && <div style={{ color: "#6C8E3E" }}>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Container for the large number */}
      <div
        style={{
          fontSize: "6em", 
          fontWeight: "bold",
          color: "#6C8E3E", 
          lineHeight: "1.2",
        }}
      >
        {formattedValue}
      </div>

      {/* Optional: A label indicating what the number represents */}
      <p style={{ color: "#aaa", marginTop: "10px" }}>
        Latest Recorded Value ({filterPeriod})
      </p>
    </div>
  );
}