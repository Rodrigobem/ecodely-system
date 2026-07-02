-- ============================================================
-- WHATSAPP CRM MULTIAGENTE — FASE 1
-- Aplicado via Supabase MCP apply_migration em xklvqcxhtariqqhvnseh
-- ============================================================

ALTER TABLE wa_conversas ADD COLUMN IF NOT EXISTS instancia TEXT DEFAULT 'victoria';
UPDATE wa_conversas SET instancia = 'victoria' WHERE instancia IS NULL;
ALTER TABLE wa_conversas ADD COLUMN IF NOT EXISTS atendente_id INTEGER;
ALTER TABLE wa_conversas ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'aguardando';
ALTER TABLE wa_conversas ADD COLUMN IF NOT EXISTS etiquetas TEXT[];
ALTER TABLE wa_conversas ADD COLUMN IF NOT EXISTS notas_internas TEXT;
ALTER TABLE wa_conversas ADD COLUMN IF NOT EXISTS parceiro_id INTEGER;
ALTER TABLE wa_conversas ADD COLUMN IF NOT EXISTS lead_id INTEGER;
ALTER TABLE wa_conversas ADD COLUMN IF NOT EXISTS transferido_de TEXT;
ALTER TABLE wa_conversas ADD COLUMN IF NOT EXISTS finalizado_em TIMESTAMP;
ALTER TABLE wa_conversas ADD COLUMN IF NOT EXISTS notificado_gerente_em TIMESTAMP; -- dedupe server-side do alerta 30min

-- numero deixa de ser único sozinho: o mesmo contato pode falar com a Maya (victoria)
-- e depois com um atendente humano (instância diferente)
ALTER TABLE wa_conversas DROP CONSTRAINT IF EXISTS wa_conversas_numero_key;
ALTER TABLE wa_conversas ADD CONSTRAINT wa_conversas_numero_instancia_key UNIQUE (numero, instancia);

CREATE TABLE IF NOT EXISTS wa_instancias (
  id BIGINT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  instancia_nome TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'desconectado',
  numero TEXT,
  criado_em TIMESTAMP DEFAULT NOW(),
  conectado_em TIMESTAMP
);
ALTER TABLE wa_instancias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_wa_instancias" ON wa_instancias FOR ALL USING (true) WITH CHECK (true);
