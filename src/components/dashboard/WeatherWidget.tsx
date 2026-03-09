import { Card, CardContent } from "@/components/ui/card";
import { Cloud, Droplets, Wind, AlertTriangle } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { useSettings } from "@/hooks/useIrrigation";

export default function WeatherWidget() {
  const { data: settings } = useSettings();
  const { data: weather, isLoading } = useWeather(settings?.weather_location ?? "Nairobi");

  if (isLoading || !weather) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-8 bg-muted rounded w-1/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Weather — {weather.city}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-display font-bold">{weather.temp}°C</span>
            </div>
            <p className="text-sm text-muted-foreground capitalize mt-0.5">{weather.description}</p>
          </div>
          <div className="text-4xl">
            <Cloud className="w-10 h-10 text-accent" />
          </div>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5" />
            {weather.humidity}%
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-3.5 h-3.5" />
            {weather.windSpeed} km/h
          </div>
        </div>
        {weather.rainExpected && (
          <div className="flex items-center gap-2 bg-accent/10 text-accent rounded-lg px-3 py-2 text-sm">
            <AlertTriangle className="w-4 h-4" />
            Rain expected — consider pausing irrigation
          </div>
        )}
      </CardContent>
    </Card>
  );
}
