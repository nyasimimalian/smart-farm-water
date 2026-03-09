import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Power, Loader2, Zap } from "lucide-react";
import { useLatestPumpStatus, useTogglePump, useSettings, useUpdateSettings } from "@/hooks/useIrrigation";
import { cn } from "@/lib/utils";

export default function PumpControl() {
  const { data: pump } = useLatestPumpStatus();
  const { data: settings } = useSettings();
  const togglePump = useTogglePump();
  const updateSettings = useUpdateSettings();

  const isOn = pump?.pump_status === "ON";
  const autoMode = settings?.auto_mode ?? true;

  return (
    <Card className="glass-card overflow-hidden">
      <div className={cn(
        "h-1 transition-all duration-500",
        isOn ? "bg-gradient-to-r from-status-optimal via-status-optimal/60 to-transparent" : "bg-gradient-to-r from-border to-transparent"
      )} />
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-display font-bold flex items-center gap-2 text-muted-foreground">
          <Zap className="w-4 h-4" />
          Pump Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-1.5">Status</p>
            <div className="flex items-center gap-2.5">
              <div className={cn(
                "w-3.5 h-3.5 rounded-full ring-4",
                isOn
                  ? "bg-status-optimal ring-status-optimal/20 animate-pulse-gentle"
                  : "bg-muted-foreground/20 ring-muted-foreground/5"
              )} />
              <span className={cn(
                "text-xl font-display font-extrabold tracking-tight",
                isOn ? "text-status-optimal" : "text-muted-foreground"
              )}>
                {isOn ? "Running" : "Idle"}
              </span>
            </div>
          </div>
          <Button
            size="lg"
            variant={isOn ? "destructive" : "default"}
            onClick={() => togglePump.mutate(isOn ? "OFF" : "ON")}
            disabled={togglePump.isPending || autoMode}
            className={cn(
              "min-w-[110px] rounded-xl font-semibold transition-all",
              !isOn && "shadow-md shadow-primary/20"
            )}
          >
            {togglePump.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <><Power className="w-4 h-4 mr-1.5" />{isOn ? "Stop" : "Start"}</>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-dashed">
          <div>
            <p className="text-sm font-semibold">Auto Mode</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {autoMode ? "Threshold-based control active" : "Manual control enabled"}
            </p>
          </div>
          <Switch
            checked={autoMode}
            onCheckedChange={(checked) => updateSettings.mutate({ auto_mode: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
