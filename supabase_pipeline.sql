-- ============================================================
-- PIPELINE DE CONVERSÃO — Ecodely
-- Rodar no SQL Editor do Supabase
-- ============================================================

CREATE TABLE IF NOT EXISTS pipeline_leads (
  id            BIGSERIAL PRIMARY KEY,
  nome          TEXT NOT NULL,              -- nome do restaurante
  responsavel   TEXT NOT NULL,              -- membro do time: Victória, Daniel, Rodrigo
  etapa         TEXT DEFAULT 'abordado',    -- abordado | respondeu | interessado | convertido
  campanha      TEXT,                       -- ex: Engelux SP, MRV Porto Alegre
  cidade        TEXT,
  tipo          TEXT,                       -- hamburgueria, restaurante, sushi, etc
  telefone      TEXT,
  instagram     TEXT,
  obs           TEXT,
  origem        TEXT DEFAULT 'manual',      -- manual | whatsapp
  wa_conversa_id BIGINT,                    -- FK para wa_conversas se vier do agente
  criado_em     TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pipeline_etapa ON pipeline_leads(etapa);
CREATE INDEX IF NOT EXISTS idx_pipeline_responsavel ON pipeline_leads(responsavel);
CREATE INDEX IF NOT EXISTS idx_pipeline_campanha ON pipeline_leads(campanha);

-- RLS
ALTER TABLE pipeline_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_pipeline" ON pipeline_leads FOR ALL USING (true) WITH CHECK (true);

-- Dados de exemplo para visualizar o kanban
INSERT INTO pipeline_leads (nome, responsavel, etapa, campanha, cidade, tipo, instagram) VALUES
('Hamburgueria do João', 'Victória', 'abordado', 'Engelux SP', 'São Paulo', 'Hamburgueria', '@hamburgueriadojoao'),
('Sushi Ipiranga', 'Daniel', 'convertido', 'Diálogo Engenharia', 'São Paulo', 'Japonês', '@sushiipiranga'),
('Açaí da Lara', 'Victória', 'convertido', 'MRV Porto Alegre', 'Porto Alegre', 'Açaí', '@acaida.lara'),
('Beer Rock Club', 'Daniel', 'convertido', 'Diálogo Engenharia', 'São Paulo', 'Boteco', '@beerrockclub'),
('Flying Sushi', 'Rodrigo', 'convertido', 'Vibra Energia', 'São Paulo', 'Japonês', '@flyingsushi'),
('Padaria Central', 'Victória', 'respondeu', 'Engelux SP', 'São Paulo', 'Padaria', '@padariacentral'),
('Burger House', 'Rodrigo', 'interessado', 'MRV Porto Alegre', 'Porto Alegre', 'Hamburgueria', '@burgerhouse'),
('Cantina Roma', 'Daniel', 'abordado', 'Engelux SP', 'São Paulo', 'Italiano', '@cantinaroma');
