import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; 

// REMOVED: calculateTimeRange helper function

export default function DataOverviewComponent({ filterPeriod, selectedDate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      // REMOVED: const { startTime, endTime } = calculateTimeRange(filterPeriod, selectedDate);
      
      // Querying the 'slurrylog' table for the absolute latest 'IN' transaction.
      const { data: fetchedData, error } = await supabase
        .from('slurrylog') // Using 'slurrylog' table name
        .select('weight, timestamp, transact_type') // Using 'weight' column
        .eq('transact_type', 'IN') 
        // REMOVED TIME FILTERS: .gte('timestamp', startTime).lt('timestamp', endTime)
        .order('timestamp', { ascending: false })
        .limit(1); 

      if (error) {
        console.error("Error fetching slurry data:", error); 
        setError("Failed to load data.");
      } else {
        setData(fetchedData); 
      }
      setLoading(false);
    }

    fetchData();
    
    // NOTE: This effect re-runs if filterPeriod changes, updating the display text.
  }, [filterPeriod, selectedDate]);


  // Access the corrected column: 'weight'
  const displayValue =
    data && data.length > 0 && data[0].weight !== undefined
      ? data[0].weight
      : 0; 

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
        Last Slurry Input
      </h3>
      
      {loading && <div style={{ color: "#6C8E3E" }}>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      
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

      <p style={{ color: "#aaa", marginTop: "10px" }}>
        Latest Recorded Value ({filterPeriod})
      </p>
    </div>
  );
}