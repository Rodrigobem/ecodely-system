CREATE TABLE IF NOT EXISTS planejamentos (
  id bigint PRIMARY KEY,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE planejamentos DISABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_plan_project ON planejamentos((data->>'projectId'));
