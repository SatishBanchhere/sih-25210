import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

// --- ENERGY SAVING OPPORTUNITIES CONFIGURATION ---
const ENERGY_CATEGORIES = {
    COMMINUTION: 'Comminution (Grinding & Crushing)',
    VENTILATION: 'Mine Ventilation',
    MATERIALS_HANDLING: 'Materials Handling & Transport',
    PROCESS_OPTIMIZATION: 'Process Optimization',
    EQUIPMENT_EFFICIENCY: 'Equipment Efficiency',
    RENEWABLE_INTEGRATION: 'Renewable Energy Integration',
    WASTE_HEAT_RECOVERY: 'Waste Heat Recovery',
    DIGITAL_OPTIMIZATION: 'Digital & AI Optimization'
};

const OPPORTUNITY_STATUS = {
    IDENTIFIED: 'Identified',
    ANALYZING: 'Under Analysis',
    IMPLEMENTING: 'Implementation in Progress',
    COMPLETED: 'Completed',
    ON_HOLD: 'On Hold'
};

const PRIORITY_LEVELS = {
    CRITICAL: 'Critical',
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low'
};

const getRandomFloat = (min, max, decimals = 2) => 
    parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- ENERGY SAVING OPPORTUNITIES DATA ---
const initialEnergySavingData = {
    opportunities: [
        {
            id: 'ESO_001',
            title: 'Grinding Circuit Optimization',
            category: ENERGY_CATEGORIES.COMMINUTION,
            description: 'Implement advanced control systems for SAG and ball mills to optimize particle size distribution and reduce energy consumption.',
            currentEnergyUse: 2500, // kWh/day
            projectedSavings: 375, // kWh/day (15% reduction)
            costSavings: 28125, // $/year
            implementationCost: 150000,
            paybackPeriod: 5.3, // years
            co2Reduction: 187.5, // kg CO2/day
            priority: PRIORITY_LEVELS.HIGH,
            status: OPPORTUNITY_STATUS.ANALYZING,
            timeline: '6-8 months',
            complexity: 'Medium',
            riskLevel: 'Low',
            department: 'Processing',
            champion: 'Sarah Johnson - Process Engineer',
            roi: 18.8,
            implementationSteps: [
                'Install advanced control sensors',
                'Implement predictive algorithms',
                'Train operators on new systems',
                'Monitor and optimize parameters'
            ],
            kpis: [
                'Energy intensity (kWh/tonne)',
                'Particle size distribution',
                'Mill utilization rate',
                'Overall equipment effectiveness'
            ]
        },
        {
            id: 'ESO_002',
            title: 'Ventilation on Demand (VOD) System',
            category: ENERGY_CATEGORIES.VENTILATION,
            description: 'Install smart ventilation control system to reduce air flow when areas are unoccupied, achieving 30-50% energy reduction.',
            currentEnergyUse: 1800,
            projectedSavings: 720, // 40% reduction
            costSavings: 54000,
            implementationCost: 200000,
            paybackPeriod: 3.7,
            co2Reduction: 360,
            priority: PRIORITY_LEVELS.CRITICAL,
            status: OPPORTUNITY_STATUS.IMPLEMENTING,
            timeline: '4-6 months',
            complexity: 'High',
            riskLevel: 'Medium',
            department: 'Mine Operations',
            champion: 'Mike Torres - Ventilation Specialist',
            roi: 27.0,
            implementationSteps: [
                'Install occupancy sensors',
                'Upgrade ventilation controls',
                'Implement demand-based algorithms',
                'Test and commission system'
            ],
            kpis: [
                'Ventilation energy consumption',
                'Air quality metrics',
                'Occupancy detection accuracy',
                'System response time'
            ]
        },
        {
            id: 'ESO_003',
            title: 'Conveyor Belt Speed Optimization',
            category: ENERGY_CATEGORIES.MATERIALS_HANDLING,
            description: 'Implement variable speed drives and load-sensing technology to optimize conveyor speeds based on material flow.',
            currentEnergyUse: 800,
            projectedSavings: 160, // 20% reduction
            costSavings: 12000,
            implementationCost: 75000,
            paybackPeriod: 6.25,
            co2Reduction: 80,
            priority: PRIORITY_LEVELS.MEDIUM,
            status: OPPORTUNITY_STATUS.IDENTIFIED,
            timeline: '3-4 months',
            complexity: 'Low',
            riskLevel: 'Low',
            department: 'Materials Handling',
            champion: 'Alex Chen - Electrical Engineer',
            roi: 16.0,
            implementationSteps: [
                'Install variable frequency drives',
                'Add load sensing equipment',
                'Program control logic',
                'Test and optimize settings'
            ],
            kpis: [
                'Conveyor energy consumption',
                'Material throughput',
                'Belt utilization efficiency',
                'Motor efficiency'
            ]
        },
        {
            id: 'ESO_004',
            title: 'Waste Heat Recovery from Kilns',
            category: ENERGY_CATEGORIES.WASTE_HEAT_RECOVERY,
            description: 'Install heat exchangers to capture waste heat from rotary kilns and use for facility heating and hot water.',
            currentEnergyUse: 1200,
            projectedSavings: 300, // 25% reduction
            costSavings: 22500,
            implementationCost: 120000,
            paybackPeriod: 5.33,
            co2Reduction: 150,
            priority: PRIORITY_LEVELS.MEDIUM,
            status: OPPORTUNITY_STATUS.IDENTIFIED,
            timeline: '8-10 months',
            complexity: 'High',
            riskLevel: 'Medium',
            department: 'Processing',
            champion: 'Emma Rodriguez - Thermal Engineer',
            roi: 18.75,
            implementationSteps: [
                'Design heat recovery system',
                'Install heat exchangers',
                'Connect distribution piping',
                'Commission and optimize'
            ],
            kpis: [
                'Heat recovery efficiency',
                'Energy offset achieved',
                'System availability',
                'Maintenance requirements'
            ]
        },
        {
            id: 'ESO_005',
            title: 'AI-Powered Process Optimization',
            category: ENERGY_CATEGORIES.DIGITAL_OPTIMIZATION,
            description: 'Deploy machine learning algorithms to optimize entire plant operations in real-time for maximum energy efficiency.',
            currentEnergyUse: 3500,
            projectedSavings: 525, // 15% reduction
            costSavings: 39375,
            implementationCost: 180000,
            paybackPeriod: 4.57,
            co2Reduction: 262.5,
            priority: PRIORITY_LEVELS.HIGH,
            status: OPPORTUNITY_STATUS.ANALYZING,
            timeline: '12-15 months',
            complexity: 'High',
            riskLevel: 'Medium',
            department: 'Digital Innovation',
            champion: 'David Kim - Data Scientist',
            roi: 21.9,
            implementationSteps: [
                'Data collection and preparation',
                'Develop ML models',
                'Deploy optimization algorithms',
                'Continuous learning and improvement'
            ],
            kpis: [
                'Overall energy efficiency',
                'Process stability',
                'Predictive accuracy',
                'Autonomous optimization rate'
            ]
        },
        {
            id: 'ESO_006',
            title: 'High-Efficiency Motor Retrofits',
            category: ENERGY_CATEGORIES.EQUIPMENT_EFFICIENCY,
            description: 'Replace standard efficiency motors with premium efficiency units across critical applications.',
            currentEnergyUse: 1500,
            projectedSavings: 105, // 7% reduction
            costSavings: 7875,
            implementationCost: 85000,
            paybackPeriod: 10.79,
            co2Reduction: 52.5,
            priority: PRIORITY_LEVELS.LOW,
            status: OPPORTUNITY_STATUS.ON_HOLD,
            timeline: '6-8 months',
            complexity: 'Medium',
            riskLevel: 'Low',
            department: 'Maintenance',
            champion: 'Jennifer Park - Maintenance Manager',
            roi: 9.26,
            implementationSteps: [
                'Conduct motor efficiency audit',
                'Procure premium efficiency motors',
                'Schedule installation windows',
                'Verify performance improvements'
            ],
            kpis: [
                'Motor efficiency ratings',
                'Energy consumption reduction',
                'Reliability improvements',
                'Maintenance cost changes'
            ]
        },
        {
            id: 'ESO_007',
            title: 'Solar-Powered Auxiliary Systems',
            category: ENERGY_CATEGORIES.RENEWABLE_INTEGRATION,
            description: 'Install solar panels to power auxiliary systems like lighting, HVAC, and small equipment during daylight hours.',
            currentEnergyUse: 600,
            projectedSavings: 420, // 70% reduction during daylight
            costSavings: 31500,
            implementationCost: 180000,
            paybackPeriod: 5.71,
            co2Reduction: 210,
            priority: PRIORITY_LEVELS.MEDIUM,
            status: OPPORTUNITY_STATUS.IDENTIFIED,
            timeline: '4-6 months',
            complexity: 'Medium',
            riskLevel: 'Low',
            department: 'Facilities',
            champion: 'Robert Martinez - Facilities Manager',
            roi: 17.5,
            implementationSteps: [
                'Site solar assessment',
                'Design solar system',
                'Install panels and inverters',
                'Connect to auxiliary loads'
            ],
            kpis: [
                'Solar generation capacity',
                'Grid offset percentage',
                'System availability',
                'Environmental impact'
            ]
        },
        {
            id: 'ESO_008',
            title: 'Compressed Air System Optimization',
            category: ENERGY_CATEGORIES.EQUIPMENT_EFFICIENCY,
            description: 'Implement leak detection, pressure optimization, and demand-based control for compressed air systems.',
            currentEnergyUse: 450,
            projectedSavings: 135, // 30% reduction
            costSavings: 10125,
            implementationCost: 45000,
            paybackPeriod: 4.44,
            co2Reduction: 67.5,
            priority: PRIORITY_LEVELS.HIGH,
            status: OPPORTUNITY_STATUS.IMPLEMENTING,
            timeline: '2-3 months',
            complexity: 'Low',
            riskLevel: 'Low',
            department: 'Utilities',
            champion: 'Lisa Wong - Utilities Supervisor',
            roi: 22.5,
            implementationSteps: [
                'Conduct leak detection audit',
                'Install pressure optimization controls',
                'Implement demand-based sequencing',
                'Monitor and maintain system'
            ],
            kpis: [
                'Compressed air pressure',
                'System efficiency',
                'Leak rate',
                'Compressor loading'
            ]
        }
    ],
    globalMetrics: {
        totalCurrentConsumption: 12350, // kWh/day
        totalPotentialSavings: 2740, // kWh/day
        totalCostSavings: 205500, // $/year
        totalImplementationCost: 1035000,
        averagePaybackPeriod: 5.8,
        totalCo2Reduction: 1370, // kg CO2/day
        overallEfficiencyGain: 22.2 // %
    }
};

