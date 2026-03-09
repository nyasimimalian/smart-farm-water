import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Droplets, MapPin, Save, Loader2 } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/hooks/useIrrigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

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
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-2">
          <Settings className="w-7 h-7" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Configure irrigation thresholds and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            Moisture Thresholds
          </CardTitle>
          <CardDescription>Set moisture levels that trigger automatic irrigation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="low">Low Threshold (pump turns ON)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="low"
                  type="number"
                  min={0}
                  max={100}
                  value={low}
                  onChange={(e) => setLow(Number(e.target.value))}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">Pump activates when moisture drops below this</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="high">High Threshold (pump turns OFF)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="high"
                  type="number"
                  min={0}
                  max={100}
                  value={high}
                  onChange={(e) => setHigh(Number(e.target.value))}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">Pump deactivates when moisture exceeds this</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-t">
            <div>
              <p className="text-sm font-medium">Automatic Irrigation</p>
              <p className="text-xs text-muted-foreground">Enable threshold-based pump control</p>
            </div>
            <Switch checked={autoMode} onCheckedChange={setAutoMode} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-display flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Weather Location
          </CardTitle>
          <CardDescription>Set your farm location for weather data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="location">City Name</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Nairobi, Kampala, Lagos"
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateSettings.isPending} className="w-full sm:w-auto">
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
