-- ============================================================
-- ECODELY — Migração 6: adiciona tasks de Gráfica e Logística
-- nas campanhas existentes
-- Cole no SQL Editor do Supabase e execute
-- ============================================================

UPDATE campanhas
SET data = jsonb_set(
  jsonb_set(
    data,
    '{tasks,grafica}',
    '[
      {"id":"g1","label":"Arte aprovada pelo cliente","done":false},
      {"id":"g2","label":"Material enviado para gráfica","done":false},
      {"id":"g3","label":"Impressão confirmada","done":false},
      {"id":"g4","label":"Material entregue","done":false}
    ]'::jsonb,
    true
  ),
  '{tasks,logistica}',
  '[
    {"id":"l1","label":"Logística confirmada","done":false},
    {"id":"l2","label":"Rota de entrega definida","done":false},
    {"id":"l3","label":"Entrega realizada","done":false}
  ]'::jsonb,
  true
)
WHERE data->'tasks'->'grafica' IS NULL;
