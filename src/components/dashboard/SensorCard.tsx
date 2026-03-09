import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  status?: "optimal" | "warning" | "critical" | "neutral";
  subtitle?: string;
}

const statusBorder = {
  optimal: "border-status-optimal/40",
  warning: "border-status-warning/40",
  critical: "border-status-critical/40",
  neutral: "border-border",
};

const statusBg = {
  optimal: "bg-status-optimal/8",
  warning: "bg-status-warning/8",
  critical: "bg-status-critical/8",
  neutral: "bg-muted/50",
};

const statusIconBg = {
  optimal: "bg-status-optimal/12 text-status-optimal",
  warning: "bg-status-warning/12 text-status-warning",
  critical: "bg-status-critical/12 text-status-critical",
  neutral: "bg-muted text-muted-foreground",
};

const statusDot = {
  optimal: "bg-status-optimal",
  warning: "bg-status-warning",
  critical: "bg-status-critical",
  neutral: "bg-muted-foreground/30",
};

export default function SensorCard({ title, value, unit, icon, status = "neutral", subtitle }: SensorCardProps) {
  return (
    <Card className={cn(
      "glass-card overflow-hidden transition-all duration-300 hover:-translate-y-0.5",
      statusBorder[status],
      status === "critical" && "animate-pulse-gentle"
    )}>
      <CardContent className="p-0">
        {/* Colored top bar */}
        <div className={cn("h-1", {
          "bg-gradient-to-r from-status-optimal/60 to-status-optimal/20": status === "optimal",
          "bg-gradient-to-r from-status-warning/60 to-status-warning/20": status === "warning",
          "bg-gradient-to-r from-status-critical/60 to-status-critical/20": status === "critical",
          "bg-gradient-to-r from-border to-transparent": status === "neutral",
        })} />
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{title}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[2rem] font-display font-extrabold leading-none tracking-tight">{value}</span>
                <span className="text-sm font-medium text-muted-foreground">{unit}</span>
              </div>
              {subtitle && (
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full ring-2 ring-offset-1 ring-offset-card", statusDot[status], {
                    "ring-status-optimal/30": status === "optimal",
                    "ring-status-warning/30": status === "warning",
                    "ring-status-critical/30": status === "critical",
                    "ring-muted-foreground/10": status === "neutral",
                  })} />
                  <span className="text-xs font-medium text-muted-foreground">{subtitle}</span>
                </div>
              )}
            </div>
            <div className={cn("p-3 rounded-2xl", statusIconBg[status])}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
