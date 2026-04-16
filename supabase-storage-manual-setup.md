# Configuración Manual de Storage en Supabase

## Paso 1: Crear el Bucket (si no existe)

1. Ve a **Storage** en el sidebar izquierdo
2. Si no ves el bucket `portfolio-files`, click **Create bucket**
3. Configura:
   - Bucket name: `portfolio-files`
   - Public bucket: **Marcado** (importante)
   - Click **Save**

## Paso 2: Configurar Políticas de Acceso

1. En **Storage**, selecciona el bucket `portfolio-files`
2. Ve a **Settings** (ícono de engranaje)
3. Desplázate hasta **Policies**
4. Click **New Policy**

### Política 1: Permitir Acceso Público (SELECT)

1. **Policy name**: `Public Access`
2. **Allowed operation**: `SELECT`
3. **Policy definition**: 
   ```sql
   bucket_id = 'portfolio-files'
   ```
4. Click **Review** y luego **Save**

### Política 2: Permitir Upload (INSERT)

1. **Policy name**: `Upload Access`
2. **Allowed operation**: `INSERT`
3. **Policy definition**:
   ```sql
   bucket_id = 'portfolio-files' AND auth.role() = 'authenticated'
   ```
4. Click **Review** y luego **Save**

### Política 3: Permitir Update/DELETE

Repite el proceso para `UPDATE` y `DELETE` con la misma definición que INSERT.

## Paso 3: Verificar Configuración

1. Ve a **Storage** > `portfolio-files`
2. Deberías ver las carpetas:
   - `models/`
   - `images/thumbnails/`
   - `images/renders/`

## Paso 4: Probar Upload

1. En tu portfolio, intenta subir un proyecto
2. Deberías ver los archivos aparecer en el storage

## Solución Alternativa: Política de Acceso Total

Si lo anterior no funciona, crea una política con:

```sql
bucket_id = 'portfolio-files'
```

Para todas las operaciones (SELECT, INSERT, UPDATE, DELETE).

## Notas Importantes

- **Public bucket debe estar marcado** para que las imágenes sean visibles
- Las políticas pueden tardar unos minutos en activarse
- Si sigues teniendo problemas, intenta recargar la página de Supabase
