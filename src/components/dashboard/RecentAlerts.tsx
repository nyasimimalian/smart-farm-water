import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, Info, XCircle } from "lucide-react";
import { useAlerts } from "@/hooks/useIrrigation";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const severityConfig = {
  critical: { icon: XCircle, color: "text-status-critical", bg: "bg-status-critical/10" },
  warning: { icon: AlertTriangle, color: "text-status-warning", bg: "bg-status-warning/10" },
  info: { icon: Info, color: "text-status-info", bg: "bg-status-info/10" },
};

export default function RecentAlerts() {
  const { data: alerts } = useAlerts();
  const recent = alerts?.slice(0, 5) ?? [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Recent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No alerts yet</p>
        ) : (
          <div className="space-y-2">
            {recent.map((alert) => {
              const config = severityConfig[alert.severity as keyof typeof severityConfig] ?? severityConfig.info;
              const Icon = config.icon;
              return (
                <div key={alert.id} className={cn("flex items-start gap-3 p-3 rounded-lg", config.bg)}>
                  <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", config.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
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
