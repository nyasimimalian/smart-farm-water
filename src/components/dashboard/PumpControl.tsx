import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Power, Loader2 } from "lucide-react";
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Power className="w-4 h-4" />
          Pump Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Status</p>
            <div className="flex items-center gap-2 mt-1">
              <div className={cn("w-3 h-3 rounded-full", isOn ? "bg-status-optimal animate-pulse-gentle" : "bg-muted-foreground/30")} />
              <span className={cn("text-lg font-display font-bold", isOn ? "text-status-optimal" : "text-muted-foreground")}>
                {isOn ? "ON" : "OFF"}
              </span>
            </div>
          </div>
          <Button
            size="lg"
            variant={isOn ? "destructive" : "default"}
            onClick={() => togglePump.mutate(isOn ? "OFF" : "ON")}
            disabled={togglePump.isPending || autoMode}
            className="min-w-[100px]"
          >
            {togglePump.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              isOn ? "Turn OFF" : "Turn ON"
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-sm font-medium">Auto Mode</p>
            <p className="text-xs text-muted-foreground">
              {autoMode ? "Pump controlled by moisture thresholds" : "Manual control enabled"}
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
