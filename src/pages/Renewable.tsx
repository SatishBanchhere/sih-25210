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
import { Line, Bar, Doughnut, Radar, Pie } from 'react-chartjs-2';

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
const ENERGY_SOURCES = {
    SOLAR: 'Solar',
    WIND: 'Wind',
    BATTERY: 'Battery Storage',
    GRID: 'Grid Power',
    HYBRID: 'Hybrid'
};

const MINING_ZONES = {
    'COMMINUTION_A': 'Comminution Zone A',
    'COMMINUTION_B': 'Comminution Zone B',
    'PROCESSING': 'Processing Plant',
    'MAINTENANCE': 'Maintenance Facility',
    'ADMIN': 'Administrative Complex'
};

// **15% ENERGY SAVINGS CALCULATION CONSTANTS**
const ORIGINAL_ENERGY_CONSUMPTION = 50; // 50% of total mining energy
const TARGET_ENERGY_CONSUMPTION = 35;   // 35% target (15% reduction)
const ENERGY_SAVINGS_PERCENTAGE = 15;   // 15% profit/savings
const COST_SAVINGS_PER_DAY = 25000;     // $25,000 per day savings
const ANNUAL_SAVINGS = COST_SAVINGS_PER_DAY * 365; // Annual savings

const getRandomFloat = (min, max, decimals = 2) => 
    parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateHistoricalData = (days = 30) => {
    const data = [];
    const today = new Date();
    for (let i = days; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        // Simulate gradual improvement over time
        const improvementFactor = (days - i) / days * 0.3;
        data.push({
            date: date.toISOString().split('T')[0],
            solarGeneration: getRandomFloat(800, 1200) * (1 + improvementFactor),
            windGeneration: getRandomFloat(400, 800) * (1 + improvementFactor),
            batteryLevel: getRandomFloat(20, 95),
            gridConsumption: getRandomFloat(500, 800) * (1 - improvementFactor), // Decreasing grid dependency
            totalConsumption: getRandomFloat(1400, 1800), // Reduced from 2000-2500
            carbonSaved: getRandomFloat(18, 28) * (1 + improvementFactor),
            efficiency: getRandomFloat(85, 96) * (1 + improvementFactor/2),
            weatherScore: getRandomFloat(6, 9.5),
            energySavings: getRandomFloat(12, 18) * (1 + improvementFactor), // 15% savings tracking
            costSavings: getRandomFloat(20000, 30000) * (1 + improvementFactor)
        });
    }
    return data;
};

// --- ENHANCED INITIAL RENEWABLE ENERGY DATA ---
const initialRenewableData = [
    {
        id: 'SOLAR_FARM_01',
        name: 'Primary Solar Array',
        type: ENERGY_SOURCES.SOLAR,
        zone: MINING_ZONES.COMMINUTION_A,
        status: 'Operational',
        capacity: 2800, // Increased capacity
        currentOutput: 2420,
        efficiency: 92.3, // Improved efficiency
        weatherCondition: 'Sunny',
        temperature: 28.5,
        irradiance: 980,
        panelCount: 9500,
        lastMaintenance: '2025-09-15',
        nextMaintenance: '2026-01-15',
        carbonOffset: 2150, // Increased carbon offset
        operatingHours: 12450,
        maintenanceCost: 45000,
        roi: 24.8, // Improved ROI due to 15% savings
        inverterStatus: 'Optimal',
        gridTieStatus: 'Connected',
        energySavingsContribution: 8.5, // % contribution to 15% savings
        costSavingsDaily: 8500, // Daily cost savings
        historicalData: generateHistoricalData(),
        alerts: [],
        coordinates: { lat: -23.5505, lng: 46.6333 }
    },
    {
        id: 'WIND_FARM_01',
        name: 'Highland Wind Turbines',
        type: ENERGY_SOURCES.WIND,
        zone: MINING_ZONES.PROCESSING,
        status: 'Operational',
        capacity: 2100, // Increased
        currentOutput: 1789,
        efficiency: 85.2,
        weatherCondition: 'Windy',
        windSpeed: 14.2,
        windDirection: 'NW',
        turbineCount: 7, // Added more turbines
        lastMaintenance: '2025-08-20',
        nextMaintenance: '2025-12-20',
        carbonOffset: 1520,
        operatingHours: 18920,
        maintenanceCost: 85000,
        roi: 19.7,
        bladeStatus: 'Excellent',
        gearboxStatus: 'Optimal',
        energySavingsContribution: 4.2,
        costSavingsDaily: 4200,
        historicalData: generateHistoricalData(),
        alerts: [],
        coordinates: { lat: -23.5405, lng: 46.6433 }
    },
    {
        id: 'BATTERY_BANK_01',
        name: 'Advanced Lithium Storage',
        type: ENERGY_SOURCES.BATTERY,
        zone: MINING_ZONES.COMMINUTION_B,
        status: 'Operational',
        capacity: 6000, // Increased capacity
        currentLevel: 5100,
        efficiency: 96.8, // Improved efficiency
        chargingRate: 550,
        dischargingRate: 0,
        temperature: 21.5,
        cycleCount: 1245,
        maxCycles: 8000, // Better batteries
        lastMaintenance: '2025-10-01',
        nextMaintenance: '2026-02-01',
        carbonOffset: 1200,
        operatingHours: 8760,
        maintenanceCost: 35000,
        roi: 28.4, // High ROI due to peak shaving
        batteryHealth: 98.2,
        cellBalance: 'Perfectly Balanced',
        energySavingsContribution: 1.8,
        costSavingsDaily: 1800,
        historicalData: generateHistoricalData(),
        alerts: [],
        coordinates: { lat: -23.5455, lng: 46.6383 }
    },
    {
        id: 'SOLAR_FARM_02',
        name: 'Secondary Solar Grid',
        type: ENERGY_SOURCES.SOLAR,
        zone: MINING_ZONES.MAINTENANCE,
        status: 'Optimization in Progress',
        capacity: 1400,
        currentOutput: 1190,
        efficiency: 85.0, // Being optimized
        weatherCondition: 'Clear',
        temperature: 29.1,
        irradiance: 850,
        panelCount: 4800,
        lastMaintenance: '2025-10-05',
        nextMaintenance: '2025-11-15',
        carbonOffset: 1010,
        operatingHours: 9840,
        maintenanceCost: 28000,
        roi: 18.5,
        inverterStatus: 'Good',
        gridTieStatus: 'Connected',
        energySavingsContribution: 0.3, // Lower due to optimization needed
        costSavingsDaily: 300,
        historicalData: generateHistoricalData(),
        alerts: ['Performance optimization in progress'],
        coordinates: { lat: -23.5555, lng: 46.6283 }
    },
    {
        id: 'HYBRID_SYSTEM_01',
        name: 'Smart Solar-Wind Hybrid',
        type: ENERGY_SOURCES.HYBRID,
        zone: MINING_ZONES.ADMIN,
        status: 'Peak Performance',
        capacity: 950,
        currentOutput: 815,
        efficiency: 85.8,
        solarOutput: 520,
        windOutput: 295,
        weatherCondition: 'Optimal',
        temperature: 26.2,
        windSpeed: 9.8,
        lastMaintenance: '2025-09-05',
        nextMaintenance: '2025-12-05',
        carbonOffset: 692,
        operatingHours: 7520,
        maintenanceCost: 22000,
        roi: 23.1,
        systemBalance: 'Perfect',
        controllerStatus: 'AI-Optimized',
        energySavingsContribution: 0.2,
        costSavingsDaily: 200,
        historicalData: generateHistoricalData(),
        alerts: [],
        coordinates: { lat: -23.5355, lng: 46.6483 }
    }
];

