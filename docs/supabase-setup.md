# Configuración de Supabase para Portfolio 3D

## Paso 1: Configurar Base de Datos

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto: `psrchqjcswcivllitkze`
3. Ve a **SQL Editor** > **New query**
4. Copia y ejecuta el contenido de `supabase-schema.sql`

## Paso 2: Configurar Storage para Archivos 3D

1. Ve a **Storage** en el sidebar izquierdo
2. Crea un nuevo bucket llamado `portfolio-files`
3. Configura las políticas de acceso:

### Políticas de Storage (ejecuta en SQL Editor):

```sql
-- Allow public access to images
CREATE POLICY "Allow public access to images" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-files' AND (name LIKE '%.png' OR name LIKE '%.jpg' OR name LIKE '%.jpeg' OR name LIKE '%.webp'));

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'portfolio-files');

-- Allow users to update their own files
CREATE POLICY "Allow users to update own files" ON storage.objects
FOR UPDATE USING (bucket_id = 'portfolio-files');
```

## Paso 3: Obtener Service Role Key

1. Ve a **Project Settings** > **API**
2. Copia el `service_role` key
3. Agrega al `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

## Paso 4: Estructura de Carpetas en Storage

Organiza tus archivos así:

```
portfolio-files/
  models/
    project-1/
      model.glb
      model.fbx
    project-2/
      character.glb
  images/
    thumbnails/
      project-1-thumb.jpg
      project-2-thumb.jpg
    renders/
      project-1-render-1.jpg
      project-1-render-2.jpg
```

## Paso 5: URLs de Archivos

Las URLs en la base de datos deben tener este formato:

```sql
-- Ejemplo de URLs
UPDATE projects SET 
  thumbnail_url = 'https://psrchqjcswcivllitkze.supabase.co/storage/v1/object/public/portfolio-files/images/thumbnails/project-1-thumb.jpg',
  model_url = 'https://psrchqjcswcivllitkze.supabase.co/storage/v1/object/public/portfolio-files/models/project-1/model.glb',
  images = ARRAY[
    'https://psrchqjcswcivllitkze.supabase.co/storage/v1/object/public/portfolio-files/images/renders/project-1-render-1.jpg',
    'https://psrchqjcswcivllitkze.supabase.co/storage/v1/object/public/portfolio-files/images/renders/project-1-render-2.jpg'
  ]
WHERE id = 'tu-project-id';
```

## Paso 6: Subir Archivos

1. Ve a **Storage** > **portfolio-files**
2. Sube tus archivos siguiendo la estructura
3. Obtén las URLs y actualiza la base de datos

## Formatos Soportados

### Modelos 3D:
- `.glb` (recomendado)
- `.gltf`
- `.fbx`
- `.obj`

### Imágenes:
- `.jpg`
- `.png`
- `.webp`

## Tips para Modelos 3D

1. **Optimiza tus modelos** antes de subir:
   - Reduce polígonos si es posible
   - Comprime texturas
   - Usa formato GLB para mejor rendimiento

2. **Tamaño recomendado**:
   - Modelos: < 50MB
   - Texturas: < 4K resolución
   - Thumbnails: 400x300px

3. **Nomenclatura**:
   - Usa nombres descriptivos
   - Evita espacios y caracteres especiales
   - Usa guiones bajos o guiones
