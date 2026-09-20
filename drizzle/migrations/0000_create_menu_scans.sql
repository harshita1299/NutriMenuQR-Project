CREATE TABLE public.menu_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  table_label text NOT NULL DEFAULT 'Unknown',
  menu_type text NOT NULL DEFAULT 'choice',
  device text NOT NULL DEFAULT 'unknown',
  session_id text
);

CREATE INDEX menu_scans_created_at_idx ON public.menu_scans (created_at DESC);

GRANT SELECT, INSERT ON public.menu_scans TO anon;
GRANT SELECT, INSERT ON public.menu_scans TO authenticated;
GRANT ALL ON public.menu_scans TO service_role;

ALTER TABLE public.menu_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a menu scan"
  ON public.menu_scans FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read scan analytics"
  ON public.menu_scans FOR SELECT
  TO anon, authenticated
  USING (true);