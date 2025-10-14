import { useState, useEffect } from "react";
import { GlassCard } from "@/components/Dashboard/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Activity, 
    Gauge, 
    Zap, 
    ThermometerSun, 
    Maximize, 
    Minimize, 
    RefreshCw,
    Settings,
    BarChart3,
    Cog,
    Hammer,
    TrendingDown,
    Battery,
    Leaf
} from "lucide-react";
import { 
  ComposedChart, 
  Line, 
  Bar, 
  Area,
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

interface ComponentData {
  selectedComponent?: string;
  voltage?: number;
  current?: number;
  temperature?: number;
  status?: string;
}

interface DigitalTwinConfig {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  type: 'crushing' | 'grinding';
  energySavings: {
    baseline: number;
    optimized: number;
    savedPercentage: number;
    monthlyReduction: number;
    costSavings: number;
  };
}

const performanceData = [
  { time: "00:00", efficiency: 94, load: 320, temperature: 45, vibration: 0.2, throughput: 3200, energyIntensity: 0.65 },
  { time: "04:00", efficiency: 96, load: 280, temperature: 42, vibration: 0.18, throughput: 3400, energyIntensity: 0.58 },
  { time: "08:00", efficiency: 98, load: 450, temperature: 58, vibration: 0.35, throughput: 3620, energyIntensity: 0.52 },
  { time: "12:00", efficiency: 97, load: 520, temperature: 65, vibration: 0.42, throughput: 3580, energyIntensity: 0.55 },
  { time: "16:00", efficiency: 95, load: 580, temperature: 71, vibration: 0.48, throughput: 3450, energyIntensity: 0.62 },
  { time: "20:00", efficiency: 96, load: 490, temperature: 62, vibration: 0.38, throughput: 3520, energyIntensity: 0.59 },
];

const energyOptimizationData = [
  { time: "Jan", beforeOptimization: 850, afterOptimization: 680, savings: 20 },
  { time: "Feb", beforeOptimization: 820, afterOptimization: 656, savings: 20 },
  { time: "Mar", beforeOptimization: 880, afterOptimization: 660, savings: 25 },
  { time: "Apr", beforeOptimization: 900, afterOptimization: 630, savings: 30 },
  { time: "May", beforeOptimization: 870, afterOptimization: 608, savings: 30 },
  { time: "Jun", beforeOptimization: 890, afterOptimization: 623, savings: 30 },
];

const radarData = [
  { metric: "Efficiency", value: 96, fullMark: 100 },
  { metric: "Energy Optimization", value: 88, fullMark: 100 },
  { metric: "Safety", value: 98, fullMark: 100 },
  { metric: "Performance", value: 92, fullMark: 100 },
  { metric: "Availability", value: 97, fullMark: 100 },
  { metric: "Sustainability", value: 89, fullMark: 100 },
];

const digitalTwins: DigitalTwinConfig[] = [
  {
    id: 'crushing',
    name: 'Crushing Circuit',
    url: 'https://crushing-ckt.vercel.app/',
    description: 'Iron ore crushing circuit with energy optimization',
    icon: <Hammer className="h-5 w-5" />,
    color: '#EF4444',
    type: 'crushing',
    energySavings: {
      baseline: 50, // kWh per tonne baseline
      optimized: 35, // kWh per tonne after optimization
      savedPercentage: 30, // 30% energy reduction
      monthlyReduction: 450000, // kWh saved per month
      costSavings: 54000 // $ saved per month
    }
  },
  {
    id: 'grinding',
    name: 'Grinding Circuit',
    url: 'https://grinding-umber.vercel.app/digital-twin',
    description: 'Advanced grinding circuit with AI-driven energy management',
    icon: <Cog className="h-5 w-5" />,
    color: '#10B981',
    type: 'grinding',
    energySavings: {
      baseline: 65, // kWh per tonne baseline
      optimized: 48, // kWh per tonne after optimization
      savedPercentage: 26, // 26% energy reduction
      monthlyReduction: 680000, // kWh saved per month
      costSavings: 81600 // $ saved per month
    }
  }
];

const DigitalTwin = () => {
  const [componentData, setComponentData] = useState<ComponentData>({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [activeTwin, setActiveTwin] = useState<DigitalTwinConfig>(digitalTwins[0]);
  const [isIframeLoading, setIsIframeLoading] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'INFO_UPDATE') {
        console.log("Received component data:", event.data.data);
        setComponentData(event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleResetView = () => {
    setIframeKey(prevKey => prevKey + 1);
    setIsIframeLoading(true);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleTwinChange = (twinId: string) => {
    const twin = digitalTwins.find(t => t.id === twinId);
    if (twin) {
      setActiveTwin(twin);
      setIframeKey(prevKey => prevKey + 1);
      setIsIframeLoading(true);
      setComponentData({});
    }
  };

  const handleIframeLoad = () => {
    setIsIframeLoading(false);
  };

  // Get twin-specific stats
  const getTwinStats = () => {
    switch (activeTwin.type) {
      case 'crushing':
        return {
          primaryMetric: { label: 'Throughput', value: '3,620', unit: 't/h', color: '#EF4444' },
          secondaryMetric: { label: 'Power', value: '2,100', unit: 'kW', color: '#F59E0B' },
          efficiency: { label: 'Efficiency', value: '92.5', unit: '%', color: '#10B981' },
          energy: { label: 'Energy Intensity', value: activeTwin.energySavings.optimized.toString(), unit: 'kWh/t', color: '#8B5CF6' }
        };
      case 'grinding':
        return {
          primaryMetric: { label: 'Mill Power', value: '11,407', unit: 'kW', color: '#10B981' },
          secondaryMetric: { label: 'Throughput', value: '1,200', unit: 't/h', color: '#3B82F6' },
          efficiency: { label: 'Energy Intensity', value: activeTwin.energySavings.optimized.toString(), unit: 'kWh/t', color: '#8B5CF6' },
          energy: { label: 'Mill Speed', value: '74', unit: '% CS', color: '#F59E0B' }
        };
      default:
        return {
          primaryMetric: { label: 'Throughput', value: '3,620', unit: 't/h', color: '#EF4444' },
          secondaryMetric: { label: 'Power', value: '2,100', unit: 'kW', color: '#F59E0B' },
          efficiency: { label: 'Efficiency', value: '92.5', unit: '%', color: '#10B981' },
          energy: { label: 'Energy Saved', value: '30', unit: '%', color: '#8B5CF6' }
        };
    }
  };

  const stats = getTwinStats();

  return (
    <div 
      className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 animate-fade-in"
      style={{ backgroundColor: '#FBF3D1' }}
    >
      {/* Header with Twin Selector */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: 'black' }}>
          Mining Process Digital Twins
        </h1>
        <p className="text-sm sm:text-base mb-4" style={{ color: '#8B8775' }}>
          Interactive 3D models with real-time energy optimization and analytics
        </p>
        
        {/* Digital Twin Selector */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {digitalTwins.map((twin) => (
            <button
              key={twin.id}
              onClick={() => handleTwinChange(twin.id)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTwin.id === twin.id
                  ? 'text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:shadow-md hover:scale-102'
              }`}
              style={{
                backgroundColor: activeTwin.id === twin.id ? twin.color : 'rgba(255, 255, 255, 0.8)',
                border: `2px solid ${twin.color}`,
              }}
            >
              <span style={{ color: activeTwin.id === twin.id ? 'white' : twin.color }}>
                {twin.icon}
              </span>
              <div className="flex flex-col items-start">
                <span className="font-semibold">{twin.name}</span>
                <span className="text-xs opacity-90">
                  -{twin.energySavings.savedPercentage}% Energy
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Energy Savings Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-gray-700">Energy Reduction</h3>
          </div>
          <div className="text-2xl font-bold text-green-600 mb-1">
            {activeTwin.energySavings.savedPercentage}%
          </div>
          <div className="text-xs text-gray-600">
            From {activeTwin.energySavings.baseline} to {activeTwin.energySavings.optimized} kWh/t
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Battery className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-700">Monthly Savings</h3>
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {(activeTwin.energySavings.monthlyReduction / 1000).toFixed(0)}k
          </div>
          <div className="text-xs text-gray-600">
            kWh saved per month
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-gray-700">Cost Savings</h3>
          </div>
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            ${(activeTwin.energySavings.costSavings / 1000).toFixed(0)}k
          </div>
          <div className="text-xs text-gray-600">
            USD saved monthly
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold text-gray-700">CO₂ Reduction</h3>
          </div>
          <div className="text-2xl font-bold text-green-500 mb-1">
            {(activeTwin.energySavings.monthlyReduction * 0.0004).toFixed(0)}
          </div>
          <div className="text-xs text-gray-600">
            tonnes CO₂/month
          </div>
        </GlassCard>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* 3D Model Viewer */}
        <div className={`lg:col-span-2 ${isFullScreen ? 'fixed inset-0 z-50' : 'relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]'}`}>
          <GlassCard className="h-full w-full p-0 overflow-hidden">
            <div 
              className="relative h-full w-full rounded-xl border-2"
              style={{
                background: 'linear-gradient(135deg, #DEDED1 0%, #C5C7BC 100%)',
                borderColor: activeTwin.color + '40'
              }}
            >
              {/* Loading Overlay */}
              {isIframeLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20 rounded-xl">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2" style={{ borderColor: activeTwin.color }}></div>
                    <p className="text-sm" style={{ color: '#8B8775' }}>Loading {activeTwin.name}...</p>
                  </div>
                </div>
              )}

              {/* Twin Info Badge */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
                <div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm text-white text-sm font-medium"
                  style={{ backgroundColor: activeTwin.color + 'CC' }}
                >
                  {activeTwin.icon}
                  <span className="hidden sm:inline">{activeTwin.name}</span>
                  <Badge className="bg-white bg-opacity-20 text-white text-xs ml-2">
                    -{activeTwin.energySavings.savedPercentage}% Energy
                  </Badge>
                </div>
              </div>

              {/* Controls */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 flex flex-col gap-1 sm:gap-2">
                <button
                  onClick={toggleFullScreen}
                  className="p-1.5 sm:p-2 rounded-full backdrop-blur-sm transition-colors"
                  style={{
                    backgroundColor: 'rgba(251, 243, 209, 0.5)',
                    color: '#5D5A52'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(251, 243, 209, 0.8)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(251, 243, 209, 0.5)'}
                  aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
                >
                  {isFullScreen ? <Minimize className="h-4 w-4 sm:h-5 sm:w-5" /> : <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
                <button
                  onClick={handleResetView}
                  className="p-1.5 sm:p-2 rounded-full backdrop-blur-sm transition-colors"
                  style={{
                    backgroundColor: 'rgba(251, 243, 209, 0.5)',
                    color: '#5D5A52'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(251, 243, 209, 0.8)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(251, 243, 209, 0.5)'}
                  aria-label="Reset view"
                >
                  <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* Iframe */}
              <iframe
                key={iframeKey}
                src={activeTwin.url}
                className="w-full h-full rounded-xl"
                title={activeTwin.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                onLoad={handleIframeLoad}
                style={{ border: 'none' }}
              />
            </div>
          </GlassCard>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-3 sm:space-y-4">
          {/* Live System Metrics */}
          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" style={{ color: activeTwin.color }} />
              <span style={{ color: '#5D5A52' }}>Live Metrics</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(stats).map(([key, stat]) => (
                <div 
                  key={key}
                  className="p-2 sm:p-3 rounded-lg"
                  style={{ backgroundColor: 'rgba(197, 199, 188, 0.3)' }}
                >
                  <p className="text-xs" style={{ color: '#8B8775' }}>{stat.label}</p>
                  <p className="text-sm sm:text-lg font-bold" style={{ color: stat.color }}>
                    {stat.value} {stat.unit}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Energy Optimization Metrics */}
          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#10B981' }} />
              <span style={{ color: '#5D5A52' }}>Energy Optimization</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <div>
                  <p className="text-xs text-gray-600">Before Optimization</p>
                  <p className="text-lg font-bold text-gray-800">{activeTwin.energySavings.baseline} kWh/t</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-600">After Optimization</p>
                  <p className="text-lg font-bold text-green-600">{activeTwin.energySavings.optimized} kWh/t</p>
                </div>
              </div>
              
              <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>
                <p className="text-2xl font-bold text-green-600">
                  {activeTwin.energySavings.savedPercentage}% SAVED
                </p>
                <p className="text-xs text-green-700">Energy Reduction Achieved</p>
              </div>
            </div>
          </GlassCard>

          {/* System Health Radar */}
          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ color: '#5D5A52' }}>System Health Index</h3>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#C5C7BC" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#5D5A52", fontSize: 10 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#8B8775", fontSize: 9 }} />
                <Radar name="Current" dataKey="value" stroke={activeTwin.color} fill={activeTwin.color} fillOpacity={0.6} />
                <Tooltip 
                  contentStyle={{ 
                    background: "#DEDED1", 
                    border: "1px solid #C5C7BC",
                    color: "#5D5A52",
                    fontSize: '12px'
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList 
          className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10"
          style={{ backgroundColor: '#C5C7BC' }}
        >
          <TabsTrigger 
            value="performance"
            className="text-xs sm:text-sm py-2 sm:py-0"
            style={{ color: '#5D5A52' }}
          >
            Energy Performance
          </TabsTrigger>
          <TabsTrigger 
            value="optimization"
            className="text-xs sm:text-sm py-2 sm:py-0"
            style={{ color: '#5D5A52' }}
          >
            Optimization Trends
          </TabsTrigger>
          <TabsTrigger 
            value="diagnostics"
            className="text-xs sm:text-sm py-2 sm:py-0"
            style={{ color: '#5D5A52' }}
          >
            AI Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-4 sm:mt-6">
          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ color: '#5D5A52' }}>
              {activeTwin.name} - Energy Performance Tracking
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={performanceData}>
                <defs>
                  <linearGradient id="efficiencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeTwin.color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={activeTwin.color} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#C5C7BC" opacity={0.3} />
                <XAxis dataKey="time" stroke="#8B8775" fontSize={10} />
                <YAxis yAxisId="left" stroke={activeTwin.color} fontSize={10} />
                <YAxis yAxisId="right" orientation="right" stroke="#C5C7BC" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    background: "#DEDED1", 
                    border: "1px solid #C5C7BC", 
                    borderRadius: "8px",
                    color: "#5D5A52",
                    fontSize: '12px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area yAxisId="left" type="monotone" dataKey="efficiency" fill="url(#efficiencyGrad)" stroke={activeTwin.color} strokeWidth={2} />
                <Bar yAxisId="right" dataKey="load" fill="#C5C7BC" opacity={0.7} radius={[4, 4, 0, 0]} />
                <Line yAxisId="left" type="monotone" dataKey="energyIntensity" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" />
                <Line yAxisId="left" type="monotone" dataKey="throughput" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </GlassCard>
        </TabsContent>

        <TabsContent value="optimization" className="mt-4 sm:mt-6">
          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ color: '#5D5A52' }}>
              Energy Optimization Progress - {activeTwin.name}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={energyOptimizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#C5C7BC" opacity={0.3} />
                <XAxis dataKey="time" stroke="#8B8775" fontSize={10} />
                <YAxis yAxisId="left" stroke="#EF4444" fontSize={10} />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    background: "#DEDED1", 
                    border: "1px solid #C5C7BC", 
                    borderRadius: "8px",
                    color: "#5D5A52",
                    fontSize: '12px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar yAxisId="left" dataKey="beforeOptimization" fill="#EF4444" opacity={0.7} radius={[4, 4, 0, 0]} name="Before (kWh)" />
                <Bar yAxisId="left" dataKey="afterOptimization" fill="#10B981" opacity={0.8} radius={[4, 4, 0, 0]} name="After (kWh)" />
                <Line yAxisId="right" type="monotone" dataKey="savings" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} name="Savings %" />
              </ComposedChart>
            </ResponsiveContainer>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <p className="text-xs text-gray-600">Average Before</p>
                <p className="text-lg font-bold text-red-600">865 kWh</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <p className="text-xs text-gray-600">Average After</p>
                <p className="text-lg font-bold text-green-600">643 kWh</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                <p className="text-xs text-gray-600">Total Savings</p>
                <p className="text-lg font-bold text-yellow-600">26%</p>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="diagnostics" className="mt-4 sm:mt-6">
          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ color: '#5D5A52' }}>
              AI-Powered Energy Recommendations - {activeTwin.name}
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div 
                className="p-3 sm:p-4 rounded-lg border"
                style={{
                  background: 'linear-gradient(135deg, #DEDED1 0%, #C5C7BC 100%)',
                  borderColor: 'rgba(16, 185, 129, 0.3)'
                }}
              >
                <h4 className="font-semibold mb-2 text-sm sm:text-base flex items-center gap-2" style={{ color: '#10B981' }}>
                  <TrendingDown className="h-4 w-4" />
                  Energy Optimization Achieved
                </h4>
                <p className="text-xs sm:text-sm" style={{ color: '#8B8775' }}>
                  {activeTwin.type === 'crushing' 
                    ? `Successfully reduced energy consumption from ${activeTwin.energySavings.baseline} kWh/t to ${activeTwin.energySavings.optimized} kWh/t through jaw gap optimization and load balancing. Achieved ${activeTwin.energySavings.savedPercentage}% energy reduction while maintaining throughput.`
                    : `Mill speed and ball charge optimization reduced energy intensity from ${activeTwin.energySavings.baseline} kWh/t to ${activeTwin.energySavings.optimized} kWh/t. AI-driven control achieved ${activeTwin.energySavings.savedPercentage}% energy savings with improved particle size distribution.`
                  }
                </p>
              </div>
              
              <div 
                className="p-3 sm:p-4 rounded-lg border"
                style={{
                  background: 'linear-gradient(135deg, #DEDED1 0%, #C5C7BC 100%)',
                  borderColor: 'rgba(59, 130, 246, 0.3)'
                }}
              >
                <h4 className="font-semibold mb-2 text-sm sm:text-base flex items-center gap-2" style={{ color: '#3B82F6' }}>
                  <Zap className="h-4 w-4" />
                  Next Optimization Opportunity
                </h4>
                <p className="text-xs sm:text-sm" style={{ color: '#8B8775' }}>
                  {activeTwin.type === 'crushing'
                    ? "AI analysis suggests further 3-5% energy reduction possible through predictive feed rate control and crusher chamber geometry optimization during maintenance window."
                    : "Mill liner wear pattern analysis indicates opportunity for additional 2-4% energy savings through optimized grinding media distribution and classifier efficiency improvements."
                  }
                </p>
              </div>

              <div 
                className="p-3 sm:p-4 rounded-lg border"
                style={{
                  background: 'linear-gradient(135deg, #DEDED1 0%, #C5C7BC 100%)',
                  borderColor: 'rgba(245, 158, 11, 0.3)'
                }}
              >
                <h4 className="font-semibold mb-2 text-sm sm:text-base flex items-center gap-2" style={{ color: '#F59E0B' }}>
                  <Battery className="h-4 w-4" />
                  ROI & Environmental Impact
                </h4>
                <p className="text-xs sm:text-sm" style={{ color: '#8B8775' }}>
                  Monthly savings: ${(activeTwin.energySavings.costSavings / 1000).toFixed(0)}k USD | 
                  CO₂ reduction: {(activeTwin.energySavings.monthlyReduction * 0.0004).toFixed(0)} tonnes/month | 
                  Payback period: 4.2 months for optimization implementation.
                </p>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DigitalTwin;
