-- Verificar tus proyectos reales en Supabase
-- Ejecuta esto en Supabase SQL Editor

-- Ver todos tus proyectos
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

-- Ver detalles de un proyecto específico (reemplaza ID)
SELECT 
  id,
  title,
  description,
  thumbnail_url,
  model_url,
  images,
  videos,
  tags,
  created_at
FROM projects 
WHERE id = 'tu-project-id-aqui';

-- Ver si hay problemas con las URLs
SELECT 
  id,
  title,
  CASE 
    WHEN thumbnail_url IS NULL OR thumbnail_url = '' THEN 'Missing thumbnail'
    ELSE 'Has thumbnail'
  END as thumbnail_status,
  CASE 
    WHEN images IS NULL OR array_length(images, 1) = 0 THEN 'No images'
    ELSE CONCAT(array_length(images, 1), ' images')
  END as images_status,
  CASE 
    WHEN videos IS NULL OR array_length(videos, 1) = 0 THEN 'No videos'
    ELSE CONCAT(array_length(videos, 1), ' videos')
  END as videos_status
FROM projects
ORDER BY created_at DESC;
