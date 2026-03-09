import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, Info, XCircle } from "lucide-react";
import { useAlerts } from "@/hooks/useIrrigation";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const severityConfig = {
  critical: { icon: XCircle, color: "text-status-critical", bg: "bg-status-critical/10", ring: "ring-status-critical/20" },
  warning: { icon: AlertTriangle, color: "text-status-warning", bg: "bg-status-warning/10", ring: "ring-status-warning/20" },
  info: { icon: Info, color: "text-status-info", bg: "bg-status-info/10", ring: "ring-status-info/20" },
};

export default function RecentAlerts() {
  const { data: alerts } = useAlerts();
  const recent = alerts?.slice(0, 5) ?? [];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-display font-bold flex items-center gap-2 text-muted-foreground">
          <Bell className="w-4 h-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Bell className="w-5 h-5 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground">No alerts yet</p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">Start the simulator to begin monitoring</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((alert) => {
              const config = severityConfig[alert.severity as keyof typeof severityConfig] ?? severityConfig.info;
              const Icon = config.icon;
              return (
                <div key={alert.id} className={cn(
                  "flex items-start gap-3 p-3 rounded-xl transition-colors",
                  config.bg
                )}>
                  <div className={cn("p-1.5 rounded-lg ring-1", config.bg, config.ring)}>
                    <Icon className={cn("w-3.5 h-3.5", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">{alert.message}</p>
                    <p className="text-[0.68rem] text-muted-foreground/70 mt-1 font-medium">
                      {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