// --- MAIN COMPONENT ---
const EnhancedRenewableEnergyDashboard = () => {
    const [energyData, setEnergyData] = useState(initialRenewableData);
    const [selectedSystem, setSelectedSystem] = useState(null);
    const [dashboardView, setDashboardView] = useState('overview');
    const [filterType, setFilterType] = useState('All');
    const [filterZone, setFilterZone] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [animationTrigger, setAnimationTrigger] = useState(0);
    
    // **15% SAVINGS TRACKING STATE**
    const [savingsMetrics, setSavingsMetrics] = useState({
        currentSavings: 14.2, // Current savings percentage
        targetSavings: 15.0,  // Target 15%
        dailyCostSavings: 23800,
        annualProjection: 8687000,
        carbonReduction: 2847, // kg CO2 per day
        gridDependency: 36.8,  // Current grid dependency (target: 35%)
        energyEfficiencyGain: 89.4 // Current efficiency
    });

    const audioRef = useRef(null);

    // Real-time simulation with 15% savings focus
    useEffect(() => {
        const intervalId = setInterval(() => {
            setEnergyData(prevData =>
                prevData.map(system => {
                    let newOutput = system.currentOutput;
                    let newEfficiency = system.efficiency;
                    let newStatus = system.status;
                    let newAlerts = [...system.alerts];

                    // Simulate different behaviors based on energy type
                    switch (system.type) {
                        case ENERGY_SOURCES.SOLAR:
                            const hour = new Date().getHours();
                            const solarMultiplier = hour >= 6 && hour <= 18 ? 
                                Math.sin((hour - 6) * Math.PI / 12) : 0;
                            newOutput = Math.max(0, system.capacity * solarMultiplier * (0.8 + Math.random() * 0.2));
                            newEfficiency = Math.max(80, Math.min(98, system.efficiency + getRandomFloat(-1, 1)));
                            break;

                        case ENERGY_SOURCES.WIND:
                            newOutput = Math.max(0, system.capacity * (0.4 + Math.random() * 0.6));
                            newEfficiency = Math.max(75, Math.min(95, system.efficiency + getRandomFloat(-1, 1)));
                            break;

                        case ENERGY_SOURCES.BATTERY:
                            if (system.status === 'Operational') {
                                const chargeChange = getRandomFloat(-30, 80);
                                newOutput = Math.max(0, Math.min(system.capacity, system.currentLevel + chargeChange));
                            }
                            break;

                        case ENERGY_SOURCES.HYBRID:
                            newOutput = Math.max(0, system.capacity * (0.7 + Math.random() * 0.3));
                            break;

                        default:
                            break;
                    }

                    return {
                        ...system,
                        currentOutput: newOutput,
                        efficiency: newEfficiency,
                        status: newStatus,
                        alerts: newAlerts,
                        lastUpdated: new Date().getTime()
                    };
                })
            );

            // Update savings metrics in real-time
            setSavingsMetrics(prev => ({
                ...prev,
                currentSavings: Math.min(15.0, prev.currentSavings + getRandomFloat(-0.1, 0.2)),
                dailyCostSavings: prev.dailyCostSavings + getRandomFloat(-500, 1000),
                gridDependency: Math.max(35.0, prev.gridDependency + getRandomFloat(-0.3, 0.1)),
                energyEfficiencyGain: Math.min(95, prev.energyEfficiencyGain + getRandomFloat(-0.2, 0.5))
            }));

            setAnimationTrigger(prev => prev + 1);
        }, 2500);

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
        
        if (type === 'critical' && audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
    }, []);

    // **ENHANCED ACTION HANDLERS WITH BETTER RESPONSIVENESS**
    const handleSystemAction = useCallback((systemId, actionType) => {
        setIsLoading(true);
        
        const processingMessages = {
            'optimize': 'Optimizing energy output...',
            'maintenance': 'Scheduling maintenance...',
            'shutdown': 'Initiating shutdown procedure...',
            'restart': 'Restarting system...',
            'upgrade': 'Upgrading system efficiency...'
        };

        // Show immediate feedback
        addNotification(processingMessages[actionType] || 'Processing request...', 'info');

        setTimeout(() => {
            setEnergyData(prevData =>
                prevData.map(system => {
                    if (system.id !== systemId) return system;

                    switch (actionType) {
                        case 'optimize':
                            return {
                                ...system,
                                efficiency: Math.min(98, system.efficiency + getRandomFloat(3, 8)),
                                status: 'AI-Optimized',
                                energySavingsContribution: system.energySavingsContribution + getRandomFloat(0.5, 1.5),
                                alerts: system.alerts.filter(alert => !alert.includes('efficiency'))
                            };
                        
                        case 'maintenance':
                            return {
                                ...system,
                                status: 'Maintenance Scheduled',
                                lastMaintenance: new Date().toISOString().split('T')[0]
                            };
                        
                        case 'shutdown':
                            return {
                                ...system,
                                status: 'Shutdown',
                                currentOutput: 0
                            };
                        
                        case 'restart':
                            return {
                                ...system,
                                status: 'Operational',
                                currentOutput: system.capacity * 0.8
                            };
                        
                        case 'upgrade':
                            return {
                                ...system,
                                efficiency: Math.min(98, system.efficiency + 5),
                                capacity: system.capacity * 1.1,
                                status: 'Upgraded - Peak Performance',
                                roi: system.roi + 2
                            };

                        default:
                            return system;
                    }
                })
            );

            // Update savings metrics based on action
            if (actionType === 'optimize' || actionType === 'upgrade') {
                setSavingsMetrics(prev => ({
                    ...prev,
                    currentSavings: Math.min(15.0, prev.currentSavings + 0.3),
                    dailyCostSavings: prev.dailyCostSavings + 1200,
                    energyEfficiencyGain: Math.min(95, prev.energyEfficiencyGain + 1.5)
                }));
            }

            const actionMessages = {
                'optimize': `✅ ${systemId} optimized! Efficiency improved by ${getRandomFloat(3, 8).toFixed(1)}%`,
                'maintenance': `🔧 Maintenance scheduled for ${systemId}`,
                'shutdown': `⛔ ${systemId} shut down safely`,
                'restart': `🟢 ${systemId} restarted successfully`,
                'upgrade': `⬆️ ${systemId} upgraded! Performance enhanced significantly`
            };

            addNotification(actionMessages[actionType], 'success');
            setIsLoading(false);
        }, getRandomInt(1500, 3000));
    }, [addNotification]);

    // **MULTIPLE QUICK ACTION HANDLERS**
    const handleOptimizeSystem = useCallback((systemId) => handleSystemAction(systemId, 'optimize'), [handleSystemAction]);
    const handleScheduleMaintenance = useCallback((systemId) => handleSystemAction(systemId, 'maintenance'), [handleSystemAction]);
    const handleShutdownSystem = useCallback((systemId) => handleSystemAction(systemId, 'shutdown'), [handleSystemAction]);
    const handleRestartSystem = useCallback((systemId) => handleSystemAction(systemId, 'restart'), [handleSystemAction]);
    const handleUpgradeSystem = useCallback((systemId) => handleSystemAction(systemId, 'upgrade'), [handleSystemAction]);

    // **GLOBAL OPTIMIZATION ACTION**
    const handleGlobalOptimization = useCallback(() => {
        setIsLoading(true);
        addNotification('🚀 Initiating global energy optimization across all systems...', 'info');
        
        setTimeout(() => {
            setEnergyData(prevData =>
                prevData.map(system => ({
                    ...system,
                    efficiency: Math.min(98, system.efficiency + getRandomFloat(2, 5)),
                    energySavingsContribution: system.energySavingsContribution + getRandomFloat(0.3, 1.0),
                    status: system.status.includes('Shutdown') ? system.status : 'AI-Optimized'
                }))
            );

            setSavingsMetrics(prev => ({
                ...prev,
                currentSavings: Math.min(15.0, prev.currentSavings + 1.2),
                dailyCostSavings: prev.dailyCostSavings + 3500,
                energyEfficiencyGain: Math.min(95, prev.energyEfficiencyGain + 3.5),
                gridDependency: Math.max(35.0, prev.gridDependency - 1.5)
            }));

            addNotification('🎉 Global optimization complete! Energy savings increased by 1.2%', 'success');
            setIsLoading(false);
        }, 4000);
    }, [addNotification]);

    // Filtered data
    const filteredData = useMemo(() => {
        return energyData
            .filter(system => {
                if (filterType !== 'All' && system.type !== filterType) return false;
                if (filterZone !== 'All' && system.zone !== filterZone) return false;
                return system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       system.id.toLowerCase().includes(searchTerm.toLowerCase());
            });
    }, [energyData, filterType, filterZone, searchTerm]);

    // Enhanced statistics with 15% savings focus
    const stats = useMemo(() => {
        const totalCapacity = energyData.reduce((sum, system) => sum + system.capacity, 0);
        const totalOutput = energyData.reduce((sum, system) => sum + system.currentOutput, 0);
        const avgEfficiency = energyData.reduce((sum, system) => sum + system.efficiency, 0) / energyData.length;
        const totalCarbonOffset = energyData.reduce((sum, system) => sum + system.carbonOffset, 0);
        const totalEnergySavings = energyData.reduce((sum, system) => sum + system.energySavingsContribution, 0);
        const totalDailySavings = energyData.reduce((sum, system) => sum + system.costSavingsDaily, 0);
        
        return {
            totalCapacity: totalCapacity.toFixed(0),
            totalOutput: totalOutput.toFixed(0),
            avgEfficiency: avgEfficiency.toFixed(1),
            totalCarbonOffset: totalCarbonOffset.toFixed(0),
            totalEnergySavings: totalEnergySavings.toFixed(1),
            totalDailySavings: totalDailySavings.toFixed(0),
            operationalSystems: energyData.filter(system => 
                system.status === 'Operational' || system.status === 'AI-Optimized' || system.status === 'Peak Performance'
            ).length,
            totalSystems: energyData.length,
            gridIndependence: ((totalOutput / (totalOutput + 800)) * 100).toFixed(1)
        };
    }, [energyData]);

    // **15% SAVINGS HIGHLIGHT COMPONENT**
    const SavingsHighlight = () => (
        <div style={savingsHighlightStyle}>
            <div style={savingsHeaderStyle}>
                <h2 style={savingsMainTitleStyle}>🎯 15% ENERGY REDUCTION TARGET</h2>
                <p style={savingsSubtitleStyle}>Mining Energy Consumption: From 50% → 35% = 15% PROFIT INCREASE</p>
            </div>
            
            <div style={savingsMetricsGridStyle}>
                <div style={savingsMetricCardStyle('primary')}>
                    <div style={savingsMetricHeaderStyle}>
                        <span style={savingsIconStyle}>💰</span>
                        <h3>Current Savings</h3>
                    </div>
                    <div style={savingsValueContainerStyle}>
                        <span style={savingsLargeValueStyle}>{savingsMetrics.currentSavings.toFixed(1)}%</span>
                        <span style={savingsTargetStyle}>/ 15.0% Target</span>
                    </div>
                    <div style={savingsProgressBarStyle}>
                        <div style={{
                            ...savingsProgressFillStyle,
                            width: `${(savingsMetrics.currentSavings / 15) * 100}%`
                        }}></div>
                    </div>
                </div>

                <div style={savingsMetricCardStyle('success')}>
                    <div style={savingsMetricHeaderStyle}>
                        <span style={savingsIconStyle}>📈</span>
                        <h3>Daily Cost Savings</h3>
                    </div>
                    <div style={savingsValueContainerStyle}>
                        <span style={savingsLargeValueStyle}>${savingsMetrics.dailyCostSavings.toLocaleString()}</span>
                        <span style={savingsTargetStyle}>per day</span>
                    </div>
                </div>

                <div style={savingsMetricCardStyle('info')}>
                    <div style={savingsMetricHeaderStyle}>
                        <span style={savingsIconStyle}>🔋</span>
                        <h3>Grid Dependency</h3>
                    </div>
                    <div style={savingsValueContainerStyle}>
                        <span style={savingsLargeValueStyle}>{savingsMetrics.gridDependency.toFixed(1)}%</span>
                        <span style={savingsTargetStyle}>Target: 35%</span>
                    </div>
                    <div style={savingsProgressBarStyle}>
                        <div style={{
                            ...savingsProgressFillStyle,
                            width: `${Math.max(0, 100 - (savingsMetrics.gridDependency - 35) * 5)}%`,
                            backgroundColor: savingsMetrics.gridDependency <= 35 ? '#10B981' : '#F59E0B'
                        }}></div>
                    </div>
                </div>

                <div style={savingsMetricCardStyle('warning')}>
                    <div style={savingsMetricHeaderStyle}>
                        <span style={savingsIconStyle}>🚀</span>
                        <h3>Annual Projection</h3>
                    </div>
                    <div style={savingsValueContainerStyle}>
                        <span style={savingsLargeValueStyle}>${(savingsMetrics.annualProjection / 1000000).toFixed(1)}M</span>
                        <span style={savingsTargetStyle}>yearly savings</span>
                    </div>
                </div>
            </div>

            <div style={savingsActionButtonsStyle}>
                <button 
                    style={globalOptimizeButtonStyle}
                    onClick={handleGlobalOptimization}
                    disabled={isLoading}
                >
                    🚀 ACHIEVE 15% TARGET NOW
                </button>
                <a
                href="https://docs.google.com/spreadsheets/d/1nG4GWW7NaxVMy6Ft79TCeGHu1qmJDC4COTgzrvFf8vo/edit?gid=0#gid=0"
                target="_blank"
                rel="noopener noreferrer"
                style={savingsReportButtonStyle}
                onClick={() => addNotification('📊 Opening comprehensive complete report...', 'info')}
                >
                📊 Generate Complete Report
                </a>

            </div>
        </div>
    );

    // **ENHANCED STAT CARD WITH 15% SAVINGS FOCUS**
    const EnhancedStatCard = ({ title, value, unit, icon, color, trend, subtitle, isHighlight }) => (
        <div style={{
            ...energyStatCardStyle, 
            borderLeft: `5px solid ${color}`,
            ...(isHighlight ? highlightCardStyle : {})
        }} className="energy-stat-card">
            {isHighlight && <div style={highlightBadgeStyle}>15% SAVINGS TARGET</div>}
            <div style={statCardHeaderStyle}>
                <span style={{...statIconStyle, color}}>{icon}</span>
                <div>
                    <h3 style={{...statCardTitleStyle, color}}>{title}</h3>
                    {subtitle && <p style={statSubtitleStyle}>{subtitle}</p>}
                </div>
            </div>
            <div style={statCardBodyStyle}>
                <p style={statCardValueStyle}>
                    {value} <span style={statCardUnitStyle}>{unit}</span>
                </p>
                {trend && (
                    <span style={{...trendStyle, color: trend > 0 ? '#10B981' : '#EF4444'}}>
                        {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
        </div>
    );

    // **RESPONSIVE SYSTEM CARD WITH MULTIPLE ACTIONS**
    const ResponsiveSystemCard = ({ system }) => (
        <div key={system.id} style={systemCardStyle(system)} className="system-card">
            <div style={systemCardHeaderStyle}>
                <h3 style={systemCardTitleStyle}>
                    {system.name}
                    <span style={systemTypeStyle(system.type)}>{system.type}</span>
                </h3>
                <div style={systemMetaStyle}>
                    <span style={zoneBadgeStyle}>{system.zone}</span>
                    <span style={statusBadgeStyle(system.status)}>{system.status}</span>
                    {system.energySavingsContribution > 0 && (
                        <span style={savingsBadgeStyle}>
                            +{system.energySavingsContribution.toFixed(1)}% Savings
                        </span>
                    )}
                </div>
            </div>

            <div style={systemBodyStyle}>
                <div style={outputDisplayStyle}>
                    <div style={outputGaugeStyle}>
                        <span style={outputLabelStyle}>Current Output</span>
                        <div style={outputValueStyle}>
                            {system.currentOutput.toFixed(0)}
                            <span style={outputUnitStyle}>kW</span>
                        </div>
                        <div style={outputCapacityStyle}>
                            /{system.capacity} kW capacity
                        </div>
                    </div>
                    <div style={efficiencyRingStyle(system.efficiency)}>
                        <span style={efficiencyValueStyle}>{system.efficiency.toFixed(1)}%</span>
                        <span style={efficiencyLabelStyle}>Efficiency</span>
                    </div>
                </div>

                {/* **15% SAVINGS CONTRIBUTION HIGHLIGHT** */}
                <div style={savingsContributionStyle}>
                    <div style={savingsContributionHeaderStyle}>
                        💰 15% Savings Contribution: <strong>${system.costSavingsDaily.toLocaleString()}/day</strong>
                    </div>
                    <div style={contributionBarStyle}>
                        <div style={{
                            ...contributionFillStyle,
                            width: `${(system.energySavingsContribution / 10) * 100}%`
                        }}></div>
                    </div>
                </div>

                <div style={systemMetricsStyle}>
                    <div style={metricItemStyle}>
                        <span>🌡️ {system.temperature?.toFixed(1) || 'N/A'}°C</span>
                    </div>
                    <div style={metricItemStyle}>
                        <span>🌱 {system.carbonOffset} kg CO₂/day</span>
                    </div>
                    <div style={metricItemStyle}>
                        <span>💰 ROI: {system.roi}%</span>
                    </div>
                    <div style={metricItemStyle}>
                        <span>⚡ {system.energySavingsContribution.toFixed(1)}% Savings</span>
                    </div>
                </div>

                {/* {system.alerts.length > 0 && (
                    <div style={alertsContainerStyle}>
                        <h4 style={alertsHeaderStyle}>⚠️ System Alerts</h4>
                        {system.alerts.map((alert, index) => (
                            <div key={index} style={alertItemStyle}>
                                {alert}
                            </div>
                        ))}
                    </div>
                )} */}
            </div>

            {/* **ENHANCED RESPONSIVE BUTTON GROUP** */}
            <div style={enhancedButtonGroupStyle}>
                <button 
                    onClick={() => setSelectedSystem(system)}
                    style={responsiveButtonStyle('primary')}
                    className="action-button"
                >
                    📊 Details
                </button>
                
                <button 
                    onClick={() => handleOptimizeSystem(system.id)}
                    style={responsiveButtonStyle('success')}
                    disabled={system.efficiency > 95 || isLoading}
                    className="action-button"
                >
                    {system.efficiency > 95 ? '✓ Optimized' : '⚡ Optimize'}
                </button>
                
                <button 
                    onClick={() => handleScheduleMaintenance(system.id)}
                    style={responsiveButtonStyle('warning')}
                    disabled={system.status.includes('Scheduled') || isLoading}
                    className="action-button"
                >
                    {system.status.includes('Scheduled') ? '⏰ Scheduled' : '🔧 Maintenance'}
                </button>
                
                {system.status === 'Shutdown' ? (
                    <button 
                        onClick={() => handleRestartSystem(system.id)}
                        style={responsiveButtonStyle('info')}
                        disabled={isLoading}
                        className="action-button"
                    >
                        🔄 Restart
                    </button>
                ) : (
                    <button 
                        onClick={() => handleShutdownSystem(system.id)}
                        style={responsiveButtonStyle('danger')}
                        disabled={isLoading}
                        className="action-button"
                    >
                        🛑 Shutdown
                    </button>
                )}
                
                <button 
                    onClick={() => handleUpgradeSystem(system.id)}
                    style={responsiveButtonStyle('premium')}
                    disabled={isLoading}
                    className="action-button"
                >
                    ⬆️ Upgrade
                </button>
            </div>
        </div>
    );

    // Main render
    return (
    <div 
      className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 animate-fade-in"
      style={{ backgroundColor: '#FBF3D1' }}
    >
            <audio ref={audioRef} preload="auto">
                <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DDrGkfCjaHzO3CbCUEMo/Y9c14LQUheMeqxNmObwwKaZ0s12BfAZyA9qzmnD4wBhU58O7CfA0FJYX26E1AYghQm8RdH0qnQ0LjOLPFZn4M7h6XfHhWaDADYQDCEBcJRBc0sJBhPz9yAhV4dEQ9Q2Uie6mNZihIeqwRdXbNz8" type="audio/wav" />
            </audio>

            {/* **ENHANCED LOADING OVERLAY WITH 15% PROGRESS** */}
            {isLoading && (
                <div style={enhancedLoadingOverlayStyle}>
                    <div style={loadingContentStyle}>
                        <div style={loadingSpinnerStyle}></div>
                        <h3>🎯 Optimizing for 15% Energy Savings</h3>
                        <p>Processing energy efficiency improvements...</p>
                        <div style={loadingProgressStyle}>
                            <div style={loadingProgressFillStyle}></div>
                        </div>
                    </div>
                </div>
            )}

            {/* **ENHANCED HEADER WITH 15% SAVINGS EMPHASIS** */}
            <header style={enhancedHeaderStyle}>
                <div style={headerContentStyle}>
                    <div>
                        <h1 style={enhancedHeaderTitleStyle}>
                            🎯 Renewable Energy Integration: 15% SAVINGS ACHIEVED
                        </h1>
                        <p style={enhancedHeaderSubtitleStyle}>
                            Mining Energy Reduction: 50% → 35% | Annual Savings: ${(savingsMetrics.annualProjection/1000000).toFixed(1)}M | Grid Independence: {stats.gridIndependence}%
                        </p>
                    </div>
                    <div style={headerButtonsStyle}>
                        <button 
                            style={{...viewButtonStyle, ...(dashboardView === 'overview' ? activeViewButtonStyle : {})}}
                            onClick={() => setDashboardView('overview')}
                        >
                            📊 15% Savings Overview
                        </button>
                        <button 
                            style={{...viewButtonStyle, ...(dashboardView === 'systems' ? activeViewButtonStyle : {})}}
                            onClick={() => setDashboardView('systems')}
                        >
                            ⚡ Energy Systems
                        </button>
                        <button 
                            style={{...viewButtonStyle, ...(dashboardView === 'analytics' ? activeViewButtonStyle : {})}}
                            onClick={() => setDashboardView('analytics')}
                        >
                            📈 Savings Analytics
                        </button>
                        {/* <button 
                            style={{...viewButtonStyle, ...(dashboardView === 'alerts' ? activeViewButtonStyle : {})}}
                            onClick={() => setDashboardView('alerts')}
                        >
                            🚨 System Alerts
                        </button> */}
                    </div>
                </div>
            </header>

            {/* **15% SAVINGS HIGHLIGHT SECTION** */}
            <SavingsHighlight />

            {/* **ENHANCED STATS WITH 15% FOCUS** */}
            <section style={statsSectionStyle}>
                <EnhancedStatCard 
                    title="Energy Savings Achieved" 
                    value={savingsMetrics.currentSavings.toFixed(1)} 
                    unit="% / 15%" 
                    icon="🎯" 
                    color="#10B981"
                    trend={2.3}
                    subtitle="Target 15% reduction achieved"
                    isHighlight={true}
                />
                <EnhancedStatCard 
                    title="Daily Cost Savings" 
                    value={`$${(savingsMetrics.dailyCostSavings/1000).toFixed(0)}K`}
                    unit="/day" 
                    icon="💰" 
                    color="#F59E0B"
                    trend={8.5}
                    subtitle="From energy optimization"
                    isHighlight={true}
                />
                <EnhancedStatCard 
                    title="Total Generation" 
                    value={stats.totalOutput} 
                    unit="kW" 
                    icon="⚡" 
                    color="#3B82F6"
                    trend={5.2}
                    subtitle="Current renewable output"
                />
                <EnhancedStatCard 
                    title="System Efficiency" 
                    value={stats.avgEfficiency} 
                    unit="%" 
                    icon="📊" 
                    color="#8B5CF6"
                    trend={3.1}
                    subtitle="Average performance"
                />
                <EnhancedStatCard 
                    title="Carbon Offset" 
                    value={`${(parseFloat(stats.totalCarbonOffset)/1000).toFixed(1)}T`}
                    unit="CO₂/day" 
                    icon="🌱" 
                    color="#10B981"
                    trend={12.4}
                    subtitle="Environmental impact"
                />
                <EnhancedStatCard 
                    title="Grid Independence" 
                    value={stats.gridIndependence} 
                    unit="%" 
                    icon="🏭" 
                    color="#EF4444"
                    trend={-2.1}
                    subtitle="Self-sufficiency level"
                />
            </section>

            {/* **DASHBOARD CONTENT WITH FIXED SYSTEM BUTTON** */}
            {dashboardView === 'overview' && (
                <>
                    {/* Charts and Analytics */}
                    <section style={chartsSectionStyle}>
                        <h2 style={sectionHeaderStyle}>📊 15% Energy Savings Performance Analytics</h2>
                        <div style={chartsGridStyle}>
                            <div style={chartCardStyle}>
                                <h3>💰 15% Savings Progress Tracking</h3>
                                <Line 
                                    data={{
                                        labels: energyData[0]?.historicalData.slice(-7).map(d => d.date) || [],
                                        datasets: [
                                            {
                                                label: 'Energy Savings %',
                                                data: energyData[0]?.historicalData.slice(-7).map(d => d.energySavings) || [],
                                                borderColor: '#10B981',
                                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                                tension: 0.4,
                                                fill: true
                                            },
                                            {
                                                label: 'Target 15%',
                                                data: Array(7).fill(15),
                                                borderColor: '#EF4444',
                                                borderDash: [5, 5],
                                                fill: false
                                            }
                                        ]
                                    }} 
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            title: { display: true, text: '15% Energy Reduction Target Progress' }
                                        },
                                        scales: { y: { beginAtZero: true, max: 20 } }
                                    }} 
                                />
                            </div>
                            
                            <div style={chartCardStyle}>
                                <h3>💵 Daily Cost Savings Trend</h3>
                                <Bar 
                                    data={{
                                        labels: energyData[0]?.historicalData.slice(-7).map(d => d.date) || [],
                                        datasets: [{
                                            label: 'Daily Savings ($)',
                                            data: energyData[0]?.historicalData.slice(-7).map(d => d.costSavings) || [],
                                            backgroundColor: 'rgba(249, 115, 22, 0.8)',
                                            borderColor: 'rgba(249, 115, 22, 1)',
                                            borderWidth: 2
                                        }]
                                    }} 
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            title: { display: true, text: 'Financial Impact of Energy Optimization' }
                                        }
                                    }} 
                                />
                            </div>

                            <div style={chartCardStyle}>
                                <h3>🔋 Energy Source Distribution</h3>
                                <Doughnut 
                                    data={{
                                        labels: Object.values(ENERGY_SOURCES),
                                        datasets: [{
                                            data: Object.values(ENERGY_SOURCES).map(type => 
                                                energyData
                                                    .filter(system => system.type === type)
                                                    .reduce((sum, system) => sum + system.currentOutput, 0)
                                            ),
                                            backgroundColor: [
                                                '#F97316', '#06B6D4', '#3B82F6', '#10B981', '#F59E0B'
                                            ],
                                            borderWidth: 3,
                                            borderColor: '#fff'
                                        }]
                                    }} 
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            title: { display: true, text: 'Current Renewable Energy Mix' }
                                        }
                                    }} 
                                />
                            </div>

                            <div style={chartCardStyle}>
                                <h3>📈 Efficiency vs Savings Correlation</h3>
                                <Bar 
                                    data={{
                                        labels: energyData.map(system => system.name),
                                        datasets: [
                                            {
                                                label: 'System Efficiency (%)',
                                                data: energyData.map(system => system.efficiency),
                                                backgroundColor: 'rgba(139, 92, 246, 0.8)',
                                                yAxisID: 'y'
                                            },
                                            {
                                                label: 'Savings Contribution (%)',
                                                data: energyData.map(system => system.energySavingsContribution),
                                                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                                                yAxisID: 'y1'
                                            }
                                        ]
                                    }} 
                                    options={{
                                        responsive: true,
                                        scales: {
                                            y: { type: 'linear', display: true, position: 'left' },
                                            y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false } }
                                        }
                                    }} 
                                />
                            </div>
                        </div>
                    </section>
                </>
            )}

            {dashboardView === 'systems' && (
                <>
                    {/* **ENHANCED CONTROLS** */}
                    <section style={enhancedControlsSectionStyle}>
                        <div style={controlsRowStyle}>
                            <div>
                                <label style={labelStyle}>🔍 Search Systems:</label>
                                <input
                                    type="text"
                                    placeholder="Search by name or ID..."
                                    style={inputStyle}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>⚡ Energy Type:</label>
                                <select style={selectStyle} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                    <option value="All">All Types</option>
                                    {Object.values(ENERGY_SOURCES).map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>📍 Mining Zone:</label>
                                <select style={selectStyle} value={filterZone} onChange={(e) => setFilterZone(e.target.value)}>
                                    <option value="All">All Zones</option>
                                    {Object.values(MINING_ZONES).map(zone => (
                                        <option key={zone} value={zone}>{zone}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div style={globalActionsStyle}>
                            <button 
                                style={globalActionButtonStyle('primary')}
                                onClick={handleGlobalOptimization}
                                disabled={isLoading}
                            >
                                🚀 Global Optimization
                            </button>
                            <button 
                                style={globalActionButtonStyle('success')}
                                onClick={() => {
                                    setIsLoading(true);
                                    setTimeout(() => {
                                        addNotification('📊 All systems refreshed successfully', 'success');
                                        setIsLoading(false);
                                    }, 1000);
                                }}
                            >
                                🔄 Refresh All Systems
                            </button>
                            <button 
                                style={globalActionButtonStyle('info')}
                                onClick={() => addNotification('📋 Generating comprehensive system report...', 'info')}
                            >
                                📋 System Report
                            </button>
                        </div>
                    </section>

                    {/* **ENHANCED SYSTEMS GRID** */}
                    <section style={systemsListSectionStyle}>
                        <h2 style={sectionHeaderStyle}>
                            ⚡ Renewable Energy Systems Contributing to 15% Savings ({filteredData.length} systems)
                        </h2>
                        <div style={systemsGridStyle}>
                            {filteredData.length > 0 ? (
                                filteredData.map((system) => (
                                    <ResponsiveSystemCard key={system.id} system={system} />
                                ))
                            ) : (
                                <div style={noResultsStyle}>
                                    <p>🔍 No systems match the current filters</p>
                                    <button 
                                        style={clearFiltersButtonStyle}
                                        onClick={() => {setFilterType('All'); setFilterZone('All'); setSearchTerm('');}}
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}

            {dashboardView === 'analytics' && (
                <section style={analyticsContainerStyle}>
                    <h2 style={sectionHeaderStyle}>📈 Advanced 15% Savings Analytics</h2>
                    <div style={analyticsGridStyle}>
                        {/* Enhanced analytics charts focusing on 15% savings */}
                        <div style={chartCardStyle}>
                            <h3>🎯 15% Savings Achievement Timeline</h3>
                            <Line data={{
                                labels: energyData[0]?.historicalData.map(d => d.date) || [],
                                datasets: [{
                                    label: 'Cumulative Savings %',
                                    data: energyData[0]?.historicalData.map((d, i) => Math.min(15, (i / 30) * 15)) || [],
                                    borderColor: '#10B981',
                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                    fill: true
                                }]
                            }} />
                        </div>
                        
                        <div style={chartCardStyle}>
                            <h3>💰 ROI Analysis with 15% Savings</h3>
                            <Bar data={{
                                labels: energyData.map(system => system.name),
                                datasets: [{
                                    label: 'Enhanced ROI (%)',
                                    data: energyData.map(system => system.roi + (system.energySavingsContribution * 2)),
                                    backgroundColor: 'rgba(245, 158, 11, 0.8)'
                                }]
                            }} />
                        </div>
                    </div>
                </section>
            )}

            {/* {dashboardView === 'alerts' && (
                <div style={notificationPanelStyle}>
                    <h3 style={notificationHeaderStyle}>
                        🔔 System Alerts & 15% Savings Updates ({notifications.length})
                    </h3>
                    <div style={notificationListStyle}>
                        {notifications.length === 0 ? (
                            <p style={noNotificationsStyle}>All systems operating optimally for 15% savings target</p>
                        ) : (
                            notifications.map(notification => (
                                <div 
                                    key={notification.id} 
                                    style={{
                                        ...notificationItemStyle,
                                        borderLeft: `4px solid ${getNotificationColor(notification.type)}`
                                    }}
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
            )} */}

            {/* **ENHANCED SYSTEM DETAIL MODAL** */}
            {selectedSystem && (
                <div style={modalOverlayStyle} onClick={() => setSelectedSystem(null)}>
                    <div style={enhancedModalContentStyle} onClick={e => e.stopPropagation()}>
                        <div style={modalHeaderStyle}>
                            <h2>{selectedSystem.name} - 15% Savings Contribution</h2>
                            <button 
                                style={closeButtonStyle}
                                onClick={() => setSelectedSystem(null)}
                            >
                                ✕
                            </button>
                        </div>
                        <div style={modalBodyStyle}>
                            <div style={savingsModalHighlightStyle}>
                                <h3>💰 15% Savings Impact</h3>
                                <div style={modalStatsGridStyle}>
                                    <div style={modalStatItemStyle}>
                                        <span>Daily Savings</span>
                                        <strong>${selectedSystem.costSavingsDaily.toLocaleString()}</strong>
                                    </div>
                                    <div style={modalStatItemStyle}>
                                        <span>Savings Contribution</span>
                                        <strong>{selectedSystem.energySavingsContribution.toFixed(1)}%</strong>
                                    </div>
                                    <div style={modalStatItemStyle}>
                                        <span>Enhanced ROI</span>
                                        <strong>{selectedSystem.roi}%</strong>
                                    </div>
                                    <div style={modalStatItemStyle}>
                                        <span>Annual Impact</span>
                                        <strong>${(selectedSystem.costSavingsDaily * 365 / 1000000).toFixed(1)}M</strong>
                                    </div>
                                </div>
                            </div>
                            
                            <div style={modalStatsGridStyle}>
                                <div style={modalStatItemStyle}>
                                    <span>Current Output</span>
                                    <strong>{selectedSystem.currentOutput.toFixed(0)} kW</strong>
                                </div>
                                <div style={modalStatItemStyle}>
                                    <span>Efficiency</span>
                                    <strong>{selectedSystem.efficiency.toFixed(1)}%</strong>
                                </div>
                                <div style={modalStatItemStyle}>
                                    <span>Carbon Offset</span>
                                    <strong>{selectedSystem.carbonOffset} kg CO₂/day</strong>
                                </div>
                                <div style={modalStatItemStyle}>
                                    <span>Status</span>
                                    <strong>{selectedSystem.status}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // **HELPER FUNCTION FOR NOTIFICATIONS**
    const getNotificationColor = (type) => {
        switch(type) {
            case 'critical': return '#EF4444';
            case 'warning': return '#F59E0B';
            case 'success': return '#10B981';
            default: return '#3B82F6';
        }
    };
};

// --- **ENHANCED STYLING WITH 15% SAVINGS FOCUS** ---

const dashboardContainerStyle = {
    fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
    padding: '20px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    position: 'relative'
};

// **15% SAVINGS HIGHLIGHT STYLES**
const savingsHighlightStyle = {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
};

const savingsHeaderStyle = {
    textAlign: 'center',
    marginBottom: '32px'
};

const savingsMainTitleStyle = {
    fontSize: '3em',
    fontWeight: '900',
    margin: '0 0 16px 0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    animation: 'pulse 2s infinite'
};

const savingsSubtitleStyle = {
    fontSize: '1.3em',
    fontWeight: '600',
    opacity: '0.95',
    margin: '0'
};

const savingsMetricsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
};

const savingsMetricCardStyle = (variant) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    padding: '24px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease'
});

const savingsMetricHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px'
};

const savingsIconStyle = {
    fontSize: '2em',
    marginRight: '12px'
};

const savingsValueContainerStyle = {
    marginBottom: '12px'
};

const savingsLargeValueStyle = {
    fontSize: '2.5em',
    fontWeight: '900',
    display: 'block',
    lineHeight: '1'
};

const savingsTargetStyle = {
    fontSize: '0.9em',
    opacity: '0.8',
    fontWeight: '500'
};

const savingsProgressBarStyle = {
    height: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    overflow: 'hidden'
};

const savingsProgressFillStyle = {
    height: '100%',
    backgroundColor: '#FBBF24',
    borderRadius: '4px',
    transition: 'width 1s ease-out'
};

const savingsActionButtonsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap'
};

const globalOptimizeButtonStyle = {
    padding: '16px 32px',
    fontSize: '1.2em',
    fontWeight: '700',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#FBBF24',
    color: '#1F2937',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(251, 191, 36, 0.4)',
    animation: 'bounce 1s infinite'
};

const savingsReportButtonStyle = {
    padding: '16px 32px',
    fontSize: '1.1em',
    fontWeight: '600',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
};

// **ENHANCED LOADING STYLES**
const enhancedLoadingOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    color: 'white'
};

const loadingContentStyle = {
    textAlign: 'center',
    padding: '40px',
    borderRadius: '16px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(16, 185, 129, 0.3)'
};

const loadingSpinnerStyle = {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(16, 185, 129, 0.3)',
    borderTop: '4px solid #10B981',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
    margin: '0 auto 20px auto'
};

const loadingProgressStyle = {
    width: '200px',
    height: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    overflow: 'hidden',
    margin: '20px auto 0'
};

const loadingProgressFillStyle = {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: '4px',
    animation: 'loading 2s ease-in-out infinite'
};

// **ENHANCED HEADER STYLES**
const enhancedHeaderStyle = {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 15px 35px rgba(16, 185, 129, 0.3)',
    color: 'white'
};

const headerContentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px'
};

const enhancedHeaderTitleStyle = {
    margin: '0 0 12px 0',
    fontSize: '2.8em',
    fontWeight: '900',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    animation: 'glow 2s ease-in-out infinite alternate'
};

const enhancedHeaderSubtitleStyle = {
    margin: '0',
    fontSize: '1.2em',
    opacity: '0.95',
    fontWeight: '500'
};

const headerButtonsStyle = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
};

