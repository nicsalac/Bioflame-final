import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const GasQualityComponent = ({ filterPeriod, selectedDate }) => {
  const [rawGas, setRawGas] = useState({ ch4: 0, co2: 0 });
  const [storedGas, setStoredGas] = useState({ ch4: 0, co2: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sensor IDs
  const RAW_CH4_ID = 'CH4-DIG';
  const RAW_CO2_ID = 'CO2-DIG';
  const STORED_CH4_ID = 'CH4-STO';
  const STORED_CO2_ID = 'CO2-STO';

  const fetchSensorValue = async (sensorId) => {
    try {
      const { data, error } = await supabase
        .from('sensorreading')
        .select('value')
        .eq('sensor_id', sensorId)
        .order('timestamp', { ascending: false })
        .limit(5);

      if (error) throw error;
      if (!data || data.length === 0) return 0;

      const firstValid = data.find((d) => d.value !== null);
      const val = firstValid ? parseFloat(firstValid.value) : 0;
      return isNaN(val) ? 0 : val;
    } catch (err) {
      console.error(`Error fetching ${sensorId}:`, err.message);
      return 0;
    }
  };

  useEffect(() => {
    const fetchGasData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [rawCh4, rawCo2, storedCh4, storedCo2] = await Promise.all([
          fetchSensorValue(RAW_CH4_ID),
          fetchSensorValue(RAW_CO2_ID),
          fetchSensorValue(STORED_CH4_ID),
          fetchSensorValue(STORED_CO2_ID),
        ]);

        setRawGas({ ch4: rawCh4, co2: rawCo2 });
        setStoredGas({ ch4: storedCh4, co2: storedCo2 });
      } catch (err) {
        console.error('Error fetching gas data:', err);
        setError('Failed to load gas data.');
      } finally {
        setLoading(false);
      }
    };

    fetchGasData();
  }, [filterPeriod, selectedDate]);

  // BAR WIDTH: 10,000 ppm = 100% width
  const getBarWidth = (value) => `${Math.min((value / 10000) * 100, 100)}%`;

  // DISPLAY TEXT: Convert Raw Value (ppm) to Percentage of 10k Limit
  const formatAsPercent = (value) => {
    const percent = (value / 10000) * 100;
    return `${percent.toFixed(2)}%`; // e.g. "4.00%"
  };

  if (loading)
    return (
      <div style={styles.container}>
        <p style={{ color: '#6C8E3E' }}>Loading Gas Data...</p>
      </div>
    );

  if (error)
    return (
      <div style={{ ...styles.container, color: 'red' }}>
        <p>{error}</p>
      </div>
    );

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>CO₂ and CH₄ ({filterPeriod})</h3>

      <div style={styles.row}>
        {/* Raw Gas Quality */}
        <GasBarSection 
          title="Raw Gas Quality (Digester)" 
          gas={rawGas} 
          getBarWidth={getBarWidth} 
          formatAsPercent={formatAsPercent}
        />

        {/* Divider */}
        <div style={styles.divider} />

        {/* Stored Gas Quality */}
        <GasBarSection 
          title="Gas Storage Quality" 
          gas={storedGas} 
          getBarWidth={getBarWidth} 
          formatAsPercent={formatAsPercent}
        />
      </div>
    </div>
  );
};

// Subcomponent for each gas section
const GasBarSection = ({ title, gas, getBarWidth, formatAsPercent }) => (
  <div style={{ flex: 1, textAlign: 'center', padding: '0 15px' }}>
    <div style={styles.sectionTitle}>{title}</div>

    {/* --- CH4 BAR --- */}
    <div style={styles.singleBarContainer}>
        {/* Label Centered in the Range */}
        <div style={styles.barLabel}>CH₄</div>
        {/* The Filled Bar */}
        <div style={{ ...styles.barFill, width: getBarWidth(gas.ch4), backgroundColor: '#DDB7A0' }} />
    </div>
    {/* Value below bar */}
    <div style={styles.valueText}>{formatAsPercent(gas.ch4)}</div>

    {/* Spacer */}
    <div style={{ height: '15px' }}></div>

    {/* --- CO2 BAR --- */}
    <div style={styles.singleBarContainer}>
        <div style={styles.barLabel}>CO₂</div>
        <div style={{ ...styles.barFill, width: getBarWidth(gas.co2), backgroundColor: '#A3362E' }} />
    </div>
    <div style={{ ...styles.valueText, color: '#FF0000' }}>{formatAsPercent(gas.co2)}</div>

    {/* Explanatory Note */}
    <p style={styles.limitNote}>(10,000 ppm = 100%)</p>
  </div>
);

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px 0',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '340px', // Ensure consistent height
    boxSizing: 'border-box',
  },
  title: { fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#333' },
  row: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '100%',
    flexGrow: 1,
  },
  divider: {
    width: '1px',
    height: '200px',
    backgroundColor: '#F8F4E3',
    margin: '0 10px',
  },
  sectionTitle: { fontSize: '14px', fontWeight: '500', marginBottom: '15px', color: '#555' },
  
  // Track Container (The Gray Bar)
  singleBarContainer: {
    position: 'relative', 
    width: '100%',
    height: '30px',
    backgroundColor: '#f0f0f0', 
    borderRadius: '4px',
    overflow: 'hidden',
  },
  
  // The Colored Fill
  barFill: {
    height: '100%',
    transition: 'width 0.5s ease-in-out',
    zIndex: 1, 
  },
  
  // The Centered Label
  barLabel: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#333', 
    zIndex: 2, // Ensures text is on top of the fill
    top: 0,
    left: 0,
  },
  
  valueText: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '5px',
    color: '#333',
  },
  
  limitNote: {
    fontSize: '11px',
    color: '#888',
    marginTop: '10px',
    fontStyle: 'italic',
  }
};

export default GasQualityComponent;