import { Droplets, Thermometer, Wind } from "lucide-react";
import SensorCard from "@/components/dashboard/SensorCard";
import PumpControl from "@/components/dashboard/PumpControl";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import RecentAlerts from "@/components/dashboard/RecentAlerts";
import SimulatorToggle from "@/components/dashboard/SimulatorToggle";
import { useLatestSensorData, useSettings } from "@/hooks/useIrrigation";

function getMoistureStatus(value: number, low: number, high: number) {
  if (value < low) return { status: "critical" as const, label: "Irrigation needed" };
  if (value > high) return { status: "optimal" as const, label: "Optimal" };
  if (value > low + (high - low) * 0.3) return { status: "optimal" as const, label: "Good" };
  return { status: "warning" as const, label: "Getting low" };
}

export default function Index() {
  const { data: sensor } = useLatestSensorData();
  const { data: settings } = useSettings();

  const moisture = sensor?.moisture_level ?? 0;
  const temp = sensor?.temperature ?? 0;
  const humidity = sensor?.humidity ?? 0;
  const thresholdLow = settings?.moisture_threshold_low ?? 30;
  const thresholdHigh = settings?.moisture_threshold_high ?? 60;

  const moistureInfo = getMoistureStatus(moisture, thresholdLow, thresholdHigh);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor your farm conditions in real-time</p>
        </div>
      </div>

      <SimulatorToggle />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SensorCard
          title="Soil Moisture"
          value={sensor ? moisture.toFixed(1) : "—"}
          unit="%"
          icon={<Droplets className="w-5 h-5" />}
          status={sensor ? moistureInfo.status : "neutral"}
          subtitle={sensor ? moistureInfo.label : "No data yet"}
        />
        <SensorCard
          title="Temperature"
          value={sensor ? temp.toFixed(1) : "—"}
          unit="°C"
          icon={<Thermometer className="w-5 h-5" />}
          status={sensor ? (temp > 35 ? "warning" : "optimal") : "neutral"}
          subtitle={sensor ? (temp > 35 ? "High" : "Normal") : "No data yet"}
        />
        <SensorCard
          title="Humidity"
          value={sensor ? humidity.toFixed(1) : "—"}
          unit="%"
          icon={<Wind className="w-5 h-5" />}
          status={sensor ? (humidity < 30 ? "warning" : "optimal") : "neutral"}
          subtitle={sensor ? (humidity < 30 ? "Low" : "Normal") : "No data yet"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PumpControl />
        <WeatherWidget />
      </div>

      <RecentAlerts />
    </div>
  );
}
