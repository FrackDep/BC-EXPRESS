# Rúbrica de Evaluación — Semana 08: Autorización y Seguridad

## 📊 Distribución de Evidencias

| Tipo de Evidencia | Peso | Descripción |
|-------------------|------|-------------|
| 🧠 Conocimiento | 30% | Cuestionario teórico (10 preguntas) |
| 💪 Desempeño | 40% | Ejercicios prácticos (2 ejercicios, 20 pts cada uno) |
| 📦 Producto | 30% | Proyecto semanal funcional |

---

## 🧠 Conocimiento (30 puntos)

### Cuestionario — 10 preguntas (3 pts cada una)

1. ¿Cuál es la diferencia entre autenticación y autorización? Da un ejemplo con Express.
2. ¿Cómo funciona RBAC? Define roles, recursos y permisos en el contexto de una API REST.
3. ¿Qué hace `helmet()` al aplicarlo en Express? Menciona 3 cabeceras que configura.
4. ¿Qué es `Content-Security-Policy` (CSP) y para qué sirve en una API?
5. ¿Qué es `HSTS` y cuándo se activa? ¿Por qué no se aplica en HTTP?
6. ¿Cómo funciona `express-rate-limit`? ¿Qué diferencia hay entre un rate limit global y uno por ruta?
7. ¿Qué es un `origin` en CORS y por qué `Access-Control-Allow-Origin: *` es peligroso en producción?
8. ¿Qué es NoSQL injection? ¿Cómo puede un atacante explotar `{ "$gt": "" }` en un login?
9. ¿Qué es XSS (Cross-Site Scripting)? ¿Cómo afecta a una API REST vs una aplicación web?
10. Menciona 3 vulnerabilidades del OWASP Top 10 y cómo se mitigan con las herramientas vistas en esta semana.

---

## 💪 Desempeño (40 puntos)

### Ejercicio 01: RBAC — Roles y Autorización (20 puntos)

| Criterio | Puntos | Descripción |
|----------|--------|-------------|
| `requireRole()` implementado | 5 | Middleware funciona correctamente con uno o más roles |
| Ruta `admin-only` protegida | 4 | `GET /admin/users` devuelve 403 para rol `user` |
| Ruta `user+admin` protegida | 3 | `GET /dashboard` accesible para ambos roles |
| Ruta pública sin auth | 3 | `GET /public` accesible sin token |
| Mensajes de error correctos | 2 | 401 sin token, 403 con token pero sin permiso |
| Token contiene `role` | 3 | El `role` viaja en el payload JWT y es leído por `requireRole` |

**Total Ejercicio 01: 20 puntos**

---

### Ejercicio 02: Helmet + CORS + Rate Limiting (20 puntos)

| Criterio | Puntos | Descripción |
|----------|--------|-------------|
| Helmet aplicado | 4 | Cabeceras de seguridad presentes en respuesta (`X-Content-Type-Options`, etc.) |
| CORS configurado con whitelist | 4 | Solo orígenes permitidos reciben `Access-Control-Allow-Origin` |
| Rate limit en `/auth` | 4 | Máximo 5 requests/15min en rutas de autenticación |
| Rate limit global | 3 | Máximo 100 requests/15min en toda la API |
| Headers de rate limit en respuesta | 2 | `X-RateLimit-Remaining` visible en Postman |
| CORS rechaza origen no permitido | 3 | Origen desconocido recibe error CORS |

**Total Ejercicio 02: 20 puntos**

---

## 📦 Producto (100 puntos)

### Proyecto Semanal — API con Auth + RBAC + Seguridad completa

| Criterio | Puntos | Descripción |
|----------|--------|-------------|
| `authMiddleware` en todas las rutas privadas | 10 | Ninguna ruta privada accesible sin token válido |
| `requireRole('admin')` en rutas administrativas | 10 | Rutas de gestión solo para admins |
| Helmet configurado | 8 | Cabeceras HTTP de seguridad presentes |
| CORS con whitelist | 8 | Orígenes explícitos, no `*` en producción |
| Rate limit en auth endpoints | 8 | Protección contra fuerza bruta |
| Rate limit global | 5 | Throttling general de la API |
| Sanitización de inputs | 8 | `express-mongo-sanitize` aplicado |
| Sin secretos en código | 8 | Todo en `.env`, no hardcodeado |
| Mensajes de error seguros | 7 | Sin stack traces expuestos, sin info interna |
| CRUD del recurso con RBAC | 10 | Lectura pública/autenticada, escritura solo admin |
| Código adaptado al dominio | 8 | Nombres reales, no genéricos (`resource`) |
| README con descripción de seguridad | 5 | Documenta las capas de protección aplicadas |
| API funcional end-to-end | 5 | Todos los endpoints responden correctamente |

**Total Producto: 100 puntos**

---

## ⛔ Penalizaciones

| Penalización | Puntos |
|--------------|--------|
| Contraseña en texto plano | -40 |
| Secret hardcodeado en código | -25 |
| `Access-Control-Allow-Origin: *` en producción | -15 |
| Sin Helmet en ningún endpoint | -15 |
| Sin rate limiting en endpoints de auth | -15 |
| Stack trace expuesto en error 500 | -10 |
| Roles hardcodeados en controladores (no middleware) | -10 |
| Sin sanitización de inputs (vulnerable a NoSQL injection) | -10 |

---

## ✅ Criterios de Aprobación

- Mínimo **70%** en cada tipo de evidencia
- API funcional demostrada con Thunder Client / Postman
- Sin penalizaciones críticas (contraseña en claro, secret hardcodeado)
- Implementación coherente con el dominio asignado
