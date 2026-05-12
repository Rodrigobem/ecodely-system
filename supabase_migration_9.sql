CREATE TABLE IF NOT EXISTS notificacoes (
  id bigint PRIMARY KEY,
  user_id bigint REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  titulo text NOT NULL,
  mensagem text,
  link_tab text,
  lida boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notificacoes DISABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_notif_user ON notificacoes(user_id, lida);
