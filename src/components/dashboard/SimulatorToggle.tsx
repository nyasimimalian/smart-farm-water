import { Button } from "@/components/ui/button";
import { Play, Square, Cpu, Radio } from "lucide-react";
import { useMockSimulator } from "@/hooks/useMockSimulator";
import { cn } from "@/lib/utils";

export default function SimulatorToggle() {
  const { isRunning, toggle } = useMockSimulator();

  return (
    <div className={cn(
      "flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300",
      isRunning
        ? "bg-primary/5 border-primary/15 shadow-sm shadow-primary/5"
        : "bg-card border-border hover:border-primary/20"
    )}>
      <div className={cn(
        "p-2.5 rounded-xl transition-colors",
        isRunning ? "bg-primary/10" : "bg-muted"
      )}>
        {isRunning ? (
          <Radio className="w-5 h-5 text-primary animate-pulse-gentle" />
        ) : (
          <Cpu className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">Sensor Simulator</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {isRunning ? "Streaming mock data every 5s..." : "Generate test sensor readings"}
        </p>
      </div>
      <Button
        size="sm"
        variant={isRunning ? "destructive" : "default"}
        onClick={toggle}
        className="rounded-xl font-semibold px-4"
      >
        {isRunning ? (
          <><Square className="w-3 h-3 mr-1.5" /> Stop</>
        ) : (
          <><Play className="w-3 h-3 mr-1.5" /> Start</>
        )}
      </Button>
    </div>
  );
}
