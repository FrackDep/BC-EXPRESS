# Cuestionario · Semana 08

Flanchito space — Coworking Space

## 1. ¿Autenticación vs autorización?

Autenticar es identificar a quien llama: authMiddleware verifica la cookie JWT de un miembro. Autorizar es decidir qué puede hacer: requireRole permite que solo un anfitrión admin elimine una sala. Sin identidad válida se responde 401; con identidad pero sin permiso, 403.

## 2. ¿Cómo funciona RBAC?

Los permisos se asignan a roles y los usuarios reciben un rol. Aquí user consulta los espacios y su perfil; admin también administra el catálogo y lista miembros. El recurso es el espacio y las acciones son leer, crear, modificar y eliminar. requireRole centraliza la política.

## 3. ¿Qué hace helmet()?

Configura cabeceras HTTP defensivas. Por ejemplo X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN y Content-Security-Policy. No reemplaza la validación, autenticación ni autorización.

## 4. ¿Qué es CSP y para qué sirve en una API?

Content-Security-Policy indica al navegador qué fuentes de scripts, estilos y otros recursos están permitidas. Reduce posibilidades de ejecutar contenido inyectado cuando una respuesta se trata como documento. En una API JSON su efecto es más limitado y no sanea los datos que otro frontend renderiza.

## 5. ¿Qué es HSTS y cuándo se activa?

Strict-Transport-Security indica al navegador que use HTTPS durante un tiempo. El navegador acepta esa política desde una conexión HTTPS válida, no desde HTTP, porque un atacante de red podría modificar una instrucción sin protección. La precarga es un mecanismo separado. Emitir el header en HTTP local no hace seguro ese canal.

## 6. ¿Cómo funciona express-rate-limit?

Cuenta solicitudes por una clave, normalmente la IP, dentro de una ventana. Al superar el límite responde 429. El global permite 100 por 15 minutos; el de auth, 5. El global cubre todas las rutas y el específico endurece las sensibles. El store de memoria de esta entrega no comparte contadores entre varias instancias.

## 7. ¿Qué es un origin y qué implica el comodín?

Es la combinación esquema, host y puerto; http://localhost:5173 y http://localhost:3001 son distintos. El comodín permite lectura desde cualquier origen y es inadecuado para una API privada. No siempre es peligroso para datos públicos; con cookies y credentials el navegador no acepta Access-Control-Allow-Origin: *. CORS no bloquea clientes como curl y no reemplaza RBAC.

## 8. ¿Qué es NoSQL injection y el caso $gt?

Ocurre cuando una entrada manipulada se interpreta como operador de consulta. Si email recibiera {"$gt":""} y se pasara directamente a findOne, podría seleccionar correos no vacíos en lugar de buscar un valor literal. Zod exige strings, express-mongo-sanitize detecta operadores y el repositorio construye consultas explícitas. El login no entrega cookies ante ese payload.

## 9. ¿Qué es XSS y cómo afecta a una API?

Es ejecución de scripts no confiables en el navegador de otra persona. Una API puede almacenar o devolver una carga que luego un frontend inserte como HTML, aunque el JSON por sí solo no la ejecute. Por eso se valida texto, se sirve JSON y el consumidor debe escapar el contenido; CSP y HttpOnly son defensas complementarias.

## 10. ¿Tres vulnerabilidades OWASP y sus mitigaciones?

A01 Broken Access Control: middleware de roles y rechazo de role en registro. A03 Injection: sanitización, Zod y queries explícitas. A07 Identification and Authentication Failures: bcrypt, JWT con expiración, rotación y rate limit. Además se mitigan A02 con criptografía y HTTPS, y A05 con Helmet, whitelist CORS y errores sin stack; eso no equivale a eliminar todos los riesgos.
