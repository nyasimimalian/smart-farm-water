-- Make per-user tables fully usable in an external Supabase project.
-- This migration tightens ownership rules, creates default settings on signup,
-- and ensures authenticated users have the needed table privileges.

-- Remove legacy settings rows that do not belong to a user.
DELETE FROM public.settings
WHERE user_id IS NULL;

-- Ensure there is only one settings row per user.
CREATE UNIQUE INDEX IF NOT EXISTS idx_settings_user_id_unique
  ON public.settings (user_id);

-- Make user ownership explicit for application tables.
ALTER TABLE public.sensor_data
  ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.alerts
  ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.pump_log
  ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.settings
  ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.sensor_data
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.alerts
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.pump_log
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.settings
  ALTER COLUMN user_id SET NOT NULL;

-- Keep settings.updated_at fresh on updates.
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create both profile and default settings when a new user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email))
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.settings (
    user_id,
    moisture_threshold_low,
    moisture_threshold_high,
    weather_location,
    auto_mode
  )
  VALUES (NEW.id, 30.0, 60.0, 'Nairobi', true)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Backfill profiles for users that may already exist.
INSERT INTO public.profiles (user_id, display_name)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'display_name', u.email)
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.user_id IS NULL;

-- Backfill settings for users that may already exist.
INSERT INTO public.settings (
  user_id,
  moisture_threshold_low,
  moisture_threshold_high,
  weather_location,
  auto_mode
)
SELECT
  u.id,
  30.0,
  60.0,
  'Nairobi',
  true
FROM auth.users u
LEFT JOIN public.settings s ON s.user_id = u.id
WHERE s.user_id IS NULL;

-- Ensure authenticated clients can use the public schema and tables.
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
