-- ============================================================
-- ECODELY — Migração 4: Usuários, Centros de Custo, Fornecedores
-- Cole no SQL Editor do Supabase e execute
-- ============================================================

-- Usuários do sistema
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
  id bigint PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  pass text NOT NULL,
  role text DEFAULT 'base',
  avatar text,
  active boolean DEFAULT true,
  "lastAccess" text DEFAULT 'nunca'
);
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- Centros de custo
DROP TABLE IF EXISTS centros_custo;
CREATE TABLE centros_custo (
  id bigint PRIMARY KEY,
  nome text NOT NULL
);
ALTER TABLE centros_custo DISABLE ROW LEVEL SECURITY;

-- Fornecedores
DROP TABLE IF EXISTS fornecedores;
CREATE TABLE fornecedores (
  id bigint PRIMARY KEY,
  name text NOT NULL,
  type text DEFAULT 'grafica',
  contact text,
  phone text,
  email text,
  "leadTime" text,
  rating integer DEFAULT 3,
  campaigns integer DEFAULT 0
);
ALTER TABLE fornecedores DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- SEED — Usuários
-- ============================================================
INSERT INTO usuarios (id, name, email, pass, role, avatar, active, "lastAccess") VALUES
  (0,  'Admin Teste',    'a',                      '1',        'admin',      'AT', true, 'nunca'),
  (1,  'Rodrigo Bem',    'rodrigo@ecodely.com.br', 'admin123', 'admin',      'RB', true, 'nunca'),
  (2,  'Ana Lima',       'ana@ecodely.com.br',     'user123',  'comercial',  'AL', true, 'nunca'),
  (3,  'Carlos Mendes',  'carlos@ecodely.com.br',  'user123',  'operacional','CM', true, 'nunca'),
  (4,  'Juliana Faria',  'juliana@ecodely.com.br', 'user123',  'marketing',  'JF', true, 'nunca'),
  (5,  'Paulo Neto',     'paulo@ecodely.com.br',   'user123',  'financeiro', 'PN', true, 'nunca'),
  (6,  'Mariana Costa',  'mariana@ecodely.com.br', 'user123',  'base',       'MC', true, 'nunca')
ON CONFLICT (id) DO NOTHING;

-- SEED — Centros de Custo
INSERT INTO centros_custo (id, nome) VALUES
  (1,'Comercial'),(2,'Operacional'),(3,'Marketing'),
  (4,'Financeiro'),(5,'Base'),(6,'Administrativo'),(7,'RH')
ON CONFLICT (id) DO NOTHING;

-- SEED — Fornecedores
INSERT INTO fornecedores (id, name, type, contact, phone, email, "leadTime", rating, campaigns) VALUES
  (1,'Gráfica TopPrint', 'grafica',  'Roberto Alves', '(11) 3333-0001','roberto@topprint.com.br', '7 dias',    5, 2),
  (2,'Gráfica ColorMax', 'grafica',  'Sandra Reis',   '(11) 3333-0002','sandra@colormax.com.br',  '10 dias',   4, 1),
  (3,'TransBrasil Cargo','logistica','Fernando Dias', '(11) 4444-0001','fernando@transbrasil.com.br','3 dias', 4, 1),
  (4,'ECT Correios',     'logistica','Agência SP',    '0800-725-0100', '',                        '5-10 dias', 3, 1)
ON CONFLICT (id) DO NOTHING;
