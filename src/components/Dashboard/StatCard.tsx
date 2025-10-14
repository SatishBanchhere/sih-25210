import { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  trend?: number;
  status?: "normal" | "warning" | "critical" | "success";
}

export const StatCard = ({ title, value, unit, icon: Icon, trend, status = "normal" }: StatCardProps) => {
  const getStatusColor = (status: string) => {
    const colors = {
      normal: "#B6AE9F",     // Primary theme color
      warning: "#F59E0B",    // Warning amber
      critical: "#EF4444",   // Critical red
      success: "#22C55E",    // Success green
    };
    return colors[status] || colors.normal;
  };

  const getIconBackgroundStyle = (status: string) => {
    const statusColor = getStatusColor(status);
    return {
      background: `linear-gradient(135deg, ${statusColor} 0%, ${statusColor}CC 100%)`,
      color: "#FFFFFF"
    };
  };

  const glowColors = {
    normal: "primary" as const,
    warning: "warning" as const,
    critical: "danger" as const,
    success: "success" as const,
  };

  return (
    <GlassCard glowColor={glowColors[status]}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p 
            className="text-sm mb-2"
            style={{ color: "#8B8775" }}
          >
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 
              className="text-3xl font-bold"
              style={{ color: getStatusColor(status) }}
            >
              {value}
            </h3>
            {unit && (
              <span 
                className="text-sm"
                style={{ color: "#8B8775" }}
              >
                {unit}
              </span>
            )}
          </div>
          {trend !== undefined && (
            <p 
              className="text-xs mt-2"
              style={{ color: trend >= 0 ? "#22C55E" : "#EF4444" }}
            >
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% from baseline
            </p>
          )}
        </div>
        <div 
          className="rounded-lg p-3"
          style={getIconBackgroundStyle(status)}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </GlassCard>
  );
};
