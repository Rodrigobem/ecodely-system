-- ============================================================
-- FEEDBACK DO SIMULADOR DE TREINAMENTO
-- Rodar no SQL Editor do Supabase
-- ============================================================

CREATE TABLE IF NOT EXISTS simulador_feedback (
  id                BIGSERIAL PRIMARY KEY,
  modo              TEXT NOT NULL,              -- prospecto | parceiro | cobranca
  resposta_agente   TEXT NOT NULL,              -- o que a Victória disse
  correcao_sugerida TEXT NOT NULL,              -- como deveria ter respondido
  historico         TEXT,                       -- últimas 6 mensagens do contexto
  resolvido         BOOLEAN DEFAULT FALSE,      -- se o problema foi corrigido no prompt
  criado_em         TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE simulador_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_feedback" ON simulador_feedback FOR ALL USING (true) WITH CHECK (true);
