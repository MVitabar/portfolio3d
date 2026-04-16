-- Solo crear el bucket (sin políticas por ahora)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-files', 'portfolio-files', true);

-- Si el bucket ya existe, esto dará error pero es normal
-- Las políticas se configurarán manualmente en la interfaz de Supabase
