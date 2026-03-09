import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Clock } from "lucide-react";
import { useSensorHistory, usePumpHistory } from "@/hooks/useIrrigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, differenceInMinutes } from "date-fns";

const timeRanges = [
  { label: "1h", hours: 1 },
  { label: "6h", hours: 6 },
  { label: "24h", hours: 24 },
  { label: "7d", hours: 168 },
];

export default function Analytics() {
  const [range, setRange] = useState(24);
  const { data: history } = useSensorHistory(range);
  const { data: pumpHistory } = usePumpHistory();

  const chartData = (history ?? []).map((d) => ({
    time: format(new Date(d.timestamp), range <= 6 ? "HH:mm" : "MM/dd HH:mm"),
    moisture: d.moisture_level,
    temperature: d.temperature,
    humidity: d.humidity,
  }));

  // Calculate water usage (pump ON duration)
  const totalPumpMinutes = (pumpHistory ?? []).reduce((acc, log) => {
    if (log.pump_status === "ON" && log.deactivation_time) {
      return acc + differenceInMinutes(new Date(log.deactivation_time), new Date(log.activation_time));
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-2">
            <BarChart3 className="w-7 h-7" />
            Analytics
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Historical sensor data and irrigation activity</p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {timeRanges.map((r) => (
            <Button
              key={r.hours}
              size="sm"
              variant={range === r.hours ? "default" : "ghost"}
              onClick={() => setRange(r.hours)}
              className="text-xs"
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-display">Soil Moisture Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">No data available. Start the simulator to generate data.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="moisture" stroke="hsl(142, 50%, 36%)" strokeWidth={2} dot={false} name="Moisture %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display">Temperature & Humidity</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-12 text-center">No data available</p>
            ) : (
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="hsl(37, 70%, 55%)" strokeWidth={2} dot={false} name="Temp °C" />
                    <Line type="monotone" dataKey="humidity" stroke="hsl(200, 60%, 50%)" strokeWidth={2} dot={false} name="Humidity %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Irrigation Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Estimated pump run time</p>
              <p className="text-2xl font-display font-bold">{totalPumpMinutes} min</p>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {(pumpHistory ?? []).slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${log.pump_status === "ON" ? "bg-status-optimal" : "bg-muted-foreground/30"}`} />
                    <span>Pump {log.pump_status}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {format(new Date(log.activation_time), "MMM d, HH:mm")}
                  </span>
                </div>
              ))}
              {(!pumpHistory || pumpHistory.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
