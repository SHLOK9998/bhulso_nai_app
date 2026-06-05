-- Medicines: duration
ALTER TABLE public.medicines ADD COLUMN IF NOT EXISTS duration_days integer;

-- Profile onboarding
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS conditions text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS goals text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wake_time text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sleep_time text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarded boolean NOT NULL DEFAULT false;

-- Family members
CREATE TABLE IF NOT EXISTS public.family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  relation text,
  age integer,
  color text DEFAULT '#0EA5A4',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own family all" ON public.family_members FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Member scoping on medicines + health_logs
ALTER TABLE public.medicines ADD COLUMN IF NOT EXISTS member_id uuid;
ALTER TABLE public.health_logs ADD COLUMN IF NOT EXISTS member_id uuid;

-- Push subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own subs all" ON public.push_subscriptions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);