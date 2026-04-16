INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-files', 'portfolio-files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public access to images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'portfolio-files' AND 
  (name LIKE 'images/thumbnails/%' OR name LIKE 'images/renders/%')
);

CREATE POLICY "Allow public access to models" ON storage.objects
FOR SELECT USING (
  bucket_id = 'portfolio-files' AND 
  name LIKE 'models/%'
);

CREATE POLICY "Allow authenticated users to upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'portfolio-files' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to update own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'portfolio-files' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'portfolio-files' AND 
  auth.role() = 'authenticated'
);

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
