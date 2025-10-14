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

// --- IOT DEVICE CONTROL SYSTEM ---
const DEVICE_TYPES = {
    SMART_VALVE: 'Smart Valve',
    MOTOR_CONTROLLER: 'Motor Controller', 
    LIGHTING_SYSTEM: 'Smart Lighting',
    HVAC_CONTROLLER: 'HVAC Controller',
    PUMP_CONTROLLER: 'Pump Controller',
    CONVEYOR_CONTROLLER: 'Conveyor Controller',
    SECURITY_CAMERA: 'Security Camera',
    ACCESS_CONTROL: 'Access Control',
    EMERGENCY_SHUTDOWN: 'Emergency Shutdown',
    CHEMICAL_DOSING: 'Chemical Dosing Pump',
    VENTILATION_FAN: 'Ventilation Fan',
    CRUSHER_CONTROL: 'Crusher Control Unit'
};

const DEVICE_STATUS = {
    ONLINE: 'Online',
    OFFLINE: 'Offline',
    CONTROLLING: 'Control Active',
    ERROR: 'Error',
    MAINTENANCE: 'Maintenance'
};

const CONTROL_MODES = {
    MANUAL: 'Manual Control',
    AUTOMATIC: 'Automatic',
    SCHEDULED: 'Scheduled',
    EMERGENCY: 'Emergency Override'
};

