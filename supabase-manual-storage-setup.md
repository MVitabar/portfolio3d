# Configuración Manual de Storage (Sin SQL)

## Paso 1: Crear Bucket Manualmente

1. Ve a **Storage** en el sidebar izquierdo
2. Click **Create bucket**
3. Configura:
   - **Bucket name**: `portfolio-files`
   - **Public bucket**: **Marcado** (¡muy importante!)
   - Click **Save**

## Paso 2: Configurar Políticas Manualmente

1. Selecciona el bucket `portfolio-files`
2. Click en **Settings** (ícono de engranaje)
3. Desplázate a **Policies**
4. Click **New Policy** para cada una:

### Política 1: SELECT (Ver archivos)
- **Policy name**: `Public View Access`
- **Allowed operation**: `SELECT`
- **Policy definition**:
  ```
  bucket_id = 'portfolio-files'
  ```
- Click **Review** > **Save**

### Política 2: INSERT (Subir archivos)
- **Policy name**: `Upload Access`
- **Allowed operation**: `INSERT`
- **Policy definition**:
  ```
  bucket_id = 'portfolio-files'
  ```
- Click **Review** > **Save**

### Política 3: UPDATE (Actualizar archivos)
- **Policy name**: `Update Access`
- **Allowed operation**: `UPDATE`
- **Policy definition**:
  ```
  bucket_id = 'portfolio-files'
  ```
- Click **Review** > **Save**

### Política 4: DELETE (Eliminar archivos)
- **Policy name**: `Delete Access`
- **Allowed operation**: `DELETE`
- **Policy definition**:
  ```
  bucket_id = 'portfolio-files'
  ```
- Click **Review** > **Save**

## Paso 3: Verificar Configuración

1. Ve a **Storage** > `portfolio-files`
2. Deberías ver el bucket con:
   - **Public**: Yes
   - **4 policies** configuradas

## Paso 4: Probar con StorageTester

1. Vuelve a tu portfolio
2. Click **Test Storage Connection**
3. Debería mostrar:
   - Bucket encontrado
   - Upload exitoso
   - URLs públicas funcionando

## Notas Importantes

- **Public bucket debe estar marcado** o las imágenes no serán visibles
- Las políticas pueden tardar **1-2 minutos** en activarse
- Si sigues con errores, recarga la página de Supabase y vuelve a probar

## Si Todo Falla - Alternativa

Si no puedes crear políticas, intenta hacer el bucket **completamente público**:

1. Ve a **Storage** > `portfolio-files`
2. **Settings** > **Public access**
3. Activa **Make bucket public**
4. Esto permitirá acceso sin políticas complejas
