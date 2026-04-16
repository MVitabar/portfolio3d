# Configuración de Administración del Portfolio

## Paso 1: Configurar Autenticación en Supabase

1. Ve a **Authentication** en el sidebar de Supabase
2. Ve a **Settings**
3. Configura el **Site URL** con tu dominio (ej: http://localhost:3000 para desarrollo)
4. Habilita **Email/Password** authentication

## Paso 2: Ejecutar SQL de Configuración

Ejecuta el contenido de `supabase-auth-setup.sql` en el SQL Editor de Supabase.

**Importante:** Reemplaza `your-admin-email@example.com` con tu email real antes de ejecutar.

## Paso 3: Crear Cuenta de Administrador

1. **Regístrate** en tu portfolio con el email que configuraste
2. Tu cuenta tendrá automáticamente rol de "admin"
3. Podrás ver los controles de administración

## Paso 4: Funcionalidades de Administrador

Como administrador, podrás:

### **En la Galería:**
- **Botón Editar** (icono de lápiz) en cada proyecto
- **Botón Eliminar** (icono de basura) en cada proyecto
- Eliminación completa (base de datos + archivos)

### **En la Navbar:**
- **Icono de Settings** para configuraciones
- **Email visible** del usuario logueado
- **Botón Sign Out** para cerrar sesión

### **Protección de Archivos:**
- Solo admins pueden eliminar proyectos
- Los archivos se eliminan del storage automáticamente
- Confirmación antes de eliminar

## Paso 5: Otorgar Permisos de Admin

Para hacer otro usuario admin:

```sql
SELECT update_user_role('user-uuid-here', 'admin');
```

O ejecuta directamente en SQL Editor:

```sql
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'),
  '{role}',
  '"admin"'
)
WHERE email = 'user@example.com';
```

## Funcionalidades Futuras

- **Editar proyectos**: Modificar título, descripción, categorías
- **Administrar usuarios**: Ver lista de usuarios, roles
- **Estadísticas**: Views, uploads, actividad
- **Configuración del sitio**: Título, descripción, tema

## Seguridad

- Las funciones SQL usan `SECURITY DEFINER` para ejecutar con permisos elevados
- Solo usuarios autenticados pueden acceder a funciones de admin
- Las políticas RLS protegen los datos
- Los archivos se eliminan completamente del storage

## Notas Importantes

- **No olvides cambiar el email** en el SQL antes de ejecutar
- **El primer usuario** con el email configurado será admin automáticamente
- **Puedes tener múltiples admins** usando la función `update_user_role`
- **Los usuarios normales** solo pueden ver el portfolio, no modificarlo
