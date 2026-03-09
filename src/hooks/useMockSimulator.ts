import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function useMockSimulator() {
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const qc = useQueryClient();
  const moistureRef = useRef(45);

  const generateReading = useCallback(async () => {
    // Simulate realistic fluctuations
    const delta = (Math.random() - 0.48) * 6; // slight downward bias
    moistureRef.current = Math.max(10, Math.min(90, moistureRef.current + delta));
    const moisture = Math.round(moistureRef.current * 10) / 10;
    const temperature = Math.round((22 + Math.random() * 15) * 10) / 10;
    const humidity = Math.round((40 + Math.random() * 40) * 10) / 10;

    await supabase.from("sensor_data").insert({
      moisture_level: moisture,
      temperature,
      humidity,
    });

    // Check thresholds and generate alerts
    const { data: settings } = await supabase.from("settings").select("*").limit(1).single();
    if (settings) {
      if (moisture < settings.moisture_threshold_low) {
        await supabase.from("alerts").insert({
          message: `Soil moisture critically low: ${moisture}%`,
          severity: "critical",
        });
        if (settings.auto_mode) {
          // Auto turn pump ON
          const { data: currentPump } = await supabase
            .from("pump_log")
            .select("pump_status")
            .order("activation_time", { ascending: false })
            .limit(1)
            .maybeSingle();
          if (!currentPump || currentPump.pump_status === "OFF") {
            await supabase.from("pump_log").insert({ pump_status: "ON" });
            await supabase.from("alerts").insert({
              message: "Pump automatically turned ON (low moisture)",
              severity: "info",
            });
          }
        }
      } else if (moisture > settings.moisture_threshold_high) {
        if (settings.auto_mode) {
          const { data: currentPump } = await supabase
            .from("pump_log")
            .select("pump_status")
            .order("activation_time", { ascending: false })
            .limit(1)
            .maybeSingle();
          if (currentPump && currentPump.pump_status === "ON") {
            await supabase.from("pump_log").insert({ pump_status: "OFF" });
            await supabase.from("alerts").insert({
              message: "Pump automatically turned OFF (sufficient moisture)",
              severity: "info",
            });
          }
        }
      }
    }

    qc.invalidateQueries({ queryKey: ["sensor-data-latest"] });
    qc.invalidateQueries({ queryKey: ["sensor-history"] });
    qc.invalidateQueries({ queryKey: ["pump-status"] });
    qc.invalidateQueries({ queryKey: ["alerts"] });
  }, [qc]);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    setIsRunning(true);
    generateReading(); // immediate first reading
    intervalRef.current = setInterval(generateReading, 5000);
  }, [generateReading]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { isRunning, start, stop, toggle: isRunning ? stop : start };
}
