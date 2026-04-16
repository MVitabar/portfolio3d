-- Create tables for your 3D portfolio

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
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

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Character Design', 'character-design', '3D character models and designs'),
('Environment Art', 'environment-art', '3D environments and scenes'),
('Props & Objects', 'props-objects', '3D props and object designs'),
('Animations', 'animations', '3D animations and motion graphics'),
('Concept Art', 'concept-art', '3D concept art and visualizations');

-- Insert sample projects
INSERT INTO projects (title, description, category, featured, thumbnail_url, model_url, images, tags) VALUES
('Cyberpunk Character', 'A futuristic cyberpunk character with detailed clothing and accessories', 'character-design', TRUE, 'https://picsum.photos/400/300?random=1', 'https://example.com/model1.glb', ARRAY['https://picsum.photos/800/600?random=1', 'https://picsum.photos/800/600?random=2'], ARRAY['cyberpunk', 'character', 'sci-fi']),
('Fantasy Environment', 'A mystical fantasy environment with ancient ruins and magical elements', 'environment-art', TRUE, 'https://picsum.photos/400/300?random=2', NULL, ARRAY['https://picsum.photos/800/600?random=3', 'https://picsum.photos/800/600?random=4'], ARRAY['fantasy', 'environment', 'nature']),
('Sci-Fi Prop Collection', 'Collection of futuristic sci-fi props and objects', 'props-objects', FALSE, 'https://picsum.photos/400/300?random=3', NULL, ARRAY['https://picsum.photos/800/600?random=5'], ARRAY['sci-fi', 'props', 'objects']),
('Character Animation', 'Animated sequence showcasing character movement and expression', 'animations', TRUE, 'https://picsum.photos/400/300?random=4', NULL, ARRAY['https://picsum.photos/800/600?random=6'], ARRAY['animation', 'character', 'motion']),
('Architecture Concept', 'Modern architectural concept visualization', 'concept-art', FALSE, 'https://picsum.photos/400/300?random=5', NULL, ARRAY['https://picsum.photos/800/600?random=7'], ARRAY['architecture', 'concept', 'modern']);

-- Create indexes for better performance
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Select projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Select categories" ON categories FOR SELECT USING (true);
