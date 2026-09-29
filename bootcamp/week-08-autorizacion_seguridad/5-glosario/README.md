# Glosario — Semana 08: Autorización y Seguridad

Términos técnicos ordenados alfabéticamente.

---

## A

**`Access-Control-Allow-Origin`**
Header HTTP que el servidor envía para indicar qué orígenes tienen permiso de acceder al recurso. `*` permite todos los orígenes (inseguro con cookies). Un valor específico como `http://localhost:5173` restringe el acceso.

**Authentication (Autenticación)**
Proceso de verificar la identidad de un usuario: "¿quién eres?". Se establece con tokens JWT, contraseñas, biometría, etc. Ver semana 07.

**Authorization (Autorización)**
Proceso de verificar qué puede hacer un usuario ya autenticado: "¿qué tienes permitido?". Se implementa con RBAC en la semana 08.

---

## C

**Clickjacking**
Técnica de ataque que embebe una página web en un `<iframe>` invisible para engañar al usuario a hacer clic en elementos ocultos. `X-Frame-Options: DENY` de Helmet previene esto.

**Content Security Policy (CSP)**
Header HTTP que declara qué fuentes de contenido (scripts, estilos, imágenes) son permitidas. Para APIs REST se configura con directivas restrictivas: `default-src 'none'`.

**CORS (Cross-Origin Resource Sharing)**
Mecanismo del navegador que restringe solicitudes HTTP entre orígenes distintos. El servidor indica orígenes permitidos mediante headers `Access-Control-*`. **Solo actúa en browsers**, no en Postman/Thunder Client.

**`credentials: true`** (CORS)
Opción en `corsOptions` que permite enviar cookies e headers de autenticación en requests cross-origin. Incompatible con `origin: '*'` — requiere origen explícito.

---

## D

**Defense in Depth (Defensa en Profundidad)**
Estrategia de seguridad que aplica múltiples capas de protección independientes. Si una capa falla, las otras siguen activas. En Express: Transport → Rate Limit → Helmet → Sanitización → Auth → RBAC.

---

## F

**Forbidden (403)**
Código HTTP 403: el usuario está autenticado pero no tiene los permisos suficientes para acceder al recurso. Diferente de 401 (no autenticado). `requireRole` retorna 403 cuando el rol no coincide.

---

## H

**Helmet**
Middleware de Express que aplica automáticamente 12 headers de seguridad HTTP por defecto. Funciona como primera línea de defensa contra XSS, clickjacking, MIME sniffing y otros ataques. Instalación: `helmet@8.0.0`.

**HSTS (HTTP Strict Transport Security)**
Header `Strict-Transport-Security` que indica al browser que SIEMPRE use HTTPS, incluso si el usuario escribe `http://`. `max-age=15552000` = 6 meses.

---

## N

**NoSQL Injection**
Ataque que inyecta operadores MongoDB (`$gt`, `$where`, `$regex`) en campos de entrada para manipular queries. Ejemplo: `{"email": {"$gt": ""}}` puede bypassear una query de login. `express-mongo-sanitize` elimina estos operadores.

**`nosniff` (X-Content-Type-Options)**
Header `X-Content-Type-Options: nosniff` que previene que el browser "adivine" el tipo de contenido de una respuesta. Evita que scripts disfrazados de imágenes sean ejecutados.

---

## O

**OWASP Top 10**
Lista publicada por OWASP (Open Web Application Security Project) con las 10 vulnerabilidades web más críticas. Actualizada periódicamente. En Express: A01=RBAC, A03=Sanitización, A05=Helmet+CORS, A07=Rate Limiting.

**Origin**
La combinación de protocolo + dominio + puerto de una URL. `http://localhost:5173` y `http://localhost:3000` son orígenes distintos, por eso el browser aplica CORS entre ellos.

---

## P

**Permission (Permiso)**
Autorización para realizar una acción específica sobre un recurso (ej. `DELETE /api/v1/users`). En RBAC, los permisos están asociados a roles, no a usuarios individuales.

**Preflight Request**
Request OPTIONS que el browser envía automáticamente antes de ciertos requests cross-origin para verificar si el servidor lo permite. Se debe manejar con `app.options('*', cors(corsOptions))`.

---

## R

**Rate Limiting (Limitación de Tasa)**
Técnica que restringe el número de requests que una IP puede hacer en un período de tiempo. Previene ataques de fuerza bruta y DoS. `express-rate-limit` retorna `429 Too Many Requests` cuando se supera el límite.

**RBAC (Role-Based Access Control)**
Modelo de autorización donde los permisos se asignan a **roles** y los roles se asignan a **usuarios**. Ejemplo: rol `admin` puede crear/eliminar; rol `user` solo puede leer y crear propios recursos.

**`requireRole()`**
Higher-order function de Express que recibe roles permitidos y retorna un `RequestHandler`. Verifica `req.user.role` contra la lista de roles. Siempre se aplica DESPUÉS de `authMiddleware`.

**Role (Rol)**
Categoría de usuario que agrupa un conjunto de permisos. Roles comunes: `user`, `admin`, `editor`, `moderator`. Se almacena en el JWT payload y en la base de datos.

---

## S

**Sanitización**
Proceso de limpiar o transformar entradas del usuario para eliminar contenido malicioso antes de procesarlas. Diferente de validación: validar verifica el formato, sanitizar elimina lo peligroso.

**`standardHeaders: 'draft-7'`**
Opción de `express-rate-limit` que activa los headers estandarizados `RateLimit-Limit`, `RateLimit-Remaining` y `RateLimit-Reset` en cada respuesta, según el borrador 7 del estándar IETF.

---

## T

**Throttling**
Ver Rate Limiting. Algunos usan "throttling" para referirse a limitar la velocidad (reducir gradualmente) y "rate limiting" para bloquear completamente al superar el umbral.

**`429 Too Many Requests`**
Código HTTP que indica que el cliente ha enviado demasiadas solicitudes en un período dado. Incluye el header `Retry-After` o `RateLimit-Reset` para indicar cuándo puede volver a intentar.

**401 Unauthorized**
Código HTTP que indica que el request no tiene credenciales válidas o que faltan. Típicamente: el token JWT no fue enviado, está expirado o es inválido. El nombre "Unauthorized" es engañoso — técnicamente es un error de **autenticación**.

---

## W

**`windowMs`**
Parámetro de `express-rate-limit` que define la ventana de tiempo en milisegundos para el conteo de requests. `15 * 60 * 1000` = 15 minutos.

---

## X

**X-Frame-Options**
Header HTTP que controla si la página puede ser embebida en un `<iframe>`. Valores: `DENY` (nunca), `SAMEORIGIN` (mismo origen), `ALLOW-FROM uri` (deprecado). Helmet lo configura como `SAMEORIGIN` por defecto.

**XSS (Cross-Site Scripting)**
Ataque que inyecta scripts maliciosos en páginas web. En APIs REST es menos crítico porque se retorna JSON (no HTML renderizable), pero los datos almacenados con XSS pueden afectar a otros clientes. Zod con regex previene HTML en inputs.

---

_Semana 08 — Bootcamp ExpressJS Zero to Hero_
