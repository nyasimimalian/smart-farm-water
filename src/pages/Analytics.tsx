import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Clock, TrendingUp, Droplets } from "lucide-react";
import { useSensorHistory, usePumpHistory } from "@/hooks/useIrrigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";
import { format, differenceInMinutes } from "date-fns";
import { cn } from "@/lib/utils";

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

  const totalPumpMinutes = (pumpHistory ?? []).reduce((acc, log) => {
    if (log.pump_status === "ON" && log.deactivation_time) {
      return acc + differenceInMinutes(new Date(log.deactivation_time), new Date(log.activation_time));
    }
    return acc;
  }, 0);

  const emptyState = (
    <div className="py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
        <TrendingUp className="w-6 h-6 text-muted-foreground/40" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">No data available yet</p>
      <p className="text-xs text-muted-foreground/60 mt-1">Start the simulator to generate sensor readings</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Historical Data</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1.5">Sensor trends and irrigation activity</p>
        </div>
        <div className="flex gap-1 bg-muted/60 rounded-xl p-1 border">
          {timeRanges.map((r) => (
            <Button
              key={r.hours}
              size="sm"
              variant={range === r.hours ? "default" : "ghost"}
              onClick={() => setRange(r.hours)}
              className={cn("text-xs rounded-lg font-semibold", range === r.hours && "shadow-sm")}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      <Card className="glass-card overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
        <CardHeader>
          <CardTitle className="text-sm font-display font-bold flex items-center gap-2">
            <Droplets className="w-4 h-4 text-primary" />
            Soil Moisture Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? emptyState : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(152, 55%, 32%)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(152, 55%, 32%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(48, 20%, 86%)",
                      boxShadow: "0 4px 12px hsl(152 20% 20% / 0.08)",
                      fontSize: "13px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="moisture"
                    stroke="hsl(152, 55%, 32%)"
                    strokeWidth={2.5}
                    fill="url(#moistureGradient)"
                    dot={false}
                    name="Moisture %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass-card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-secondary/40 via-accent/20 to-transparent" />
          <CardHeader>
            <CardTitle className="text-sm font-display font-bold">Temperature & Humidity</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-12 text-center">No data available</p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "13px" }} />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="hsl(32, 65%, 52%)" strokeWidth={2} dot={false} name="Temp °C" />
                    <Line type="monotone" dataKey="humidity" stroke="hsl(178, 45%, 40%)" strokeWidth={2} dot={false} name="Humidity %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-status-info/40 to-transparent" />
          <CardHeader>
            <CardTitle className="text-sm font-display font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-status-info" />
              Irrigation Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-5 p-4 bg-muted/40 rounded-2xl border border-border/60">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Total Pump Runtime</p>
              <p className="text-2xl font-display font-extrabold mt-1">{totalPumpMinutes} <span className="text-sm font-medium text-muted-foreground">min</span></p>
            </div>
            <div className="space-y-1 max-h-44 overflow-y-auto">
              {(pumpHistory ?? []).slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between text-sm py-2.5 px-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      log.pump_status === "ON" ? "bg-status-optimal" : "bg-muted-foreground/25"
                    )} />
                    <span className="font-medium">Pump {log.pump_status}</span>
                  </div>
                  <span className="text-muted-foreground text-xs font-medium">
                    {format(new Date(log.activation_time), "MMM d, HH:mm")}
                  </span>
                </div>
              ))}
              {(!pumpHistory || pumpHistory.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-6">No activity recorded</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
