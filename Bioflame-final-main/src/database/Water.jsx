import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; 

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

export default function WaterLevelComponent({ filterPeriod, selectedDate }) {
  const [totalWeight, setTotalWeight] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(170); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- ALERT GENERATION LOGIC ---
  // This connects the Slurry Level status to your Alert Dashboard
  const createSlurryAlert = async (percentage) => {
      let alertType = null;

      // 1. Critical: Over 100% capacity
      if (percentage > 100) {
          alertType = 'Digester_Overfill';
      } 
      // 2. Warning: Near Capacity (90% - 100%)
      else if (percentage >= 90) {
          alertType = 'Digester_Near_Cap';
      }

      if (alertType) {
          // Prevent duplicates: Check if an alert of this type is already 'New'
          const { count } = await supabase
              .from('alertlog')
              .select('*', { count: 'exact', head: true })
              .eq('alert_type', alertType)
              .eq('status', 'New');

          if (count === 0) {
              await supabase.from('alertlog').insert({
                  timestamp: new Date().toISOString(),
                  alert_type: alertType,
                  sensor_id: 'D-01', // ID for the Digester Tank
                  status: 'New'
              });
          }
      }
  };

  const fetchMaxCapacity = async () => {
      const { data, error } = await supabase
          .from('digester')
          .select('max_capacity')
          .eq('digester_id', 'D-01')
          .single();

      if (error || !data || data.max_capacity === null) {
          console.error("Error fetching max capacity:", error);
          setMaxCapacity(1000); 
          return 1000;
      } else {
          const capacity = Math.max(1, parseFloat(data.max_capacity));
          setMaxCapacity(capacity); 
          return capacity;
      }
  }

  useEffect(() => {
    async function getHistoricalSlurryBalance() {
      setLoading(true);
      setError(null);
      
      try {
        const currentMaxCapacity = await fetchMaxCapacity(); 
        const { endTime } = calculateTimeRange(filterPeriod, selectedDate);
        
        // Fetch Inputs (slurrylog)
        const { data: inputData } = await supabase
          .from('slurrylog')
          .select('weight') 
          .eq('transact_type', 'IN')
          .lt('timestamp', endTime); 

        // Fetch Outputs (slurrylog)
        const { data: outputData } = await supabase
          .from('slurrylog')
          .select('weight') 
          .eq('transact_type', 'OUT') 
          .lt('timestamp', endTime); 

        // Calculate Balance
        const inputSum = (inputData || []).reduce((acc, item) => acc + (parseFloat(item.weight) || 0), 0);
        const outputSum = (outputData || []).reduce((acc, item) => acc + (parseFloat(item.weight) || 0), 0);
        
        const balance = Math.max(0, inputSum - outputSum); 
        setTotalWeight(balance);

        // --- CHECK FOR ALERTS ---
        const rawPercentage = (balance / currentMaxCapacity) * 100;
        createSlurryAlert(rawPercentage);

      } catch (e) {
        console.error("Fetch exception:", e);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    getHistoricalSlurryBalance();
    
  }, [filterPeriod, selectedDate]); 

  const percentageFull = Math.min(100, Math.max(0, (totalWeight / maxCapacity) * 100));
  const formattedValue = percentageFull.toFixed(1); 
  
  // Visual Color Change for the Card itself
  const statusColor = (percentageFull < 10 || percentageFull >= 90) ? "#A3362E" : "#6C8E3E";

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
        Digester Slurry Level
      </h3>
      
      {loading && <div style={{ color: "#6C8E3E" }}>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      
      {!loading && !error && (
        <>
          <div
              style={{
              fontSize: "6em", 
              fontWeight: "bold",
              color: statusColor, 
              lineHeight: "1.2",
              }}
          >
              {formattedValue}
          </div>

          <p style={{ color: "#aaa", marginTop: "10px", textAlign: "center" }}>
              % Full ({totalWeight.toFixed(0)} kg / {maxCapacity.toFixed(0)} kg)
          </p>
        </>
      )}
    </div>
  );
}