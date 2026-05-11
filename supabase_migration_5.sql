-- ============================================================
-- ECODELY — Migração 5: coluna extraRoles em usuarios
-- Cole no SQL Editor do Supabase e execute
-- ============================================================

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS "extraRoles" jsonb DEFAULT '[]'::jsonb;

-- Garante que todos os usuários existentes têm array vazio
UPDATE usuarios SET "extraRoles" = '[]'::jsonb WHERE "extraRoles" IS NULL;
