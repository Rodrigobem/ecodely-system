-- Migration 10: Tabela de Planejamentos de Mídia
CREATE TABLE IF NOT EXISTS planejamentos (
  id BIGINT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Desativa RLS (padrão do projeto)
ALTER TABLE planejamentos DISABLE ROW LEVEL SECURITY;

-- Índice para busca por cliente
CREATE INDEX IF NOT EXISTS idx_planejamentos_cliente 
  ON planejamentos ((data->>'clienteNome'));

-- Índice para ordenação por data
CREATE INDEX IF NOT EXISTS idx_planejamentos_created 
  ON planejamentos ((data->>'createdAt'));
