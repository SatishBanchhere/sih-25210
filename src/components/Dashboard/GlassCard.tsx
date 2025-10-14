import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "primary" | "accent" | "success" | "warning" | "danger";
  onClick?: () => void;
}

export const GlassCard = ({ children, className, glowColor = "primary", onClick }: GlassCardProps) => {
  const getGlowStyle = (color: string) => {
    const glowStyles = {
      primary: "0 4px 12px rgba(182, 174, 159, 0.3), 0 0 20px rgba(182, 174, 159, 0.2)",
      accent: "0 4px 12px rgba(197, 199, 188, 0.3), 0 0 20px rgba(197, 199, 188, 0.2)",
      success: "0 4px 12px rgba(34, 197, 94, 0.3), 0 0 20px rgba(34, 197, 94, 0.2)",
      warning: "0 4px 12px rgba(245, 158, 11, 0.3), 0 0 20px rgba(245, 158, 11, 0.2)",
      danger: "0 4px 12px rgba(239, 68, 68, 0.3), 0 0 20px rgba(239, 68, 68, 0.2)",
    };
    return glowStyles[color] || glowStyles.primary;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl p-6 transition-all duration-300",
        onClick && "cursor-pointer hover:scale-[1.02]",
        className
      )}
      style={{
        backgroundColor: '#DEDED1',
        border: '1px solid #C5C7BC',
        boxShadow: getGlowStyle(glowColor)
      }}
    >
      {children}
    </div>
  );
};
