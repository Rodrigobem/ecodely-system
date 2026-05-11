-- ============================================================
-- ECODELY — Migração 3: tabelas restantes + Storage
-- Cole no SQL Editor do Supabase e execute
-- ============================================================

-- Parceiros (JSONB — tem endereco e contrato aninhados)
DROP TABLE IF EXISTS parceiros;
CREATE TABLE parceiros (
  id bigint PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE parceiros DISABLE ROW LEVEL SECURITY;

-- Comissões lançadas
DROP TABLE IF EXISTS closings;
CREATE TABLE closings (
  id bigint PRIMARY KEY,
  "user" text,
  "userId" integer,
  partner text,
  type text,
  "typeId" integer,
  project text,
  "projectId" integer,
  value numeric DEFAULT 0,
  date text,
  status text DEFAULT 'pendente',
  pago boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE closings DISABLE ROW LEVEL SECURITY;

-- Tabela de comissões por tipo/projeto
DROP TABLE IF EXISTS comm_table;
CREATE TABLE comm_table (
  id bigint PRIMARY KEY,
  "typeId" integer,
  "typeName" text,
  "projectId" integer,
  "projectName" text,
  value numeric DEFAULT 0
);
ALTER TABLE comm_table DISABLE ROW LEVEL SECURITY;

-- Projetos
DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
  id bigint PRIMARY KEY,
  name text NOT NULL,
  active boolean DEFAULT true
);
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Tipos de parceiro
DROP TABLE IF EXISTS ptypes;
CREATE TABLE ptypes (
  id bigint PRIMARY KEY,
  name text NOT NULL
);
ALTER TABLE ptypes DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- Storage bucket para arquivos reais
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('ecodely-files', 'ecodely-files', true)
ON CONFLICT (id) DO NOTHING;

-- Política: qualquer um pode ler (público)
CREATE POLICY "public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'ecodely-files');

-- Política: qualquer um pode fazer upload (sem auth próprio)
CREATE POLICY "public upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'ecodely-files');

CREATE POLICY "public update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'ecodely-files');

CREATE POLICY "public delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'ecodely-files');

-- ============================================================
-- SEED — Parceiros
-- ============================================================
INSERT INTO parceiros (id, data) VALUES
(1,'{"id":1,"name":"Burger Bros SP","handle":"@burgerbros_sp","city":"São Paulo","state":"SP","category":"Hamburguer","deliveries":312,"status":"ativo","mesesNaBase":8,"campanhas":3,"engajamento":3,"score":74,"endereco":{"rua":"Rua Augusta","numero":"1204","bairro":"Consolação","cep":"01304-001","lat":-23.5542,"lng":-46.6527},"contrato":{"status":"assinado","enviadoEm":"10/09/2024","assinadoEm":"12/09/2024","expiraEm":"12/09/2025"}}'::jsonb),
(2,'{"id":2,"name":"Pizza da Vila","handle":"@pizzadavila_rj","city":"Rio de Janeiro","state":"RJ","category":"Pizza","deliveries":187,"status":"prospectado","mesesNaBase":1,"campanhas":0,"engajamento":2,"score":13,"endereco":{"rua":"Rua Voluntários da Pátria","numero":"340","bairro":"Botafogo","cep":"22270-010","lat":-22.9519,"lng":-43.1823},"contrato":{"status":"pendente","enviadoEm":"01/05/2025","assinadoEm":null,"expiraEm":null}}'::jsonb),
(3,'{"id":3,"name":"Sushi Zen","handle":"@sushizen_bsb","city":"Brasília","state":"DF","category":"Japonesa","deliveries":445,"status":"negociando","mesesNaBase":3,"campanhas":1,"engajamento":3,"score":42,"endereco":{"rua":"CLN 408 Bloco B","numero":"12","bairro":"Asa Norte","cep":"70855-520","lat":-15.7396,"lng":-47.8826},"contrato":{"status":"pendente","enviadoEm":"15/03/2025","assinadoEm":null,"expiraEm":null}}'::jsonb),
(4,'{"id":4,"name":"Açaí Raiz","handle":"@acairaiz_ssa","city":"Salvador","state":"BA","category":"Açaí","deliveries":276,"status":"ativo","mesesNaBase":6,"campanhas":2,"engajamento":3,"score":58,"endereco":{"rua":"Av. Oceânica","numero":"876","bairro":"Ondina","cep":"40170-010","lat":-13.0061,"lng":-38.5147},"contrato":{"status":"assinado","enviadoEm":"05/11/2024","assinadoEm":"06/11/2024","expiraEm":"06/11/2025"}}'::jsonb),
(5,'{"id":5,"name":"Churrasco do Gaúcho","handle":"@churrascodogaucho","city":"Porto Alegre","state":"RS","category":"Churrascaria","deliveries":203,"status":"ativo","mesesNaBase":5,"campanhas":2,"engajamento":2,"score":47,"endereco":{"rua":"Av. Ipiranga","numero":"1681","bairro":"Azenha","cep":"90160-093","lat":-30.0453,"lng":-51.2177},"contrato":{"status":"expirando","enviadoEm":"02/05/2024","assinadoEm":"04/05/2024","expiraEm":"04/06/2025"}}'::jsonb),
(6,'{"id":6,"name":"Tapioca Nordestina","handle":"@tapioca_nordestina","city":"Recife","state":"PE","category":"Regional","deliveries":98,"status":"ativo","mesesNaBase":2,"campanhas":1,"engajamento":1,"score":14,"endereco":{"rua":"Rua do Bom Jesus","numero":"197","bairro":"Recife Antigo","cep":"50030-170","lat":-8.0631,"lng":-34.8711},"contrato":{"status":"sem contrato","enviadoEm":null,"assinadoEm":null,"expiraEm":null}}'::jsonb),
(7,'{"id":7,"name":"Café Paulistano","handle":"@cafepaulistano","city":"São Paulo","state":"SP","category":"Café","deliveries":156,"status":"ativo","mesesNaBase":4,"campanhas":1,"engajamento":2,"score":36,"endereco":{"rua":"Rua Oscar Freire","numero":"540","bairro":"Jardins","cep":"01426-000","lat":-23.5635,"lng":-46.6711},"contrato":{"status":"assinado","enviadoEm":"10/01/2025","assinadoEm":"11/01/2025","expiraEm":"11/01/2026"}}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- SEED — Closings
INSERT INTO closings (id,"user","userId",partner,type,"typeId",project,"projectId",value,date,status,pago) VALUES
(1,'Mariana Costa',6,'Churrascaria do Zé','Restaurante',1,'Copa 2025',1,80,'02/04','aprovado',true),
(2,'Mariana Costa',6,'Bar do Alemão','Bar',2,'Copa 2025',1,120,'05/04','aprovado',false),
(3,'Mariana Costa',6,'Padaria Estrela','Padaria',3,'Copa 2025',1,60,'08/04','pendente',false),
(4,'Carlos Mendes',3,'Café Central','Café',5,'Dia das Mães 2025',3,55,'20/04','pendente',false)
ON CONFLICT (id) DO NOTHING;

-- SEED — Comm Table
INSERT INTO comm_table (id,"typeId","typeName","projectId","projectName",value) VALUES
(1,1,'Restaurante',1,'Copa 2025',80),
(2,2,'Bar',1,'Copa 2025',120),
(3,3,'Padaria',1,'Copa 2025',60),
(4,1,'Restaurante',2,'Verão 2025',70),
(5,4,'Açaí',2,'Verão 2025',90),
(6,5,'Café',3,'Dia das Mães 2025',55)
ON CONFLICT (id) DO NOTHING;

-- SEED — Projects
INSERT INTO projects (id,name,active) VALUES
(1,'Copa 2025',true),(2,'Verão 2025',true),(3,'Dia das Mães 2025',true)
ON CONFLICT (id) DO NOTHING;

-- SEED — Ptypes
INSERT INTO ptypes (id,name) VALUES
(1,'Restaurante'),(2,'Bar'),(3,'Padaria'),(4,'Açaí'),(5,'Café'),(6,'Hamburgueria')
ON CONFLICT (id) DO NOTHING;
