import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Activity, Wifi, Database, Clock, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

interface SCADANodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeData: {
    id: string;
    name: string;
    status: "online" | "offline" | "warning";
    latency: number;
    dataRate: number;
    uptime: number;
    packets: number;
  } | null;
}

const generateLatencyData = (baseLatency: number) => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: `${i}s`,
    latency: parseFloat(Math.max(0, baseLatency + Math.random() * 5 - 2.5).toFixed(2)),
  }));
};

export const SCADANodeDialog = ({ open, onOpenChange, nodeData }: SCADANodeDialogProps) => {
  const [latencyData, setLatencyData] = useState<ReturnType<typeof generateLatencyData>>([]);

  useEffect(() => {
    if (open && nodeData) {
      setLatencyData(generateLatencyData(nodeData.latency));
    }
  }, [open, nodeData]);

  if (!nodeData) return null;

  const getStatusColors = (status: string) => {
    const colors = {
      online: { bg: "#22C55E", text: "#FFFFFF" },
      offline: { bg: "#EF4444", text: "#FFFFFF" },
      warning: { bg: "#F59E0B", text: "#FFFFFF" },
    };
    return colors[status] || colors.online;
  };

  const statusColors = getStatusColors(nodeData.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full mx-auto"
        style={{
          backgroundColor: '#DEDED1',
          border: '1px solid #C5C7BC'
        }}
      >
        <DialogHeader>
          <DialogTitle 
            className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 sm:gap-3"
            style={{ color: '#5D5A52' }}
          >
            <Activity className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: '#B6AE9F' }} />
            <span className="truncate">{nodeData.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 mt-3 sm:mt-4 p-1">
          {/* Status Overview - Mobile-responsive Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <div 
              className="p-3 sm:p-4 rounded-lg border"
              style={{
                background: 'linear-gradient(135deg, #DEDED1 0%, #C5C7BC 100%)',
                borderColor: 'rgba(182, 174, 159, 0.3)'
              }}
            >
              <div className="flex items-center gap-1 sm:gap-2 mb-2">
                <Wifi className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#B6AE9F' }} />
                <p className="text-xs" style={{ color: '#8B8775' }}>Status</p>
              </div>
              <Badge 
                className="text-xs px-2 py-1"
                style={{ 
                  backgroundColor: statusColors.bg, 
                  color: statusColors.text 
                }}
              >
                {nodeData.status.toUpperCase()}
              </Badge>
            </div>

            <div 
              className="p-3 sm:p-4 rounded-lg border"
              style={{
                background: 'linear-gradient(135deg, #DEDED1 0%, #C5C7BC 100%)',
                borderColor: 'rgba(182, 174, 159, 0.3)'
              }}
            >
              <div className="flex items-center gap-1 sm:gap-2 mb-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#C5C7BC' }} />
                <p className="text-xs" style={{ color: '#8B8775' }}>Latency</p>
              </div>
              <p className="text-sm sm:text-lg md:text-xl font-bold" style={{ color: '#5D5A52' }}>
                {nodeData.latency}ms
              </p>
            </div>

            <div 
              className="p-3 sm:p-4 rounded-lg border"
              style={{
                background: 'linear-gradient(135deg, #DEDED1 0%, #C5C7BC 100%)',
                borderColor: 'rgba(182, 174, 159, 0.3)'
              }}
            >
              <div className="flex items-center gap-1 sm:gap-2 mb-2">
                <Database className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#22C55E' }} />
                <p className="text-xs" style={{ color: '#8B8775' }}>Data Rate</p>
              </div>
              <p className="text-sm sm:text-lg md:text-xl font-bold" style={{ color: '#5D5A52' }}>
                {nodeData.dataRate} kb/s
              </p>
            </div>

            <div 
              className="p-3 sm:p-4 rounded-lg border col-span-2 lg:col-span-1"
              style={{
                background: 'linear-gradient(135deg, #DEDED1 0%, #C5C7BC 100%)',
                borderColor: 'rgba(182, 174, 159, 0.3)'
              }}
            >
              <div className="flex items-center gap-1 sm:gap-2 mb-2">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#F59E0B' }} />
                <p className="text-xs" style={{ color: '#8B8775' }}>Uptime</p>
              </div>
              <p className="text-sm sm:text-lg md:text-xl font-bold" style={{ color: '#5D5A52' }}>
                {nodeData.uptime}%
              </p>
            </div>
          </div>

          {/* Latency Graph - Mobile-optimized */}
          <div 
            className="p-3 sm:p-4 rounded-lg border"
            style={{
              background: 'linear-gradient(135deg, #DEDED1 0%, #C5C7BC 100%)',
              borderColor: 'rgba(182, 174, 159, 0.3)'
            }}
          >
            <h4 
              className="text-sm sm:text-base font-semibold mb-3 sm:mb-4"
              style={{ color: '#5D5A52' }}
            >
              Real-time Latency (Last 20s)
            </h4>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#C5C7BC" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="#8B8775" 
                  tick={{ fontSize: 10 }} 
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#8B8775" 
                  tick={{ fontSize: 10 }} 
                  width={35}
                />
                <Tooltip
                  contentStyle={{
                    background: "#DEDED1",
                    border: "1px solid #C5C7BC",
                    borderRadius: "8px",
                    color: "#5D5A52",
                    fontSize: "12px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#B6AE9F" 
                  strokeWidth={2} 
                  dot={{ r: 1.5, fill: "#B6AE9F" }} 
                  activeDot={{ r: 3, fill: "#B6AE9F" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Additional Info - Mobile-responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div 
              className="p-3 sm:p-4 rounded-lg"
              style={{ backgroundColor: 'rgba(197, 199, 188, 0.3)' }}
            >
              <p className="text-xs sm:text-sm mb-1" style={{ color: '#8B8775' }}>
                Total Packets Transmitted
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: '#5D5A52' }}>
                {nodeData.packets.toLocaleString()}
              </p>
            </div>
            <div 
              className="p-3 sm:p-4 rounded-lg"
              style={{ backgroundColor: 'rgba(197, 199, 188, 0.3)' }}
            >
              <p className="text-xs sm:text-sm mb-1" style={{ color: '#8B8775' }}>
                Connection Quality
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: '#22C55E' }}>
                Excellent
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
