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
import { Line, Bar, Doughnut, Radar, Scatter } from 'react-chartjs-2';

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

// --- SIMULATION CONFIGURATION & UTILITIES ---
const EQUIPMENT_TYPES = {
    CRUSHER: 'Crusher',
    MILL: 'Mill',
    CONVEYOR: 'Conveyor',
    PUMP: 'Pump',
    SEPARATOR: 'Separator',
    SCREEN: 'Screen',
    FEEDER: 'Feeder',
    COMPRESSOR: 'Compressor'
};

const MATERIAL_TYPES = {
    IRON_ORE: 'Iron Ore',
    COPPER_ORE: 'Copper Ore',
    GOLD_ORE: 'Gold Ore', 
    LIMESTONE: 'Limestone',
    COAL: 'Coal',
    GRANITE: 'Granite'
};

const SIMULATION_MODES = {
    STEADY_STATE: 'Steady State',
    DYNAMIC: 'Dynamic',
    OPTIMIZATION: 'Optimization',
    SCENARIO_ANALYSIS: 'Scenario Analysis'
};

const getRandomFloat = (min, max, decimals = 2) => 
    parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Equipment icons and colors
const getEquipmentIcon = (type) => {
    const icons = {
        [EQUIPMENT_TYPES.CRUSHER]: '🔨',
        [EQUIPMENT_TYPES.MILL]: '⚙️',
        [EQUIPMENT_TYPES.CONVEYOR]: '🔗',
        [EQUIPMENT_TYPES.PUMP]: '💧',
        [EQUIPMENT_TYPES.SEPARATOR]: '🌀',
        [EQUIPMENT_TYPES.SCREEN]: '📊',
        [EQUIPMENT_TYPES.FEEDER]: '📥',
        [EQUIPMENT_TYPES.COMPRESSOR]: '💨'
    };
    return icons[type] || '⚙️';
};

const getEquipmentColor = (type) => {
    const colors = {
        [EQUIPMENT_TYPES.CRUSHER]: '#EF4444',
        [EQUIPMENT_TYPES.MILL]: '#8B5CF6',
        [EQUIPMENT_TYPES.CONVEYOR]: '#06B6D4',
        [EQUIPMENT_TYPES.PUMP]: '#3B82F6',
        [EQUIPMENT_TYPES.SEPARATOR]: '#10B981',
        [EQUIPMENT_TYPES.SCREEN]: '#F59E0B',
        [EQUIPMENT_TYPES.FEEDER]: '#EC4899',
        [EQUIPMENT_TYPES.COMPRESSOR]: '#6B7280'
    };
    return colors[type] || '#6B7280';
};

// --- EQUIPMENT PARAMETER TEMPLATES ---
const getEquipmentDefaults = (type) => {
    const defaults = {
        [EQUIPMENT_TYPES.CRUSHER]: {
            capacity: 1000,
            powerRating: 500,
            efficiency: 85,
            gapeSize: 150,
            compressionRatio: 4,
            wearRate: 0.5,
            maintenanceInterval: 720,
            operatingTemperature: 45,
            vibrationLevel: 3.2,
            noiseLevel: 85
        },
        [EQUIPMENT_TYPES.MILL]: {
            capacity: 800,
            powerRating: 2500,
            efficiency: 82,
            millSpeed: 75,
            ballCharge: 35,
            pulpDensity: 70,
            wearRate: 0.3,
            maintenanceInterval: 1440,
            operatingTemperature: 65,
            vibrationLevel: 2.8,
            noiseLevel: 92
        },
        [EQUIPMENT_TYPES.CONVEYOR]: {
            capacity: 2000,
            powerRating: 150,
            efficiency: 95,
            beltSpeed: 2.5,
            beltWidth: 1.2,
            inclination: 15,
            wearRate: 0.1,
            maintenanceInterval: 2160,
            operatingTemperature: 35,
            vibrationLevel: 1.5,
            noiseLevel: 65
        },
        [EQUIPMENT_TYPES.PUMP]: {
            capacity: 500,
            powerRating: 300,
            efficiency: 78,
            flowRate: 350,
            headPressure: 85,
            impellerSpeed: 1800,
            wearRate: 0.4,
            maintenanceInterval: 1080,
            operatingTemperature: 55,
            vibrationLevel: 2.2,
            noiseLevel: 70
        }
    };
    return defaults[type] || defaults[EQUIPMENT_TYPES.CRUSHER];
};