const viewButtonStyle = {
    padding: '14px 24px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    fontSize: '0.95em'
};

const activeViewButtonStyle = {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderColor: 'rgba(255,255,255,0.8)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
};

// **ENHANCED STATS STYLES**
const statsSectionStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
};

const energyStatCardStyle = {
    padding: '28px',
    borderRadius: '18px',
    backgroundColor: '#ffffff',
    boxShadow: '0 6px 25px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
};

const highlightCardStyle = {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: 'white',
    transform: 'scale(1.02)',
    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
};

const highlightBadgeStyle = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#FBBF24',
    color: '#1F2937',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.7em',
    fontWeight: '700'
};

const statCardHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '18px'
};

const statIconStyle = {
    fontSize: '2.2em',
    marginRight: '16px'
};

const statCardTitleStyle = {
    margin: '0 0 4px 0',
    fontSize: '1.1em',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const statSubtitleStyle = {
    margin: '0',
    fontSize: '0.85em',
    opacity: '0.7',
    fontWeight: '400'
};

const statCardBodyStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const statCardValueStyle = {
    margin: '0',
    fontSize: '2.4em',
    fontWeight: '800',
    lineHeight: '1'
};

const statCardUnitStyle = {
    fontSize: '0.4em',
    fontWeight: '400',
    opacity: '0.7',
    marginLeft: '4px'
};

const trendStyle = {
    fontSize: '1em',
    fontWeight: '700'
};

// **ENHANCED CONTROLS STYLES**
const enhancedControlsSectionStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '28px',
    marginBottom: '32px',
    boxShadow: '0 6px 25px rgba(0,0,0,0.1)'
};

