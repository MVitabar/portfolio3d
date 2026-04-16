-- Verificar y arreglar rol de admin
-- Ejecuta esto en Supabase SQL Editor

-- 1. Verificar tu rol actual
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users 
WHERE email = 'vitabarmartin@gmail.com';

-- 2. Asignar rol de admin manualmente
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'),
  '{role}',
  '"admin"'
)
WHERE email = 'vitabarmartin@gmail.com';

-- 3. Verificar que se actualizó correctamente
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users 
WHERE email = 'vitabarmartin@gmail.com';

-- 4. Si necesitas ver todos los usuarios y sus roles
SELECT 
  email, 
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users 
ORDER BY created_at DESC;