// --- INITIAL SIMULATION DATA ---
const initialSimulationData = {
    equipment: [
        {
            id: 'EQUIP_001',
            name: 'Primary Jaw Crusher',
            type: EQUIPMENT_TYPES.CRUSHER,
            material: MATERIAL_TYPES.IRON_ORE,
            parameters: {
                ...getEquipmentDefaults(EQUIPMENT_TYPES.CRUSHER),
                capacity: 1200,
                efficiency: 87
            },
            position: { x: 150, y: 200 },
            connections: ['EQUIP_002'],
            status: 'Active',
            simulationResults: {
                throughput: 1050,
                powerConsumption: 445,
                wearProgress: 15.5,
                vibrationActual: 3.4,
                temperatureActual: 47.2,
                efficiency: 87.5
            }
        },
        {
            id: 'EQUIP_002', 
            name: 'Primary Conveyor',
            type: EQUIPMENT_TYPES.CONVEYOR,
            material: MATERIAL_TYPES.IRON_ORE,
            parameters: {
                ...getEquipmentDefaults(EQUIPMENT_TYPES.CONVEYOR),
                capacity: 1500,
                beltSpeed: 3.0
            },
            position: { x: 400, y: 200 },
            connections: ['EQUIP_003'],
            status: 'Active',
            simulationResults: {
                throughput: 1050,
                powerConsumption: 125,
                wearProgress: 8.2,
                vibrationActual: 1.3,
                temperatureActual: 32.8,
                efficiency: 96.2
            }
        },
        {
            id: 'EQUIP_003',
            name: 'Ball Mill',
            type: EQUIPMENT_TYPES.MILL,
            material: MATERIAL_TYPES.IRON_ORE,
            parameters: {
                ...getEquipmentDefaults(EQUIPMENT_TYPES.MILL),
                capacity: 900,
                efficiency: 84
            },
            position: { x: 650, y: 200 },
            connections: [],
            status: 'Active',
            simulationResults: {
                throughput: 850,
                powerConsumption: 2100,
                wearProgress: 12.3,
                vibrationActual: 2.9,
                temperatureActual: 68.5,
                efficiency: 84.2
            }
        }
    ],
    globalParameters: {
        simulationTime: 24,
        timeStep: 0.1,
        temperature: 25,
        humidity: 65,
        ambientPressure: 101.3,
        materialDensity: 2.7,
        materialHardness: 6.5,
        moistureContent: 8.5
    },
    simulationMode: SIMULATION_MODES.STEADY_STATE,
    scenarios: []
};