const controlsRowStyle = {
    display: 'flex',
    gap: '28px',
    marginBottom: '24px',
    alignItems: 'center',
    flexWrap: 'wrap'
};

const globalActionsStyle = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap'
};

const labelStyle = {
    fontWeight: '700',
    marginRight: '12px',
    color: '#1F2937',
    fontSize: '0.95em'
};

const selectStyle = {
    padding: '14px 18px',
    borderRadius: '10px',
    border: '2px solid #E5E7EB',
    backgroundColor: '#ffffff',
    fontSize: '0.95em',
    fontWeight: '500',
    minWidth: '180px',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
};

const inputStyle = {
    padding: '14px 18px',
    borderRadius: '10px',
    border: '2px solid #E5E7EB',
    backgroundColor: '#ffffff',
    fontSize: '0.95em',
    width: '300px',
    transition: 'all 0.3s ease'
};

const globalActionButtonStyle = (variant) => {
    const variants = {
        primary: { bg: '#3B82F6', hover: '#2563EB' },
        success: { bg: '#10B981', hover: '#059669' },
        info: { bg: '#06B6D4', hover: '#0891B2' }
    };
    
    return {
        padding: '12px 24px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: variants[variant].bg,
        color: 'white',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '0.95em'
    };
};

// **ENHANCED SYSTEM CARD STYLES**
const systemsListSectionStyle = {
    padding: '28px',
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    boxShadow: '0 6px 25px rgba(0,0,0,0.1)'
};

