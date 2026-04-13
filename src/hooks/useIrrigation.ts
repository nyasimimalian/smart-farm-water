import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useLatestSensorData() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["sensor-data-latest", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sensor_data")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    refetchInterval: 5000,
  });
}

export function useSensorHistory(hours = 24) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["sensor-history", hours, user?.id],
    queryFn: async () => {
      const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("sensor_data")
        .select("*")
        .gte("timestamp", since)
        .order("timestamp", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
    refetchInterval: 10000,
  });
}

export function useLatestPumpStatus() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["pump-status", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pump_log")
        .select("*")
        .order("activation_time", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    refetchInterval: 5000,
  });
}

export function usePumpHistory() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["pump-history", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pump_log")
        .select("*")
        .order("activation_time", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
    refetchInterval: 10000,
  });
}

export function useAlerts(unreadOnly = false) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["alerts", unreadOnly, user?.id],
    queryFn: async () => {
      let query = supabase
        .from("alerts")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(50);
      if (unreadOnly) query = query.eq("is_read", false);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
    refetchInterval: 5000,
  });
}

export function useSettings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["settings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      // If no settings exist for this user, create default ones
      if (!data && user) {
        const { data: newData, error: insertError } = await supabase
          .from("settings")
          .insert({
            user_id: user.id,
            moisture_threshold_low: 30,
            moisture_threshold_high: 60,
            weather_location: "Nairobi",
            auto_mode: true,
          })
          .select()
          .single();
        if (insertError) throw insertError;
        return newData;
      }
      return data;
    },
    enabled: !!user,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: {
      moisture_threshold_low?: number;
      moisture_threshold_high?: number;
      weather_location?: string;
      auto_mode?: boolean;
    }) => {
      const { data: current } = await supabase.from("settings").select("id").limit(1).single();
      if (!current) throw new Error("No settings found");
      const { error } = await supabase.from("settings").update(updates).eq("id", current.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}

export function useTogglePump() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (status: "ON" | "OFF") => {
      if (!user) throw new Error("Not authenticated");
      if (status === "OFF") {
        const { data: current } = await supabase
          .from("pump_log")
          .select("*")
          .eq("pump_status", "ON")
          .is("deactivation_time", null)
          .order("activation_time", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (current) {
          await supabase
            .from("pump_log")
            .update({ pump_status: "OFF", deactivation_time: new Date().toISOString() })
            .eq("id", current.id);
        }
        const { error } = await supabase.from("pump_log").insert({ pump_status: "OFF", user_id: user.id });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("pump_log").insert({ pump_status: "ON", user_id: user.id });
        if (error) throw error;
      }
      await supabase.from("alerts").insert({
        message: `Pump manually turned ${status}`,
        severity: "info",
        user_id: user.id,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pump-status"] });
      qc.invalidateQueries({ queryKey: ["pump-history"] });
      qc.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function useMarkAlertRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase.from("alerts").update({ is_read: true }).eq("id", alertId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

export function useDismissAllAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("alerts").update({ is_read: true }).eq("is_read", false);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}
