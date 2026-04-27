import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth }  from '../context/AuthContext';

const SlurryManagementTable = () => {
    const { isAdmin } = useAuth();

    const [tableData,    setTableData]    = useState([]);
    const [filterPeriod, setFilterPeriod] = useState('Weekly');
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState(null);

    const [newWeight, setNewWeight] = useState('');
    const [isAdding,  setIsAdding]  = useState(false);

    // --- Fetch Data ---
    const fetchSlurryData = async () => {
        setLoading(true);
        setError(null);

        const { data: fetchedData, error } = await supabase
            .from('slurrylog')
            .select('log_id, created_at, weight')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load table data.");
        } else {
            const formattedData = fetchedData.map(item => ({
                batchID:      item.log_id,
                inputDate:    new Date(item.created_at).toLocaleString(),
                weightVolume: item.weight,
            }));
            setTableData(formattedData);
        }
        setLoading(false);
    };

    useEffect(() => { fetchSlurryData(); }, [filterPeriod]);

    // --- 1. Update Existing Row (Admin only) ---
    const handleWeightChange = (e, batchID) => {
        if (!isAdmin) return;
        const newValue = e.target.value;
        setTableData(prev =>
            prev.map(item => item.batchID === batchID ? { ...item, weightVolume: newValue } : item)
        );
    };

    const updateWeightInDb = async (batchID, newWeight) => {
        if (!isAdmin || newWeight === '' || isNaN(newWeight)) return;

        const { error } = await supabase
            .from('slurrylog')
            .update({ weight: parseFloat(newWeight) })
            .eq('log_id', batchID);

        if (error) {
            console.error("Update failed:", error);
            alert("Failed to save update.");
        }
    };

    // --- 2. Add New Batch (Admin only) ---
    const handleAddBatch = async () => {
        if (!isAdmin) return;
        if (!newWeight) {
            alert("Please enter a Weight.");
            return;
        }

        setIsAdding(true);

        const { error: logError } = await supabase
            .from('slurrylog')
            .insert([{
                digester_id: 'D-01',
                created_at:  new Date().toISOString(),
                weight:      parseFloat(newWeight),
            }]);

        if (logError) {
            console.error("Error adding batch:", logError);
            alert("Failed to add new batch to logs.");
            setIsAdding(false);
        } else {
            setNewWeight('');
            setIsAdding(false);
            fetchSlurryData();
        }
    };

    // --- 3. Delete Batch (Admin only) ---
    const handleDeleteBatch = async (batchID) => {
        if (!isAdmin) return;
        if (!window.confirm("Are you sure you want to delete this batch?")) return;

        const { error } = await supabase
            .from('slurrylog')
            .delete()
            .eq('log_id', batchID);

        if (error) {
            console.error("Error deleting batch:", error);
            alert("Failed to delete batch.");
        } else {
            fetchSlurryData();
        }
    };

    return (
        <div style={{ backgroundColor: "#23320F", borderRadius: 8, padding: 30, maxWidth: '100%', margin: '20px 0' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 'bold', margin: '0 0 4px', color: 'white' }}>
                        Slurry Management Table
                    </h2>
                    <span style={{
                        display: 'inline-block',
                        background: isAdmin ? 'rgba(108,142,62,0.3)' : 'rgba(200,160,60,0.25)',
                        color:      isAdmin ? '#8fb050'              : '#d4a84b',
                        border:     `1px solid ${isAdmin ? '#6C8E3E' : '#c9a245'}`,
                        borderRadius: 12, padding: '2px 10px',
                        fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                    }}>
                        {isAdmin ? '🔑 Admin — Full Access' : '👁 View Only — Slurry input restricted to Admin'}
                    </span>
                </div>
                <select
                    value={filterPeriod}
                    onChange={e => setFilterPeriod(e.target.value)}
                    style={{
                        padding: '8px 15px', borderRadius: 6, backgroundColor: '#6C8E3E', color: 'white',
                        border: 'none', fontWeight: 'bold', cursor: 'pointer',
                    }}
                >
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                </select>
            </div>

            {isAdmin ? (
                <div style={{
                    backgroundColor: '#F0F0F0', padding: 15, borderRadius: 8,
                    marginBottom: 20, display: 'flex', gap: 15,
                    alignItems: 'flex-end', flexWrap: 'wrap',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <label style={{ fontSize: 12, fontWeight: 'bold', color: '#333' }}>Weight (kg):</label>
                        <input
                            type="number"
                            value={newWeight}
                            onChange={e => setNewWeight(e.target.value)}
                            placeholder="e.g. 50"
                            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                        />
                    </div>
                    <button
                        onClick={handleAddBatch}
                        disabled={isAdding}
                        style={{
                            padding: '8px 20px', backgroundColor: '#6C8E3E', color: 'white',
                            border: 'none', borderRadius: 4, cursor: 'pointer',
                            fontWeight: 'bold', height: 35,
                        }}
                    >
                        {isAdding ? 'Adding...' : '+ Add Batch'}
                    </button>
                </div>
            ) : (
                <div style={{
                    backgroundColor: 'rgba(229,193,106,0.12)',
                    border: '1px solid rgba(229,193,106,0.35)',
                    borderRadius: 8, padding: '12px 18px', marginBottom: 20,
                    display: 'flex', alignItems: 'center', gap: 10,
                }}>
                    <span style={{ fontSize: 18 }}>🔒</span>
                    <p style={{ color: '#d4a84b', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                        <strong>Slurry input is restricted to Admin accounts.</strong> You can view and filter
                        existing entries below. Contact your administrator to add or modify batches.
                    </p>
                </div>
            )}

            {loading && <div style={{ color: "#6C8E3E", textAlign: 'center', padding: 20, backgroundColor: 'white' }}>Loading table data...</div>}
            {error   && <div style={{ color: "red",     textAlign: 'center', padding: 20, backgroundColor: 'white' }}>{error}</div>}

            {!loading && !error && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14, minWidth: 400 }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #E0E0E0', color: 'white', fontWeight: 500 }}>
                                <th style={{ padding: '12px 0',    width: '10%' }}>ID</th>
                                <th style={{ padding: '12px 10px', width: '55%' }}>Input Date</th>
                                <th style={{ padding: '12px 10px', width: '25%' }}>Weight (kg)</th>
                                {isAdmin && <th style={{ padding: '12px 10px', width: '10%', textAlign: 'center' }}>Del</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? 4 : 3} style={{ padding: 20, textAlign: 'center', backgroundColor: 'white', color: '#666' }}>
                                        No records found.
                                    </td>
                                </tr>
                            ) : (
                                tableData.map(item => (
                                    <tr key={item.batchID} style={{ borderBottom: '1px solid #F0F0F0', backgroundColor: '#FFFFFF' }}>
                                        <td style={{ padding: '15px 0',    fontWeight: 'bold', color: '#333' }}>{item.batchID}</td>
                                        <td style={{ padding: '15px 10px', color: '#333' }}>{item.inputDate}</td>
                                        <td style={{ padding: '10px' }}>
                                            {isAdmin ? (
                                                <input
                                                    type="number"
                                                    value={item.weightVolume}
                                                    onChange={e => handleWeightChange(e, item.batchID)}
                                                    onBlur={e => updateWeightInDb(item.batchID, e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                                                    style={{ width: '100%', padding: 5, borderRadius: 4, border: '1px solid #ccc', textAlign: 'center' }}
                                                />
                                            ) : (
                                                <span style={{ color: '#333' }}>{item.weightVolume}</span>
                                            )}
                                        </td>
                                        {isAdmin && (
                                            <td style={{ padding: '15px 10px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleDeleteBatch(item.batchID)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}
                                                    title="Delete Batch"
                                                >🗑️</button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SlurryManagementTable;