const sectionHeaderStyle = {
    color: '#1F2937',
    marginBottom: '28px',
    fontSize: '2em',
    fontWeight: '800',
    borderBottom: '3px solid #E5E7EB',
    paddingBottom: '16px'
};

const systemsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
    gap: '28px'
};

const systemCardStyle = (system) => ({
    borderLeft: `8px solid ${getSystemColor(system.type)}`,
    padding: '28px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #F3F4F6'
});

const getSystemColor = (type) => {
    switch (type) {
        case ENERGY_SOURCES.SOLAR: return '#F97316';
        case ENERGY_SOURCES.WIND: return '#06B6D4';
        case ENERGY_SOURCES.BATTERY: return '#3B82F6';
        case ENERGY_SOURCES.HYBRID: return '#10B981';
        default: return '#8B5CF6';
    }
};

const systemCardHeaderStyle = {
    marginBottom: '24px'
};

const systemCardTitleStyle = {
    margin: '0 0 12px 0',
    fontSize: '1.4em',
    fontWeight: '800',
    color: '#1F2937',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const systemTypeStyle = (type) => ({
    fontSize: '0.7em',
    padding: '6px 12px',
    backgroundColor: getSystemColor(type),
    color: 'white',
    borderRadius: '16px',
    fontWeight: '700',
    textTransform: 'uppercase'
});

const systemMetaStyle = {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
};

const zoneBadgeStyle = {
    padding: '6px 12px',
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
    borderRadius: '8px',
    fontSize: '0.8em',
    fontWeight: '600'
};

const statusBadgeStyle = (status) => ({
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.8em',
    fontWeight: '600',
    backgroundColor: status === 'Operational' || status === 'AI-Optimized' || status === 'Peak Performance' ? '#D1FAE5' : 
                    status.includes('Maintenance') ? '#FEF3C7' : 
                    status.includes('Shutdown') ? '#FEE2E2' : '#E0F2FE',
    color: status === 'Operational' || status === 'AI-Optimized' || status === 'Peak Performance' ? '#065F46' :
           status.includes('Maintenance') ? '#92400E' :
           status.includes('Shutdown') ? '#991B1B' : '#0C4A6E'
});

const savingsBadgeStyle = {
    padding: '6px 12px',
    backgroundColor: '#10B981',
    color: 'white',
    borderRadius: '8px',
    fontSize: '0.8em',
    fontWeight: '700',
    animation: 'pulse 2s infinite'
};

const systemBodyStyle = {
    marginBottom: '24px'
};

const outputDisplayStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    padding: '24px',
    backgroundColor: '#F8FAFC',
    borderRadius: '14px'
};

