CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  thumbnail_url TEXT NOT NULL,
  model_url TEXT,
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}'
);

INSERT INTO categories (name, slug, description) VALUES
('Character Design', 'character-design', '3D character models and designs'),
('Environment Art', 'environment-art', '3D environments and scenes'),
('Props & Objects', 'props-objects', '3D props and object designs'),
('Animations', 'animations', '3D animations and motion graphics'),
('Concept Art', 'concept-art', '3D concept art and visualizations')
ON CONFLICT (slug) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Select projects" ON projects FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Select categories" ON categories FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Insert projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Update projects" ON projects FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Delete projects" ON projects FOR DELETE USING (true);
