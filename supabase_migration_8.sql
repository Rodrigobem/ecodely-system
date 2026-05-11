CREATE TABLE IF NOT EXISTS configuracoes (
  chave text PRIMARY KEY,
  valor jsonb NOT NULL
);
ALTER TABLE configuracoes DISABLE ROW LEVEL SECURITY;

INSERT INTO configuracoes (chave, valor) VALUES
  ('reservaCaixaPct', '10'::jsonb),
  ('socios', '[{"id":1,"nome":"Rodrigo Bem","pct":50},{"id":2,"nome":"Pedro","pct":50}]'::jsonb),
  ('dasAjuste', 'null'::jsonb)
ON CONFLICT (chave) DO NOTHING;
