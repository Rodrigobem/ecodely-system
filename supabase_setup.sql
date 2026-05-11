-- ============================================================
-- ECODELY SISTEMA DE GESTÃO — Setup Supabase
-- Cole este SQL no SQL Editor do Supabase e execute
-- ============================================================

-- Desabilita RLS para uso interno (sistema fechado com login próprio)
-- Se quiser ativar autenticação Supabase no futuro, habilite RLS

-- ============================================================
-- FINANCEIRO
-- ============================================================

create table if not exists lancamentos (
  id bigint primary key,
  data text not null,
  descricao text not null,
  entrada numeric default 0,
  saida numeric default 0,
  tipo text,
  categoria text,
  "centrosCusto" text,
  forma text,
  projeto text,
  "contaBancoId" integer,
  created_at timestamptz default now()
);
alter table lancamentos disable row level security;

create table if not exists contas (
  id bigint primary key,
  banco text not null,
  tipo text,
  agencia text,
  conta text,
  saldo numeric default 0,
  cor text,
  created_at timestamptz default now()
);
alter table contas disable row level security;

create table if not exists cartoes (
  id bigint primary key,
  nome text not null,
  titular text,
  vencimento integer,
  limite numeric default 0,
  banco text,
  cor text,
  created_at timestamptz default now()
);
alter table cartoes disable row level security;

create table if not exists compras_cartao (
  id bigint primary key,
  "cartaoId" integer,
  projeto text,
  descricao text,
  "valorTotal" numeric default 0,
  parcelas integer default 1,
  "parcelaAtual" integer default 1,
  "valorParcela" numeric default 0,
  "mesInicio" text,
  created_at timestamptz default now()
);
alter table compras_cartao disable row level security;

create table if not exists custos_fixos (
  id bigint primary key,
  descricao text not null,
  valor numeric default 0,
  dia integer,
  categoria text,
  "centrosCusto" text,
  ativo boolean default true,
  created_at timestamptz default now()
);
alter table custos_fixos disable row level security;

create table if not exists fat_mensais (
  id serial primary key,
  mes text unique not null,
  fat numeric default 0,
  created_at timestamptz default now()
);
alter table fat_mensais disable row level security;

-- ============================================================
-- COMERCIAL / CAMPANHAS
-- ============================================================

create table if not exists campanhas (
  id bigint primary key,
  name text not null,
  client text,
  stage integer default 1,
  progress integer default 0,
  start text,
  "endDate" text,
  budget numeric default 0,
  tags jsonb default '[]',
  tasks jsonb default '{}',
  timeline jsonb default '[]',
  partners jsonb default '[]',
  created_at timestamptz default now()
);
alter table campanhas disable row level security;

create table if not exists prospects (
  id bigint primary key,
  name text not null,
  owner text,
  stage text,
  value numeric default 0,
  contact text,
  email text,
  phone text,
  notes text,
  created_at timestamptz default now()
);
alter table prospects disable row level security;

create table if not exists parceiros (
  id bigint primary key,
  name text not null,
  category text,
  address text,
  city text,
  state text,
  contact text,
  email text,
  phone text,
  score integer default 0,
  status text default 'ativo',
  contract text,
  "contractEnd" text,
  deliveries integer default 0,
  created_at timestamptz default now()
);
alter table parceiros disable row level security;

-- ============================================================
-- DADOS INICIAIS — Abril 2026
-- ============================================================

-- Contas bancárias
insert into contas (id, banco, tipo, agencia, conta, saldo, cor) values
  (1, 'Bradesco', 'Conta Corrente', '1234-5', '98765-4', 14915.62, '#CC0000'),
  (2, 'Nubank', 'Conta Corrente', '', '', 5000, '#820AD1'),
  (3, 'C6 Bank', 'Conta Corrente', '', '', 2000, '#F5C518')
on conflict (id) do nothing;

-- Cartões
insert into cartoes (id, nome, titular, vencimento, limite, banco, cor) values
  (1, 'C6 Azul Dani', 'Daniela Gmeiner', 15, 30000, 'C6 Bank', '#3D9EFF'),
  (2, 'Latam Dani', 'Daniela Gmeiner', 20, 20000, 'Itaú', '#F5A623'),
  (3, 'Mastercard Daniela', 'Daniela Gmeiner', 10, 25000, 'Santander', '#FF4D6A'),
  (4, 'Master Santander Rodrigo', 'Rodrigo Bem', 15, 30000, 'Santander', '#9B7FFF')
on conflict (id) do nothing;

-- Compras no cartão
insert into compras_cartao (id, "cartaoId", projeto, descricao, "valorTotal", parcelas, "parcelaAtual", "valorParcela", "mesInicio") values
  (1, 1, 'PP 131 - Gráfica EVO - Sensia', 'GRAFICA EVO SENSIA 2.000 MEGABOX', 4490, 2, 2, 2245, '04/2026'),
  (2, 1, 'PP 130 - Gráfica EVO - UNEX', 'GRAFICA EVO UNEX 3.000 MEGABOX BAHIA', 7860, 2, 2, 3930, '04/2026'),
  (3, 4, 'Fluxo Ecodely Midia', 'FLUXO PAGAMENTOS ECODELY MIDIA', 5000, 12, 10, 416.74, '07/2025'),
  (4, 2, 'Fluxo Ecodely Midia', 'FLUXO PAGAMENTOS ECODELY MIDIA LATAM', 5000, 12, 10, 416.74, '07/2025')
