-- Add videos column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS videos TEXT[] DEFAULT '{}';

-- Update existing projects to have empty videos array
UPDATE projects SET videos = '{}' WHERE videos IS NULL;