// --- INITIAL IOT CONTROL DEVICES ---
const initialDevices = {
    devices: [
        {
            id: 'VALVE_001',
            name: 'Main Water Intake Valve',
            type: DEVICE_TYPES.SMART_VALVE,
            location: 'Water Treatment Plant',
            zone: 'Processing',
            status: DEVICE_STATUS.ONLINE,
            controlMode: CONTROL_MODES.AUTOMATIC,
            isControllable: true,
            currentState: {
                isOpen: true,
                openingPercentage: 75,
                flowRate: 1247.3,
                pressure: 4.2,
                temperature: 22.1
            },
            controls: {
                canToggle: true,
                canAdjustPercentage: true,
                hasPresets: true,
                presets: [
                    { name: 'Fully Open', value: 100 },
                    { name: 'Half Open', value: 50 },
                    { name: 'Quarter Open', value: 25 },
                    { name: 'Closed', value: 0 }
                ]
            },
            commandHistory: [],
            lastCommand: {
                action: 'Set Opening to 75%',
                timestamp: new Date(Date.now() - 1800000).toISOString(),
                user: 'System Auto'
            },
            capabilities: ['Remote Open/Close', 'Variable Control', 'Flow Monitoring', 'Pressure Sensing']
        },
        {
            id: 'MOTOR_002',
            name: 'Conveyor Belt Motor #3',
            type: DEVICE_TYPES.MOTOR_CONTROLLER,
            location: 'Material Handling Bay',
            zone: 'Transport',
            status: DEVICE_STATUS.ONLINE,
            controlMode: CONTROL_MODES.MANUAL,
            isControllable: true,
            currentState: {
                isRunning: true,
                speed: 85, // RPM percentage
                direction: 'Forward',
                current: 12.4,
                temperature: 67.8,
                vibration: 2.1
            },
            controls: {
                canStartStop: true,
                canAdjustSpeed: true,
                canReverse: true,
                hasPresets: true,
                presets: [
                    { name: 'Full Speed', value: 100 },
                    { name: 'Normal Speed', value: 85 },
                    { name: 'Slow Speed', value: 50 },
                    { name: 'Maintenance Speed', value: 25 }
                ]
            },
            commandHistory: [],
            lastCommand: {
                action: 'Speed adjusted to 85%',
                timestamp: new Date(Date.now() - 600000).toISOString(),
                user: 'operator_john'
            },
            capabilities: ['Start/Stop Control', 'Variable Speed', 'Direction Control', 'Load Monitoring']
        },
        {
            id: 'LIGHT_003',
            name: 'Underground Mining Lights - Sector 7',
            type: DEVICE_TYPES.LIGHTING_SYSTEM,
            location: 'Underground Level -150m',
            zone: 'Mining',
            status: DEVICE_STATUS.ONLINE,
            controlMode: CONTROL_MODES.SCHEDULED,
            isControllable: true,
            currentState: {
                isOn: true,
                brightness: 90,
                colorTemperature: 4000,
                energyConsumption: 2.4,
                motionDetected: false
            },
            controls: {
                canToggle: true,
                canAdjustBrightness: true,
                hasColorControl: true,
                hasScheduling: true,
                hasMotionSensor: true,
                presets: [
                    { name: 'Full Bright', brightness: 100, temp: 5000 },
                    { name: 'Work Light', brightness: 90, temp: 4000 },
                    { name: 'Safety Light', brightness: 60, temp: 3000 },
                    { name: 'Emergency', brightness: 100, temp: 6500 }
                ]
            },
            commandHistory: [],
            lastCommand: {
                action: 'Brightness set to 90%',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                user: 'scheduled_task'
            },
            capabilities: ['On/Off Control', 'Dimming', 'Color Temperature', 'Motion Detection', 'Scheduling']
        },
        {
            id: 'PUMP_004',
            name: 'Slurry Pump Station Alpha',
            type: DEVICE_TYPES.PUMP_CONTROLLER,
            location: 'Processing Plant',
            zone: 'Processing',
            status: DEVICE_STATUS.CONTROLLING,
            controlMode: CONTROL_MODES.AUTOMATIC,
            isControllable: true,
            currentState: {
                isRunning: true,
                flowRate: 890.5,
                pressure: 6.8,
                speed: 1850, // RPM
                efficiency: 87.2,
                cavitation: false
            },
            controls: {
                canStartStop: true,
                canAdjustSpeed: true,
                hasFlowControl: true,
                hasPressureControl: true,
                presets: [
                    { name: 'Maximum Flow', speed: 100, flow: 1200 },
                    { name: 'Normal Operation', speed: 85, flow: 900 },
                    { name: 'Reduced Flow', speed: 60, flow: 600 },
                    { name: 'Minimum Flow', speed: 30, flow: 300 }
                ]
            },
            commandHistory: [],
            lastCommand: {
                action: 'Auto-adjust speed to maintain pressure',
                timestamp: new Date(Date.now() - 300000).toISOString(),
                user: 'ai_controller'
            },
            capabilities: ['Variable Speed Control', 'Flow Rate Control', 'Pressure Regulation', 'Cavitation Detection']
        },
        {
            id: 'HVAC_005',
            name: 'Control Room Climate System',
            type: DEVICE_TYPES.HVAC_CONTROLLER,
            location: 'Main Control Room',
            zone: 'Administration',
            status: DEVICE_STATUS.ONLINE,
            controlMode: CONTROL_MODES.AUTOMATIC,
            isControllable: true,
            currentState: {
                temperature: 22.5,
                targetTemperature: 23.0,
                humidity: 45,
                targetHumidity: 50,
                fanSpeed: 65,
                coolingActive: true,
                heatingActive: false
            },
            controls: {
                canSetTemperature: true,
                canSetHumidity: true,
                canAdjustFanSpeed: true,
                hasEcoMode: true,
                presets: [
                    { name: 'Comfort', temp: 23, humidity: 50, fan: 60 },
                    { name: 'Energy Save', temp: 25, humidity: 45, fan: 40 },
                    { name: 'High Performance', temp: 21, humidity: 55, fan: 80 },
                    { name: 'Night Mode', temp: 20, humidity: 45, fan: 30 }
                ]
            },
            commandHistory: [],
            lastCommand: {
                action: 'Set target temperature to 23°C',
                timestamp: new Date(Date.now() - 900000).toISOString(),
                user: 'operator_sarah'
            },
            capabilities: ['Temperature Control', 'Humidity Control', 'Fan Speed Control', 'Smart Scheduling']
        },
        {
            id: 'CAMERA_006',
            name: 'Security Camera - Main Entrance',
            type: DEVICE_TYPES.SECURITY_CAMERA,
            location: 'Main Gate',
            zone: 'Security',
            status: DEVICE_STATUS.ONLINE,
            controlMode: CONTROL_MODES.AUTOMATIC,
            isControllable: true,
            currentState: {
                isRecording: true,
                panAngle: 45,
                tiltAngle: -10,
                zoomLevel: 1.5,
                nightVision: false,
                motionDetection: true,
                resolution: '4K'
            },
            controls: {
                canPan: true,
                canTilt: true,
                canZoom: true,
                hasNightVision: true,
                hasPresets: true,
                presets: [
                    { name: 'Gate View', pan: 0, tilt: 0, zoom: 1 },
                    { name: 'Parking Area', pan: 45, tilt: -10, zoom: 1.5 },
                    { name: 'Road Monitor', pan: -30, tilt: 5, zoom: 2 },
                    { name: 'Wide Angle', pan: 0, tilt: 0, zoom: 0.5 }
                ]
            },
            commandHistory: [],
            lastCommand: {
                action: 'Pan to parking area view',
                timestamp: new Date(Date.now() - 1200000).toISOString(),
                user: 'security_mike'
            },
            capabilities: ['Pan/Tilt Control', 'Digital Zoom', 'Night Vision', 'Motion Detection', 'Remote Recording']
        },
        {
            id: 'CRUSHER_007',
            name: 'Primary Jaw Crusher Control',
            type: DEVICE_TYPES.CRUSHER_CONTROL,
            location: 'Crushing Circuit',
            zone: 'Processing',
            status: DEVICE_STATUS.ONLINE,
            controlMode: CONTROL_MODES.MANUAL,
            isControllable: true,
            currentState: {
                isRunning: true,
                jawGap: 125, // mm
                crushingForce: 850, // tons
                feedRate: 1200,
                outputSize: 85,
                motorLoad: 78
            },
            controls: {
                canStartStop: true,
                canAdjustGap: true,
                canSetFeedRate: true,
                hasEmergencyStop: true,
                presets: [
                    { name: 'Coarse Crushing', gap: 150, feed: 1000 },
                    { name: 'Standard', gap: 125, feed: 1200 },
                    { name: 'Fine Crushing', gap: 100, feed: 900 },
                    { name: 'Maintenance', gap: 200, feed: 0 }
                ]
            },
            commandHistory: [],
            lastCommand: {
                action: 'Jaw gap adjusted to 125mm',
                timestamp: new Date(Date.now() - 2400000).toISOString(),
                user: 'operator_alex'
            },
            capabilities: ['Start/Stop Control', 'Gap Adjustment', 'Feed Rate Control', 'Emergency Stop', 'Load Monitoring']
        },
        {
            id: 'FAN_008',
            name: 'Ventilation Fan - Main Shaft',
            type: DEVICE_TYPES.VENTILATION_FAN,
            location: 'Main Ventilation Shaft',
            zone: 'Ventilation',
            status: DEVICE_STATUS.ONLINE,
            controlMode: CONTROL_MODES.AUTOMATIC,
            isControllable: true,
            currentState: {
                isRunning: true,
                speed: 1450, // RPM
                airFlow: 25000, // CFM
                power: 45.6,
                direction: 'Exhaust',
                vibration: 1.8
            },
            controls: {
                canStartStop: true,
                canAdjustSpeed: true,
                canReverse: true,
                hasVariableControl: true,
                presets: [
                    { name: 'Maximum Ventilation', speed: 100 },
                    { name: 'Normal Operation', speed: 80 },
                    { name: 'Reduced Ventilation', speed: 60 },
                    { name: 'Emergency Exhaust', speed: 100, direction: 'Exhaust' }
                ]
            },
            commandHistory: [],
            lastCommand: {
                action: 'Speed set to 80% (Auto)',
                timestamp: new Date(Date.now() - 1800000).toISOString(),
                user: 'vod_system'
            },
            capabilities: ['Variable Speed Control', 'Direction Control', 'Auto Ventilation on Demand', 'Emergency Override']
        }
    ],
    activeCommands: [],
    commandQueue: [],
    systemStats: {
        totalDevices: 8,
        onlineDevices: 7,
        controllableDevices: 8,
        activeControls: 1,
        commandsToday: 47,
        automationLevel: 75
    }
};