const outputGaugeStyle = {
    flex: 1
};

const outputLabelStyle = {
    fontSize: '0.9em',
    color: '#64748B',
    fontWeight: '600',
    marginBottom: '4px'
};

const outputValueStyle = {
    fontSize: '2.8em',
    fontWeight: '800',
    color: '#1F2937',
    lineHeight: '1'
};

const outputUnitStyle = {
    fontSize: '0.35em',
    color: '#64748B',
    marginLeft: '6px'
};

const outputCapacityStyle = {
    fontSize: '0.85em',
    color: '#64748B',
    marginTop: '6px'
};

const efficiencyRingStyle = (efficiency) => ({
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: `conic-gradient(${efficiency >= 90 ? '#10B981' : efficiency >= 75 ? '#F59E0B' : '#EF4444'} ${efficiency * 3.6}deg, #E5E7EB 0deg)`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
});

const efficiencyValueStyle = {
    fontSize: '1.3em',
    fontWeight: '800',
    color: '#1F2937'
};

const efficiencyLabelStyle = {
    fontSize: '0.7em',
    color: '#64748B',
    fontWeight: '600'
};

// **15% SAVINGS CONTRIBUTION STYLES**
const savingsContributionStyle = {
    padding: '16px',
    backgroundColor: '#F0FDF4',
    borderRadius: '12px',
    border: '2px solid #10B981',
    marginBottom: '20px'
};

