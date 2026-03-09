import { Button } from "@/components/ui/button";
import { Play, Square, Cpu } from "lucide-react";
import { useMockSimulator } from "@/hooks/useMockSimulator";
import { cn } from "@/lib/utils";

export default function SimulatorToggle() {
  const { isRunning, toggle } = useMockSimulator();

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl border",
      isRunning ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-border"
    )}>
      <Cpu className={cn("w-5 h-5", isRunning ? "text-primary animate-pulse-gentle" : "text-muted-foreground")} />
      <div className="flex-1">
        <p className="text-sm font-medium">Mock Sensor Simulator</p>
        <p className="text-xs text-muted-foreground">
          {isRunning ? "Generating data every 5s..." : "Generate test sensor data"}
        </p>
      </div>
      <Button size="sm" variant={isRunning ? "destructive" : "default"} onClick={toggle}>
        {isRunning ? <><Square className="w-3 h-3 mr-1" /> Stop</> : <><Play className="w-3 h-3 mr-1" /> Start</>}
      </Button>
    </div>
  );
}
