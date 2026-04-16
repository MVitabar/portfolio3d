-- Actualizar proyectos de prueba con URLs válidas
-- Ejecuta esto en Supabase SQL Editor

-- Actualizar proyectos con URLs de imágenes reales (placeholder)
UPDATE projects 
SET 
  thumbnail_url = 'https://picsum.photos/400/300?random=1',
  images = ARRAY['https://picsum.photos/800/600?random=1', 'https://picsum.photos/800/600?random=2'],
  videos = ARRAY['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4']
WHERE id = '1';

UPDATE projects 
SET 
  thumbnail_url = 'https://picsum.photos/400/300?random=2',
  images = ARRAY['https://picsum.photos/800/600?random=3', 'https://picsum.photos/800/600?random=4'],
  videos = ARRAY['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4']
WHERE id = '2';

-- Verificar los cambios
SELECT 
  id, 
  title, 
  thumbnail_url,
  array_length(images, 1) as image_count,
  array_length(videos, 1) as video_count
FROM projects 
ORDER BY id;
