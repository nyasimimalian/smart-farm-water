import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Droplets, MapPin, Save, Loader2, Sliders } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/hooks/useIrrigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const KENYA_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet",
  "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga",
  "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
  "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit",
  "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
  "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River",
  "Tharaka-Nithi", "Trans-Nzoia", "Turkana", "Uasin Gishu",
  "Vihiga", "Wajir", "West Pokot",
];

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [low, setLow] = useState(30);
  const [high, setHigh] = useState(60);
  const [location, setLocation] = useState("Nairobi");
  const [autoMode, setAutoMode] = useState(true);

  useEffect(() => {
    if (settings) {
      setLow(settings.moisture_threshold_low);
      setHigh(settings.moisture_threshold_high);
      setLocation(settings.weather_location);
      setAutoMode(settings.auto_mode);
    }
  }, [settings]);

  const handleSave = () => {
    if (low >= high) {
      toast.error("Low threshold must be less than high threshold");
      return;
    }
    updateSettings.mutate(
      { moisture_threshold_low: low, moisture_threshold_high: high, weather_location: location, auto_mode: autoMode },
      { onSuccess: () => toast.success("Settings saved successfully") }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sliders className="w-5 h-5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Configuration</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1.5">Configure irrigation thresholds and preferences</p>
      </div>

      <Card className="glass-card overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary/40 to-transparent" />
        <CardHeader>
          <CardTitle className="text-sm font-display font-bold flex items-center gap-2">
            <Droplets className="w-4 h-4 text-primary" />
            Moisture Thresholds
          </CardTitle>
          <CardDescription>Define moisture levels that trigger automatic irrigation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2.5">
              <Label htmlFor="low" className="text-sm font-semibold">Low Threshold</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="low"
                  type="number"
                  min={0}
                  max={100}
                  value={low}
                  onChange={(e) => setLow(Number(e.target.value))}
                  className="rounded-xl"
                />
                <span className="text-sm font-medium text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">Pump activates below this level</p>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="high" className="text-sm font-semibold">High Threshold</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="high"
                  type="number"
                  min={0}
                  max={100}
                  value={high}
                  onChange={(e) => setHigh(Number(e.target.value))}
                  className="rounded-xl"
                />
                <span className="text-sm font-medium text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">Pump deactivates above this level</p>
            </div>
          </div>

          {/* Visual threshold indicator */}
          <div className="pt-2">
            <div className="h-3 rounded-full bg-gradient-to-r from-status-critical/30 via-status-warning/30 to-status-optimal/30 relative overflow-hidden">
              <div
                className="absolute top-0 bottom-0 border-l-2 border-dashed border-status-critical"
                style={{ left: `${low}%` }}
              />
              <div
                className="absolute top-0 bottom-0 border-l-2 border-dashed border-status-optimal"
                style={{ left: `${high}%` }}
              />
            </div>
            <div className="flex justify-between text-[0.65rem] font-semibold text-muted-foreground mt-1.5">
              <span>0% — Dry</span>
              <span className="text-status-critical">{low}%</span>
              <span className="text-status-optimal">{high}%</span>
              <span>100% — Wet</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-dashed">
            <div>
              <p className="text-sm font-semibold">Automatic Irrigation</p>
              <p className="text-xs text-muted-foreground mt-0.5">Enable threshold-based pump control</p>
            </div>
            <Switch checked={autoMode} onCheckedChange={setAutoMode} />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-accent/40 to-transparent" />
        <CardHeader>
          <CardTitle className="text-sm font-display font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent" />
            Weather Location
          </CardTitle>
          <CardDescription>Set your farm location for weather forecasts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold">County</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select a county" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {KENYA_COUNTIES.map((county) => (
                  <SelectItem key={county} value={county}>
                    {county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={updateSettings.isPending}
        className="w-full sm:w-auto rounded-xl font-semibold shadow-md shadow-primary/15 px-8"
        size="lg"
      >
        {updateSettings.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Save className="w-4 h-4 mr-2" />
        )}
        Save Settings
      </Button>
    </div>
  );
}
