-- ============================================================
-- LIMPEZA DE DADOS DE TESTE — Ecodely
-- ATENÇÃO: preserva todos os dados financeiros (lancamentos, contas, cartoes, etc)
-- Rodar no SQL Editor do Supabase
-- ============================================================

-- Limpar campanhas de teste
DELETE FROM campanhas WHERE id IS NOT NULL;

-- Limpar prospects de teste (Natura, Ambev, iFood, etc)
DELETE FROM prospects WHERE id IS NOT NULL;

-- Limpar closings de teste (Mariana Costa, Carlos Mendes)
DELETE FROM closings WHERE id IS NOT NULL;

-- Limpar tabela de comissões de teste
DELETE FROM comm_table WHERE id IS NOT NULL;

-- Limpar projetos de teste (Copa 2025, Verão 2025, etc)
DELETE FROM projects WHERE id IS NOT NULL;

-- Limpar parceiros de teste
DELETE FROM parceiros WHERE id IS NOT NULL;

-- Limpar faturamento mensal de teste
DELETE FROM fat_mensais WHERE id IS NOT NULL;

-- Limpar planejamentos de teste
DELETE FROM planejamentos WHERE id IS NOT NULL;

-- NÃO APAGAR (dados reais):
-- lancamentos ← financeiro real 2025/2026
-- contas ← Bradesco, C6
-- cartoes ← cartões reais
-- compras_cartao ← compras reais
-- custos_fixos ← custos fixos reais
-- usuarios ← usuários reais
-- configuracoes ← configurações do sistema
-- centros_custo ← centros de custo configurados
-- fornecedores ← fornecedores cadastrados

SELECT 'Limpeza concluída. Dados financeiros preservados.' as status;
