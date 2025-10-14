import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    Filler
);

// --- CONFIGURATION & UTILITIES ---
const CRITICAL_THRESHOLD = 90;
const HIGH_THRESHOLD = 70;
const MEDIUM_THRESHOLD = 30;

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

const getCriticality = (wear) => {
    if (wear >= CRITICAL_THRESHOLD) return 'Critical';
    if (wear >= HIGH_THRESHOLD) return 'High';
    if (wear >= MEDIUM_THRESHOLD) return 'Medium';
    return 'Low';
};

// Generate historical data for charts
const generateHistoricalData = (days = 30) => {
    const data = [];
    const today = new Date();
    for (let i = days; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toISOString().split('T')[0],
            efficiency: getRandomFloat(70, 95),
            temperature: getRandomFloat(65, 85),
            vibration: getRandomFloat(2, 8),
            pressure: getRandomFloat(45, 65)
        });
    }
    return data;
};

// --- ENHANCED INITIAL DATA ---
const initialEquipmentData = [
    {
        id: 'CRSHR-001',
        name: 'Primary Jaw Crusher',
        status: 'Operational',
        wearLevel: 78,
        prediction: 'High risk of jaw plate failure in 45 days.',
        lastMaintenance: '2025-09-01',
        nextMaintenance: '2025-11-15',
        criticality: getCriticality(78),
        energyEfficiency: 82,
        temperature: 75.5,
        vibration: 4.2,
        pressure: 52.1,
        operatingHours: 8420,
        maintenanceCost: 15000,
        downtime: 12,
        location: 'Zone A',
        manufacturer: 'Metso',
        model: 'C130',
        historicalData: generateHistoricalData()
    },
    {
        id: 'SAG-MILL-003',
        name: 'SAG Mill 3',
        status: 'Operational',
        wearLevel: 32,
        prediction: 'Liner bolts integrity nominal. Inspection advised in 90 days.',
        lastMaintenance: '2025-05-15',
        nextMaintenance: '2025-12-20',
        criticality: getCriticality(32),
        energyEfficiency: 91,
        temperature: 68.2,
        vibration: 2.8,
        pressure: 48.9,
        operatingHours: 12340,
        maintenanceCost: 25000,
        downtime: 8,
        location: 'Zone B',
        manufacturer: 'FLSmidth',
        model: 'SAG-42',
        historicalData: generateHistoricalData()
    },
    {
        id: 'CRSHR-002',
        name: 'Secondary Cone Crusher',
        status: 'Operational',
        wearLevel: 94,
        prediction: 'Severe bearing fatigue detected. **IMMEDIATE SHUTDOWN ADVISED.**',
        lastMaintenance: '2025-08-20',
        nextMaintenance: '2025-10-16',
        criticality: getCriticality(94),
        energyEfficiency: 75,
        temperature: 89.4,
        vibration: 7.2,
        pressure: 61.5,
        operatingHours: 9850,
        maintenanceCost: 18000,
        downtime: 24,
        location: 'Zone A',
        manufacturer: 'Sandvik',
        model: 'CH440',
        historicalData: generateHistoricalData()
    },
    {
        id: 'BALL-MILL-001',
        name: 'Ball Mill 1',
        status: 'Operational',
        wearLevel: 15,
        prediction: 'Optimal performance. Next check in 6 months.',
        lastMaintenance: '2025-10-10',
        nextMaintenance: '2026-01-15',
        criticality: getCriticality(15),
        energyEfficiency: 95,
        temperature: 62.1,
        vibration: 1.9,
        pressure: 46.2,
        operatingHours: 3420,
        maintenanceCost: 12000,
        downtime: 4,
        location: 'Zone C',
        manufacturer: 'Outotec',
        model: 'TrunnionGrate',
        historicalData: generateHistoricalData()
    },
    {
        id: 'CONV-004',
        name: 'Main Conveyor Belt',
        status: 'Maintenance Required',
        wearLevel: 67,
        prediction: 'Belt tension irregularities detected. Service required within 30 days.',
        lastMaintenance: '2025-07-12',
        nextMaintenance: '2025-11-05',
        criticality: getCriticality(67),
        energyEfficiency: 88,
        temperature: 55.3,
        vibration: 3.1,
        pressure: 35.8,
        operatingHours: 15600,
        maintenanceCost: 8000,
        downtime: 6,
        location: 'Zone D',
        manufacturer: 'Continental',
        model: 'ST2500',
        historicalData: generateHistoricalData()
    },
    {
        id: 'PUMP-007',
        name: 'Slurry Pump System',
        status: 'Operational',
        wearLevel: 43,
        prediction: 'Impeller wear within normal parameters. Monitor closely.',
        lastMaintenance: '2025-08-30',
        nextMaintenance: '2025-12-01',
        criticality: getCriticality(43),
        energyEfficiency: 87,
        temperature: 71.8,
        vibration: 3.7,
        pressure: 58.2,
        operatingHours: 7890,
        maintenanceCost: 9500,
        downtime: 3,
        location: 'Zone B',
        manufacturer: 'Warman',
        model: 'AH-Series',
        historicalData: generateHistoricalData()
    }
];