const savingsContributionHeaderStyle = {
    fontSize: '0.95em',
    fontWeight: '700',
    color: '#065F46',
    marginBottom: '8px'
};

const contributionBarStyle = {
    height: '8px',
    backgroundColor: '#D1FAE5',
    borderRadius: '4px',
    overflow: 'hidden'
};

const contributionFillStyle = {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: '4px',
    transition: 'width 1s ease-out'
};

const systemMetricsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginBottom: '20px'
};

const metricItemStyle = {
    padding: '10px 14px',
    backgroundColor: '#F1F5F9',
    borderRadius: '8px',
    fontSize: '0.85em',
    fontWeight: '600',
    color: '#475569'
};

const alertsContainerStyle = {
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: '#FEF7CD',
    borderRadius: '10px',
    border: '1px solid #FBBF24'
};

const alertsHeaderStyle = {
    margin: '0 0 10px 0',
    fontSize: '0.9em',
    color: '#92400E',
    fontWeight: '700'
};

const alertItemStyle = {
    fontSize: '0.8em',
    color: '#92400E',
    marginBottom: '6px',
    fontWeight: '500'
};

// **ENHANCED RESPONSIVE BUTTON STYLES**
const enhancedButtonGroupStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '10px'
};

const responsiveButtonStyle = (variant) => {
    const variants = {
        primary: { bg: '#3B82F6', hover: '#2563EB', color: 'white' },
        success: { bg: '#10B981', hover: '#059669', color: 'white' },
        warning: { bg: '#F59E0B', hover: '#D97706', color: 'white' },
        danger: { bg: '#EF4444', hover: '#DC2626', color: 'white' },
        info: { bg: '#06B6D4', hover: '#0891B2', color: 'white' },
        premium: { bg: '#8B5CF6', hover: '#7C3AED', color: 'white' }
    };
    
    return {
        padding: '12px 16px',
        border: 'none',
        borderRadius: '10px',
        fontWeight: '600',
        fontSize: '0.85em',
        cursor: 'pointer',
        backgroundColor: variants[variant].bg,
        color: variants[variant].color,
        transition: 'all 0.2s ease',
        textAlign: 'center',
        minHeight: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };
};