// --- MAIN SIMULATION TOOL COMPONENT ---
const IndustrialSimulationTool = () => {
    const [simulationData, setSimulationData] = useState(initialSimulationData);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [activeView, setActiveView] = useState('designer');
    const [isSimulationRunning, setIsSimulationRunning] = useState(false);
    const [simulationProgress, setSimulationProgress] = useState(0);
    const [showAddEquipment, setShowAddEquipment] = useState(false);
    const [showParameterEditor, setShowParameterEditor] = useState(false);
    const [simulationResults, setSimulationResults] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [draggedEquipment, setDraggedEquipment] = useState(null);
    const canvasRef = useRef(null);

    // --- NEW EQUIPMENT FORM STATE (FIXED STATE MANAGEMENT) ---
    const [newEquipment, setNewEquipment] = useState({
        name: '',
        type: EQUIPMENT_TYPES.CRUSHER,
        material: MATERIAL_TYPES.IRON_ORE,
        parameters: { ...getEquipmentDefaults(EQUIPMENT_TYPES.CRUSHER) },
        position: { x: 200, y: 300 }
    });

    // --- CANVAS DRAWING EFFECT (FIXED DEPENDENCIES) ---
    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid background
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < canvas.width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < canvas.height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw connections between equipment
        simulationData.equipment.forEach(equipment => {
            equipment.connections.forEach(connectionId => {
                const connectedEquipment = simulationData.equipment.find(eq => eq.id === connectionId);
                if (connectedEquipment) {
                    ctx.strokeStyle = '#6B7280';
                    ctx.lineWidth = 3;
                    ctx.setLineDash([10, 5]);
                    
                    ctx.beginPath();
                    ctx.moveTo(equipment.position.x, equipment.position.y);
                    ctx.lineTo(connectedEquipment.position.x, connectedEquipment.position.y);
                    ctx.stroke();
                    
                    // Draw arrow
                    const angle = Math.atan2(
                        connectedEquipment.position.y - equipment.position.y,
                        connectedEquipment.position.x - equipment.position.x
                    );
                    const arrowX = connectedEquipment.position.x - 20 * Math.cos(angle);
                    const arrowY = connectedEquipment.position.y - 20 * Math.sin(angle);
                    
                    ctx.save();
                    ctx.translate(arrowX, arrowY);
                    ctx.rotate(angle);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(-15, -8);
                    ctx.lineTo(-15, 8);
                    ctx.closePath();
                    ctx.fillStyle = '#6B7280';
                    ctx.fill();
                    ctx.restore();
                    
                    ctx.setLineDash([]);
                }
            });
        });
        
        // Draw material flow animation
        if (isSimulationRunning) {
            const time = Date.now() / 1000;
            simulationData.equipment.forEach(equipment => {
                equipment.connections.forEach(connectionId => {
                    const connectedEquipment = simulationData.equipment.find(eq => eq.id === connectionId);
                    if (connectedEquipment) {
                        const progress = (time % 2) / 2; // 2-second cycle
                        const flowX = equipment.position.x + (connectedEquipment.position.x - equipment.position.x) * progress;
                        const flowY = equipment.position.y + (connectedEquipment.position.y - equipment.position.y) * progress;
                        
                        // Draw flowing material particles
                        ctx.fillStyle = '#F59E0B';
                        ctx.beginPath();
                        ctx.arc(flowX, flowY, 4, 0, 2 * Math.PI);
                        ctx.fill();
                        
                        ctx.fillStyle = '#EF4444';
                        ctx.beginPath();
                        ctx.arc(flowX - 20, flowY - 5, 3, 0, 2 * Math.PI);
                        ctx.fill();
                        
                        ctx.fillStyle = '#10B981';
                        ctx.beginPath();
                        ctx.arc(flowX + 15, flowY + 8, 3, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                });
            });
        }
    }, [simulationData.equipment, isSimulationRunning]);

    useEffect(() => {
        drawCanvas();
    }, [drawCanvas]);

    // Animation frame for flowing materials (FIXED)
    useEffect(() => {
        let animationId;
        if (isSimulationRunning) {
            const animate = () => {
                drawCanvas();
                animationId = requestAnimationFrame(animate);
            };
            animationId = requestAnimationFrame(animate);
        }
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [isSimulationRunning, drawCanvas]);

    // --- NOTIFICATION SYSTEM (FIXED) ---
    const addNotification = useCallback((message, type) => {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toLocaleTimeString()
        };
        setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    }, []);

    // --- SIMULATION ENGINE (FIXED DEPENDENCIES) ---
    const runSimulation = useCallback(async () => {
        setIsSimulationRunning(true);
        setSimulationProgress(0);
        
        const totalSteps = 100;
        const results = [];
        
        for (let step = 0; step < totalSteps; step++) {
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Simulate equipment performance
            const stepResults = simulationData.equipment.map(equipment => {
                const baseEfficiency = equipment.parameters.efficiency;
                const randomVariation = getRandomFloat(-5, 5);
                const currentEfficiency = Math.max(0, Math.min(100, baseEfficiency + randomVariation));
                
                const throughput = equipment.parameters.capacity * (currentEfficiency / 100);
                const powerConsumption = equipment.parameters.powerRating * (0.7 + (currentEfficiency / 100) * 0.3);
                
                return {
                    equipmentId: equipment.id,
                    timestamp: Date.now() + step * 1000,
                    efficiency: currentEfficiency,
                    throughput,
                    powerConsumption,
                    temperature: equipment.parameters.operatingTemperature + getRandomFloat(-3, 8),
                    vibration: equipment.parameters.vibrationLevel + getRandomFloat(-0.5, 1.0),
                    wearRate: equipment.parameters.wearRate * (1 + getRandomFloat(-0.2, 0.3))
                };
            });
            
            results.push({
                step,
                timestamp: Date.now() + step * 1000,
                equipment: stepResults,
                globalMetrics: {
                    totalThroughput: stepResults.reduce((sum, eq) => sum + eq.throughput, 0),
                    totalPowerConsumption: stepResults.reduce((sum, eq) => sum + eq.powerConsumption, 0),
                    averageEfficiency: stepResults.reduce((sum, eq) => sum + eq.efficiency, 0) / stepResults.length,
                    energyIntensity: stepResults.reduce((sum, eq) => sum + eq.powerConsumption, 0) / 
                                   stepResults.reduce((sum, eq) => sum + eq.throughput, 0)
                }
            });
            
            setSimulationProgress((step + 1) / totalSteps * 100);
        }
        
        setSimulationResults(results);
        setIsSimulationRunning(false);
        addNotification('Simulation completed successfully!', 'success');
    }, [simulationData.equipment, addNotification]);

    // --- ADD NEW EQUIPMENT (FIXED) ---
    const addEquipment = useCallback(() => {
        const equipment = {
            id: `EQUIP_${Date.now()}`,
            name: newEquipment.name || `New ${newEquipment.type}`,
            type: newEquipment.type,
            material: newEquipment.material,
            parameters: { ...newEquipment.parameters },
            position: { ...newEquipment.position },
            connections: [],
            status: 'Inactive',
            simulationResults: {
                throughput: 0,
                powerConsumption: 0,
                wearProgress: 0,
                vibrationActual: 0,
                temperatureActual: 0,
                efficiency: 0
            }
        };
        
        setSimulationData(prev => ({
            ...prev,
            equipment: [...prev.equipment, equipment]
        }));
        
        // Reset form
        setNewEquipment({
            name: '',
            type: EQUIPMENT_TYPES.CRUSHER,
            material: MATERIAL_TYPES.IRON_ORE,
            parameters: { ...getEquipmentDefaults(EQUIPMENT_TYPES.CRUSHER) },
            position: { x: 200, y: 300 }
        });
        
        setShowAddEquipment(false);
        addNotification(`Added new equipment: ${equipment.name}`, 'success');
    }, [newEquipment, addNotification]);

    // --- UPDATE EQUIPMENT PARAMETERS (FIXED) ---
    const updateEquipmentParameters = useCallback((equipmentId, newParameters) => {
        setSimulationData(prev => ({
            ...prev,
            equipment: prev.equipment.map(eq => 
                eq.id === equipmentId 
                    ? { ...eq, parameters: { ...eq.parameters, ...newParameters } }
                    : eq
            )
        }));
        addNotification('Equipment parameters updated', 'info');
    }, [addNotification]);

    // --- DRAG AND DROP HANDLERS (FIXED) ---
    const handleEquipmentMouseDown = useCallback((equipment, e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        setDraggedEquipment({
            ...equipment,
            offset: {
                x: e.clientX - rect.left - equipment.position.x,
                y: e.clientY - rect.top - equipment.position.y
            }
        });
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (draggedEquipment) {
            const rect = canvasRef.current.getBoundingClientRect();
            const newX = e.clientX - rect.left - draggedEquipment.offset.x;
            const newY = e.clientY - rect.top - draggedEquipment.offset.y;
            
            setSimulationData(prev => ({
                ...prev,
                equipment: prev.equipment.map(eq =>
                    eq.id === draggedEquipment.id
                        ? { ...eq, position: { x: newX, y: newY } }
                        : eq
                )
            }));
        }
    }, [draggedEquipment]);

    const handleMouseUp = useCallback(() => {
        setDraggedEquipment(null);
    }, []);

    // --- CHART DATA PREPARATION (FIXED) ---
    const performanceChartData = useMemo(() => {
        if (simulationResults.length === 0) return null;
        
        return {
            labels: simulationResults.map((_, index) => `Step ${index + 1}`),
            datasets: [
                {
                    label: 'Total Throughput (t/h)',
                    data: simulationResults.map(result => result.globalMetrics.totalThroughput),
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Average Efficiency (%)',
                    data: simulationResults.map(result => result.globalMetrics.averageEfficiency),
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        };
    }, [simulationResults]);

    const powerConsumptionData = useMemo(() => {
        if (simulationResults.length === 0) return null;
        
        return {
            labels: simulationData.equipment.map(eq => eq.name),
            datasets: [{
                label: 'Power Consumption (kW)',
                data: simulationData.equipment.map(eq => eq.simulationResults.powerConsumption),
                backgroundColor: simulationData.equipment.map(eq => getEquipmentColor(eq.type)),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        };
    }, [simulationData.equipment, simulationResults]);

    // --- COMPONENT RENDERERS ---
    const EquipmentDesigner = useCallback(() => (
        <div style={designerContainerStyle}>
            <div style={designerHeaderStyle}>
                <h3>🎨 Equipment Layout Designer</h3>
                <div style={designerToolbarStyle}>
                    <button 
                        style={toolbarButtonStyle}
                        onClick={() => setShowAddEquipment(true)}
                    >
                        ➕ Add Equipment
                    </button>
                    <button 
                        style={{...toolbarButtonStyle, backgroundColor: isSimulationRunning ? '#EF4444' : '#10B981'}}
                        onClick={runSimulation}
                        disabled={isSimulationRunning || simulationData.equipment.length === 0}
                    >
                        {isSimulationRunning ? '⏳ Simulating...' : '▶️ Run Simulation'}
                    </button>
                    <button 
                        style={{...toolbarButtonStyle, backgroundColor: '#6B7280'}}
                        onClick={() => {
                            setSimulationData(prev => ({
                                ...prev,
                                equipment: prev.equipment.map(eq => ({
                                    ...eq,
                                    position: {
                                        x: 100 + Math.random() * 600,
                                        y: 100 + Math.random() * 400
                                    }
                                }))
                            }));
                        }}
                    >
                        🔄 Auto Layout
                    </button>
                </div>
            </div>
            
            <div 
                style={canvasContainerStyle}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <canvas
                    ref={canvasRef}
                    width={900}
                    height={600}
                    style={canvasStyle}
                />
                
                {/* Enhanced Equipment Visualization */}
                <div style={equipmentOverlayStyle}>
                    {simulationData.equipment.map(equipment => (
                        <div
                            key={equipment.id}
                            style={{
                                ...enhancedEquipmentNodeStyle,
                                left: equipment.position.x - 40,
                                top: equipment.position.y - 40,
                                backgroundColor: getEquipmentColor(equipment.type),
                                border: `3px solid ${equipment.status === 'Active' ? '#10B981' : '#6B7280'}`,
                                boxShadow: equipment.status === 'Active' 
                                    ? '0 0 20px rgba(16, 185, 129, 0.4)' 
                                    : '0 4px 12px rgba(0,0,0,0.2)',
                                animation: equipment.status === 'Active' ? 'pulse 2s infinite' : 'none'
                            }}
                            onMouseDown={(e) => handleEquipmentMouseDown(equipment, e)}
                            onClick={() => {
                                setSelectedEquipment(equipment);
                                setShowParameterEditor(true);
                            }}
                        >
                            <div style={equipmentIconStyle}>
                                {getEquipmentIcon(equipment.type)}
                            </div>
                            <div style={equipmentLabelStyle}>{equipment.name}</div>
                            <div style={equipmentTypeStyle}>{equipment.type}</div>
                            <div style={equipmentStatusStyle}>
                                {equipment.status === 'Active' ? '🟢' : '⚪'} {equipment.status}
                            </div>
                            <div style={equipmentMetricsStyle}>
                                <span>💨 {equipment.simulationResults.throughput.toFixed(0)} t/h</span>
                                <span>⚡ {equipment.simulationResults.powerConsumption.toFixed(0)} kW</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {isSimulationRunning && (
                <div style={progressBarContainerStyle}>
                    <div style={progressBarStyle}>
                        <div 
                            style={{
                                ...progressBarFillStyle,
                                width: `${simulationProgress}%`
                            }}
                        />
                    </div>
                    <span style={progressTextStyle}>
                        Simulation Progress: {simulationProgress.toFixed(1)}%
                    </span>
                </div>
            )}
        </div>
    ), [simulationData.equipment, isSimulationRunning, simulationProgress, runSimulation, handleMouseMove, handleMouseUp, handleEquipmentMouseDown]);

    // --- FIXED ADD EQUIPMENT MODAL ---
    const AddEquipmentModal = useCallback(({newEquipment, setNewEquipment}) => (
        <div style={modalOverlayStyle} onClick={() => setShowAddEquipment(false)}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
                <div style={modalHeaderStyle}>
                    <h3>➕ Add New Equipment</h3>
                    <button 
                        style={closeButtonStyle}
                        onClick={() => setShowAddEquipment(false)}
                    >
                        ✕
                    </button>
                </div>
                
                <div style={modalBodyStyle}>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Equipment Name:</label>
                        <input
                            type="text"
                            style={inputStyle}
                            value={newEquipment.name}
                            onChange={(e) => setNewEquipment(prev => ({
                                ...prev,
                                name: e.target.value
                            }))}
                            placeholder="Enter equipment name"
                        />
                    </div>
                    
                    <div style={formRowStyle}>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Equipment Type:</label>
                            <select
                                style={selectStyle}
                                value={newEquipment.type}
                                onChange={(e) => {
                                    const newType = e.target.value;
                                    setNewEquipment(prev => ({
                                        ...prev,
                                        type: newType,
                                        parameters: { ...getEquipmentDefaults(newType) }
                                    }));
                                }}
                            >
                                {Object.values(EQUIPMENT_TYPES).map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Material Type:</label>
                            <select
                                style={selectStyle}
                                value={newEquipment.material}
                                onChange={(e) => setNewEquipment(prev => ({
                                    ...prev,
                                    material: e.target.value
                                }))}
                            >
                                {Object.values(MATERIAL_TYPES).map(material => (
                                    <option key={material} value={material}>{material}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <h4 style={sectionHeaderStyle}>Equipment Parameters</h4>
                    <div style={parametersGridStyle}>
                        {Object.entries(newEquipment.parameters).map(([key, value]) => (
                            <div key={key} style={parameterItemStyle}>
                                <label style={parameterLabelStyle}>
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                </label>
                                <input
                                    type="number"
                                    style={parameterInputStyle}
                                    value={value}
                                    onChange={(e) => {
                                        const newValue = parseFloat(e.target.value) || 0;
                                        setNewEquipment(prev => ({
                                            ...prev,
                                            parameters: {
                                                ...prev.parameters,
                                                [key]: newValue
                                            }
                                        }));
                                    }}
                                    step={key.includes('Rate') || key.includes('Level') ? '0.1' : '1'}
                                />
                            </div>
                        ))}
                    </div>
                    
                    <div style={modalActionsStyle}>
                        <button 
                            style={cancelButtonStyle}
                            onClick={() => setShowAddEquipment(false)}
                        >
                            Cancel
                        </button>
                        <button 
                            style={addButtonStyle}
                            onClick={addEquipment}
                            disabled={!newEquipment.name.trim()}
                        >
                            Add Equipment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ), []);

    // --- FIXED PARAMETER EDITOR ---
    const ParameterEditor = useCallback(() => (
        showParameterEditor && selectedEquipment && (
            <div style={modalOverlayStyle} onClick={() => setShowParameterEditor(false)}>
                <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
                    <div style={modalHeaderStyle}>
                        <h3>⚙️ Edit Parameters - {selectedEquipment.name}</h3>
                        <button 
                            style={closeButtonStyle}
                            onClick={() => setShowParameterEditor(false)}
                        >
                            ✕
                        </button>
                    </div>
                    
                    <div style={modalBodyStyle}>
                        <div style={equipmentInfoStyle}>
                            <div><strong>Type:</strong> {selectedEquipment.type}</div>
                            <div><strong>Material:</strong> {selectedEquipment.material}</div>
                            <div><strong>Status:</strong> {selectedEquipment.status}</div>
                        </div>
                        
                        <h4 style={sectionHeaderStyle}>Operating Parameters</h4>
                        <div style={parametersGridStyle}>
                            {Object.entries(selectedEquipment.parameters).map(([key, value]) => (
                                <div key={key} style={parameterItemStyle}>
                                    <label style={parameterLabelStyle}>
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                    </label>
                                    <input
                                        type="number"
                                        style={parameterInputStyle}
                                        value={value}
                                        onChange={(e) => {
                                            const newValue = parseFloat(e.target.value) || 0;
                                            updateEquipmentParameters(selectedEquipment.id, {
                                                [key]: newValue
                                            });
                                            // Update local selected equipment state
                                            setSelectedEquipment(prev => ({
                                                ...prev,
                                                parameters: {
                                                    ...prev.parameters,
                                                    [key]: newValue
                                                }
                                            }));
                                        }}
                                        step={key.includes('Rate') || key.includes('Level') ? '0.1' : '1'}
                                    />
                                </div>
                            ))}
                        </div>
                        
                        <h4 style={sectionHeaderStyle}>Current Performance</h4>
                        <div style={performanceGridStyle}>
                            <div style={performanceItemStyle}>
                                <span>💨 Throughput:</span>
                                <strong>{selectedEquipment.simulationResults.throughput.toFixed(1)} t/h</strong>
                            </div>
                            <div style={performanceItemStyle}>
                                <span>⚡ Power Consumption:</span>
                                <strong>{selectedEquipment.simulationResults.powerConsumption.toFixed(1)} kW</strong>
                            </div>
                            <div style={performanceItemStyle}>
                                <span>📊 Efficiency:</span>
                                <strong>{selectedEquipment.simulationResults.efficiency.toFixed(1)}%</strong>
                            </div>
                            <div style={performanceItemStyle}>
                                <span>🌡️ Temperature:</span>
                                <strong>{selectedEquipment.simulationResults.temperatureActual.toFixed(1)}°C</strong>
                            </div>
                            <div style={performanceItemStyle}>
                                <span>📳 Vibration:</span>
                                <strong>{selectedEquipment.simulationResults.vibrationActual.toFixed(1)} mm/s</strong>
                            </div>
                            <div style={performanceItemStyle}>
                                <span>⚠️ Wear Progress:</span>
                                <strong>{selectedEquipment.simulationResults.wearProgress.toFixed(1)}%</strong>
                            </div>
                        </div>
                        
                        <div style={modalActionsStyle}>
                            <button 
                                style={cancelButtonStyle}
                                onClick={() => setShowParameterEditor(false)}
                            >
                                Close
                            </button>
                            <button 
                                style={addButtonStyle}
                                onClick={() => {
                                    addNotification(`Parameters saved for ${selectedEquipment.name}`, 'success');
                                    setShowParameterEditor(false);
                                }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    ), [showParameterEditor, selectedEquipment, updateEquipmentParameters, addNotification]);

    // Continue with SimulationResults and other components...
    const SimulationResults = useCallback(() => (
        <div style={resultsContainerStyle}>
            <h3 style={resultsHeaderStyle}>📊 Simulation Results & Analytics</h3>
            
            {simulationResults.length > 0 ? (
                <>
                    <div style={summaryCardsStyle}>
                        <div style={summaryCardStyle}>
                            <h4>💨 Total Throughput</h4>
                            <div style={summaryValueStyle}>
                                {simulationResults[simulationResults.length - 1]?.globalMetrics.totalThroughput.toFixed(1)} t/h
                            </div>
                        </div>
                        <div style={summaryCardStyle}>
                            <h4>⚡ Total Power</h4>
                            <div style={summaryValueStyle}>
                                {simulationResults[simulationResults.length - 1]?.globalMetrics.totalPowerConsumption.toFixed(1)} kW
                            </div>
                        </div>
                        <div style={summaryCardStyle}>
                            <h4>📊 Avg Efficiency</h4>
                            <div style={summaryValueStyle}>
                                {simulationResults[simulationResults.length - 1]?.globalMetrics.averageEfficiency.toFixed(1)}%
                            </div>
                        </div>
                        <div style={summaryCardStyle}>
                            <h4>🔋 Energy Intensity</h4>
                            <div style={summaryValueStyle}>
                                {simulationResults[simulationResults.length - 1]?.globalMetrics.energyIntensity.toFixed(2)} kWh/t
                            </div>
                        </div>
                    </div>
                    
                    <div style={chartsContainerStyle}>
                        <div style={chartCardStyle}>
                            <h4>📈 Performance Trends</h4>
                            {performanceChartData && (
                                <Line 
                                    data={performanceChartData}
                                    options={{
                                        responsive: true,
                                        scales: {
                                            y: { beginAtZero: true },
                                            y1: { 
                                                type: 'linear',
                                                display: true,
                                                position: 'right',
                                                grid: { drawOnChartArea: false }
                                            }
                                        }
                                    }}
                                />
                            )}
                        </div>
                        
                        <div style={chartCardStyle}>
                            <h4>🔌 Power Distribution</h4>
                            {powerConsumptionData && (
                                <Doughnut 
                                    data={powerConsumptionData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: { position: 'bottom' }
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    
                    <div style={detailedResultsStyle}>
                        <h4>📋 Equipment Performance Details</h4>
                        <div style={tableContainerStyle}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={tableHeaderStyle}>
                                        <th>Equipment</th>
                                        <th>Type</th>
                                        <th>Throughput (t/h)</th>
                                        <th>Power (kW)</th>
                                        <th>Efficiency (%)</th>
                                        <th>Temperature (°C)</th>
                                        <th>Vibration (mm/s)</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {simulationData.equipment.map(equipment => (
                                        <tr key={equipment.id} style={tableRowStyle}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span>{getEquipmentIcon(equipment.type)}</span>
                                                    {equipment.name}
                                                </div>
                                            </td>
                                            <td>{equipment.type}</td>
                                            <td>{equipment.simulationResults.throughput.toFixed(1)}</td>
                                            <td>{equipment.simulationResults.powerConsumption.toFixed(1)}</td>
                                            <td>{equipment.simulationResults.efficiency.toFixed(1)}</td>
                                            <td>{equipment.simulationResults.temperatureActual.toFixed(1)}</td>
                                            <td>{equipment.simulationResults.vibrationActual.toFixed(1)}</td>
                                            <td>
                                                <span style={{
                                                    ...statusBadgeStyle,
                                                    backgroundColor: equipment.status === 'Active' ? '#10B981' : '#6B7280'
                                                }}>
                                                    {equipment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div style={noResultsStyle}>
                    <div style={{ fontSize: '4em', marginBottom: '16px' }}>🔬</div>
                    <h4>No simulation results available</h4>
                    <p>Run a simulation to see detailed results and analytics</p>
                    <button 
                        style={runSimButtonStyle}
                        onClick={runSimulation}
                        disabled={simulationData.equipment.length === 0}
                    >
                        ▶️ Run Simulation Now
                    </button>
                </div>
            )}
        </div>
    ), [simulationResults, simulationData.equipment, performanceChartData, powerConsumptionData, runSimulation]);

    const NotificationPanel = useCallback(() => (
        <div style={notificationPanelStyle}>
            {notifications.map(notification => (
                <div 
                    key={notification.id}
                    style={{
                        ...notificationStyle,
                        borderLeft: `4px solid ${getNotificationColor(notification.type)}`
                    }}
                >
                    <div style={notificationMessageStyle}>
                        {notification.message}
                    </div>
                    <div style={notificationTimeStyle}>
                        {notification.timestamp}
                    </div>
                </div>
            ))}
        </div>
    ), [notifications]);

    // Helper function for notification colors
    const getNotificationColor = (type) => {
        switch(type) {
            case 'success': return '#10B981';
            case 'error': return '#EF4444';
            case 'warning': return '#F59E0B';
            default: return '#3B82F6';
        }
    };

    // --- MAIN RENDER ---
    return (
    <div 
      className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 animate-fade-in"
      style={{ backgroundColor: '#FBF3D1' }}
    >
            {/* Header */}
            <header style={headerStyle}>
                <h1 style={titleStyle}>🔧 Industrial Equipment Simulation Tool</h1>
                <p style={subtitleStyle}>
                    Design, Configure & Simulate Industrial Mining Equipment Performance
                </p>
            </header>

            {/* Navigation */}
            <nav style={navStyle}>
                <button 
                    style={{
                        ...navButtonStyle,
                        ...(activeView === 'designer' ? activeNavButtonStyle : {})
                    }}
                    onClick={() => setActiveView('designer')}
                >
                    🎨 Equipment Designer
                </button>
                <button 
                    style={{
                        ...navButtonStyle,
                        ...(activeView === 'results' ? activeNavButtonStyle : {})
                    }}
                    onClick={() => setActiveView('results')}
                >
                    📊 Simulation Results
                </button>
                <button 
                    style={{
                        ...navButtonStyle,
                        ...(activeView === 'parameters' ? activeNavButtonStyle : {})
                    }}
                    onClick={() => setActiveView('parameters')}
                >
                    ⚙️ Global Parameters
                </button>
            </nav>

            {/* Main Content */}
            <main style={mainContentStyle}>
                {activeView === 'designer' && <EquipmentDesigner />}
                {activeView === 'results' && <SimulationResults />}
                {activeView === 'parameters' && (
                    <div style={parametersViewStyle}>
                        <h3>🌐 Global Simulation Parameters</h3>
                        <div style={globalParamsGridStyle}>
                            {Object.entries(simulationData.globalParameters).map(([key, value]) => (
                                <div key={key} style={globalParamItemStyle}>
                                    <label style={parameterLabelStyle}>
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                    </label>
                                    <input
                                        type="number"
                                        style={parameterInputStyle}
                                        value={value}
                                        onChange={(e) => {
                                            const newValue = parseFloat(e.target.value) || 0;
                                            setSimulationData(prev => ({
                                                ...prev,
                                                globalParameters: {
                                                    ...prev.globalParameters,
                                                    [key]: newValue
                                                }
                                            }));
                                        }}
                                        step="0.1"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Notifications */}
            <NotificationPanel />

            {/* Modals */}
            {showAddEquipment && <AddEquipmentModal newEquipment={newEquipment} setNewEquipment={setNewEquipment} />}
            <ParameterEditor />
        </div>
    );
};

// --- ENHANCED STYLING ---

const containerStyle = {
    fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
    padding: '20px'
};

const headerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '24px',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
};

const titleStyle = {
    margin: '0 0 8px 0',
    fontSize: '2.8em',
    fontWeight: '800',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
};

const subtitleStyle = {
    margin: '0',
    fontSize: '1.3em',
    opacity: '0.95',
    fontWeight: '400'
};

const navStyle = {
    display: 'flex',
    gap: '20px',
    marginBottom: '28px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
};

const navButtonStyle = {
    padding: '14px 28px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '1rem'
};

const activeNavButtonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
};

const mainContentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '36px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
    minHeight: '700px'
};

// Enhanced Designer Styles
const designerContainerStyle = {
    width: '100%'
};

const designerHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    paddingBottom: '20px',
    borderBottom: '3px solid #e2e8f0'
};

const designerToolbarStyle = {
    display: 'flex',
    gap: '16px'
};

const toolbarButtonStyle = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.95rem'
};

const canvasContainerStyle = {
    position: 'relative',
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    border: '3px solid #e2e8f0',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
};

const canvasStyle = {
    display: 'block',
    backgroundColor: 'transparent',
    cursor: 'crosshair'
};

const equipmentOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none'
};

// Enhanced Equipment Node Styling
const enhancedEquipmentNodeStyle = {
    position: 'absolute',
    width: '80px',
    height: '80px',
    borderRadius: '12px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75em',
    fontWeight: '600',
    cursor: 'move',
    pointerEvents: 'all',
    transition: 'all 0.3s ease',
    userSelect: 'none'
};

const equipmentIconStyle = {
    fontSize: '1.8em',
    marginBottom: '2px'
};

const equipmentLabelStyle = {
    fontSize: '0.7em',
    textAlign: 'center',
    lineHeight: '1',
    fontWeight: '700',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
};

const equipmentTypeStyle = {
    fontSize: '0.55em',
    opacity: '0.9',
    marginTop: '1px',
    fontWeight: '500'
};

const equipmentStatusStyle = {
    fontSize: '0.6em',
    marginTop: '2px',
    padding: '1px 4px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '4px'
};

const equipmentMetricsStyle = {
    fontSize: '0.5em',
    marginTop: '2px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    textAlign: 'center'
};

const progressBarContainerStyle = {
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '2px solid #e2e8f0'
};

const progressBarStyle = {
    flex: 1,
    height: '12px',
    backgroundColor: '#e2e8f0',
    borderRadius: '6px',
    overflow: 'hidden'
};

const progressBarFillStyle = {
    height: '100%',
    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
    borderRadius: '6px',
    transition: 'width 0.3s ease'
};

const progressTextStyle = {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#374151'
};

// Enhanced Modal Styles
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
    backdropFilter: 'blur(4px)'
};

const modalContentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    maxWidth: '900px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
};

const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '28px',
    borderBottom: '3px solid #e2e8f0',
    backgroundColor: '#f8fafc'
};

const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.8em',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    color: '#64748b',
    transition: 'all 0.2s ease'
};

const modalBodyStyle = {
    padding: '28px'
};

const formGroupStyle = {
    marginBottom: '24px'
};

const formRowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px'
};

const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '700',
    color: '#374151',
    fontSize: '0.95rem'
};

const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
    backgroundColor: '#ffffff'
};

const selectStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '1rem',
    backgroundColor: '#ffffff',
    cursor: 'pointer'
};

const sectionHeaderStyle = {
    margin: '28px 0 20px 0',
    fontSize: '1.3em',
    fontWeight: '800',
    color: '#1f2937',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '10px'
};

const parametersGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '28px'
};

const parameterItemStyle = {
    display: 'flex',
    flexDirection: 'column'
};

const parameterLabelStyle = {
    fontSize: '0.85em',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '6px'
};

const parameterInputStyle = {
    padding: '10px 14px',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.95em',
    transition: 'border-color 0.3s ease'
};

const modalActionsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
    marginTop: '32px',
    paddingTop: '20px',
    borderTop: '2px solid #e2e8f0'
};

const cancelButtonStyle = {
    padding: '12px 24px',
    border: '2px solid #d1d5db',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    color: '#64748b',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
};

const addButtonStyle = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#10b981',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
};

const equipmentInfoStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    marginBottom: '24px',
    border: '2px solid #e2e8f0'
};

const performanceGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px'
};

const performanceItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
};

// Results Styles
const resultsContainerStyle = {
    width: '100%'
};

const resultsHeaderStyle = {
    marginBottom: '28px',
    color: '#1f2937',
    borderBottom: '3px solid #e2e8f0',
    paddingBottom: '16px',
    fontSize: '1.8em',
    fontWeight: '800'
};

const summaryCardsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '36px'
};

const summaryCardStyle = {
    padding: '24px',
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    border: '3px solid #e2e8f0',
    textAlign: 'center',
    transition: 'all 0.3s ease'
};

const summaryValueStyle = {
    fontSize: '2.2em',
    fontWeight: '800',
    color: '#3b82f6',
    marginTop: '12px'
};

const chartsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '28px',
    marginBottom: '36px'
};

const chartCardStyle = {
    padding: '28px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '3px solid #e2e8f0',
    boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
};

const detailedResultsStyle = {
    marginTop: '36px'
};

const tableContainerStyle = {
    overflowX: 'auto',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    backgroundColor: '#ffffff'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
};

const tableHeaderStyle = {
    backgroundColor: '#f8fafc',
    borderBottom: '3px solid #e2e8f0'
};

const tableRowStyle = {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background-color 0.3s ease'
};

const statusBadgeStyle = {
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '0.8em',
    fontWeight: '600',
    color: 'white'
};

const noResultsStyle = {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#64748b'
};

const runSimButtonStyle = {
    padding: '16px 32px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease'
};

// Parameters View
const parametersViewStyle = {
    width: '100%'
};

const globalParamsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginTop: '28px'
};

const globalParamItemStyle = {
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '2px solid #e2e8f0'
};

// Notification Styles
const notificationPanelStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 999,
    width: '320px'
};

const notificationStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '12px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    animation: 'slideIn 0.4s ease-out'
};

const notificationMessageStyle = {
    fontSize: '0.95em',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '6px'
};

const notificationTimeStyle = {
    fontSize: '0.8em',
    color: '#64748b'
};

// CSS Animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
    }
    
    input:focus, select:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        outline: none;
    }
    
    button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
    
    .enhanced-equipment-node:hover {
        transform: scale(1.05);
        z-index: 10;
    }
    
    table th, table td {
        padding: 16px;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
    }
    
    table th {
        font-weight: 600;
        color: '#374151';
    }
    
    table tr:hover {
        background-color: #f8fafc;
    }
    
    .summary-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(style);

export default IndustrialSimulationTool;
