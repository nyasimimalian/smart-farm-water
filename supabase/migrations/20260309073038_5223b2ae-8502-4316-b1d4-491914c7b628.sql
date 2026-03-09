
-- Create sensor_data table
CREATE TABLE public.sensor_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  moisture_level FLOAT NOT NULL,
  temperature FLOAT NOT NULL,
  humidity FLOAT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create pump_log table
CREATE TABLE public.pump_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pump_status TEXT NOT NULL CHECK (pump_status IN ('ON', 'OFF')),
  activation_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  deactivation_time TIMESTAMPTZ
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false
);

-- Create settings table (single row for single-user system)
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  moisture_threshold_low FLOAT NOT NULL DEFAULT 30.0,
  moisture_threshold_high FLOAT NOT NULL DEFAULT 60.0,
  weather_location TEXT NOT NULL DEFAULT 'Nairobi',
  auto_mode BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pump_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Since single-user with no auth, allow all access
CREATE POLICY "Allow all access to sensor_data" ON public.sensor_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to pump_log" ON public.pump_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to alerts" ON public.alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);

-- Insert default settings row
INSERT INTO public.settings (moisture_threshold_low, moisture_threshold_high, weather_location, auto_mode)
VALUES (30.0, 60.0, 'Nairobi', true);

-- Create indexes for performance
CREATE INDEX idx_sensor_data_timestamp ON public.sensor_data (timestamp DESC);
CREATE INDEX idx_pump_log_activation ON public.pump_log (activation_time DESC);
CREATE INDEX idx_alerts_timestamp ON public.alerts (timestamp DESC);
CREATE INDEX idx_alerts_is_read ON public.alerts (is_read);
