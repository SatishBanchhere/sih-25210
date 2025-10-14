import { useState, useEffect } from "react";
import { GlassCard } from "@/components/Dashboard/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Activity, 
    TrendingDown,
    TrendingUp,
    Battery,
    Leaf,
    Zap,
    Target,
    DollarSign,
    Gauge,
    Award,
    Lightbulb,
    Factory,
    Wind,
    Sun,
    Cpu,
    BarChart3,
    PieChart,
    Settings,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    ArrowUp,
    ArrowDown
} from "lucide-react";
import { 
  ComposedChart, 
  Line, 
  Bar, 
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import React from "react";

// --- COMPREHENSIVE ENERGY SAVINGS DATA ---

const BASELINE_ENERGY = 50; // % of total mining energy
const OPTIMIZED_ENERGY = 35; // % after optimization
const ENERGY_SAVINGS_PERCENTAGE = 15; // % saved
const ANNUAL_COST_SAVINGS = 9125000; // USD

// Energy savings by initiative
const energySavingInitiatives = [
  {
    id: 'comminution',
    name: 'Comminution Optimization',
    category: 'Process Control',
    baselineConsumption: 2500,
    currentConsumption: 2125,
    savingsPercentage: 15,
    annualSavings: 375000,
    co2Reduction: 1875,
    status: 'Implemented',
    roi: 18.5,
    icon: <Factory className="h-5 w-5" />,
    color: '#EF4444'
  },
  {
    id: 'renewable',
    name: 'Renewable Energy Integration',
    category: 'Clean Energy',
    baselineConsumption: 12350,
    currentConsumption: 9608,
    savingsPercentage: 22.2,
    annualSavings: 2740000,
    co2Reduction: 13700,
    status: 'Operational',
    roi: 27.0,
    icon: <Sun className="h-5 w-5" />,
    color: '#10B981'
  },
  {
    id: 'ventilation',
    name: 'Ventilation on Demand',
    category: 'Smart Systems',
    baselineConsumption: 1800,
    currentConsumption: 1080,
    savingsPercentage: 40,
    annualSavings: 720000,
    co2Reduction: 3600,
    status: 'Operational',
    roi: 24.0,
    icon: <Wind className="h-5 w-5" />,
    color: '#06B6D4'
  },
  {
    id: 'iot_control',
    name: 'IoT Device Optimization',
    category: 'Digital Control',
    baselineConsumption: 3200,
    currentConsumption: 2720,
    savingsPercentage: 15,
    annualSavings: 480000,
    co2Reduction: 2400,
    status: 'Active',
    roi: 32.5,
    icon: <Cpu className="h-5 w-5" />,
    color: '#8B5CF6'
  },
  {
    id: 'predictive_maintenance',
    name: 'Predictive Maintenance',
    category: 'AI-Driven',
    baselineConsumption: 1500,
    currentConsumption: 1275,
    savingsPercentage: 15,
    annualSavings: 225000,
    co2Reduction: 1125,
    status: 'Implemented',
    roi: 45.8,
    icon: <Settings className="h-5 w-5" />,
    color: '#F59E0B'
  },
  {
    id: 'digital_twin',
    name: 'Digital Twin Optimization',
    category: 'Simulation',
    baselineConsumption: 4800,
    currentConsumption: 3648,
    savingsPercentage: 24,
    annualSavings: 1152000,
    co2Reduction: 5760,
    status: 'Active',
    roi: 28.3,
    icon: <BarChart3 className="h-5 w-5" />,
    color: '#EC4899'
  }
];

// Monthly trend data
const monthlyTrendData = [
  { month: 'Jan', baseline: 50, actual: 48, target: 35, savings: 4 },
  { month: 'Feb', baseline: 50, actual: 46, target: 35, savings: 8 },
  { month: 'Mar', baseline: 50, actual: 44, target: 35, savings: 12 },
  { month: 'Apr', baseline: 50, actual: 42, target: 35, savings: 16 },
  { month: 'May', baseline: 50, actual: 39, target: 35, savings: 22 },
  { month: 'Jun', baseline: 50, actual: 37, target: 35, savings: 26 },
  { month: 'Jul', baseline: 50, actual: 36, target: 35, savings: 28 },
  { month: 'Aug', baseline: 50, actual: 35.5, target: 35, savings: 29 },
  { month: 'Sep', baseline: 50, actual: 35.2, target: 35, savings: 29.6 },
  { month: 'Oct', baseline: 50, actual: 35, target: 35, savings: 30 },
];

// Energy distribution data
const energyDistributionData = energySavingInitiatives.map(initiative => ({
  name: initiative.name,
  value: initiative.currentConsumption,
  savings: initiative.baselineConsumption - initiative.currentConsumption,
  color: initiative.color
}));

// Savings by category
const savingsByCategoryData = [
  { category: 'Process Control', savings: 600000, percentage: 6.6 },
  { category: 'Clean Energy', savings: 2740000, percentage: 30.0 },
  { category: 'Smart Systems', savings: 720000, percentage: 7.9 },
  { category: 'Digital Control', savings: 480000, percentage: 5.3 },
  { category: 'AI-Driven', savings: 1377000, percentage: 15.1 },
  { category: 'Simulation', savings: 3208000, percentage: 35.1 }
];

const COLORS = ['#EF4444', '#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EC4899'];

const EnergySavingsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [animatedSavings, setAnimatedSavings] = useState(0);

  // Animate savings counter
  useEffect(() => {
    let interval;
    if (animatedSavings < ENERGY_SAVINGS_PERCENTAGE) {
      interval = setInterval(() => {
        setAnimatedSavings(prev => {
          const next = prev + 0.5;
          return next > ENERGY_SAVINGS_PERCENTAGE ? ENERGY_SAVINGS_PERCENTAGE : next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [animatedSavings]);

  // Calculate totals
  const totalBaselineConsumption = energySavingInitiatives.reduce((sum, init) => sum + init.baselineConsumption, 0);
  const totalCurrentConsumption = energySavingInitiatives.reduce((sum, init) => sum + init.currentConsumption, 0);
  const totalAnnualSavings = energySavingInitiatives.reduce((sum, init) => sum + init.annualSavings, 0);
  const totalCo2Reduction = energySavingInitiatives.reduce((sum, init) => sum + init.co2Reduction, 0);
  const averageROI = energySavingInitiatives.reduce((sum, init) => sum + init.roi, 0) / energySavingInitiatives.length;

  return (
    <div 
      className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 animate-fade-in"
      style={{ backgroundColor: '#FBF3D1' }}
    >
      {/* Hero Section - Energy Savings Achievement */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12" style={{
        background: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)',
        boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4)'
      }}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              15% Energy Savings Achieved
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-white opacity-95 mb-8">
            Mining Energy Consumption Reduced: 50% → 35% = 15% PROFIT INCREASE
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-white" />
                <p className="text-white text-sm font-medium">Energy Reduction</p>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white">{animatedSavings.toFixed(1)}%</p>
              <p className="text-white text-xs mt-1 opacity-90">From 50% to 35%</p>
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-white" />
                <p className="text-white text-sm font-medium">Annual Savings</p>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white">${(totalAnnualSavings / 1000000).toFixed(1)}M</p>
              <p className="text-white text-xs mt-1 opacity-90">Cost reduction</p>
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="h-5 w-5 text-white" />
                <p className="text-white text-sm font-medium">CO₂ Reduction</p>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white">{(totalCo2Reduction / 1000).toFixed(1)}k</p>
              <p className="text-white text-xs mt-1 opacity-90">tonnes/year</p>
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-white" />
                <p className="text-white text-sm font-medium">Average ROI</p>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white">{averageROI.toFixed(1)}%</p>
              <p className="text-white text-xs mt-1 opacity-90">Return on investment</p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-12 gap-2" style={{ backgroundColor: 'transparent' }}>
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-gray-700 font-semibold py-2 sm:py-3 rounded-lg"
          >
            📊 Overview
          </TabsTrigger>
          <TabsTrigger 
            value="initiatives"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-gray-700 font-semibold py-2 sm:py-3 rounded-lg"
          >
            🎯 Initiatives
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-gray-700 font-semibold py-2 sm:py-3 rounded-lg"
          >
            📈 Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="impact"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-gray-700 font-semibold py-2 sm:py-3 rounded-lg"
          >
            🌍 Impact
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Progress to Target */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">15% Energy Savings Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Current Achievement</span>
                  <span className="text-sm font-bold text-green-600">{ENERGY_SAVINGS_PERCENTAGE}% / {ENERGY_SAVINGS_PERCENTAGE}% Target</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-end pr-3 transition-all duration-1000"
                    style={{ width: `${(animatedSavings / ENERGY_SAVINGS_PERCENTAGE) * 100}%` }}
                  >
                    <span className="text-white text-xs font-bold">100% Achieved</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-600 font-medium mb-1">Baseline</p>
                  <p className="text-2xl font-bold text-red-600">{BASELINE_ENERGY}%</p>
                  <p className="text-xs text-gray-600 mt-1">Energy consumption</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 font-medium mb-1">Optimized</p>
                  <p className="text-2xl font-bold text-green-600">{OPTIMIZED_ENERGY}%</p>
                  <p className="text-xs text-gray-600 mt-1">Current consumption</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium mb-1">Saved</p>
                  <p className="text-2xl font-bold text-blue-600">{ENERGY_SAVINGS_PERCENTAGE}%</p>
                  <p className="text-xs text-gray-600 mt-1">Total reduction</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Monthly Trend */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Energy Consumption Trend (Monthly)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" label={{ value: 'Energy %', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '2px solid #10B981',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="baseline" stroke="#EF4444" fill="transparent" strokeDasharray="5 5" name="Baseline (50%)" />
                <Area type="monotone" dataKey="actual" stroke="#10B981" fill="url(#actualGrad)" strokeWidth={3} name="Actual Consumption" />
                <Line type="monotone" dataKey="target" stroke="#3B82F6" strokeWidth={2} strokeDasharray="3 3" name="Target (35%)" />
              </ComposedChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Battery className="h-8 w-8 text-blue-600" />
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-sm text-gray-600 mb-2">Total Energy Saved</h4>
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {((totalBaselineConsumption - totalCurrentConsumption) / 1000).toFixed(1)}k kWh
              </p>
              <p className="text-xs text-green-600 font-medium">↓ {ENERGY_SAVINGS_PERCENTAGE}% reduction achieved</p>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-8 w-8 text-yellow-600" />
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-sm text-gray-600 mb-2">Monthly Cost Savings</h4>
              <p className="text-3xl font-bold text-yellow-600 mb-1">
                ${(totalAnnualSavings / 12 / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-green-600 font-medium">↑ ${(totalAnnualSavings / 1000000).toFixed(1)}M annually</p>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-sm text-gray-600 mb-2">Environmental Impact</h4>
              <p className="text-3xl font-bold text-green-600 mb-1">
                {(totalCo2Reduction / 1000).toFixed(0)}T CO₂
              </p>
              <p className="text-xs text-green-600 font-medium">↓ Annual reduction</p>
            </GlassCard>
          </div>
        </TabsContent>

        {/* Initiatives Tab */}
        <TabsContent value="initiatives" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {energySavingInitiatives.map((initiative) => (
              <GlassCard 
                key={initiative.id}
                className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedInitiative(initiative)}
                style={{
                  borderLeft: `6px solid ${initiative.color}`
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-3 rounded-full"
                      style={{ backgroundColor: initiative.color + '20' }}
                    >
                      {React.cloneElement(initiative.icon, { style: { color: initiative.color } })}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{initiative.name}</h3>
                      <Badge style={{ backgroundColor: initiative.color + '20', color: initiative.color }}>
                        {initiative.category}
                      </Badge>
                    </div>
                  </div>
                  <Badge 
                    className="text-white"
                    style={{ backgroundColor: initiative.status === 'Operational' || initiative.status === 'Implemented' || initiative.status === 'Active' ? '#10B981' : '#F59E0B' }}
                  >
                    {initiative.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Energy Savings</span>
                    <span className="text-lg font-bold" style={{ color: initiative.color }}>
                      {initiative.savingsPercentage}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${initiative.savingsPercentage * 3}%`,
                        backgroundColor: initiative.color
                      }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600">Annual Savings</p>
                      <p className="text-sm font-bold" style={{ color: initiative.color }}>
                        ${(initiative.annualSavings / 1000).toFixed(0)}k
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600">CO₂ Reduced</p>
                      <p className="text-sm font-bold text-green-600">
                        {(initiative.co2Reduction / 1000).toFixed(1)}T
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600">ROI</p>
                      <p className="text-sm font-bold text-blue-600">
                        {initiative.roi.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Baseline</p>
                      <p className="text-sm font-semibold text-red-600">{initiative.baselineConsumption} kWh</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Current</p>
                      <p className="text-sm font-semibold text-green-600">{initiative.currentConsumption} kWh</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Energy Distribution */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Energy Distribution by Initiative</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={energyDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {energyDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Savings by Category */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Savings by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={savingsByCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="category" stroke="#6B7280" angle={-45} textAnchor="end" height={100} fontSize={10} />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '2px solid #10B981',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="savings" fill="#10B981" radius={[8, 8, 0, 0]} />
                  <Line type="monotone" dataKey="percentage" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* Detailed Comparison Table */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Initiative Performance Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Initiative</th>
                    <th className="text-center p-3 text-sm font-semibold text-gray-700">Baseline</th>
                    <th className="text-center p-3 text-sm font-semibold text-gray-700">Current</th>
                    <th className="text-center p-3 text-sm font-semibold text-gray-700">Savings</th>
                    <th className="text-center p-3 text-sm font-semibold text-gray-700">Annual Value</th>
                    <th className="text-center p-3 text-sm font-semibold text-gray-700">ROI</th>
                    <th className="text-center p-3 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {energySavingInitiatives.map((initiative, index) => (
                    <tr key={initiative.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {React.cloneElement(initiative.icon, { style: { color: initiative.color }, className: 'h-4 w-4' })}
                          <span className="font-medium text-gray-800">{initiative.name}</span>
                        </div>
                      </td>
                      <td className="text-center p-3 text-red-600 font-semibold">{initiative.baselineConsumption} kWh</td>
                      <td className="text-center p-3 text-green-600 font-semibold">{initiative.currentConsumption} kWh</td>
                      <td className="text-center p-3">
                        <Badge style={{ backgroundColor: initiative.color }}>
                          {initiative.savingsPercentage}%
                        </Badge>
                      </td>
                      <td className="text-center p-3 text-yellow-600 font-semibold">${(initiative.annualSavings / 1000).toFixed(0)}k</td>
                      <td className="text-center p-3 text-blue-600 font-semibold">{initiative.roi}%</td>
                      <td className="text-center p-3">
                        <Badge className="text-white" style={{ backgroundColor: '#10B981' }}>
                          {initiative.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td className="p-3">TOTAL</td>
                    <td className="text-center p-3 text-red-600">{totalBaselineConsumption} kWh</td>
                    <td className="text-center p-3 text-green-600">{totalCurrentConsumption} kWh</td>
                    <td className="text-center p-3">
                      <Badge style={{ backgroundColor: '#10B981' }}>
                        {((totalBaselineConsumption - totalCurrentConsumption) / totalBaselineConsumption * 100).toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="text-center p-3 text-yellow-600">${(totalAnnualSavings / 1000000).toFixed(2)}M</td>
                    <td className="text-center p-3 text-blue-600">{averageROI.toFixed(1)}%</td>
                    <td className="text-center p-3">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Impact Tab */}
        <TabsContent value="impact" className="mt-6 space-y-6">
          {/* Environmental Impact */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              Environmental Impact Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <Leaf className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-green-600 mb-2">{(totalCo2Reduction / 1000).toFixed(1)}T</p>
                <p className="text-sm text-gray-600">CO₂ Reduction (Annual)</p>
                <p className="text-xs text-gray-500 mt-2">Equivalent to {(totalCo2Reduction / 411).toFixed(0)} cars off the road</p>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <Battery className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-blue-600 mb-2">{((totalBaselineConsumption - totalCurrentConsumption) * 365 / 1000000).toFixed(2)}GWh</p>
                <p className="text-sm text-gray-600">Energy Saved (Annual)</p>
                <p className="text-xs text-gray-500 mt-2">Powers {((totalBaselineConsumption - totalCurrentConsumption) * 365 / 10950).toFixed(0)} homes for a year</p>
              </div>

              <div className="text-center p-6 bg-yellow-50 rounded-xl">
                <DollarSign className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-yellow-600 mb-2">${(totalAnnualSavings / 1000000).toFixed(2)}M</p>
                <p className="text-sm text-gray-600">Cost Savings (Annual)</p>
                <p className="text-xs text-gray-500 mt-2">ROI: {averageROI.toFixed(1)}% average</p>
              </div>
            </div>
          </GlassCard>

          {/* Key Achievements */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <Award className="h-6 w-6 text-yellow-600" />
              Key Achievements
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-green-800 mb-1">15% Energy Reduction Target Achieved</h4>
                  <p className="text-sm text-gray-600">Successfully reduced mining energy consumption from 50% to 35%, achieving the target 15% savings and improving operational profitability.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-800 mb-1">Comprehensive Digital Integration</h4>
                  <p className="text-sm text-gray-600">Implemented IoT sensors, digital twins, AI-powered predictive maintenance, and automated control systems across all operations.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-yellow-800 mb-1">${(totalAnnualSavings / 1000000).toFixed(1)}M Annual Cost Savings</h4>
                  <p className="text-sm text-gray-600">Achieved substantial cost reductions through energy optimization, with average ROI of {averageROI.toFixed(1)}% across all initiatives.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-purple-800 mb-1">Sustainability Leadership</h4>
                  <p className="text-sm text-gray-600">Reduced {(totalCo2Reduction / 1000).toFixed(1)} tonnes of CO₂ annually, positioning the operation as an environmental leader in the mining industry.</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Future Roadmap */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-blue-600" />
              Future Optimization Opportunities
            </h3>
            <div className="space-y-3">
              <div className="p-4 border-l-4 border-blue-600 bg-blue-50 rounded">
                <h4 className="font-bold text-blue-800 mb-1">Additional 3-5% Energy Reduction Potential</h4>
                <p className="text-sm text-gray-600">Advanced AI algorithms and machine learning models identify opportunities for further optimization in comminution and material handling processes.</p>
              </div>

              <div className="p-4 border-l-4 border-green-600 bg-green-50 rounded">
                <h4 className="font-bold text-green-800 mb-1">100% Renewable Energy Integration by 2027</h4>
                <p className="text-sm text-gray-600">Expand solar and wind capacity to achieve complete renewable energy coverage for auxiliary systems and reduce grid dependency to zero.</p>
              </div>

              <div className="p-4 border-l-4 border-purple-600 bg-purple-50 rounded">
                <h4 className="font-bold text-purple-800 mb-1">Autonomous Energy Management System</h4>
                <p className="text-sm text-gray-600">Deploy fully autonomous AI-driven energy management system capable of real-time optimization across all mining operations.</p>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnergySavingsDashboard;
