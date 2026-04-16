-- Políticas de Storage para Supabase
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Crear bucket para archivos del portfolio
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-files', 'portfolio-files', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas de acceso para el bucket

-- Permitir acceso público a imágenes (thumbnails y renders)
CREATE POLICY "Allow public access to images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'portfolio-files' AND 
  (name LIKE 'images/thumbnails/%' OR name LIKE 'images/renders/%')
);

-- Permitir acceso público a modelos 3D
CREATE POLICY "Allow public access to models" ON storage.objects
FOR SELECT USING (
  bucket_id = 'portfolio-files' AND 
  name LIKE 'models/%'
);

-- Permitir que usuarios autenticados suban archivos
CREATE POLICY "Allow authenticated users to upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'portfolio-files' AND 
  auth.role() = 'authenticated'
);

-- Permitir que usuarios actualicen sus propios archivos
CREATE POLICY "Allow users to update own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'portfolio-files' AND 
  auth.role() = 'authenticated'
);

-- Permitir que usuarios eliminen sus propios archivos
CREATE POLICY "Allow users to delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'portfolio-files' AND 
  auth.role() = 'authenticated'
);

-- 3. Habilitar RLS para storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 4. Opcional: Crear función para generar URLs firmadas si necesitas acceso privado
CREATE OR REPLACE FUNCTION get_private_url(path text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  select public.storage.get_signed_url('portfolio-files', path, 3600);
$$;