// --- MAIN ENERGY SAVING OPPORTUNITIES COMPONENT ---
const EnergySavingOpportunities = () => {
    const [energyData, setEnergyData] = useState(initialEnergySavingData);
    const [activeView, setActiveView] = useState('overview');
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [sortBy, setSortBy] = useState('roi');
    const [notifications, setNotifications] = useState([]);

    // Add notification function
    const addNotification = useCallback((message, type) => {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toLocaleTimeString()
        };
        setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    }, []);

    // Filtered and sorted opportunities
    const filteredOpportunities = useMemo(() => {
        return energyData.opportunities
            .filter(opp => {
                if (filterCategory !== 'All' && opp.category !== filterCategory) return false;
                if (filterStatus !== 'All' && opp.status !== filterStatus) return false;
                if (filterPriority !== 'All' && opp.priority !== filterPriority) return false;
                return true;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'roi': return b.roi - a.roi;
                    case 'savings': return b.projectedSavings - a.projectedSavings;
                    case 'payback': return a.paybackPeriod - b.paybackPeriod;
                    case 'co2': return b.co2Reduction - a.co2Reduction;
                    default: return 0;
                }
            });
    }, [energyData.opportunities, filterCategory, filterStatus, filterPriority, sortBy]);

    // Chart data preparation
    const categoryDistributionData = {
        labels: Object.values(ENERGY_CATEGORIES),
        datasets: [{
            data: Object.values(ENERGY_CATEGORIES).map(category => 
                energyData.opportunities
                    .filter(opp => opp.category === category)
                    .reduce((sum, opp) => sum + opp.projectedSavings, 0)
            ),
            backgroundColor: [
                '#EF4444', '#F97316', '#F59E0B', '#84CC16',
                '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6'
            ],
            borderWidth: 3,
            borderColor: '#fff'
        }]
    };

    const savingsVsInvestmentData = {
        datasets: [{
            label: 'Energy Saving Opportunities',
            data: energyData.opportunities.map(opp => ({
                x: opp.implementationCost / 1000, // Convert to thousands
                y: opp.costSavings / 1000, // Convert to thousands
                r: opp.projectedSavings / 10 // Size based on energy savings
            })),
            backgroundColor: energyData.opportunities.map(opp => {
                switch (opp.priority) {
                    case PRIORITY_LEVELS.CRITICAL: return 'rgba(239, 68, 68, 0.7)';
                    case PRIORITY_LEVELS.HIGH: return 'rgba(245, 158, 11, 0.7)';
                    case PRIORITY_LEVELS.MEDIUM: return 'rgba(16, 185, 129, 0.7)';
                    default: return 'rgba(107, 114, 128, 0.7)';
                }
            }),
            borderColor: '#fff',
            borderWidth: 2
        }]
    };

    const monthlyProgressData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Cumulative Energy Savings (kWh)',
                data: [0, 160, 320, 480, 800, 1200, 1600, 2000, 2200, 2400, 2600, 2740],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Cumulative Cost Savings ($K)',
                data: [0, 12, 24, 36, 60, 90, 120, 150, 165, 180, 195, 205.5],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    };

    // Component renderers
    const OverviewDashboard = () => (
        <div style={overviewContainerStyle}>
            {/* Key Metrics Section */}
            <div style={metricsGridStyle}>
                <div style={{...metricCardStyle, borderLeft: '6px solid #EF4444'}}>
                    <div style={metricHeaderStyle}>
                        <span style={metricIconStyle}>⚡</span>
                        <h3>Total Energy Savings</h3>
                    </div>
                    <div style={metricValueStyle}>
                        {energyData.globalMetrics.totalPotentialSavings.toLocaleString()}
                        <span style={metricUnitStyle}>kWh/day</span>
                    </div>
                    <div style={metricSubtextStyle}>
                        {energyData.globalMetrics.overallEfficiencyGain}% efficiency improvement
                    </div>
                </div>

                <div style={{...metricCardStyle, borderLeft: '6px solid #10B981'}}>
                    <div style={metricHeaderStyle}>
                        <span style={metricIconStyle}>💰</span>
                        <h3>Annual Cost Savings</h3>
                    </div>
                    <div style={metricValueStyle}>
                        ${(energyData.globalMetrics.totalCostSavings / 1000).toFixed(0)}K
                        <span style={metricUnitStyle}>per year</span>
                    </div>
                    <div style={metricSubtextStyle}>
                        Average payback: {energyData.globalMetrics.averagePaybackPeriod} years
                    </div>
                </div>

                <div style={{...metricCardStyle, borderLeft: '6px solid #3B82F6'}}>
                    <div style={metricHeaderStyle}>
                        <span style={metricIconStyle}>🌱</span>
                        <h3>CO₂ Reduction</h3>
                    </div>
                    <div style={metricValueStyle}>
                        {(energyData.globalMetrics.totalCo2Reduction / 1000).toFixed(1)}
                        <span style={metricUnitStyle}>tonnes CO₂/day</span>
                    </div>
                    <div style={metricSubtextStyle}>
                        {(energyData.globalMetrics.totalCo2Reduction * 365 / 1000).toFixed(0)} tonnes annually
                    </div>
                </div>

                <div style={{...metricCardStyle, borderLeft: '6px solid #F59E0B'}}>
                    <div style={metricHeaderStyle}>
                        <span style={metricIconStyle}>🎯</span>
                        <h3>Implementation Cost</h3>
                    </div>
                    <div style={metricValueStyle}>
                        ${(energyData.globalMetrics.totalImplementationCost / 1000000).toFixed(1)}M
                        <span style={metricUnitStyle}>total investment</span>
                    </div>
                    <div style={metricSubtextStyle}>
                        {energyData.opportunities.length} opportunities identified
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div style={chartsContainerStyle}>
                <div style={chartCardStyle}>
                    <h4>💡 Savings by Category</h4>
                    <Doughnut 
                        data={categoryDistributionData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'right' },
                                title: { display: true, text: 'Energy Savings Distribution (kWh/day)' }
                            }
                        }}
                    />
                </div>


                <div style={{...chartCardStyle, gridColumn: '1 / -1'}}>
                    <h4>📈 Cumulative Savings Projection</h4>
                    <Line 
                        data={monthlyProgressData}
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
                            },
                            plugins: {
                                title: { display: true, text: 'Projected Implementation Timeline & Savings' }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );

    const OpportunitiesGrid = () => (
        <div style={opportunitiesContainerStyle}>
            {/* Filters Section */}
            <div style={filtersContainerStyle}>
                <div style={filterRowStyle}>
                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Category:</label>
                        <select 
                            style={filterSelectStyle} 
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            {Object.values(ENERGY_CATEGORIES).map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Status:</label>
                        <select 
                            style={filterSelectStyle} 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            {Object.values(OPPORTUNITY_STATUS).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Priority:</label>
                        <select 
                            style={filterSelectStyle} 
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                        >
                            <option value="All">All Priorities</option>
                            {Object.values(PRIORITY_LEVELS).map(priority => (
                                <option key={priority} value={priority}>{priority}</option>
                            ))}
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Sort by:</label>
                        <select 
                            style={filterSelectStyle} 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="roi">ROI (Highest First)</option>
                            <option value="savings">Energy Savings</option>
                            <option value="payback">Payback Period</option>
                            <option value="co2">CO₂ Reduction</option>
                        </select>
                    </div>
                </div>

                <div style={filterSummaryStyle}>
                    Showing {filteredOpportunities.length} of {energyData.opportunities.length} opportunities
                    • Total potential savings: {filteredOpportunities.reduce((sum, opp) => sum + opp.projectedSavings, 0).toLocaleString()} kWh/day
                </div>
            </div>

            {/* Opportunities Grid */}
            <div style={opportunitiesGridStyle}>
                {filteredOpportunities.map(opportunity => (
                    <div 
                        key={opportunity.id} 
                        style={opportunityCardStyle(opportunity.priority)}
                        onClick={() => {
                            setSelectedOpportunity(opportunity);
                            setShowDetailModal(true);
                        }}
                    >
                        <div style={opportunityHeaderStyle}>
                            <h3 style={opportunityTitleStyle}>{opportunity.title}</h3>
                            <div style={opportunityMetaStyle}>
                                <span style={priorityBadgeStyle(opportunity.priority)}>
                                    {opportunity.priority}
                                </span>
                                <span style={statusBadgeStyle(opportunity.status)}>
                                    {opportunity.status}
                                </span>
                            </div>
                        </div>

                        <div style={opportunityBodyStyle}>
                            <p style={opportunityDescriptionStyle}>
                                {opportunity.description}
                            </p>

                            <div style={opportunityMetricsStyle}>
                                <div style={metricItemStyle}>
                                    <span style={metricLabelStyle}>Energy Savings:</span>
                                    <strong>{opportunity.projectedSavings} kWh/day</strong>
                                </div>
                                <div style={metricItemStyle}>
                                    <span style={metricLabelStyle}>Cost Savings:</span>
                                    <strong>${(opportunity.costSavings / 1000).toFixed(0)}K/year</strong>
                                </div>
                                <div style={metricItemStyle}>
                                    <span style={metricLabelStyle}>ROI:</span>
                                    <strong>{opportunity.roi.toFixed(1)}%</strong>
                                </div>
                                <div style={metricItemStyle}>
                                    <span style={metricLabelStyle}>Payback:</span>
                                    <strong>{opportunity.paybackPeriod.toFixed(1)} years</strong>
                                </div>
                                <div style={metricItemStyle}>
                                    <span style={metricLabelStyle}>CO₂ Reduction:</span>
                                    <strong>{opportunity.co2Reduction} kg/day</strong>
                                </div>
                                <div style={metricItemStyle}>
                                    <span style={metricLabelStyle}>Timeline:</span>
                                    <strong>{opportunity.timeline}</strong>
                                </div>
                            </div>

                            <div style={opportunityFooterStyle}>
                                <span style={categoryLabelStyle}>
                                    {opportunity.category}
                                </span>
                                <span style={championStyle}>
                                    Champion: {opportunity.champion}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const DetailModal = () => (
        showDetailModal && selectedOpportunity && (
            <div style={modalOverlayStyle} onClick={() => setShowDetailModal(false)}>
                <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
                    <div style={modalHeaderStyle}>
                        <h2>{selectedOpportunity.title}</h2>
                        <button 
                            style={closeButtonStyle}
                            onClick={() => setShowDetailModal(false)}
                        >
                            ✕
                        </button>
                    </div>

                    <div style={modalBodyStyle}>
                        <div style={modalMetaInfoStyle}>
                            <div><strong>Category:</strong> {selectedOpportunity.category}</div>
                            <div><strong>Department:</strong> {selectedOpportunity.department}</div>
                            <div><strong>Champion:</strong> {selectedOpportunity.champion}</div>
                            <div><strong>Complexity:</strong> {selectedOpportunity.complexity}</div>
                            <div><strong>Risk Level:</strong> {selectedOpportunity.riskLevel}</div>
                        </div>

                        <div style={modalSectionStyle}>
                            <h4>💡 Opportunity Description</h4>
                            <p>{selectedOpportunity.description}</p>
                        </div>

                        <div style={modalMetricsGridStyle}>
                            <div style={modalMetricCardStyle}>
                                <h5>⚡ Energy Impact</h5>
                                <div>Current Use: {selectedOpportunity.currentEnergyUse} kWh/day</div>
                                <div>Projected Savings: {selectedOpportunity.projectedSavings} kWh/day</div>
                                <div>Reduction: {((selectedOpportunity.projectedSavings / selectedOpportunity.currentEnergyUse) * 100).toFixed(1)}%</div>
                            </div>

                            <div style={modalMetricCardStyle}>
                                <h5>💰 Financial Impact</h5>
                                <div>Annual Savings: ${selectedOpportunity.costSavings.toLocaleString()}</div>
                                <div>Implementation Cost: ${selectedOpportunity.implementationCost.toLocaleString()}</div>
                                <div>ROI: {selectedOpportunity.roi.toFixed(1)}%</div>
                            </div>

                            <div style={modalMetricCardStyle}>
                                <h5>🌱 Environmental Impact</h5>
                                <div>Daily CO₂ Reduction: {selectedOpportunity.co2Reduction} kg</div>
                                <div>Annual CO₂ Reduction: {(selectedOpportunity.co2Reduction * 365 / 1000).toFixed(1)} tonnes</div>
                            </div>

                            <div style={modalMetricCardStyle}>
                                <h5>📅 Implementation Timeline</h5>
                                <div>Estimated Duration: {selectedOpportunity.timeline}</div>
                                <div>Payback Period: {selectedOpportunity.paybackPeriod.toFixed(1)} years</div>
                            </div>
                        </div>

                        <div style={modalSectionStyle}>
                            <h4>🚀 Implementation Steps</h4>
                            <ol style={implementationListStyle}>
                                {selectedOpportunity.implementationSteps.map((step, index) => (
                                    <li key={index} style={implementationStepStyle}>{step}</li>
                                ))}
                            </ol>
                        </div>

                        <div style={modalSectionStyle}>
                            <h4>📊 Key Performance Indicators</h4>
                            <div style={kpiGridStyle}>
                                {selectedOpportunity.kpis.map((kpi, index) => (
                                    <div key={index} style={kpiItemStyle}>{kpi}</div>
                                ))}
                            </div>
                        </div>

                        <div style={modalActionsStyle}>
                            <button 
                                style={actionButtonStyle('approve')}
                                onClick={() => {
                                    addNotification(`Approved implementation for: ${selectedOpportunity.title}`, 'success');
                                    setShowDetailModal(false);
                                }}
                            >
                                ✅ Approve Implementation
                            </button>
                            <button 
                                style={actionButtonStyle('analyze')}
                                onClick={() => {
                                    addNotification(`Analysis requested for: ${selectedOpportunity.title}`, 'info');
                                    setShowDetailModal(false);
                                }}
                            >
                                🔍 Request Analysis
                            </button>
                            <button 
                                style={actionButtonStyle('defer')}
                                onClick={() => {
                                    addNotification(`Deferred implementation: ${selectedOpportunity.title}`, 'warning');
                                    setShowDetailModal(false);
                                }}
                            >
                                ⏸️ Defer Implementation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );

    const NotificationPanel = () => (
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
    );

    const getNotificationColor = (type) => {
        switch(type) {
            case 'success': return '#10B981';
            case 'warning': return '#F59E0B';
            case 'info': return '#3B82F6';
            default: return '#6B7280';
        }
    };

    // Main render
    return (
    <div 
      className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 animate-fade-in"
      style={{ backgroundColor: '#FBF3D1' }}
    >
            {/* Header */}
            <header style={headerStyle}>
                <h1 style={titleStyle}>💡 Energy Saving Opportunities Dashboard</h1>
                <p style={subtitleStyle}>
                    Comprehensive analysis of energy efficiency improvements across mining operations
                </p>
            </header>

            {/* Navigation */}
            <nav style={navStyle}>
                <button 
                    style={{
                        ...navButtonStyle,
                        ...(activeView === 'overview' ? activeNavButtonStyle : {})
                    }}
                    onClick={() => setActiveView('overview')}
                >
                    📊 Savings Overview
                </button>
                <button 
                    style={{
                        ...navButtonStyle,
                        ...(activeView === 'opportunities' ? activeNavButtonStyle : {})
                    }}
                    onClick={() => setActiveView('opportunities')}
                >
                    💡 All Opportunities
                </button>
                <button 
                    style={{
                        ...navButtonStyle,
                        ...(activeView === 'implementation' ? activeNavButtonStyle : {})
                    }}
                    onClick={() => setActiveView('implementation')}
                >
                    🚀 Implementation Plan
                </button>
            </nav>

            {/* Main Content */}
            <main style={mainContentStyle}>
                {activeView === 'overview' && <OverviewDashboard />}
                {activeView === 'opportunities' && <OpportunitiesGrid />}
                {activeView === 'implementation' && (
                    <div style={implementationViewStyle}>
                        <h3>🚀 Implementation Roadmap</h3>
                        <div style={roadmapContainerStyle}>
                            {energyData.opportunities
                                .filter(opp => opp.status !== OPPORTUNITY_STATUS.COMPLETED)
                                .sort((a, b) => {
                                    const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                                })
                                .map((opp, index) => (
                                    <div key={opp.id} style={roadmapItemStyle(opp.priority)}>
                                        <div style={roadmapItemHeaderStyle}>
                                            <h4>{opp.title}</h4>
                                            <span style={priorityBadgeStyle(opp.priority)}>{opp.priority}</span>
                                        </div>
                                        <div style={roadmapItemBodyStyle}>
                                            <div>Timeline: {opp.timeline}</div>
                                            <div>Investment: ${(opp.implementationCost / 1000).toFixed(0)}K</div>
                                            <div>Annual Savings: ${(opp.costSavings / 1000).toFixed(0)}K</div>
                                            <div>Status: {opp.status}</div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Notifications */}
            <NotificationPanel />

            {/* Detail Modal */}
            <DetailModal />
        </div>
    );
};

// --- COMPREHENSIVE STYLING ---

const containerStyle = {
    fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
    padding: '20px'
};

const headerStyle = {
    background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '24px',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 15px 35px rgba(16, 185, 129, 0.3)'
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
    backgroundColor: '#10b981',
    color: 'white',
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
};

const mainContentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '36px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
    minHeight: '700px'
};

// Overview Styles
const overviewContainerStyle = {
    width: '100%'
};

const metricsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '36px'
};

const metricCardStyle = {
    padding: '28px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    border: '1px solid #e2e8f0'
};

const metricHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px'
};

const metricIconStyle = {
    fontSize: '2.5em',
    marginRight: '16px'
};

const metricValueStyle = {
    fontSize: '2.5em',
    fontWeight: '800',
    color: '#1f2937',
    lineHeight: '1',
    marginBottom: '8px'
};

const metricUnitStyle = {
    fontSize: '0.4em',
    color: '#64748b',
    fontWeight: '500',
    marginLeft: '8px'
};

const metricSubtextStyle = {
    color: '#64748b',
    fontSize: '0.9em',
    fontWeight: '500'
};

const chartsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '28px'
};

const chartCardStyle = {
    padding: '28px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
};

// Opportunities Styles
const opportunitiesContainerStyle = {
    width: '100%'
};

const filtersContainerStyle = {
    marginBottom: '32px',
    padding: '24px',
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    border: '2px solid #e2e8f0'
};

const filterRowStyle = {
    display: 'flex',
    gap: '24px',
    marginBottom: '16px',
    flexWrap: 'wrap',
    alignItems: 'end'
};

const filterGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '200px'
};

const filterLabelStyle = {
    fontSize: '0.9em',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
};

const filterSelectStyle = {
    padding: '10px 14px',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    fontSize: '0.9em',
    cursor: 'pointer'
};

const filterSummaryStyle = {
    fontSize: '0.95em',
    color: '#64748b',
    fontWeight: '500'
};

const opportunitiesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '24px'
};

const opportunityCardStyle = (priority) => ({
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `3px solid ${getPriorityColor(priority)}`,
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
});

const getPriorityColor = (priority) => {
    switch (priority) {
        case PRIORITY_LEVELS.CRITICAL: return '#EF4444';
        case PRIORITY_LEVELS.HIGH: return '#F59E0B';
        case PRIORITY_LEVELS.MEDIUM: return '#10B981';
        default: return '#6B7280';
    }
};

const opportunityHeaderStyle = {
    marginBottom: '16px'
};

const opportunityTitleStyle = {
    margin: '0 0 8px 0',
    fontSize: '1.3em',
    fontWeight: '700',
    color: '#1f2937'
};

const opportunityMetaStyle = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
};

const priorityBadgeStyle = (priority) => ({
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75em',
    fontWeight: '600',
    color: 'white',
    backgroundColor: getPriorityColor(priority)
});

const statusBadgeStyle = (status) => ({
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75em',
    fontWeight: '600',
    color: '#1f2937',
    backgroundColor: '#e5e7eb'
});

const opportunityBodyStyle = {
    marginBottom: '16px'
};

const opportunityDescriptionStyle = {
    fontSize: '0.9em',
    color: '#4b5563',
    lineHeight: '1.5',
    marginBottom: '16px'
};

const opportunityMetricsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    marginBottom: '16px'
};

const metricItemStyle = {
    fontSize: '0.85em',
    display: 'flex',
    justifyContent: 'space-between'
};

const metricLabelStyle = {
    color: '#64748b'
};

const opportunityFooterStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8em',
    color: '#64748b',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '12px'
};

const categoryLabelStyle = {
    fontWeight: '600'
};

const championStyle = {
    fontStyle: 'italic'
};

// Modal Styles
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

const modalContentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    maxWidth: '1000px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
};

