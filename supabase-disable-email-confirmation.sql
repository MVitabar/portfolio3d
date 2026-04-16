-- Deshabilitar confirmación de email para desarrollo
-- Ejecuta esto en Supabase SQL Editor

-- 1. Deshabilitar confirmación de email
UPDATE auth.config 
SET mailer_autoconfirm = true;

-- 2. Opcional: Deshabilitar rate limiting para desarrollo
UPDATE auth.config 
SET rate_limit_signups = 999999;

-- 3. Verificar configuración
SELECT * FROM auth.config WHERE key IN ('mailer_autoconfirm', 'rate_limit_signups');