// --- MAIN COMPONENT ---
const EnhancedPredictiveMaintenance = () => {
    const [equipmentData, setEquipmentData] = useState(initialEquipmentData);
    const [filter, setFilter] = useState('All');
    const [locationFilter, setLocationFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [dashboardView, setDashboardView] = useState('overview');
    const [notifications, setNotifications] = useState([]);
    const [realTimeData, setRealTimeData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef(null);

    // Real-time simulation with enhanced features
    useEffect(() => {
        const intervalId = setInterval(() => {
            setEquipmentData(prevData =>
                prevData.map(asset => {
                    const newWear = Math.min(100, asset.wearLevel + (asset.criticality === 'Critical' ? getRandomInt(0, 2) : getRandomFloat(0, 0.5)));
                    const newEfficiency = Math.max(70, Math.min(99, asset.energyEfficiency + getRandomFloat(-2, 1)));
                    const newTemperature = Math.max(50, Math.min(100, asset.temperature + getRandomFloat(-1, 1)));
                    const newVibration = Math.max(1, Math.min(10, asset.vibration + getRandomFloat(-0.3, 0.3)));
                    const newPressure = Math.max(30, Math.min(70, asset.pressure + getRandomFloat(-1, 1)));
                    
                    const newCriticality = getCriticality(newWear);
                    let newStatus = asset.status;
                    
                    // Enhanced status logic
                    if (newWear >= 95 && newStatus === 'Operational') {
                        newStatus = 'CRITICAL ALERT - Immediate Action Required';
                        addNotification(`CRITICAL: ${asset.name} requires immediate attention!`, 'critical');
                    } else if (newWear >= 85 && newStatus === 'Operational') {
                        newStatus = 'HIGH ALERT - Schedule Maintenance';
                        addNotification(`HIGH: ${asset.name} maintenance window approaching`, 'high');
                    }

                    return {
                        ...asset,
                        wearLevel: newWear,
                        criticality: newCriticality,
                        energyEfficiency: newEfficiency,
                        temperature: newTemperature,
                        vibration: newVibration,
                        pressure: newPressure,
                        status: newStatus,
                        lastUpdated: new Date().getTime(),
                    };
                })
            );
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    // Notification system
    const addNotification = useCallback((message, type) => {
        const newNotification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toLocaleTimeString()
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        
        // Play sound for critical alerts
        if (type === 'critical' && audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
    }, []);

    // Enhanced action handlers
    const handleScheduleMaintenance = useCallback((assetId) => {
        setIsLoading(true);
        
        setTimeout(() => {
            setEquipmentData(prevData =>
                prevData.map(asset => 
                    asset.id === assetId
                        ? { 
                            ...asset, 
                            status: 'Maintenance Scheduled', 
                            wearLevel: Math.max(20, asset.wearLevel - 10),
                            prediction: `Maintenance scheduled for ${new Date(Date.now() + 24*60*60*1000).toLocaleDateString()}. Team dispatched.`,
                          }
                        : asset
                )
            );
            addNotification(`Maintenance scheduled for ${assetId}`, 'info');
            setIsLoading(false);
        }, 1500);
    }, [addNotification]);

    const handleEmergencyShutdown = useCallback((assetId) => {
        setEquipmentData(prevData =>
            prevData.map(asset =>
                asset.id === assetId
                    ? { ...asset, status: 'EMERGENCY SHUTDOWN - Offline', wearLevel: asset.wearLevel }
                    : asset
            )
        );
        addNotification(`EMERGENCY: ${assetId} has been shut down`, 'critical');
    }, [addNotification]);

    const handleAcknowledgeAlert = useCallback((assetId) => {
        setEquipmentData(prevData =>
            prevData.map(asset =>
                asset.id === assetId
                    ? { ...asset, status: asset.status.replace('ALERT', 'ACKNOWLEDGED') }
                    : asset
            )
        );
        addNotification(`Alert acknowledged for ${assetId}`, 'info');
    }, [addNotification]);

    const handleStartDiagnostic = useCallback((assetId) => {
        setIsLoading(true);
        setTimeout(() => {
            addNotification(`Diagnostic completed for ${assetId}`, 'success');
            setIsLoading(false);
        }, 3000);
    }, [addNotification]);

    // Enhanced filtering
    const filteredData = useMemo(() => {
        return equipmentData
            .filter(item => {
                if (filter !== 'All' && item.criticality !== filter) return false;
                if (locationFilter !== 'All' && item.location !== locationFilter) return false;
                return item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.id.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .sort((a, b) => {
                const order = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                return order[b.criticality] - order[a.criticality];
            });
    }, [equipmentData, filter, locationFilter, searchTerm]);

    // Statistics calculations
    const stats = useMemo(() => {
        const criticalCount = equipmentData.filter(d => d.criticality === 'Critical').length;
        const highCount = equipmentData.filter(d => d.criticality === 'High').length;
        const scheduledCount = equipmentData.filter(d => d.status.includes('Scheduled')).length;
        const avgEfficiency = (equipmentData.reduce((sum, d) => sum + d.energyEfficiency, 0) / equipmentData.length);
        const totalDowntime = equipmentData.reduce((sum, d) => sum + d.downtime, 0);
        const avgTemperature = (equipmentData.reduce((sum, d) => sum + d.temperature, 0) / equipmentData.length);
        
        return {
            criticalCount,
            highCount,
            scheduledCount,
            avgEfficiency: avgEfficiency.toFixed(1),
            totalDowntime,
            avgTemperature: avgTemperature.toFixed(1),
            operationalCount: equipmentData.filter(d => d.status === 'Operational').length,
            totalAssets: equipmentData.length
        };
    }, [equipmentData]);

    // Chart data preparations
    const efficiencyChartData = {
        labels: equipmentData.map(asset => asset.name),
        datasets: [{
            label: 'Efficiency %',
            data: equipmentData.map(asset => asset.energyEfficiency),
            backgroundColor: equipmentData.map(asset => {
                if (asset.criticality === 'Critical') return 'rgba(244, 67, 54, 0.8)';
                if (asset.criticality === 'High') return 'rgba(255, 152, 0, 0.8)';
                if (asset.criticality === 'Medium') return 'rgba(255, 235, 59, 0.8)';
                return 'rgba(76, 175, 80, 0.8)';
            }),
            borderColor: equipmentData.map(asset => {
                if (asset.criticality === 'Critical') return 'rgba(244, 67, 54, 1)';
                if (asset.criticality === 'High') return 'rgba(255, 152, 0, 1)';
                if (asset.criticality === 'Medium') return 'rgba(255, 235, 59, 1)';
                return 'rgba(76, 175, 80, 1)';
            }),
            borderWidth: 2,
            borderRadius: 8,
        }]
    };

    const wearLevelChartData = {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{
            data: [
                equipmentData.filter(d => d.criticality === 'Critical').length,
                equipmentData.filter(d => d.criticality === 'High').length,
                equipmentData.filter(d => d.criticality === 'Medium').length,
                equipmentData.filter(d => d.criticality === 'Low').length,
            ],
            backgroundColor: ['#F44336', '#FF9800', '#FFEB3B', '#4CAF50'],
            borderWidth: 3,
            borderColor: '#fff'
        }]
    };

    const temperatureChartData = selectedAsset ? {
        labels: selectedAsset.historicalData.slice(-7).map(d => d.date),
        datasets: [{
            label: 'Temperature (°C)',
            data: selectedAsset.historicalData.slice(-7).map(d => d.temperature),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            tension: 0.4,
            fill: true
        }]
    } : null;

    const radarChartData = selectedAsset ? {
        labels: ['Efficiency', 'Temperature', 'Vibration', 'Pressure', 'Wear Level'],
        datasets: [{
            label: selectedAsset.name,
            data: [
                selectedAsset.energyEfficiency,
                (100 - selectedAsset.temperature), // Inverted for better visualization
                (10 - selectedAsset.vibration) * 10, // Scaled and inverted
                selectedAsset.pressure,
                (100 - selectedAsset.wearLevel) // Inverted
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
        }]
    } : null;

    // Sub-components
    const StatCard = ({ title, value, unit, color, icon, trend }) => (
        <div style={{...statCardStyle, borderLeft: `5px solid ${color}`}} className="stat-card">
            <div style={statCardHeaderStyle}>
                <span style={statIconStyle}>{icon}</span>
                <h3 style={{...statCardTitleStyle, color}}>{title}</h3>
            </div>
            <div style={statCardBodyStyle}>
                <p style={statCardValueStyle}>
                    {value} <span style={statCardUnitStyle}>{unit}</span>
                </p>
                {trend && (
                    <span style={{...trendStyle, color: trend > 0 ? '#4CAF50' : '#F44336'}}>
                        {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
        </div>
    );

    const WearBar = ({ level, criticality, animated = true }) => {
        const barColor = {
            'Critical': '#F44336',
            'High': '#FF9800', 
            'Medium': '#FFEB3B',
            'Low': '#4CAF50'
        }[criticality];

        return (
            <div style={wearBarContainerStyle}>
                <div style={wearBarStyle}>
                    <div
                        style={{
                            ...wearBarFillStyle,
                            width: `${Math.min(level, 100)}%`,
                            backgroundColor: barColor,
                            animation: animated ? `fillBar 1s ease-out` : 'none'
                        }}
                    />
                    <span style={wearBarLabelStyle}>{level.toFixed(1)}%</span>
                </div>
                <div style={wearBarGradientStyle}></div>
            </div>
        );
    };

    const NotificationPanel = () => (
        <div style={notificationPanelStyle}>
            <h3 style={notificationHeaderStyle}>
                🔔 Live Alerts ({notifications.length})
            </h3>
            <div style={notificationListStyle}>
                {notifications.length === 0 ? (
                    <p style={noNotificationsStyle}>No new alerts</p>
                ) : (
                    notifications.map(notification => (
                        <div 
                            key={notification.id} 
                            style={{
                                ...notificationItemStyle,
                                borderLeft: `4px solid ${getNotificationColor(notification.type)}`
                            }}
                            className="notification-item"
                        >
                            <div style={notificationContentStyle}>
                                <span style={notificationMessageStyle}>{notification.message}</span>
                                <span style={notificationTimeStyle}>{notification.timestamp}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const getNotificationColor = (type) => {
        switch(type) {
            case 'critical': return '#F44336';
            case 'high': return '#FF9800';
            case 'success': return '#4CAF50';
            default: return '#2196F3';
        }
    };

    const AssetDetailModal = () => {
        if (!selectedAsset) return null;

        return (
            <div style={modalOverlayStyle} onClick={() => setSelectedAsset(null)}>
                <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
                    <div style={modalHeaderStyle}>
                        <h2>{selectedAsset.name}</h2>
                        <button 
                            style={closeButtonStyle}
                            onClick={() => setSelectedAsset(null)}
                        >
                            ✕
                        </button>
                    </div>
                    <div style={modalBodyStyle}>
                        <div style={modalStatsGridStyle}>
                            <div style={modalStatItemStyle}>
                                <span>Temperature</span>
                                <strong>{selectedAsset.temperature.toFixed(1)}°C</strong>
                            </div>
                            <div style={modalStatItemStyle}>
                                <span>Vibration</span>
                                <strong>{selectedAsset.vibration.toFixed(1)} mm/s</strong>
                            </div>
                            <div style={modalStatItemStyle}>
                                <span>Pressure</span>
                                <strong>{selectedAsset.pressure.toFixed(1)} bar</strong>
                            </div>
                            <div style={modalStatItemStyle}>
                                <span>Operating Hours</span>
                                <strong>{selectedAsset.operatingHours.toLocaleString()}</strong>
                            </div>
                        </div>
                        
                        <div style={chartContainerStyle}>
                            {temperatureChartData && (
                                <div style={chartItemStyle}>
                                    <h4>Temperature Trend (7 days)</h4>
                                    <Line data={temperatureChartData} options={{
                                        responsive: true,
                                        plugins: { legend: { display: false } },
                                        scales: { y: { beginAtZero: false } }
                                    }} />
                                </div>
                            )}
                            
                            {radarChartData && (
                                <div style={chartItemStyle}>
                                    <h4>Performance Radar</h4>
                                    <Radar data={radarChartData} options={{
                                        responsive: true,
                                        plugins: { legend: { display: false } },
                                        scales: { r: { beginAtZero: true, max: 100 } }
                                    }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render main dashboard
    return (
    <div 
      className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 animate-fade-in"
      style={{ backgroundColor: '#FBF3D1' }}
    >
            <audio ref={audioRef} preload="auto">
                <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DDrGkfCjaHzO3CbCUEMo/Y9c14LQUheMeqxNmObwwKaZ0s12BfAZyA9qzmnD4wBhU58O7CfA0FJYX26E1AYghQm8RdH0qnQ0LjOLPFZn4M7h6XfHhWaDADYQDCEBcJRBc0sJBhPz9yAhV4dEQ9Q2Uie6mNZihIeqwRdXbNz8" type="audio/wav" />
            </audio>

            {/* Enhanced Header */}
            <header style={headerStyle}>
                <div style={headerContentStyle}>
                    <div>
                        <h1 style={headerTitleStyle}>
                            ⚙️ AI Predictive Maintenance Console
                        </h1>
                        <p style={headerSubtitleStyle}>
                            Real-Time Industrial Equipment Monitoring | Updated every 2s | Zone Coverage: A-D
                        </p>
                    </div>
                    <div style={headerButtonsStyle}>
                        <button 
                            style={{...viewButtonStyle, ...(dashboardView === 'overview' ? activeViewButtonStyle : {})}}
                            onClick={() => setDashboardView('overview')}
                        >
                            📊 Overview
                        </button>
                        <button 
                            style={{...viewButtonStyle, ...(dashboardView === 'analytics' ? activeViewButtonStyle : {})}}
                            onClick={() => setDashboardView('analytics')}
                        >
                            📈 Analytics
                        </button>
                        <button 
                            style={{...viewButtonStyle, ...(dashboardView === 'alerts' ? activeViewButtonStyle : {})}}
                            onClick={() => setDashboardView('alerts')}
                        >
                            🚨 Alerts
                        </button>
                    </div>
                </div>
            </header>

            {/* Loading Overlay */}
            {isLoading && (
                <div style={loadingOverlayStyle}>
                    <div style={loadingSpinnerStyle}></div>
                    <p>Processing request...</p>
                </div>
            )}

            {/* Enhanced Stats Section */}
            <section style={statsSectionStyle}>
                <StatCard 
                    title="Critical Alerts" 
                    value={stats.criticalCount} 
                    unit="Units" 
                    color="#F44336" 
                    icon="🚨"
                    trend={-2}
                />
                <StatCard 
                    title="High Priority" 
                    value={stats.highCount} 
                    unit="Units" 
                    color="#FF9800" 
                    icon="⚠️"
                    trend={1}
                />
                <StatCard 
                    title="Scheduled Jobs" 
                    value={stats.scheduledCount} 
                    unit="Active" 
                    color="#2196F3" 
                    icon="🔧"
                    trend={0}
                />
                <StatCard 
                    title="Avg Efficiency" 
                    value={stats.avgEfficiency} 
                    unit="%" 
                    color="#4CAF50" 
                    icon="⚡"
                    trend={3}
                />
                <StatCard 
                    title="Total Downtime" 
                    value={stats.totalDowntime} 
                    unit="hrs" 
                    color="#9C27B0" 
                    icon="⏰"
                    trend={-5}
                />
                <StatCard 
                    title="Avg Temperature" 
                    value={stats.avgTemperature} 
                    unit="°C" 
                    color="#FF5722" 
                    icon="🌡️"
                    trend={0}
                />
            </section>

            {/* Enhanced Controls */}
            <section style={controlsSectionStyle}>
                <div>
                    <label style={labelStyle}>🔍 Search Assets:</label>
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        style={inputStyle}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div>
                    <label style={labelStyle}>⚠️ Criticality:</label>
                    <select style={selectStyle} value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="All">All Levels</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>📍 Location:</label>
                    <select style={selectStyle} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                        <option value="All">All Zones</option>
                        <option value="Zone A">Zone A</option>
                        <option value="Zone B">Zone B</option>
                        <option value="Zone C">Zone C</option>
                        <option value="Zone D">Zone D</option>
                    </select>
                </div>
                <button 
                    style={refreshButtonStyle}
                    onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => setIsLoading(false), 1000);
                        addNotification('Data refreshed successfully', 'success');
                    }}
                >
                    🔄 Refresh Data
                </button>
            </section>

            {/* Dashboard Content based on view */}
            {dashboardView === 'overview' && (
                <>
                    {/* Analytics Charts Section */}
                    <section style={chartsSectionStyle}>
                        <h2 style={sectionHeaderStyle}>📊 Performance Analytics</h2>
                        <div style={chartsGridStyle}>
                            <div style={chartCardStyle}>
                                <h3>Equipment Efficiency Distribution</h3>
                                <Bar 
                                    data={efficiencyChartData} 
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: { display: false },
                                            title: { display: true, text: 'Current Efficiency Levels' }
                                        },
                                        scales: {
                                            y: { beginAtZero: true, max: 100 }
                                        }
                                    }} 
                                />
                            </div>
                            <div style={chartCardStyle}>
                                <h3>Criticality Distribution</h3>
                                <Doughnut 
                                    data={wearLevelChartData} 
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: { position: 'bottom' },
                                            title: { display: true, text: 'Asset Risk Levels' }
                                        }
                                    }} 
                                />
                            </div>
                        </div>
                    </section>

                    {/* Enhanced Asset List */}
                    <section style={assetListSectionStyle}>
                        <h2 style={sectionHeaderStyle}>
                            🏭 Asset Monitoring & Failure Prediction ({filteredData.length} assets)
                        </h2>
                        <div style={assetGridStyle}>
                            {filteredData.length > 0 ? (
                                filteredData.map((asset) => (
                                    <div key={asset.id} style={assetCardStyle(asset.criticality)} className="asset-card">
                                        <div style={assetCardHeaderStyle}>
                                            <h3 style={assetCardTitleStyle}>
                                                {asset.name} 
                                                <span style={assetIDStyle}>({asset.id})</span>
                                            </h3>
                                            <div style={assetMetaStyle}>
                                                <span style={locationBadgeStyle}>{asset.location}</span>
                                                <span style={statusBadgeStyle(asset.status)}>{asset.status}</span>
                                            </div>
                                        </div>

                                        <div style={assetBodyStyle}>
                                            <div style={wearPredictionContainerStyle}>
                                                <p style={wearPredictionHeaderStyle}>Component Wear Level</p>
                                                <WearBar level={asset.wearLevel} criticality={asset.criticality} />
                                            </div>

                                            <div style={sensorDataGridStyle}>
                                                <div style={sensorItemStyle}>
                                                    <span>🌡️ {asset.temperature.toFixed(1)}°C</span>
                                                </div>
                                                <div style={sensorItemStyle}>
                                                    <span>📳 {asset.vibration.toFixed(1)} mm/s</span>
                                                </div>
                                                <div style={sensorItemStyle}>
                                                    <span>🔘 {asset.pressure.toFixed(1)} bar</span>
                                                </div>
                                                <div style={sensorItemStyle}>
                                                    <span>⚡ {asset.energyEfficiency.toFixed(1)}%</span>
                                                </div>
                                            </div>

                                            <p style={assetPredictionStyle}>
                                                <strong>🔮 AI Prediction:</strong> {asset.prediction}
                                            </p>

                                            <div style={detailsRowStyle}>
                                                <span>Last: {asset.lastMaintenance}</span>
                                                <span>Next: {asset.nextMaintenance}</span>
                                                <span>Hours: {asset.operatingHours.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div style={buttonGroupStyle}>
                                            <button 
                                                onClick={() => setSelectedAsset(asset)}
                                                style={detailButtonStyle}
                                            >
                                                📊 Details
                                            </button>
                                            
                                            {asset.status.includes('ALERT') && (
                                                <button 
                                                    onClick={() => handleAcknowledgeAlert(asset.id)}
                                                    style={acknowledgeButtonStyle}
                                                >
                                                    ✅ Acknowledge
                                                </button>
                                            )}
                                            
                                            {asset.criticality === 'Critical' && (
                                                <button 
                                                    onClick={() => handleEmergencyShutdown(asset.id)}
                                                    style={emergencyButtonStyle}
                                                >
                                                    🛑 Emergency Stop
                                                </button>
                                            )}
                                            
                                            <button 
                                                onClick={() => handleScheduleMaintenance(asset.id)}
                                                disabled={asset.status.includes('Scheduled') || asset.status.includes('SHUTDOWN')}
                                                style={scheduleButtonStyle(asset.criticality, asset.status.includes('Scheduled'))}
                                            >
                                                {asset.status.includes('Scheduled') ? '⏰ Scheduled' : '🔧 Schedule'}
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleStartDiagnostic(asset.id)}
                                                style={diagnosticButtonStyle}
                                            >
                                                🔍 Diagnostic
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={noResultsStyle}>
                                    <p>🔍 No assets match the current filters</p>
                                    <button onClick={() => {setFilter('All'); setLocationFilter('All'); setSearchTerm('');}}>
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}

            {dashboardView === 'analytics' && (
                <section style={analyticsContainerStyle}>
                    <h2 style={sectionHeaderStyle}>📈 Advanced Analytics Dashboard</h2>
                    <div style={analyticsGridStyle}>
                        <div style={chartCardStyle}>
                            <h3>Equipment Efficiency Trends</h3>
                            <Bar data={efficiencyChartData} />
                        </div>
                        <div style={chartCardStyle}>
                            <h3>Risk Distribution</h3>
                            <Doughnut data={wearLevelChartData} />
                        </div>
                        <div style={chartCardStyle}>
                            <h3>Maintenance Cost Analysis</h3>
                            <Bar data={{
                                labels: equipmentData.map(asset => asset.name),
                                datasets: [{
                                    label: 'Maintenance Cost ($)',
                                    data: equipmentData.map(asset => asset.maintenanceCost),
                                    backgroundColor: 'rgba(156, 39, 176, 0.8)',
                                    borderColor: 'rgba(156, 39, 176, 1)',
                                    borderWidth: 2
                                }]
                            }} />
                        </div>
                        <div style={chartCardStyle}>
                            <h3>Downtime Analysis</h3>
                            <Bar data={{
                                labels: equipmentData.map(asset => asset.name),
                                datasets: [{
                                    label: 'Downtime (hours)',
                                    data: equipmentData.map(asset => asset.downtime),
                                    backgroundColor: 'rgba(255, 87, 34, 0.8)',
                                    borderColor: 'rgba(255, 87, 34, 1)',
                                    borderWidth: 2
                                }]
                            }} />
                        </div>
                    </div>
                </section>
            )}

            {dashboardView === 'alerts' && <NotificationPanel />}

            {/* Asset Detail Modal */}
            <AssetDetailModal />
        </div>
    );
};

// --- ENHANCED STYLING ---

const dashboardContainerStyle = {
    fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
    padding: '20px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    position: 'relative'
};

const headerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '32px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    color: 'white'
};

const headerContentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px'
};

const headerTitleStyle = {
    margin: '0 0 8px 0',
    fontSize: '2.5em',
    fontWeight: '700',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
};

const headerSubtitleStyle = {
    margin: '0',
    fontSize: '1.1em',
    opacity: '0.9',
    fontWeight: '300'
};

const headerButtonsStyle = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
};

const viewButtonStyle = {
    padding: '12px 20px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
};

const activeViewButtonStyle = {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderColor: 'rgba(255,255,255,0.8)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
};

const loadingOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    color: 'white',
    fontSize: '1.2em'
};

const loadingSpinnerStyle = {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255,255,255,0.3)',
    borderTop: '4px solid #fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
};

const statsSectionStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
};

const statCardStyle = {
    padding: '24px',
    borderRadius: '16px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
};

const statCardHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px'
};

const statIconStyle = {
    fontSize: '1.8em',
    marginRight: '12px'
};

const statCardTitleStyle = {
    margin: '0',
    fontSize: '0.95em',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const statCardBodyStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const statCardValueStyle = {
    margin: '0',
    fontSize: '2.5em',
    fontWeight: '700',
    lineHeight: '1'
};

const statCardUnitStyle = {
    fontSize: '0.4em',
    fontWeight: '400',
    color: '#666',
    marginLeft: '4px'
};

const trendStyle = {
    fontSize: '0.9em',
    fontWeight: '600'
};

const controlsSectionStyle = {
    display: 'flex',
    gap: '24px',
    marginBottom: '32px',
    padding: '20px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    alignItems: 'center',
    flexWrap: 'wrap'
};

const labelStyle = {
    fontWeight: '600',
    marginRight: '12px',
    color: '#333',
    fontSize: '0.95em'
};

const selectStyle = {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    backgroundColor: '#ffffff',
    fontSize: '0.95em',
    fontWeight: '500',
    minWidth: '160px',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
};

const inputStyle = {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    backgroundColor: '#ffffff',
    fontSize: '0.95em',
    width: '280px',
    transition: 'all 0.3s ease'
};

const refreshButtonStyle = {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#4f46e5',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.95em'
};

const chartsSectionStyle = {
    marginBottom: '32px'
};

const sectionHeaderStyle = {
    color: '#1e293b',
    marginBottom: '24px',
    fontSize: '1.8em',
    fontWeight: '700',
    borderBottom: '3px solid #e2e8f0',
    paddingBottom: '12px'
};

const chartsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '24px'
};

const chartCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease'
};

const assetListSectionStyle = {
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
};

const assetGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px'
};

const getBorderColor = (criticality) => {
    switch (criticality) {
        case 'Critical': return '#dc2626';
        case 'High': return '#ea580c';
        case 'Medium': return '#d97706';
        default: return '#16a34a';
    }
};

const assetCardStyle = (criticality) => ({
    borderLeft: `6px solid ${getBorderColor(criticality)}`,
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    ...(criticality === 'Critical' && {
        animation: 'pulse 2s infinite',
        boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)'
    })
});

const assetCardHeaderStyle = {
    marginBottom: '16px'
};

const assetCardTitleStyle = {
    margin: '0 0 8px 0',
    fontSize: '1.3em',
    fontWeight: '700',
    color: '#1e293b'
};

const assetIDStyle = {
    fontSize: '0.75em',
    color: '#64748b',
    fontWeight: '500'
};

const assetMetaStyle = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
};

const locationBadgeStyle = {
    padding: '4px 8px',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    borderRadius: '6px',
    fontSize: '0.8em',
    fontWeight: '600'
};

const statusBadgeStyle = (status) => ({
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.8em',
    fontWeight: '600',
    backgroundColor: status.includes('ALERT') || status.includes('CRITICAL') ? '#fef2f2' : 
                    status.includes('Scheduled') ? '#eff6ff' : '#f0fdf4',
    color: status.includes('ALERT') || status.includes('CRITICAL') ? '#dc2626' :
           status.includes('Scheduled') ? '#2563eb' : '#16a34a'
});

const assetBodyStyle = {
    marginBottom: '20px'
};

const wearPredictionContainerStyle = {
    margin: '16px 0'
};

const wearPredictionHeaderStyle = {
    margin: '0 0 8px 0',
    fontSize: '0.9em',
    fontWeight: '600',
    color: '#374151'
};

const wearBarContainerStyle = {
    position: 'relative',
    marginBottom: '8px'
};

const wearBarStyle = {
    height: '28px',
    backgroundColor: '#f1f5f9',
    borderRadius: '14px',
    overflow: 'hidden',
    position: 'relative',
    border: '2px solid #e2e8f0'
};

const wearBarFillStyle = {
    height: '100%',
    transition: 'width 1s ease-out',
    borderRadius: '12px',
    position: 'relative'
};

const wearBarLabelStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '0.85em',
    fontWeight: '700',
    color: '#1e293b',
    textShadow: '1px 1px 2px rgba(255,255,255,0.7)'
};

const wearBarGradientStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
    pointerEvents: 'none'
};

const sensorDataGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    marginBottom: '16px'
};

const sensorItemStyle = {
    padding: '8px 12px',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    fontSize: '0.85em',
    fontWeight: '600',
    color: '#475569'
};

const assetPredictionStyle = {
    backgroundColor: '#fef7cd',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #fbbf24',
    fontSize: '0.9em',
    lineHeight: '1.4',
    marginBottom: '16px',
    color: '#92400e'
};

const detailsRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8em',
    color: '#64748b',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '8px'
};

const buttonGroupStyle = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
};

const scheduleButtonStyle = (criticality, isDisabled) => ({
    flex: '1',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.85em',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    backgroundColor: isDisabled ? '#94a3b8' : (criticality === 'Critical' ? '#dc2626' : '#2563eb'),
    color: '#ffffff',
    transition: 'all 0.2s ease',
    opacity: isDisabled ? 0.7 : 1
});

const acknowledgeButtonStyle = {
    padding: '10px 16px',
    border: '2px solid #f59e0b',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.85em',
    cursor: 'pointer',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    transition: 'all 0.2s ease'
};

const emergencyButtonStyle = {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.85em',
    cursor: 'pointer',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    transition: 'all 0.2s ease',
    animation: 'pulse 1.5s infinite'
};

const detailButtonStyle = {
    padding: '10px 16px',
    border: '2px solid #3b82f6',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.85em',
    cursor: 'pointer',
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    transition: 'all 0.2s ease'
};

const diagnosticButtonStyle = {
    padding: '10px 16px',
    border: '2px solid #059669',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.85em',
    cursor: 'pointer',
    backgroundColor: '#d1fae5',
    color: '#047857',
    transition: 'all 0.2s ease'
};

const notificationPanelStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    maxHeight: '600px',
    overflow: 'hidden'
};

const notificationHeaderStyle = {
    margin: '0 0 20px 0',
    fontSize: '1.4em',
    fontWeight: '700',
    color: '#1e293b'
};

const notificationListStyle = {
    maxHeight: '500px',
    overflowY: 'auto',
    paddingRight: '8px'
};

const noNotificationsStyle = {
    textAlign: 'center',
    color: '#64748b',
    fontStyle: 'italic',
    padding: '40px 0'
};

const notificationItemStyle = {
    padding: '12px 16px',
    marginBottom: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    transition: 'all 0.3s ease'
};

const notificationContentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px'
};

