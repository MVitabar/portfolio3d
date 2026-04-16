-- Agregar columna videos a la tabla projects
-- Ejecuta esto en Supabase SQL Editor

-- 1. Agregar la columna videos
ALTER TABLE projects ADD COLUMN IF NOT EXISTS videos TEXT[] DEFAULT '{}';

-- 2. Verificar que se agregó correctamente
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name IN ('images', 'videos');

-- 3. Ver todos tus proyectos ahora
SELECT 
  id, 
  title, 
  category, 
  featured,
  thumbnail_url,
  model_url IS NOT NULL as has_model,
  array_length(images, 1) as image_count,
  array_length(videos, 1) as video_count,
  created_at
FROM projects 
ORDER BY created_at DESC;
