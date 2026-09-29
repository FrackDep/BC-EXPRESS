# 03 — Rate Limiting y CORS

## 🎯 Objetivos

- Entender qué es rate limiting y por qué protege contra fuerza bruta y DoS
- Implementar throttling global y por ruta con `express-rate-limit`
- Configurar CORS correctamente con whitelist de orígenes
- Evitar el error común de `Access-Control-Allow-Origin: *` en producción

---

## 1. Rate Limiting — Qué es y para qué sirve

El **rate limiting** (limitación de tasa) restringe cuántas requests puede hacer un cliente en un período de tiempo. Protege contra:

- **Fuerza bruta** en endpoints de autenticación (`/auth/login`)
- **DoS involuntario** por bots o scripts erráticos
- **Scraping masivo** de datos de la API
- **Abuso de recursos** computacionales costosos

```
Sin rate limit:    cliente → 10.000 req/seg → API caída
Con rate limit:    cliente → max 5 req/15min → API estable
```

---

## 2. Instalar `express-rate-limit`

```bash
pnpm add express-rate-limit@7.5.0
```

No requiere `@types` — incluye sus propios tipos TypeScript.

---

## 3. Rate limit global

Aplica a **todas las rutas** de la API:

```typescript
import rateLimit from 'express-rate-limit';

// Limitar a 100 requests por IP cada 15 minutos
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 100,                // máximo 100 requests por ventana
  standardHeaders: 'draft-7', // incluye cabeceras RateLimit-* en respuesta
  legacyHeaders: false,       // desactiva cabeceras X-RateLimit-* antiguas
  message: {
    error: 'Demasiadas peticiones, intenta de nuevo en 15 minutos',
  },
});
```

```typescript
// src/app.ts
app.use(globalLimiter);
```

---

## 4. Rate limit específico para autenticación

Los endpoints de login/register necesitan limits más estrictos — son el objetivo principal de ataques de fuerza bruta:

```typescript
// Máximo 5 intentos de login por IP cada 15 minutos
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: 'Demasiados intentos de autenticación, intenta en 15 minutos',
  },
});
```

```typescript
// src/routes/auth.routes.ts
import { authLimiter } from '../middlewares/rateLimiter';

router.post('/login', authLimiter, authController.login);
router.post('/register', authLimiter, authController.register);
```

---

## 5. Cabeceras de rate limit en la respuesta

Con `standardHeaders: 'draft-7'`, la respuesta incluye:

```http
RateLimit-Limit: 100
RateLimit-Remaining: 87
RateLimit-Reset: 1712345678
```

Cuando se supera el límite, devuelve automáticamente **429 Too Many Requests**:

```json
{
  "error": "Demasiadas peticiones, intenta de nuevo en 15 minutos"
}
```

---

## 6. CORS — Cross-Origin Resource Sharing

**CORS** es un mecanismo de seguridad del navegador que bloquea requests HTTP desde un origen diferente al servidor, a menos que el servidor lo permita explícitamente.

```
Frontend: https://miapp.com              ← Origen A
Backend:  https://api.miapp.com          ← Origen B (diferente)

Sin CORS: el navegador bloquea la respuesta del backend
Con CORS: el servidor incluye cabeceras que permiten el acceso
```

> ⚠️ CORS **solo aplica en navegadores**. Postman y Thunder Client no lo verifican porque no son navegadores.

---

## 7. Instalar `cors`

```bash
pnpm add cors@2.8.5
pnpm add -D @types/cors@2.8.17
```

---

## 8. Configuración de CORS

### ❌ NUNCA en producción

```typescript
// Permite cualquier origen — peligroso en producción
app.use(cors());
// equivalente a:
// Access-Control-Allow-Origin: *
```

Problemas con `*`:
- No permite enviar cookies (withCredentials)
- Expone la API a cualquier sitio web del mundo
- Inutilizable con autenticación basada en cookies

### ✅ Con whitelist de orígenes

```typescript
import cors from 'cors';

const ALLOWED_ORIGINS = [
  'http://localhost:3000',   // Frontend local
  'http://localhost:5173',   // Vite dev server
  'https://miapp.com',       // Producción
];

const corsOptions: cors.CorsOptions = {
  origin: (requestOrigin, callback) => {
    // Permitir requests sin Origin (Postman, curl, servidores)
    if (!requestOrigin) return callback(null, true);

    if (ALLOWED_ORIGINS.includes(requestOrigin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origen ${requestOrigin} no permitido`));
    }
  },
  credentials: true,         // Necesario para enviar cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

---

## 9. Preflight requests (OPTIONS)

Antes de una request con método no simple (POST, PUT, DELETE) o con headers personalizados, el navegador envía una **preflight request** `OPTIONS`. Express debe responderla:

```typescript
// Express 5 maneja OPTIONS automáticamente si se usa cors()
// Para asegurar, agregar antes de las rutas:
app.options('*', cors(corsOptions));
```

---

## 10. CORS y cookies HttpOnly

Para que las cookies se envíen en requests cross-origin, se necesita:

**En el servidor:**
```typescript
credentials: true  // en corsOptions
```

**En el cliente (frontend):**
```typescript
fetch('https://api.miapp.com/auth/login', {
  method: 'POST',
  credentials: 'include',  // envía cookies
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

---

## ✅ Checklist de Verificación

- [ ] Rate limit global configurado (100 req/15min)
- [ ] Rate limit estricto en `/auth/login` y `/auth/register` (5 req/15min)
- [ ] CORS con whitelist de orígenes (no `*`)
- [ ] `credentials: true` si se usan cookies
- [ ] `app.options('*', cors(...))` para preflight requests
- [ ] Cabeceras `RateLimit-*` visibles en respuestas

## 📚 Recursos Adicionales

- [express-rate-limit — Documentación](https://express-rate-limit.mintlify.app/)
- [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP — API Security Top 10 — API4: Unrestricted Resource Consumption](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/)