const notificationMessageStyle = {
    fontSize: '0.9em',
    fontWeight: '600',
    color: '#374151',
    flex: 1
};

const notificationTimeStyle = {
    fontSize: '0.75em',
    color: '#9ca3af',
    whiteSpace: 'nowrap'
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
};

const modalContentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    maxWidth: '1000px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
};

const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '2px solid #e2e8f0',
    backgroundColor: '#f8fafc'
};

const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.5em',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    transition: 'all 0.2s ease'
};

const modalBodyStyle = {
    padding: '24px'
};

const modalStatsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
};

const modalStatItemStyle = {
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    textAlign: 'center',
    border: '2px solid #e2e8f0'
};

const chartContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px'
};

const chartItemStyle = {
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '2px solid #e2e8f0'
};

const analyticsContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
};

const analyticsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px'
};

const noResultsStyle = {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
    color: '#64748b',
    fontSize: '1.1em'
};

// Add CSS animations via a style tag
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    @keyframes fillBar {
        0% { width: 0%; }
        100% { width: var(--target-width); }
    }
    
    .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .asset-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    }
    
    .notification-item:hover {
        background-color: #e2e8f0;
        transform: translateX(4px);
    }
    
    button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    button:active {
        transform: translateY(0px);
    }
    
    input:focus, select:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        outline: none;
    }
`;
document.head.appendChild(style);

export default EnhancedPredictiveMaintenance;
