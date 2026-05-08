import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; 

// Helper function to define the time range
const calculateTimeRange = (filterPeriod, selectedDate) => {
    const now = new Date();
    let startTime = new Date(now);
    let endTime = new Date(now);
    
    if (filterPeriod === 'Hourly' && selectedDate && selectedDate.includes('|')) {
        const parts = selectedDate.split('|');
        const datePart = parts[0];
        const hour = parseInt(parts[1], 10); 

        startTime = new Date(`${datePart}T00:00:00Z`);
        startTime.setUTCHours(hour);
        endTime = new Date(startTime);
        endTime.setUTCHours(hour + 1);

        return { startTime: startTime.toISOString(), endTime: endTime.toISOString() };
    }

    if (selectedDate && !selectedDate.includes('|')) {
        const dateParts = selectedDate.split('-'); 
        endTime = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 23, 59, 59, 999);
    } 

    startTime = new Date(endTime); 

    switch (filterPeriod) {
        case 'Daily': startTime.setDate(startTime.getDate() - 1); break;
        case 'Weekly': startTime.setDate(startTime.getDate() - 7); break;
        case 'Monthly': startTime.setMonth(startTime.getMonth() - 1); break;
        case 'Yearly': startTime.setFullYear(startTime.getFullYear() - 1); break;
    }
    
    return { startTime: startTime.toISOString(), endTime: endTime.toISOString() };
};

export default function AlertCountComponent({ filterPeriod, selectedDate }) {
  const [alertCount, setAlertCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const formattedValue = alertCount.toFixed(0); 

  // Function to fetch the count
  const getAlertCount = async () => {
      // Don't set loading to true here to avoid flickering on re-fetches
      const { startTime, endTime } = calculateTimeRange(filterPeriod, selectedDate);

      const { count, error } = await supabase
        .from('alertlog')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'New')
        .gte('timestamp', startTime)
        .lt('timestamp', endTime);

      if (error) {
        console.error("Supabase Error fetching Alert Count:", error);
        setError("Failed to load.");
      } else {
        setAlertCount(count || 0); 
        // Only turn off loading on the very first successful fetch
        setLoading(false); 
      }
  };

  useEffect(() => {
    // 1. Fetch immediately on mount/filter change
    getAlertCount();

    // 2. Set up an interval to check for new alerts every 2 seconds
    // This ensures that if the Slurry component creates an alert, this card updates automatically.
    const intervalId = setInterval(() => {
        getAlertCount();
    }, 2000);

    // Cleanup interval when component unmounts
    return () => clearInterval(intervalId);

  }, [filterPeriod, selectedDate]); 


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
        Active Alerts
      </h3>
      
      {loading && <div style={{ color: "#6C8E3E" }}>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      
      {!loading && !error && (
        <>
            <div
                style={{
                fontSize: "6em", 
                fontWeight: "bold",
                // Red if alerts exist, Green if 0
                color: alertCount > 0 ? "#A3362E" : "#6C8E3E", 
                lineHeight: "1.2",
                }}
            >
                {formattedValue}
            </div>

            <p style={{ color: "#aaa", marginTop: "10px" }}>
                Current Issues ({filterPeriod})
            </p>
        </>
      )}
    </div>
  );
}