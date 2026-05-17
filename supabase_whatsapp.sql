-- ============================================================
-- AGENTE WHATSAPP ECODELY
-- Rodar no SQL Editor do Supabase
-- ============================================================

-- Tabela de conversas
CREATE TABLE IF NOT EXISTS wa_conversas (
  id          BIGSERIAL PRIMARY KEY,
  numero      TEXT NOT NULL UNIQUE,       -- +5511999999999
  nome        TEXT,                        -- nome detectado ou dado pelo usuário
  modo        TEXT DEFAULT 'prospecto',    -- prospecto | parceiro | equipe
  status      TEXT DEFAULT 'novo',         -- novo | em_andamento | convertido | encerrado | aguardando
  parceiro_id BIGINT,                      -- FK para tabela parceiros quando convertido
  dados_lead  JSONB DEFAULT '{}',          -- dados coletados durante conversa
  criado_em   TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS wa_mensagens (
  id           BIGSERIAL PRIMARY KEY,
  conversa_id  BIGINT NOT NULL REFERENCES wa_conversas(id) ON DELETE CASCADE,
  role         TEXT NOT NULL,              -- user | assistant | system
  conteudo     TEXT NOT NULL,
  enviada      BOOLEAN DEFAULT TRUE,
  criado_em    TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de templates de mensagem
CREATE TABLE IF NOT EXISTS wa_templates (
  id        BIGSERIAL PRIMARY KEY,
  nome      TEXT NOT NULL,
  modo      TEXT NOT NULL,                 -- prospecto | parceiro | equipe | cobranca
  conteudo  TEXT NOT NULL,
  ativo     BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Templates padrão
INSERT INTO wa_templates (nome, modo, conteudo) VALUES
('Apresentação inicial', 'prospecto',
'Olá! 👋 Sou da *Ecodely Mídia In-Home*. Trabalhamos com publicidade dentro de estabelecimentos — colocamos displays com anúncios de grandes marcas no seu espaço e você recebe por isso, sem custo nenhum. Posso te explicar melhor?'),

('Qualificação', 'prospecto',
'Ótimo! Para entender se o seu espaço se encaixa, me conta: qual é o tipo do seu estabelecimento e quantas pessoas passam por lá em média por dia?'),

('Proposta de parceria', 'prospecto',
'Perfeito! O seu espaço tem tudo que nossos clientes procuram. 🎯 A parceria funciona assim: instalamos os materiais, você não precisa fazer nada, e recebe uma comissão mensal. Posso te enviar mais detalhes para fechar?'),

('Aviso de etapa', 'equipe',
'⚠️ *Atualização de campanha*\nCampanha: {{campanha}}\nEtapa atual: {{etapa}}\nPrazo: {{prazo}}\n\nAção necessária: {{acao}}'),

('Cobrança postagem', 'cobranca',
'Olá {{nome}}! 📸 Passando para lembrar sobre a postagem do mês referente à parceria com a Ecodely. Você já conseguiu fazer? Se precisar de ajuda com o conteúdo, é só falar!'),

('Confirmação cadastro', 'parceiro',
'🎉 Que ótima notícia! Seu cadastro como parceiro Ecodely foi confirmado. Em breve nossa equipe entra em contato para agendar a instalação. Bem-vindo à família! 🌿');

-- Índices
CREATE INDEX IF NOT EXISTS idx_wa_mensagens_conversa ON wa_mensagens(conversa_id);
CREATE INDEX IF NOT EXISTS idx_wa_conversas_numero ON wa_conversas(numero);
CREATE INDEX IF NOT EXISTS idx_wa_conversas_status ON wa_conversas(status);

-- RLS (Row Level Security) — permite acesso via anon key
ALTER TABLE wa_conversas ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_wa_conversas" ON wa_conversas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_wa_mensagens" ON wa_mensagens FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_wa_templates" ON wa_templates FOR ALL USING (true) WITH CHECK (true);
