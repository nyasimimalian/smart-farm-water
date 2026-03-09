import { Card, CardContent } from "@/components/ui/card";
import { CloudRain, Droplets, Wind, CloudSun, AlertTriangle } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { useSettings } from "@/hooks/useIrrigation";

export default function WeatherWidget() {
  const { data: settings } = useSettings();
  const { data: weather, isLoading } = useWeather(settings?.weather_location ?? "Nairobi");

  if (isLoading || !weather) {
    return (
      <Card className="glass-card">
        <CardContent className="p-5">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded-full w-1/2" />
            <div className="h-10 bg-muted rounded-full w-1/3" />
            <div className="h-3 bg-muted rounded-full w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-accent/50 via-accent/20 to-transparent" />
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
              Weather — {weather.city}
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[2rem] font-display font-extrabold leading-none tracking-tight">{weather.temp}</span>
              <span className="text-sm font-medium text-muted-foreground">°C</span>
            </div>
            <p className="text-sm text-muted-foreground capitalize mt-1">{weather.description}</p>
          </div>
          <div className="p-3 rounded-2xl bg-accent/10 text-accent">
            {weather.rainExpected ? (
              <CloudRain className="w-7 h-7" />
            ) : (
              <CloudSun className="w-7 h-7" />
            )}
          </div>
        </div>

        <div className="flex gap-5 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <div className="p-1 rounded-md bg-muted">
              <Droplets className="w-3 h-3" />
            </div>
            <span className="font-medium">{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <div className="p-1 rounded-md bg-muted">
              <Wind className="w-3 h-3" />
            </div>
            <span className="font-medium">{weather.windSpeed} km/h</span>
          </div>
        </div>

        {weather.rainExpected && (
          <div className="flex items-center gap-2.5 bg-accent/8 border border-accent/15 text-accent rounded-xl px-4 py-3 text-sm font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Rain expected — consider pausing irrigation
          </div>
        )}
      </CardContent>
    </Card>
  );
}
