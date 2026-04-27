import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; 

export default function Retention({ filterPeriod, selectedDate }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getRetentionDaysLeft() {
      setLoading(true);
      setError(null);
      
      // 1. Fetch the Release Date of the latest active batch from slurrylog
      const { data, error } = await supabase
        .from('slurrylog') 
        .select('release_date')
        .eq('transact_type', 'IN')
        .not('release_date', 'is', null) 
        .order('timestamp', { ascending: false }) // Get the most recent one
        .limit(1);

      if (error) {
        console.error("Supabase Error fetching Retention data:", error);
        setError("Failed to load data.");
        setDisplayValue(0);
      } else {
        if (data && data.length > 0) {
            const releaseDate = data[0].release_date;
            
            // 2. Dynamic Calculation: Target Date - Today
            // This ensures it matches the logic in your Table component
            const today = new Date();
            const targetDate = new Date(releaseDate);
            
            // Reset hours to ensure clean day calculation
            targetDate.setHours(0, 0, 0, 0); 
            // We don't reset 'today' hours to keep it relative to current moment, 
            // or we can match Table.jsx exactly:
            // today.setHours(0,0,0,0); // Optional: Uncomment to ignore time of day

            const diffTime = targetDate.getTime() - today.getTime();
            const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            setDisplayValue(daysRemaining);
        } else {
            // Default if no active batch exists
            setDisplayValue(0);
        }
      }
      setLoading(false);
    }
    
    getRetentionDaysLeft();
    
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
        Retention (Days Left)
      </h3>
      
      {loading && <div style={{ color: "#6C8E3E" }}>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {!loading && !error && (
        <>
            <div
                style={{
                fontSize: "6em", 
                fontWeight: "bold",
                // Visual Alert: Red if overdue (negative), Green if safe
                color: displayValue < 0 ? "#A3362E" : "#6C8E3E", 
                lineHeight: "1.2",
                }}
            >
                {displayValue}
            </div>

            <p style={{ color: "#aaa", marginTop: "10px" }}>
                Days Remaining
            </p>
        </>
      )}
    </div>
  );
}