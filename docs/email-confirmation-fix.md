# Solución: Email no confirmado

## Opción 1: Deshabilitar confirmación (Recomendado para desarrollo)

Ejecuta `supabase-disable-email-confirmation.sql` en el SQL Editor de Supabase.

Esto deshabilitará la confirmación de email y podrás acceder inmediatamente.

## Opción 2: Confirmar email manualmente

1. Ve a **Authentication** en Supabase
2. Ve a **Users**
3. Busca tu email (`vitabarmartin@gmail.com`)
4. Click en los **tres puntos (···)** junto a tu usuario
5. Click **Confirm email**

## Opción 3: Reenviar email de confirmación

En tu portfolio, puedes agregar un botón para reenviar la confirmación:

```javascript
// En tu LoginForm o AuthProvider
const resendConfirmation = async (email: string) => {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  })
  
  if (error) {
    console.error('Error:', error)
  } else {
    alert('Email de confirmación reenviado')
  }
}
```

## Opción 4: Usar el modo de desarrollo

Para desarrollo, puedes configurar el cliente para saltar confirmación:

```javascript
// En auth.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

## Verificación de configuración

Después de ejecutar el SQL, verifica que la configuración sea correcta:

```sql
SELECT * FROM auth.config WHERE key = 'mailer_autoconfirm';
```

Debería mostrar `value = 'true'`.

## Para producción

En producción, es recomendable mantener la confirmación de email activada por seguridad.

## Pasos recomendados:

1. **Ejecuta el SQL** para deshabilitar confirmación
2. **Regístrate** con tu email
3. **Verifica** que tengas rol de admin
4. **Prueba** las funciones de administración

## Si sigues con problemas:

1. **Limpia el cache** del navegador
2. **Cierra sesión** y vuelve a intentar
3. **Verifica** en Authentication > Users que tu rol sea 'admin'
4. **Recarga** la página del portfolio