on conflict (id) do nothing;

-- Custos fixos
insert into custos_fixos (id, descricao, valor, dia, categoria, "centrosCusto", ativo) values
  (1, 'PRONAMP - Bradesco (Capital de Giro)', 2494.85, 2, 'Financiamento', 'Financeiro', true),
  (2, 'Advogado - Masserotto', 1860, 5, 'Juridico', 'Administrativo', true),
  (3, 'Salario Priscila', 1000, 5, 'Salario', 'Comercial', true),
  (4, 'Salario Larissa', 1343.75, 5, 'Salario', 'Marketing', true),
  (5, 'Salario Victoria (base)', 1000, 5, 'Salario', 'Base', true),
  (6, 'Salario Pedro Designer', 2500, 5, 'Salario', 'Operacional', true),
  (7, 'Coworking Delta', 212, 10, 'Infraestrutura', 'Administrativo', true),
  (8, 'Sistema Operand', 240, 15, 'SaaS', 'Operacional', true),
  (9, 'Google GSuite', 441, 15, 'SaaS', 'Administrativo', true),
  (10, 'Hostgator (Site Lock)', 38.99, 15, 'SaaS', 'Marketing', true),
  (11, 'Hostgator (Mensal)', 16.79, 15, 'SaaS', 'Marketing', true),
  (12, 'Contador (+ 13o proporcional)', 568.62, 15, 'Contador', 'Financeiro', true),
  (13, 'Salario Pedro (socio)', 12500, 15, 'Pro-Labore', 'Administrativo', true),
  (14, 'Salario Rodrigo (socio)', 12500, 15, 'Pro-Labore', 'Administrativo', true),
  (15, 'DARF', 178.31, 20, 'Imposto', 'Financeiro', true),
  (16, 'Acao Ambiental - Selo EPN', 226, 30, 'Ambiental', 'Operacional', true)
on conflict (id) do nothing;

-- Lançamentos Abril 2026
insert into lancamentos (id, data, descricao, entrada, saida, tipo, categoria, "centrosCusto", forma, projeto, "contaBancoId") values
  (1, '02/04/2026', 'PI 2523 CLIENTE DIALOGO | BAIRRO IPIRANGA - NF 134', 76800, 0, 'Receita', 'Projeto', 'Comercial', 'PIX', 'NF 134', 1),
  (2, '02/04/2026', 'PI 2555 CLIENTE DIALOGO | BAIRRO MOOCA - NF 135', 76800, 0, 'Receita', 'Projeto', 'Comercial', 'PIX', 'NF 135', 1),
  (3, '02/04/2026', 'PRONAMP - Conta Bradesco 13/42', 0, 2494.85, 'Despesa', 'Financiamento', 'Financeiro', 'Debito', '', 1),
  (4, '02/04/2026', 'SALARIO PRISCILA', 0, 1000, 'Despesa', 'Salario', 'Comercial', 'PIX', '', 1),
  (5, '02/04/2026', 'SALARIO VICTORIA (base)', 0, 1000, 'Despesa', 'Salario', 'Base', 'PIX', '', 1),
  (6, '02/04/2026', 'SALARIO LARISSA', 0, 1343.75, 'Despesa', 'Salario', 'Marketing', 'PIX', '', 1),
  (7, '02/04/2026', 'SALARIO PEDRO DESIGNER', 0, 2500, 'Despesa', 'Salario', 'Operacional', 'PIX', '', 1),
  (8, '02/04/2026', 'JUROS APORTE RENATO', 0, 2400, 'Despesa', 'Financiamento', 'Financeiro', 'PIX', '', 1),
  (9, '02/04/2026', 'SALARIO PEDRO (socio)', 0, 12500, 'Despesa', 'Pro-Labore', 'Administrativo', 'PIX', '', 1),
  (10, '02/04/2026', 'SALARIO RODRIGO (socio)', 0, 12500, 'Despesa', 'Pro-Labore', 'Administrativo', 'PIX', '', 1),
  (11, '18/04/2026', 'DAS - NF 134 e 135 DIALOGO', 0, 173.34, 'Despesa', 'Imposto', 'Financeiro', 'Boleto', 'DAS Abril/2026', 1),
  (12, '18/04/2026', 'DARF', 0, 178.31, 'Despesa', 'Imposto', 'Financeiro', 'DARF', '', 1),
  (13, '15/04/2026', 'CONTADOR', 0, 568.62, 'Despesa', 'Contador', 'Financeiro', 'Boleto', '', 1),
  (14, '15/04/2026', 'COWORKING DELTA', 0, 212, 'Despesa', 'Infraestrutura', 'Administrativo', 'Boleto', '', 1),
  (15, '30/04/2026', 'ACAO AMBIENTAL - SELO EPN', 0, 226, 'Despesa', 'Ambiental', 'Operacional', 'Boleto', '', 1)
on conflict (id) do nothing;

-- Faturamento mensal histórico
insert into fat_mensais (mes, fat) values
  ('Mai/2025', 80000), ('Jun/2025', 45000), ('Jul/2025', 60000),
  ('Ago/2025', 120000), ('Set/2025', 95000), ('Out/2025', 110000),
  ('Nov/2025', 85000), ('Dez/2025', 70000), ('Jan/2026', 115440),
  ('Fev/2026', 39840), ('Mar/2026', 90000), ('Abr/2026', 153600)
on conflict (mes) do nothing;
