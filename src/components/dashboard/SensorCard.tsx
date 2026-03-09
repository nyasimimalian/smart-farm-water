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

const statusStyles = {
  optimal: "border-l-4 border-l-status-optimal",
  warning: "border-l-4 border-l-status-warning",
  critical: "border-l-4 border-l-status-critical animate-pulse-gentle",
  neutral: "border-l-4 border-l-muted-foreground/30",
};

const statusDot = {
  optimal: "bg-status-optimal",
  warning: "bg-status-warning",
  critical: "bg-status-critical",
  neutral: "bg-muted-foreground/30",
};

export default function SensorCard({ title, value, unit, icon, status = "neutral", subtitle }: SensorCardProps) {
  return (
    <Card className={cn("transition-shadow hover:shadow-md", statusStyles[status])}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-display font-bold">{value}</span>
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
            {subtitle && (
              <div className="flex items-center gap-1.5">
                <div className={cn("w-2 h-2 rounded-full", statusDot[status])} />
                <span className="text-xs text-muted-foreground">{subtitle}</span>
              </div>
            )}
          </div>
          <div className="p-2.5 rounded-xl bg-muted text-muted-foreground">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
