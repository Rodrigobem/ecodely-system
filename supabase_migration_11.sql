-- Migration 11: Adiciona colunas confirmado e obs em lancamentos

ALTER TABLE lancamentos
  ADD COLUMN IF NOT EXISTS confirmado boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS obs text DEFAULT '';

-- Garante que rows existentes tenham valor padrão
UPDATE lancamentos SET confirmado = false WHERE confirmado IS NULL;
UPDATE lancamentos SET obs = '' WHERE obs IS NULL;
