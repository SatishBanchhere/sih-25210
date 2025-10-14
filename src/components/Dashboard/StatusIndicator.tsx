import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "healthy" | "warning" | "critical" | "offline";
  label?: string;
  size?: "sm" | "md" | "lg";
}

export const StatusIndicator = ({ status, label, size = "md" }: StatusIndicatorProps) => {
  const getStatusConfig = (status: string) => {
    const configs = {
      healthy: { 
        color: "#22C55E", 
        text: "Healthy", 
        glow: "0 0 10px rgba(34, 197, 94, 0.6)" 
      },
      warning: { 
        color: "#F59E0B", 
        text: "Warning", 
        glow: "0 0 10px rgba(245, 158, 11, 0.6)" 
      },
      critical: { 
        color: "#EF4444", 
        text: "Critical", 
        glow: "0 0 10px rgba(239, 68, 68, 0.6)" 
      },
      offline: { 
        color: "#8B8775", 
        text: "Offline", 
        glow: "" 
      },
    };
    return configs[status] || configs.offline;
  };

  const sizeConfig = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  const config = getStatusConfig(status);

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "rounded-full animate-pulse",
          sizeConfig[size]
        )}
        style={{
          backgroundColor: config.color,
          boxShadow: config.glow
        }}
      />
      {label && (
        <span 
          className="text-sm font-medium"
          style={{ color: "#5D5A52" }}
        >
          {label || config.text}
        </span>
      )}
    </div>
  );
};
