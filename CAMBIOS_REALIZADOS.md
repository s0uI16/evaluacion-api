# CAMBIOS REALIZADOS

## 1. Validación de Email
- **Archivo:** `src/controllers/users.controller.js`
- **Solución:** Se agregó expresión regular `emailRegex` para validar el formato del email. Retorna error 400 si el formato es inválido. Aplicado en `createNewUser` y `updateExistingUser`.

## 2. Validación de Contraseña
- **Archivo:** `src/controllers/users.controller.js`
- **Solución:** Se agregó validación de mínimo 8 caracteres. Retorna error 400 si no cumple. Aplicado en `createNewUser` y `updateExistingUser`.

## 3. Autorización en Posts
- **Archivo:** `src/controllers/post.controller.js`
- **Solución:** Se verifica que `req.user.id` coincida con `user_id` del post. Retorna error 403 si no es el dueño. Aplicado en `updateExistingPost` y `deleteExistingPost`.

## 4. Autorización en Usuarios
- **Archivo:** `src/controllers/users.controller.js`
- **Solución:** Se verifica que `req.user.id` coincida con el `id` del usuario a modificar. Retorna error 403 si intenta modificar otra cuenta. Aplicado en `updateExistingUser` y `deleteExistingUser`.

## 5. Corrección de userId en Posts
- **Archivo:** `src/controllers/post.controller.js`
- **Solución:** Se eliminó `userId` de `req.body`. Ahora el `user_id` se obtiene exclusivamente desde `req.user.id` del token JWT.

## 6. Activación del Middleware de Sanitización
- **Archivo:** `src/app.js`
- **Solución:** Se descomentó la línea `app.use(sanitizeMiddleware)` para que todas las peticiones sean sanitizadas antes de llegar a los controladores.
