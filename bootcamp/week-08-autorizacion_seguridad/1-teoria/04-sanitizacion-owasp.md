# 04 — Sanitización e OWASP Top 10

## 🎯 Objetivos

- Entender qué es la sanitización de inputs y por qué es necesaria
- Prevenir **NoSQL injection** con `express-mongo-sanitize`
- Mitigar **XSS** en APIs REST
- Identificar las vulnerabilidades más relevantes del **OWASP Top 10** para APIs

---

## 1. ¿Por qué sanitizar los inputs?

Los inputs de usuario son el principal vector de ataque. Sin validación y sanitización:

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": { "$gt": "" },
  "password": { "$gt": "" }
}
```

Un servidor sin sanitización podría interpretar `{ "$gt": "" }` como un operador de MongoDB y devolver el primer usuario de la base de datos — sin conocer la contraseña.

---

## 2. NoSQL Injection

### El ataque

MongoDB acepta objetos anidados en sus queries. Si el input del usuario llega sin sanitizar directamente a una query:

```typescript
// ❌ VULNERABLE — el email llega directamente del body
const user = await UserModel.findOne({ email: req.body.email });

// Si req.body.email === { "$gt": "" }
// mongo ejecuta: db.users.findOne({ email: { $gt: "" } })
// que devuelve el PRIMER usuario de la colección
```

### La solución — `express-mongo-sanitize`

```bash
pnpm add express-mongo-sanitize@2.2.0
pnpm add -D @types/express-mongo-sanitize@2.1.4
```

```typescript
import mongoSanitize from 'express-mongo-sanitize';

// Elimina cualquier clave que empiece con '$' o contenga '.'
// Debe aplicarse ANTES de las rutas, DESPUÉS de express.json()
app.use(express.json());
app.use(mongoSanitize());
```

Con esta configuración, `{ "$gt": "" }` se convierte en `{}` antes de llegar a las rutas.

### Opciones adicionales

```typescript
app.use(
  mongoSanitize({
    replaceWith: '_',  // reemplazar con '_' en lugar de eliminar
    onSanitize: ({ req, key }) => {
      console.warn(`Sanitization triggered on key: ${key}`);
    },
  })
);
```

---

## 3. XSS en APIs REST

### ¿Afecta XSS a una API REST?

En una API REST pura (solo JSON), XSS **es menos crítico** porque:
- No se renderiza HTML desde la API
- Los scripts almacenados en DB solo son peligrosos si el frontend los renderiza sin escapar

Pero sigue siendo importante sanitizar si la API **almacena y devuelve** datos que un frontend puede renderizar.

### Capa de defensa en la API

Zod ya valida el formato de los datos. Para sanitizar HTML:

```typescript
// Opción 1: validar con Zod que los campos no contienen HTML
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().max(200).regex(/^[^<>]*$/, 'No se permiten caracteres HTML'),
  content: z.string().max(5000),
});

// Opción 2: sanitizar con la librería 'xss' (si necesitas permitir HTML)
// pnpm add xss@1.0.15
import xss from 'xss';
const safeContent = xss(req.body.content);
```

### La defensa real contra XSS

La protección definitiva ocurre en el **frontend** (escapar output) y en las **cabeceras HTTP** (CSP via Helmet). La API sanitiza como capa adicional.

---

## 4. OWASP Top 10 — Relevancia para APIs REST

![OWASP Top 10](../0-assets/03-owasp-top10.svg)

| # | Vulnerabilidad | Mitigación en esta semana |
|---|---------------|--------------------------|
| A01 | **Broken Access Control** | RBAC + `requireRole()` |
| A02 | **Cryptographic Failures** | bcrypt para contraseñas (semana 07) |
| A03 | **Injection** | `express-mongo-sanitize` + Zod |
| A04 | **Insecure Design** | Arquitectura en capas, validación en boundary |
| A05 | **Security Misconfiguration** | Helmet, CORS con whitelist, no stack traces |
| A06 | **Vulnerable and Outdated Components** | Versiones exactas en `package.json` |
| A07 | **Identification & Auth Failures** | Rate limiting en auth + JWT (semana 07) |
| A08 | **Software and Data Integrity Failures** | CI/CD seguro (semana 15) |
| A09 | **Logging & Monitoring Failures** | Winston logging (semana 04) |
| A10 | **Server-Side Request Forgery (SSRF)** | Validar URLs de terceros con Zod |

---

## 5. Errores seguros — Sin stack traces en producción

Exponer stack traces en errores 500 es una vulnerabilidad de **Security Misconfiguration** (A05):

```typescript
// ❌ MAL — expone información interna
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack,       // nunca exponer esto
    path: req.path,         // ni esto
  });
});

// ✅ BIEN — error seguro
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Log completo en servidor, mensaje genérico al cliente
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});
```

---

## 6. Variables de entorno — Sin secretos en código

**A02 Cryptographic Failures** incluye hardcodear secretos en el código:

```typescript
// ❌ NUNCA
const JWT_SECRET = 'mi_secreto_super_seguro';
const DB_URI = 'mongodb://user:pass@host/db';

// ✅ SIEMPRE
const JWT_SECRET = process.env.JWT_ACCESS_SECRET;
if (!JWT_SECRET) throw new Error('JWT_ACCESS_SECRET must be set');
```

### Validar variables de entorno al inicio

```typescript
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
```

Si falta alguna variable, la app **no arranca** — mejor que fallar silenciosamente en producción.

---

## ✅ Checklist de Seguridad Completo

```
☐ authMiddleware en todas las rutas privadas      ← semana 07
☐ requireRole() en rutas que necesitan rol        ← semana 08
☐ Helmet aplicado como primer middleware          ← semana 08
☐ CORS con whitelist de orígenes                  ← semana 08
☐ Rate limit en endpoints de auth (5/15min)       ← semana 08
☐ Rate limit global (100/15min)                   ← semana 08
☐ express-mongo-sanitize después de json()        ← semana 08
☐ Sin stack traces en respuestas de producción    ← semana 08
☐ Variables de entorno validadas al inicio        ← semana 08
☐ Contraseñas hasheadas con bcrypt                ← semana 07
☐ Refresh tokens hasheados en DB                  ← semana 07
☐ Cookies HttpOnly + Secure + SameSite            ← semana 07
☐ JWT secrets distintos para access y refresh     ← semana 07
```

---

## 📚 Recursos Adicionales

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize)
- [OWASP API Security Top 10](https://owasp.org/API-Security/)
- [Node.js Security Handbook (Snyk)](https://www.snyk.io/wp-content/uploads/snyk-nodejs-security-handbook.pdf)