// **MODAL ENHANCEMENTS**
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
};

const enhancedModalContentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    maxWidth: '1200px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
};

const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '28px',
    borderBottom: '2px solid #E5E7EB',
    backgroundColor: '#F8FAFC'
};

const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.8em',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    color: '#6B7280'
};

const modalBodyStyle = {
    padding: '28px'
};

const savingsModalHighlightStyle = {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
    color: 'white'
};

const modalStatsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px'
};

const modalStatItemStyle = {
    padding: '18px',
    backgroundColor: '#F8FAFC',
    borderRadius: '10px',
    textAlign: 'center',
    border: '2px solid #E5E7EB'
};

// **NOTIFICATION STYLES**
const notificationPanelStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '28px',
    boxShadow: '0 6px 25px rgba(0,0,0,0.1)',
    maxHeight: '700px',
    overflow: 'hidden'
};

const notificationHeaderStyle = {
    margin: '0 0 24px 0',
    fontSize: '1.6em',
    fontWeight: '800',
    color: '#1F2937'
};

const notificationListStyle = {
    maxHeight: '600px',
    overflowY: 'auto',
    paddingRight: '10px'
};

const noNotificationsStyle = {
    textAlign: 'center',
    color: '#64748B',
    fontStyle: 'italic',
    padding: '50px 0',
    fontSize: '1.1em'
};

const notificationItemStyle = {
    padding: '16px 20px',
    marginBottom: '14px',
    backgroundColor: '#F8FAFC',
    borderRadius: '10px',
    transition: 'all 0.3s ease'
};

const notificationContentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '14px'
};

const notificationMessageStyle = {
    fontSize: '0.95em',
    fontWeight: '600',
    color: '#374151',
    flex: 1
};

const notificationTimeStyle = {
    fontSize: '0.8em',
    color: '#9CA3AF',
    whiteSpace: 'nowrap'
};

// **ANALYTICS AND CHARTS**
const chartsSectionStyle = {
    marginBottom: '32px'
};

const chartsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(550px, 1fr))',
    gap: '28px'
};

const chartCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '28px',
    boxShadow: '0 6px 25px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
};

const analyticsContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '28px',
    boxShadow: '0 6px 25px rgba(0,0,0,0.1)'
};

const analyticsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '28px'
};

const noResultsStyle = {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '80px 20px',
    color: '#64748B',
    fontSize: '1.2em'
};

const clearFiltersButtonStyle = {
    padding: '12px 24px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#3B82F6',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px'
};

// **CSS ANIMATIONS**
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
    }
    
    @keyframes glow {
        0% { text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        100% { text-shadow: 2px 2px 20px rgba(255,255,255,0.5); }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
    }
    
    @keyframes loading {
        0% { width: 0%; }
        50% { width: 70%; }
        100% { width: 100%; }
    }
    
    .energy-stat-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.15);
    }
    
    .system-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 35px rgba(0,0,0,0.15);
    }
    
    .action-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(0,0,0,0.2);
    }
    
    .action-button:active {
        transform: translateY(0px);
    }
    
    input:focus, select:focus {
        border-color: #10B981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        outline: none;
    }
    
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
`;
document.head.appendChild(style);

export default EnhancedRenewableEnergyDashboard;
