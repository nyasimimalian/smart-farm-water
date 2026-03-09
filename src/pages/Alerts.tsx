import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Info, XCircle, CheckCheck } from "lucide-react";
import { useAlerts, useMarkAlertRead, useDismissAllAlerts } from "@/hooks/useIrrigation";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const severityConfig = {
  critical: { icon: XCircle, color: "text-status-critical", bg: "bg-status-critical/10", label: "Critical" },
  warning: { icon: AlertTriangle, color: "text-status-warning", bg: "bg-status-warning/10", label: "Warning" },
  info: { icon: Info, color: "text-status-info", bg: "bg-status-info/10", label: "Info" },
};

export default function Alerts() {
  const { data: alerts } = useAlerts();
  const markRead = useMarkAlertRead();
  const dismissAll = useDismissAllAlerts();
  const unreadCount = alerts?.filter((a) => !a.is_read).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-2">
            <Bell className="w-7 h-7" />
            Alerts
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{unreadCount} unread alerts</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => dismissAll.mutate()}>
            <CheckCheck className="w-4 h-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {(!alerts || alerts.length === 0) ? (
            <div className="py-16 text-center">
              <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No alerts yet</p>
              <p className="text-xs text-muted-foreground mt-1">Start the simulator to generate alerts</p>
            </div>
          ) : (
            <div className="divide-y">
              {alerts.map((alert) => {
                const config = severityConfig[alert.severity as keyof typeof severityConfig] ?? severityConfig.info;
                const Icon = config.icon;
                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "flex items-start gap-3 p-4 transition-colors",
                      !alert.is_read && "bg-muted/30"
                    )}
                  >
                    <div className={cn("p-2 rounded-lg shrink-0", config.bg)}>
                      <Icon className={cn("w-4 h-4", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", config.bg, config.color)}>
                          {config.label}
                        </span>
                        {!alert.is_read && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-sm mt-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    {!alert.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs shrink-0"
                        onClick={() => markRead.mutate(alert.id)}
                      >
                        Dismiss
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
