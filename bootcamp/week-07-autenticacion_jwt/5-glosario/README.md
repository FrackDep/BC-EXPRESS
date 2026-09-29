# 📖 Glosario — Semana 07: Autenticación JWT

Términos clave ordenados alfabéticamente.

---

## A

### Access Token
Token JWT de vida corta (15 minutos) que autoriza el acceso a recursos protegidos. Se envía en cada request y se verifica en el servidor. Su corta duración limita el daño si es interceptado.

### Authentication (Autenticación)
Proceso de verificar la identidad de un usuario: "¿quién eres?". Se diferencia de la autorización, que responde "¿qué puedes hacer?". En esta semana se implementa con email/contraseña + JWT.

### Authorization (Autorización)
Proceso de verificar si un usuario autenticado tiene permiso para acceder a un recurso o ejecutar una acción. Se profundiza en la semana 08 con RBAC.

### `authMiddleware`
Middleware de Express que protege rutas privadas. Extrae el access token de la cookie, lo verifica con `verifyAccessToken()`, y adjunta el payload en `req.user`. Si falla, responde 401.

---

## B

### Base64URL
Variante de Base64 que usa `-` y `_` en lugar de `+` y `/`, y omite el padding `=`. Se usa en JWT para codificar header y payload. No es cifrado: cualquiera puede decodificarlo.

### bcrypt
Algoritmo de hashing diseñado específicamente para contraseñas. Incorpora un salt aleatorio y permite configurar los "salt rounds" para aumentar el costo computacional con el tiempo.

---

## C

### Claim
Fragmento de información en el payload de un JWT. Los claims estándar son `sub` (sujeto), `iat` (emitido en), `exp` (expiración). Los claims personalizados agregan datos propios (ej. `role`, `email`).

### cookie-parser
Middleware de Express que parsea el header `Cookie` y popula `req.cookies`. Necesario para leer cookies HttpOnly en el servidor.

### CSRF (Cross-Site Request Forgery)
Ataque en el que un sitio malicioso hace que el navegador del usuario envíe requests autenticados a otro sitio sin su conocimiento. Las cookies con `SameSite: 'lax'` o `'strict'` mitigan este riesgo.

---

## H

### Hash (one-way)
Función matemática unidireccional: dado un input produce siempre el mismo output, pero no se puede obtener el input original desde el output. bcrypt genera hashes one-way para contraseñas.

### HttpOnly (cookie flag)
Atributo de cookie que impide su acceso desde JavaScript (`document.cookie`). Mitiga ataques XSS porque aunque un script malicioso se ejecute, no puede robar la cookie.

---

## I

### `iat` (Issued At)
Claim JWT que indica cuándo fue emitido el token, en Unix timestamp (segundos). Generado automáticamente por `jsonwebtoken` al llamar a `jwt.sign()`.

---

## J

### JWT (JSON Web Token)
Estándar abierto (RFC 7519) para transmitir información de forma segura como objeto JSON firmado digitalmente. Estructura: `header.payload.signature`, separados por puntos.

### `JsonWebTokenError`
Clase de error lanzada por `jsonwebtoken` cuando el token tiene firma inválida, formato incorrecto, o secret incorrecto.

### jsonwebtoken
Librería npm para crear y verificar JWTs en Node.js. Funciones principales: `jwt.sign()` para crear tokens y `jwt.verify()` para validarlos.

---

## R

### Rainbow Table
Tabla precalculada de hashes para revertirlos a sus valores originales. El salt aleatorio de bcrypt hace que cada hash sea único, haciendo inútiles las rainbow tables.

### RBAC (Role-Based Access Control)
Sistema de control de acceso basado en roles asignados a usuarios (ej. `'user'`, `'admin'`). Se implementa como middleware que verifica `req.user.role` antes de permitir el acceso. Se profundiza en la semana 08.

### Refresh Token
Token JWT de vida larga (7 días) que se usa para obtener nuevos access tokens sin que el usuario inicie sesión de nuevo. Se almacena en cookie HttpOnly con path restrictivo (`/api/v1/auth`).

### `req.user`
Propiedad inyectada en el objeto `Request` de Express por `authMiddleware`. Contiene el payload decodificado del access token (`{ sub, email, role }`). Tipada globalmente en `src/types/express.d.ts`.

---

## S

### Salt
Valor aleatorio único generado para cada contraseña antes de hacer el hash. Garantiza que dos usuarios con la misma contraseña tengan hashes distintos. En bcrypt está embebido en el hash resultante.

### Salt Rounds
Número que determina cuántas veces el algoritmo bcrypt itera (factor de costo). Valor recomendado: 10. Cada incremento duplica el tiempo de cómputo. Formato interno: `$2b$<rounds>$<salt><hash>`.

### Secure (cookie flag)
Atributo de cookie que indica que solo debe enviarse sobre conexiones HTTPS. Se activa con `secure: true` en producción para evitar transmisión en claro.

### `SameSite` (cookie flag)
Atributo que controla cuándo se envía la cookie en requests cross-site. Valores: `'strict'` (nunca), `'lax'` (solo navegación directa), `'none'` (siempre, requiere Secure).

### `select: false`
Opción de campo en Mongoose Schema que excluye el campo de los resultados de las queries por defecto. Para incluirlo hay que solicitarlo explícitamente: `.select('+password')`. Previene la exposición accidental de datos sensibles.

### `sub` (Subject)
Claim JWT estándar que identifica al sujeto del token. Generalmente contiene el ID del usuario (`user._id.toString()`).

---

## T

### Token Rotation
Estrategia de seguridad en la que cada vez que se usa un refresh token para renovar el acceso, se genera un nuevo refresh token e invalida el anterior. Previene el reúso de tokens robados.

### Token Revocation
Proceso de invalidar un token antes de su expiración. En el contexto de refresh tokens con rotación, se logra eliminando o actualizando el hash almacenado en la base de datos.

### `TokenExpiredError`
Clase de error lanzada por `jsonwebtoken` cuando el token tiene la firma correcta pero ya pasó su fecha de expiración (`exp` en el pasado). Se debe diferenciar de `JsonWebTokenError` para dar respuestas apropiadas.

---

## U

### User Enumeration
Vulnerabilidad que permite a un atacante determinar si un email existe en el sistema mediante diferencias en los mensajes de error. Se previene retornando el mismo mensaje de error para "email no encontrado" y "contraseña incorrecta".

---

## X

### XSS (Cross-Site Scripting)
Ataque que inyecta scripts maliciosos en páginas web que se ejecutan en el navegador del usuario. Las cookies HttpOnly mitigan XSS porque los tokens no son accesibles desde JavaScript.
