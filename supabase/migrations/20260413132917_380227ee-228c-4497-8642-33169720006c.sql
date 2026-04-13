
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  farm_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add user_id to existing tables
ALTER TABLE public.sensor_data ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.alerts ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.pump_log ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.settings ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old permissive policies
DROP POLICY "Allow all access to alerts" ON public.alerts;
DROP POLICY "Allow all access to pump_log" ON public.pump_log;
DROP POLICY "Allow all access to sensor_data" ON public.sensor_data;
DROP POLICY "Allow all access to settings" ON public.settings;

-- Per-user RLS policies for sensor_data
CREATE POLICY "Users can view their own sensor_data"
  ON public.sensor_data FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sensor_data"
  ON public.sensor_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sensor_data"
  ON public.sensor_data FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sensor_data"
  ON public.sensor_data FOR DELETE
  USING (auth.uid() = user_id);

-- Per-user RLS policies for alerts
CREATE POLICY "Users can view their own alerts"
  ON public.alerts FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own alerts"
  ON public.alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts"
  ON public.alerts FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts"
  ON public.alerts FOR DELETE
  USING (auth.uid() = user_id);

-- Per-user RLS policies for pump_log
CREATE POLICY "Users can view their own pump_log"
  ON public.pump_log FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own pump_log"
  ON public.pump_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pump_log"
  ON public.pump_log FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pump_log"
  ON public.pump_log FOR DELETE
  USING (auth.uid() = user_id);

-- Per-user RLS policies for settings
CREATE POLICY "Users can view their own settings"
  ON public.settings FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings"
  ON public.settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings"
  ON public.settings FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own settings"
  ON public.settings FOR DELETE
  USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
