import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Info, XCircle, CheckCheck, ShieldAlert } from "lucide-react";
import { useAlerts, useMarkAlertRead, useDismissAllAlerts } from "@/hooks/useIrrigation";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const severityConfig = {
  critical: { icon: XCircle, color: "text-status-critical", bg: "bg-status-critical/8", border: "border-status-critical/15", label: "Critical" },
  warning: { icon: AlertTriangle, color: "text-status-warning", bg: "bg-status-warning/8", border: "border-status-warning/15", label: "Warning" },
  info: { icon: Info, color: "text-status-info", bg: "bg-status-info/8", border: "border-status-info/15", label: "Info" },
};

export default function Alerts() {
  const { data: alerts } = useAlerts();
  const markRead = useMarkAlertRead();
  const dismissAll = useDismissAllAlerts();
  const unreadCount = alerts?.filter((a) => !a.is_read).length ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Notifications</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">Alerts</h1>
          <p className="text-muted-foreground text-sm mt-1.5">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => dismissAll.mutate()} className="rounded-xl font-semibold">
            <CheckCheck className="w-4 h-4 mr-1.5" />
            Mark all read
          </Button>
        )}
      </div>

      <Card className="glass-card overflow-hidden">
        <CardContent className="p-0">
          {(!alerts || alerts.length === 0) ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Bell className="w-7 h-7 text-muted-foreground/30" />
              </div>
              <p className="text-base font-semibold text-muted-foreground">No alerts yet</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Start the simulator to generate sensor alerts</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {alerts.map((alert) => {
                const config = severityConfig[alert.severity as keyof typeof severityConfig] ?? severityConfig.info;
                const Icon = config.icon;
                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "flex items-start gap-4 p-5 transition-colors",
                      !alert.is_read && "bg-muted/20"
                    )}
                  >
                    <div className={cn("p-2 rounded-xl border shrink-0", config.bg, config.border)}>
                      <Icon className={cn("w-4 h-4", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-[0.68rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md", config.bg, config.color)}>
                          {config.label}
                        </span>
                        {!alert.is_read && (
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-gentle" />
                        )}
                      </div>
                      <p className="text-sm leading-relaxed">{alert.message}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1.5 font-medium">
                        {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    {!alert.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs shrink-0 rounded-lg font-semibold"
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
