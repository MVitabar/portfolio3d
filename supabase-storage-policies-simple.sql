-- Políticas de Storage para solucionar el error RLS
-- Ejecuta esto en SQL Editor de Supabase

-- 1. Deshabilitar RLS temporalmente para storage
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- 2. Crear el bucket si no existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-files', 'portfolio-files', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Rehabilitar RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas simples para storage.buckets
DROP POLICY IF EXISTS "Users can view buckets" ON storage.buckets;
CREATE POLICY "Users can view buckets" ON storage.buckets FOR SELECT USING (true);

-- 5. Deshabilitar RLS para storage.objects
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 6. Crear políticas para storage.objects
DROP POLICY IF EXISTS "Users can view objects" ON storage.objects;
CREATE POLICY "Users can view objects" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-files');

DROP POLICY IF EXISTS "Users can upload objects" ON storage.objects;
CREATE POLICY "Users can upload objects" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-files');

DROP POLICY IF EXISTS "Users can update objects" ON storage.objects;
CREATE POLICY "Users can update objects" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-files');

DROP POLICY IF EXISTS "Users can delete objects" ON storage.objects;
CREATE POLICY "Users can delete objects" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-files');

-- 7. Rehabilitar RLS para storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
