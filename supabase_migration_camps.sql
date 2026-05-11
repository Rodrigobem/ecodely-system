-- ============================================================
-- MIGRAÇÃO: Campanhas (JSONB) + Seed Prospects
-- Cole no SQL Editor do Supabase e execute
-- ============================================================

-- Recria campanhas com coluna data JSONB (flexível para todos os campos)
DROP TABLE IF EXISTS campanhas;
CREATE TABLE campanhas (
  id bigint PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE campanhas DISABLE ROW LEVEL SECURITY;

-- Seed Campanhas (dados reais do sistema)
INSERT INTO campanhas (id, data) VALUES
(1, '{
  "id":1,"name":"O Boticário - Maio 2025","client":"O Boticário","stage":3,
  "project":"Dia das Mães","startDate":"05/05/2025","endDate":"31/05/2025",
  "region":"São Paulo · SP","segments":["Hamburguer","Açaí","Café"],
  "graficaFornecedor":"Gráfica TopPrint","material":"Sacola kraft 30x40",
  "graficaPrazo":"28/04/2025","logistica":"Transportadora",
  "logisticaFornecedor":"TransBrasil Cargo","logisticaPrazo":"02/05/2025",
  "parceiros":87,"sacolas":18000,"sacolasDistribuidas":null,"progress":60,
  "parceirosIds":[1,7],
  "tasks":{
    "comercial":[{"id":"c1","label":"Emitir PI","done":true,"doneAt":"28/04 10:20","doneBy":"Ana Lima"},{"id":"c2","label":"Enviar contrato ao cliente","done":true,"doneAt":"28/04 11:05","doneBy":"Ana Lima"}],
    "financeiro":[{"id":"f1","label":"Receber PI","done":true,"doneAt":"29/04 09:00","doneBy":"Paulo Neto"},{"id":"f2","label":"Faturar NF","done":false},{"id":"f3","label":"Lançar planilha financeira","done":false}],
    "marketing":[{"id":"m1","label":"Post Instagram","done":true,"doneAt":"01/05 14:30","doneBy":"Juliana Faria"},{"id":"m2","label":"Post LinkedIn","done":false},{"id":"m3","label":"Contratar influencer","done":false}],
    "base":[{"id":"b1","label":"Confirmar base participante","done":true,"doneAt":"27/04 16:00","doneBy":"Mariana Costa"},{"id":"b2","label":"Enviar contrato de exclusividade","done":false}]
  },
  "timeline":[
    {"id":1,"type":"stage","text":"Campanha criada - Etapa: Fechamento","user":"Rodrigo Bem","avatar":"RB","at":"25/04 09:00","color":"#3D9EFF"},
    {"id":2,"type":"task","text":"Tarefa concluída: Confirmar base participante","user":"Mariana Costa","avatar":"MC","at":"27/04 16:00","color":"#25D366"},
    {"id":3,"type":"task","text":"Tarefa concluída: Emitir PI","user":"Ana Lima","avatar":"AL","at":"28/04 10:20","color":"#3D9EFF"},
    {"id":5,"type":"stage","text":"Etapa avançada: Gráfica - Logística","user":"Carlos Mendes","avatar":"CM","at":"02/05 08:30","color":"#9B7FFF"}
  ],
  "files":[
    {"id":1,"name":"Arte_Boticario_MaeDias.pdf","type":"arte","size":"4.2 MB","uploadedBy":"Ana Lima","at":"30/04 14:55","icon":"-"},
    {"id":2,"name":"PI_Boticario_0052025.pdf","type":"pi","size":"1.1 MB","uploadedBy":"Ana Lima","at":"28/04 10:18","icon":"-"}
  ],
  "impactos":{"stories":[],"influencer":[],"impulsionado":[],"galeria":[]}
}'::jsonb),

(2, '{
  "id":2,"name":"Pirelli - Junho 2025","client":"Pirelli Brasil","stage":1,
  "project":"Copa 2025","startDate":"01/06/2025","endDate":"30/06/2025",
  "region":"Rio de Janeiro · RJ","segments":["Pizza","Japonesa","Hamburguer"],
  "graficaFornecedor":"","material":"","graficaPrazo":"","logistica":"",
  "logisticaFornecedor":"","logisticaPrazo":"","parceiros":54,"sacolas":10000,
  "sacolasDistribuidas":null,"progress":15,"parceirosIds":[2],
  "tasks":{
    "comercial":[{"id":"c1","label":"Emitir PI","done":false},{"id":"c2","label":"Enviar contrato ao cliente","done":false}],
    "financeiro":[{"id":"f1","label":"Receber PI","done":false},{"id":"f2","label":"Faturar NF","done":false},{"id":"f3","label":"Lançar planilha financeira","done":false}],
    "marketing":[{"id":"m1","label":"Post Instagram","done":false},{"id":"m2","label":"Post LinkedIn","done":false},{"id":"m3","label":"Contratar influencer","done":false}],
    "base":[{"id":"b1","label":"Confirmar base participante","done":true,"doneAt":"02/05 09:00","doneBy":"Mariana Costa"},{"id":"b2","label":"Enviar contrato de exclusividade","done":false}]
  },
  "timeline":[{"id":1,"type":"stage","text":"Campanha criada","user":"Rodrigo Bem","avatar":"RB","at":"01/05 10:00","color":"#3D9EFF"}],
  "files":[],
  "impactos":{"stories":[],"influencer":[],"impulsionado":[],"galeria":[]}
}'::jsonb),

(3, '{
  "id":3,"name":"Supergasbras - Abril 2025","client":"Supergasbras","stage":5,
  "project":"Verão 2025","startDate":"01/04/2025","endDate":"30/04/2025",
  "region":"Salvador · BA + Recife · PE","segments":["Açaí","Regional","Padaria"],
  "graficaFornecedor":"Gráfica ColorMax","material":"Sacola biodegradável",
  "graficaPrazo":"20/03/2025","logistica":"Correios","logisticaFornecedor":"ECT",
  "logisticaPrazo":"28/03/2025","parceiros":123,"sacolas":25000,
  "sacolasDistribuidas":null,"progress":100,"parceirosIds":[4,6],
  "tasks":{
    "comercial":[{"id":"c1","label":"Emitir PI","done":true,"doneAt":"10/03 09:00","doneBy":"Ana Lima"},{"id":"c2","label":"Enviar contrato ao cliente","done":true,"doneAt":"10/03 11:00","doneBy":"Ana Lima"}],
    "financeiro":[{"id":"f1","label":"Receber PI","done":true,"doneAt":"11/03 10:00","doneBy":"Paulo Neto"},{"id":"f2","label":"Faturar NF","done":true,"doneAt":"02/04 09:00","doneBy":"Paulo Neto"},{"id":"f3","label":"Lançar planilha financeira","done":true,"doneAt":"02/04 10:00","doneBy":"Paulo Neto"}],
    "marketing":[{"id":"m1","label":"Post Instagram","done":true,"doneAt":"01/04 08:00","doneBy":"Juliana Faria"},{"id":"m2","label":"Post LinkedIn","done":true,"doneAt":"01/04 08:30","doneBy":"Juliana Faria"},{"id":"m3","label":"Contratar influencer","done":true,"doneAt":"15/03 14:00","doneBy":"Juliana Faria"}],
    "base":[{"id":"b1","label":"Confirmar base participante","done":true,"doneAt":"08/03 16:00","doneBy":"Mariana Costa"},{"id":"b2","label":"Enviar contrato de exclusividade","done":true,"doneAt":"12/03 11:00","doneBy":"Mariana Costa"}]
  },
  "timeline":[
    {"id":1,"type":"stage","text":"Campanha criada","user":"Rodrigo Bem","avatar":"RB","at":"05/03 09:00","color":"#3D9EFF"},
    {"id":2,"type":"stage","text":"Campanha finalizada com sucesso","user":"Rodrigo Bem","avatar":"RB","at":"30/04 18:00","color":"#00E5A0"}
  ],
  "files":[{"id":1,"name":"Relatorio_Final_Supergasbras.pdf","type":"relatorio","size":"2.8 MB","uploadedBy":"Rodrigo Bem","at":"30/04 17:00","icon":"-"}],
  "impactos":{"stories":[],"influencer":[],"impulsionado":[],"galeria":[]}
}'::jsonb),

(4, '{
  "id":4,"name":"T4F - Maio 2025","client":"T4F Entretenimento","stage":2,
  "project":"Copa 2025","startDate":"15/05/2025","endDate":"15/06/2025",
  "region":"São Paulo + Porto Alegre","segments":["Café","Sobremesa","Hamburguer"],
  "graficaFornecedor":"Gráfica TopPrint","material":"Sacola papel offset",
  "graficaPrazo":"08/05/2025","logistica":"","logisticaFornecedor":"",
  "logisticaPrazo":"","parceiros":67,"sacolas":14000,"sacolasDistribuidas":null,
  "progress":30,"parceirosIds":[1,5,7],
  "tasks":{
    "comercial":[{"id":"c1","label":"Emitir PI","done":true,"doneAt":"25/04 10:00","doneBy":"Ana Lima"},{"id":"c2","label":"Enviar contrato ao cliente","done":true,"doneAt":"25/04 11:00","doneBy":"Ana Lima"}],
    "financeiro":[{"id":"f1","label":"Receber PI","done":true,"doneAt":"26/04 09:00","doneBy":"Paulo Neto"},{"id":"f2","label":"Faturar NF","done":false},{"id":"f3","label":"Lançar planilha financeira","done":false}],
    "marketing":[{"id":"m1","label":"Post Instagram","done":true,"doneAt":"28/04 10:00","doneBy":"Juliana Faria"},{"id":"m2","label":"Post LinkedIn","done":true,"doneAt":"28/04 10:30","doneBy":"Juliana Faria"},{"id":"m3","label":"Contratar influencer","done":false}],
    "base":[{"id":"b1","label":"Confirmar base participante","done":true,"doneAt":"27/04 15:00","doneBy":"Mariana Costa"},{"id":"b2","label":"Enviar contrato de exclusividade","done":false}]
  },
  "timeline":[
    {"id":1,"type":"stage","text":"Campanha criada","user":"Rodrigo Bem","avatar":"RB","at":"24/04 14:00","color":"#3D9EFF"},
    {"id":2,"type":"stage","text":"Etapa avançada: Fechamento - Gráfica","user":"Carlos Mendes","avatar":"CM","at":"02/05 09:00","color":"#9B7FFF"}
  ],
  "files":[{"id":1,"name":"PI_T4F_Copa2025.pdf","type":"pi","size":"980 KB","uploadedBy":"Ana Lima","at":"25/04 10:00","icon":"-"}],
  "impactos":{"stories":[],"influencer":[],"impulsionado":[],"galeria":[]}
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Seed Prospects
-- ============================================================
INSERT INTO prospects (id, name, contact, email, phone, notes, stage, value, owner) VALUES
  (1, 'Natura',          'Paula Mendes',   'paula@natura.com.br',      '', 'Indicação O Boticário',       'lead',       42000,  'Ana Lima'),
  (2, 'Ambev',           'Ricardo Torres', 'ricardo@ambev.com.br',     '', 'Interesse em 3 capitais',    'qualificado', 85000,  'Ana Lima'),
  (3, 'Magazine Luiza',  'Fernanda Luz',   'fernanda@magalu.com.br',   '', 'Proposta enviada 05/04',     'proposta',   120000, 'Rodrigo Bem'),
  (4, 'iFood',           'Bruno Sá',       'bruno@ifood.com.br',       '', 'Reunião marcada 20/04',      'negociacao', 200000, 'Rodrigo Bem'),
  (5, 'Riachuelo',       'Carla Vaz',      'carla@riachuelo.com.br',   '', 'Aguardando aprovação interna','proposta',   55000,  'Ana Lima')
ON CONFLICT (id) DO NOTHING;