const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '28px',
    borderBottom: '2px solid #e2e8f0',
    backgroundColor: '#f8fafc'
};

const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.8em',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    color: '#64748b'
};

const modalBodyStyle = {
    padding: '28px'
};

const modalMetaInfoStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '0.9em'
};

const modalSectionStyle = {
    marginBottom: '24px'
};

const modalMetricsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '24px'
};

const modalMetricCardStyle = {
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
};

const implementationListStyle = {
    paddingLeft: '20px',
    lineHeight: '1.6'
};

const implementationStepStyle = {
    marginBottom: '8px',
    fontSize: '0.95em'
};

const kpiGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
};

const kpiItemStyle = {
    padding: '8px 12px',
    backgroundColor: '#f1f5f9',
    borderRadius: '6px',
    fontSize: '0.85em',
    fontWeight: '500'
};

const modalActionsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '2px solid #e2e8f0'
};

const actionButtonStyle = (type) => {
    const colors = {
        approve: '#10B981',
        analyze: '#3B82F6',
        defer: '#F59E0B'
    };
    return {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: colors[type],
        color: 'white',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    };
};

// Implementation View Styles
const implementationViewStyle = {
    width: '100%'
};

const roadmapContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
};

const roadmapItemStyle = (priority) => ({
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: `3px solid ${getPriorityColor(priority)}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
});

const roadmapItemHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
};

const roadmapItemBodyStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    fontSize: '0.9em',
    color: '#64748b'
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
    
    .opportunity-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.15);
    }
    
    .metric-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.12);
    }
    
    button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }
    
    select:focus, input:focus {
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        outline: none;
    }
`;
document.head.appendChild(style);

export default EnergySavingOpportunities;