// --- MAIN IOT CONTROL DASHBOARD ---
const IoTControlDashboard = () => {
    const [devices, setDevices] = useState(initialDevices);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [showControlModal, setShowControlModal] = useState(false);
    const [activeView, setActiveView] = useState('control');
    const [notifications, setNotifications] = useState([]);
    const [isExecutingCommand, setIsExecutingCommand] = useState(false);
    const [commandQueue, setCommandQueue] = useState([]);
    const [liveCommands, setLiveCommands] = useState([]);
    
    // Real-time device state updates
    useEffect(() => {
        const interval = setInterval(() => {
            setDevices(prevDevices => ({
                ...prevDevices,
                devices: prevDevices.devices.map(device => {
                    // Simulate real-time state changes
                    const newState = { ...device.currentState };
                    
                    switch (device.type) {
                        case DEVICE_TYPES.SMART_VALVE:
                            if (device.controlMode === CONTROL_MODES.AUTOMATIC) {
                                newState.flowRate = newState.flowRate + (Math.random() - 0.5) * 50;
                                newState.pressure = Math.max(3, Math.min(6, newState.pressure + (Math.random() - 0.5) * 0.5));
                            }
                            break;
                        case DEVICE_TYPES.MOTOR_CONTROLLER:
                            if (newState.isRunning) {
                                newState.current = newState.current + (Math.random() - 0.5) * 2;
                                newState.temperature = Math.max(40, Math.min(80, newState.temperature + (Math.random() - 0.5) * 3));
                                newState.vibration = Math.max(1, Math.min(5, newState.vibration + (Math.random() - 0.5) * 0.3));
                            }
                            break;
                        case DEVICE_TYPES.HVAC_CONTROLLER:
                            const tempDiff = newState.targetTemperature - newState.temperature;
                            newState.temperature = newState.temperature + tempDiff * 0.1 + (Math.random() - 0.5) * 0.5;
                            newState.humidity = Math.max(30, Math.min(70, newState.humidity + (Math.random() - 0.5) * 2));
                            break;
                    }
                    
                    return {
                        ...device,
                        currentState: newState
                    };
                })
            }));
        }, 3000);
        
        return () => clearInterval(interval);
    }, []);

    // Command execution system
    const executeCommand = useCallback(async (deviceId, command, parameters = {}) => {
        setIsExecutingCommand(true);
        
        const commandObj = {
            id: Date.now(),
            deviceId,
            command,
            parameters,
            status: 'Executing',
            timestamp: new Date().toISOString(),
            user: 'current_user'
        };
        
        setLiveCommands(prev => [commandObj, ...prev.slice(0, 9)]);
        addNotification(`Executing: ${command} on device ${deviceId}`, 'info');
        
        // Simulate command execution delay
        setTimeout(() => {
            setDevices(prevDevices => ({
                ...prevDevices,
                devices: prevDevices.devices.map(device => {
                    if (device.id !== deviceId) return device;
                    
                    const newState = { ...device.currentState };
                    const newDevice = { ...device };
                    
                    // Execute the actual command
                    switch (command) {
                        case 'toggle':
                            if ('isOn' in newState) newState.isOn = !newState.isOn;
                            if ('isRunning' in newState) newState.isRunning = !newState.isRunning;
                            if ('isOpen' in newState) newState.isOpen = !newState.isOpen;
                            break;
                        case 'setPercentage':
                            if ('openingPercentage' in newState) newState.openingPercentage = parameters.value;
                            if ('speed' in newState) newState.speed = parameters.value;
                            if ('brightness' in newState) newState.brightness = parameters.value;
                            break;
                        case 'setTemperature':
                            if ('targetTemperature' in newState) newState.targetTemperature = parameters.value;
                            break;
                        case 'setPreset':
                            const preset = device.controls.presets.find(p => p.name === parameters.presetName);
                            if (preset) {
                                Object.keys(preset).forEach(key => {
                                    if (key !== 'name' && key in newState) {
                                        newState[key] = preset[key];
                                    }
                                });
                            }
                            break;
                        case 'emergencyStop':
                            newState.isRunning = false;
                            newState.speed = 0;
                            newDevice.status = DEVICE_STATUS.ERROR;
                            break;
                        case 'panTilt':
                            if ('panAngle' in newState) newState.panAngle = parameters.pan;
                            if ('tiltAngle' in newState) newState.tiltAngle = parameters.tilt;
                            break;
                        case 'zoom':
                            if ('zoomLevel' in newState) newState.zoomLevel = parameters.value;
                            break;
                    }
                    
                    newDevice.currentState = newState;
                    newDevice.lastCommand = {
                        action: `${command} executed`,
                        timestamp: new Date().toISOString(),
                        user: 'current_user'
                    };
                    newDevice.status = DEVICE_STATUS.CONTROLLING;
                    
                    return newDevice;
                })
            }));
            
            setLiveCommands(prev => 
                prev.map(cmd => 
                    cmd.id === commandObj.id 
                        ? { ...cmd, status: 'Completed' }
                        : cmd
                )
            );
            
            addNotification(`✅ Command completed: ${command}`, 'success');
            setIsExecutingCommand(false);
        }, 1000 + Math.random() * 2000);
    }, []);

    const addNotification = useCallback((message, type) => {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toLocaleTimeString()
        };
        setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    }, []);

    // Device Control Modal
    const DeviceControlModal = () => (
        showControlModal && selectedDevice && (
            <div style={modalOverlayStyle} onClick={() => setShowControlModal(false)}>
                <div style={controlModalStyle} onClick={e => e.stopPropagation()}>
                    <div style={modalHeaderStyle}>
                        <div>
                            <h2>🎮 Control: {selectedDevice.name}</h2>
                            <p style={modalSubtitleStyle}>{selectedDevice.type} - {selectedDevice.location}</p>
                        </div>
                        <button style={closeButtonStyle} onClick={() => setShowControlModal(false)}>✕</button>
                    </div>

                    <div style={controlModalBodyStyle}>
                        {/* Device Status Display */}
                        <div style={deviceStatusPanelStyle}>
                            <h3>📊 Current Status</h3>
                            <div style={statusGridStyle}>
                                {Object.entries(selectedDevice.currentState).map(([key, value]) => (
                                    <div key={key} style={statusItemStyle}>
                                        <span style={statusKeyStyle}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                        <span style={statusValueStyle(typeof value)}>
                                            {typeof value === 'boolean' ? (value ? '✅ Yes' : '❌ No') : 
                                             typeof value === 'number' ? value.toFixed(1) : value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Live Controls */}
                        <div style={liveControlsStyle}>
                            <h3>🎮 Live Controls</h3>
                            
                            {/* Toggle Controls */}
                            {selectedDevice.controls.canToggle && (
                                <div style={controlGroupStyle}>
                                    <h4>Power Control</h4>
                                    <button 
                                        style={toggleButtonStyle(selectedDevice.currentState.isOn || selectedDevice.currentState.isRunning || selectedDevice.currentState.isOpen)}
                                        onClick={() => executeCommand(selectedDevice.id, 'toggle')}
                                        disabled={isExecutingCommand}
                                    >
                                        {selectedDevice.currentState.isOn || selectedDevice.currentState.isRunning || selectedDevice.currentState.isOpen ? 
                                         '🔴 Turn OFF' : '🟢 Turn ON'}
                                    </button>
                                </div>
                            )}

                            {/* Percentage Controls */}
                            {(selectedDevice.controls.canAdjustPercentage || selectedDevice.controls.canAdjustSpeed || selectedDevice.controls.canAdjustBrightness) && (
                                <div style={controlGroupStyle}>
                                    <h4>Variable Control</h4>
                                    <div style={sliderControlStyle}>
                                        <input 
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={selectedDevice.currentState.openingPercentage || 
                                                   selectedDevice.currentState.speed || 
                                                   selectedDevice.currentState.brightness || 0}
                                            onChange={(e) => executeCommand(selectedDevice.id, 'setPercentage', { value: parseInt(e.target.value) })}
                                            style={sliderStyle}
                                            disabled={isExecutingCommand}
                                        />
                                        <span style={sliderValueStyle}>
                                            {selectedDevice.currentState.openingPercentage || 
                                             selectedDevice.currentState.speed || 
                                             selectedDevice.currentState.brightness || 0}%
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Temperature Control */}
                            {selectedDevice.controls.canSetTemperature && (
                                <div style={controlGroupStyle}>
                                    <h4>Temperature Control</h4>
                                    <div style={temperatureControlStyle}>
                                        <button 
                                            style={tempButtonStyle}
                                            onClick={() => executeCommand(selectedDevice.id, 'setTemperature', 
                                                { value: selectedDevice.currentState.targetTemperature - 1 })}
                                            disabled={isExecutingCommand}
                                        >
                                            ➖
                                        </button>
                                        <span style={tempDisplayStyle}>{selectedDevice.currentState.targetTemperature}°C</span>
                                        <button 
                                            style={tempButtonStyle}
                                            onClick={() => executeCommand(selectedDevice.id, 'setTemperature', 
                                                { value: selectedDevice.currentState.targetTemperature + 1 })}
                                            disabled={isExecutingCommand}
                                        >
                                            ➕
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Camera Controls */}
                            {selectedDevice.type === DEVICE_TYPES.SECURITY_CAMERA && (
                                <div style={controlGroupStyle}>
                                    <h4>Camera Control</h4>
                                    <div style={cameraControlsStyle}>
                                        <div style={panTiltControlStyle}>
                                            <button style={directionButtonStyle} onClick={() => executeCommand(selectedDevice.id, 'panTilt', { pan: selectedDevice.currentState.panAngle, tilt: selectedDevice.currentState.tiltAngle + 10 })}>⬆️</button>
                                            <div style={middleRowStyle}>
                                                <button style={directionButtonStyle} onClick={() => executeCommand(selectedDevice.id, 'panTilt', { pan: selectedDevice.currentState.panAngle - 10, tilt: selectedDevice.currentState.tiltAngle })}>⬅️</button>
                                                <span style={centerIndicatorStyle}>📷</span>
                                                <button style={directionButtonStyle} onClick={() => executeCommand(selectedDevice.id, 'panTilt', { pan: selectedDevice.currentState.panAngle + 10, tilt: selectedDevice.currentState.tiltAngle })}>➡️</button>
                                            </div>
                                            <button style={directionButtonStyle} onClick={() => executeCommand(selectedDevice.id, 'panTilt', { pan: selectedDevice.currentState.panAngle, tilt: selectedDevice.currentState.tiltAngle - 10 })}>⬇️</button>
                                        </div>
                                        <div style={zoomControlStyle}>
                                            <button style={zoomButtonStyle} onClick={() => executeCommand(selectedDevice.id, 'zoom', { value: Math.max(0.5, selectedDevice.currentState.zoomLevel - 0.5) })}>🔍➖</button>
                                            <span>{selectedDevice.currentState.zoomLevel}x</span>
                                            <button style={zoomButtonStyle} onClick={() => executeCommand(selectedDevice.id, 'zoom', { value: Math.min(5, selectedDevice.currentState.zoomLevel + 0.5) })}>🔍➕</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Preset Controls */}
                            {selectedDevice.controls.hasPresets && (
                                <div style={controlGroupStyle}>
                                    <h4>Quick Presets</h4>
                                    <div style={presetsGridStyle}>
                                        {selectedDevice.controls.presets.map(preset => (
                                            <button 
                                                key={preset.name}
                                                style={presetButtonStyle}
                                                onClick={() => executeCommand(selectedDevice.id, 'setPreset', { presetName: preset.name })}
                                                disabled={isExecutingCommand}
                                            >
                                                📋 {preset.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Emergency Controls */}
                            {selectedDevice.controls.hasEmergencyStop && (
                                <div style={emergencyControlStyle}>
                                    <button 
                                        style={emergencyButtonStyle}
                                        onClick={() => executeCommand(selectedDevice.id, 'emergencyStop')}
                                        disabled={isExecutingCommand}
                                    >
                                        🚨 EMERGENCY STOP
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    );

    // Live Command Center
    const LiveCommandCenter = () => (
        <div style={commandCenterStyle}>
            <div style={commandHeaderStyle}>
                <h3>⚡ Live Command Center</h3>
                <div style={commandStatsStyle}>
                    <span>Active: {liveCommands.filter(cmd => cmd.status === 'Executing').length}</span>
                    <span>Completed: {liveCommands.filter(cmd => cmd.status === 'Completed').length}</span>
                    <span>Queue: {commandQueue.length}</span>
                </div>
            </div>
            
            <div style={commandListStyle}>
                {liveCommands.length === 0 ? (
                    <div style={noCommandsStyle}>
                        <p>🎮 No commands executed yet</p>
                        <p>Select a device and start controlling!</p>
                    </div>
                ) : (
                    liveCommands.map(command => (
                        <div key={command.id} style={commandItemStyle(command.status)}>
                            <div style={commandInfoStyle}>
                                <strong>{command.command}</strong> on {command.deviceId}
                                <span style={commandTimeStyle}>{new Date(command.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div style={commandStatusStyle(command.status)}>
                                {command.status === 'Executing' ? '⏳' : '✅'} {command.status}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    // Main Control Grid
    const ControlGrid = () => (
        <div style={controlGridContainerStyle}>
            <div style={controlGridHeaderStyle}>
                <h3>🎮 IoT Device Control Center</h3>
                <div style={quickStatsStyle}>
                    <span>📱 {devices.systemStats.controllableDevices} Controllable</span>
                    <span>🟢 {devices.systemStats.onlineDevices} Online</span>
                    <span>⚡ {devices.systemStats.activeControls} Active Controls</span>
                    <span>📊 {devices.systemStats.commandsToday} Commands Today</span>
                </div>
            </div>

            <div style={devicesControlGridStyle}>
                {devices.devices.map(device => (
                    <div key={device.id} style={deviceControlCardStyle(device.status)}>
                        <div style={deviceCardHeaderStyle}>
                            <h4>{device.name}</h4>
                            <div style={deviceMetaStyle}>
                                <span style={deviceTypeTagStyle}>{device.type}</span>
                                <span style={statusTagStyle(device.status)}>{device.status}</span>
                            </div>
                        </div>

                        <div style={deviceCardBodyStyle}>
                            <div style={currentStateDisplayStyle}>
                                {Object.entries(device.currentState).slice(0, 3).map(([key, value]) => (
                                    <div key={key} style={stateItemStyle}>
                                        <span>{key.replace(/([A-Z])/g, ' $1')}: </span>
                                        <strong>
                                            {typeof value === 'boolean' ? (value ? '✅' : '❌') : 
                                             typeof value === 'number' ? value.toFixed(1) : value}
                                        </strong>
                                    </div>
                                ))}
                            </div>

                            <div style={quickControlsStyle}>
                                {device.controls.canToggle && (
                                    <button 
                                        style={quickControlButtonStyle}
                                        onClick={() => executeCommand(device.id, 'toggle')}
                                        disabled={isExecutingCommand}
                                    >
                                        {device.currentState.isOn || device.currentState.isRunning ? '🔴' : '🟢'}
                                    </button>
                                )}
                                
                                <button 
                                    style={fullControlButtonStyle}
                                    onClick={() => {
                                        setSelectedDevice(device);
                                        setShowControlModal(true);
                                    }}
                                >
                                    🎮 Full Control
                                </button>
                            </div>

                            <div style={lastCommandStyle}>
                                <small>Last: {device.lastCommand.action}</small>
                                <small>{new Date(device.lastCommand.timestamp).toLocaleTimeString()}</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Notification Panel
    const NotificationPanel = () => (
        <div style={notificationPanelStyle}>
            {notifications.map(notification => (
                <div key={notification.id} style={{...notificationStyle, borderLeft: `4px solid ${getNotificationColor(notification.type)}`}}>
                    <div style={notificationMessageStyle}>{notification.message}</div>
                    <div style={notificationTimeStyle}>{notification.timestamp}</div>
                </div>
            ))}
        </div>
    );

    const getNotificationColor = (type) => {
        switch(type) {
            case 'success': return '#10B981';
            case 'warning': return '#F59E0B';
            case 'info': return '#3B82F6';
            default: return '#6B7280';
        }
    };

    return (
    <div 
      className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 animate-fade-in"
      style={{ backgroundColor: '#FBF3D1' }}
    >
            {/* Header */}
            <header style={headerStyle}>
                <h1 style={titleStyle}>🎮 IoT Device Control Center</h1>
                <p style={subtitleStyle}>Real-time control and command of industrial IoT devices</p>
            </header>

            {/* Navigation */}
            <nav style={navStyle}>
                <button 
                    style={{...navButtonStyle, ...(activeView === 'control' ? activeNavButtonStyle : {})}}
                    onClick={() => setActiveView('control')}
                >
                    🎮 Device Control
                </button>
                <button 
                    style={{...navButtonStyle, ...(activeView === 'commands' ? activeNavButtonStyle : {})}}
                    onClick={() => setActiveView('commands')}
                >
                    ⚡ Command Center
                </button>
                <button 
                    style={{...navButtonStyle, ...(activeView === 'automation' ? activeNavButtonStyle : {})}}
                    onClick={() => setActiveView('automation')}
                >
                    🤖 Automation
                </button>
            </nav>

            {/* Main Content */}
            <main style={mainContentStyle}>
                {activeView === 'control' && <ControlGrid />}
                {activeView === 'commands' && <LiveCommandCenter />}
                {activeView === 'automation' && (
                    <div style={automationViewStyle}>
                        <h3>🤖 Automation Rules & Scheduling</h3>
                        <p>Configure automated responses and scheduled operations</p>
                        {/* Automation content would go here */}
                    </div>
                )}
            </main>

            {/* Notifications */}
            <NotificationPanel />

            {/* Control Modal */}
            <DeviceControlModal />
        </div>
    );
};

// --- CLEAN LIGHT THEME STYLING ---

const containerStyle = {
    fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
    padding: '20px',
    color: '#1f2937'
};

const headerStyle = {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #1e3a8a 100%)',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '24px',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 15px 35px rgba(59, 130, 246, 0.3)'
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
    opacity: '0.95'
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

// Control Grid Styles
const controlGridContainerStyle = {
    width: '100%'
};

const controlGridHeaderStyle = {
    marginBottom: '32px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e5e7eb'
};

const quickStatsStyle = {
    display: 'flex',
    gap: '24px',
    marginTop: '16px',
    flexWrap: 'wrap'
};

const devicesControlGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px'
};

const deviceControlCardStyle = (status) => ({
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: `3px solid ${status === DEVICE_STATUS.CONTROLLING ? '#10b981' : 
                         status === DEVICE_STATUS.ERROR ? '#ef4444' : '#e5e7eb'}`,
    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease'
});

const deviceCardHeaderStyle = {
    marginBottom: '16px'
};

const deviceMetaStyle = {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
    flexWrap: 'wrap'
};

const deviceTypeTagStyle = {
    padding: '4px 8px',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '8px',
    fontSize: '0.75em',
    fontWeight: '600'
};

const statusTagStyle = (status) => ({
    padding: '4px 8px',
    backgroundColor: status === DEVICE_STATUS.CONTROLLING ? '#10b981' : 
                    status === DEVICE_STATUS.ERROR ? '#ef4444' : '#6b7280',
    color: 'white',
    borderRadius: '8px',
    fontSize: '0.75em',
    fontWeight: '600'
});

const deviceCardBodyStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
};

const currentStateDisplayStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
};

const stateItemStyle = {
    fontSize: '0.9em',
    color: '#374151'
};

const quickControlsStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
};

const quickControlButtonStyle = {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontSize: '1.2em',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
};

const fullControlButtonStyle = {
    flex: 1,
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#10b981',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
};

const lastCommandStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8em',
    color: '#6b7280',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '12px'
};

// Control Modal Styles
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

const controlModalStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    maxWidth: '1200px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    color: '#1f2937'
};

const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '28px',
    borderBottom: '2px solid #e5e7eb',
    backgroundColor: '#f8fafc'
};

const modalSubtitleStyle = {
    margin: '8px 0 0 0',
    color: '#6b7280',
    fontSize: '1rem'
};

const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.8em',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    color: '#6b7280',
    transition: 'all 0.3s ease'
};

const controlModalBodyStyle = {
    padding: '28px',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '32px'
};

const deviceStatusPanelStyle = {
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
};

const statusGridStyle = {
    display: 'grid',
    gap: '12px',
    marginTop: '16px'
};

const statusItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
};

const statusKeyStyle = {
    color: '#6b7280',
    fontSize: '0.9em'
};

const statusValueStyle = (type) => ({
    fontWeight: '600',
    color: type === 'boolean' ? '#10b981' : '#374151'
});

const liveControlsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
};

const controlGroupStyle = {
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
};

const toggleButtonStyle = (isActive) => ({
    width: '100%',
    padding: '16px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: isActive ? '#ef4444' : '#10b981',
    color: 'white',
    fontSize: '1.1em',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
});

const sliderControlStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
};

const sliderStyle = {
    flex: 1,
    height: '8px',
    borderRadius: '4px',
    background: '#e5e7eb',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none'
};

const sliderValueStyle = {
    fontSize: '1.2em',
    fontWeight: '700',
    color: '#10b981',
    minWidth: '60px'
};

const temperatureControlStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px'
};

const tempButtonStyle = {
    width: '50px',
    height: '50px',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontSize: '1.5em',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
};

const tempDisplayStyle = {
    fontSize: '2em',
    fontWeight: '700',
    color: '#10b981',
    minWidth: '100px',
    textAlign: 'center'
};

const cameraControlsStyle = {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
};

const panTiltControlStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    width: '120px'
};

const directionButtonStyle = {
    width: '35px',
    height: '35px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontSize: '1em',
    cursor: 'pointer'
};

const middleRowStyle = {
    display: 'contents'
};

const centerIndicatorStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2em'
};

const zoomControlStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
};

const zoomButtonStyle = {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#10b981',
    color: 'white',
    cursor: 'pointer'
};

const presetsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
};

const presetButtonStyle = {
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#374151',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
};

const emergencyControlStyle = {
    padding: '20px',
    backgroundColor: '#fee2e2',
    borderRadius: '12px',
    border: '2px solid #ef4444'
};

const emergencyButtonStyle = {
    width: '100%',
    padding: '16px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#ef4444',
    color: 'white',
    fontSize: '1.2em',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    animation: 'pulse 1s infinite'
};

// Command Center Styles
const commandCenterStyle = {
    width: '100%'
};

const commandHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e5e7eb'
};

const commandStatsStyle = {
    display: 'flex',
    gap: '16px',
    fontSize: '0.9em',
    color: '#6b7280'
};

const commandListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '600px',
    overflowY: 'auto'
};

const noCommandsStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280'
};

const commandItemStyle = (status) => ({
    padding: '16px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `2px solid ${status === 'Executing' ? '#f59e0b' : '#10b981'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
});

const commandInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
};

const commandTimeStyle = {
    fontSize: '0.8em',
    color: '#6b7280'
};

const commandStatusStyle = (status) => ({
    padding: '6px 12px',
    borderRadius: '8px',
    backgroundColor: status === 'Executing' ? '#f59e0b' : '#10b981',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.9em'
});

const automationViewStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280'
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
    color: '#6b7280'
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
        50% { opacity: 0.7; }
    }
    
    button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }
    
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
    
    input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #10b981;
        cursor: pointer;
    }
    
    input[type="range"]::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #10b981;
        cursor: pointer;
        border: none;
    }
    
    .device-control-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.12);
    }
    
    .preset-button:hover {
        background-color: #3b82f6;
        color: white;
    }
    
    .close-button:hover {
        background-color: #f3f4f6;
        color: #374151;
    }
`;
document.head.appendChild(style);

export default IoTControlDashboard;
