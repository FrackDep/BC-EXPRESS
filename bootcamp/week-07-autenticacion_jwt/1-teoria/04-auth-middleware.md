# Middleware de Autenticación y Rutas Protegidas

## 🎯 Objetivos

- Implementar el middleware `authMiddleware` que verifica el JWT de la cookie
- Extender los tipos de Express para añadir `req.user` con TypeScript
- Aplicar el middleware a rutas específicas de forma correcta
- Manejar todos los casos de error del middleware (token ausente, inválido, expirado)

## 1. Extensión de Tipos de Express

Express no incluye un campo `user` en `Request` por defecto. Necesitamos extender la interface con TypeScript para tener tipado correcto en todos los controladores.

```ts
// src/types/express.d.ts
import { JwtPayload } from '../utils/jwt';

// Declaración de módulo — extiende los tipos de Express globalmente
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
```

Con esto, `req.user` tiene tipo `JwtPayload | undefined` en todos los controladores, sin necesidad de castear.

## 2. Implementación del Middleware

```ts
// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../errors/AppError';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // 1. Leer el token de la cookie HttpOnly
  const token = req.cookies?.accessToken as string | undefined;

  // 2. Si no hay token, el usuario no está autenticado
  if (!token) {
    next(new AppError(401, 'No autenticado'));
    return;
  }

  try {
    // 3. Verificar y decodificar el token
    const decoded = verifyAccessToken(token);

    // 4. Adjuntar payload al request para uso en controladores
    req.user = decoded;

    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      next(new AppError(401, 'Token expirado'));
      return;
    }
    // JsonWebTokenError, NotBeforeError u otro
    next(new AppError(401, 'Token inválido'));
  }
}
```

## 3. Aplicación a Rutas

### Opción A — Proteger una ruta individual

```ts
// src/routes/auth.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);  // solo esta ruta protegida

export { router as authRouter };
```

### Opción B — Proteger todas las rutas de un router

```ts
// src/routes/products.routes.ts
const router = Router();

// El middleware se aplica a TODAS las rutas de este router
router.use(authMiddleware);

router.get('/', productsController.getAll);
router.post('/', productsController.create);
router.put('/:id', productsController.update);
router.delete('/:id', productsController.remove);

export { router as productsRouter };
```

### Opción C — Mezcla (algunas públicas, algunas privadas)

```ts
const router = Router();

// Rutas públicas — sin middleware
router.get('/', productsController.getAll);
router.get('/:id', productsController.getById);

// Rutas privadas — con middleware
router.post('/', authMiddleware, productsController.create);
router.put('/:id', authMiddleware, productsController.update);
router.delete('/:id', authMiddleware, productsController.remove);
```

## 4. Uso de req.user en Controladores

```ts
// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // req.user está disponible gracias al middleware y la declaración de tipos
    // TypeScript sabe que puede ser undefined si el middleware no se ejecutó
    if (!req.user) {
      next(new AppError(401, 'No autenticado'));
      return;
    }

    // Buscar el usuario completo en DB usando el sub (ID) del token
    const user = await usersRepository.findById(req.user.sub);
    if (!user) {
      next(new AppError(404, 'Usuario no encontrado'));
      return;
    }

    res.json({ id: user._id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
}
```

## 5. Alternativa: Token en Header Authorization

Algunos clientes (aplicaciones móviles, otros backends) envían el token en el header en lugar de cookies:

```ts
// Leer de cookie O de header Authorization: Bearer <token>
const token =
  req.cookies?.accessToken ||
  req.headers.authorization?.replace(/^Bearer\s+/i, '');
```

> Para las prácticas de este bootcamp usaremos únicamente cookies HttpOnly (más seguras para aplicaciones web).

## 6. Middleware de Autorización (Preview — Semana 08)

El `authMiddleware` solo verifica **quién eres** (autenticación). Para verificar **qué puedes hacer** (autorización) se añade un middleware adicional:

```ts
// Preview de semana 08 — RBAC básico
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new AppError(403, 'Acceso denegado'));
      return;
    }
    next();
  };
}

// Uso: solo admins pueden eliminar
router.delete('/:id', authMiddleware, requireRole('admin'), deleteController);
```

## ✅ Checklist de Verificación

- [ ] Archivo `src/types/express.d.ts` con extensión de `Request.user`
- [ ] Middleware retorna `next(new AppError(401, ...))` para todos los casos de error
- [ ] `TokenExpiredError` capturado por separado (mensaje diferenciado)
- [ ] Middleware aplicado **solo** a las rutas que lo necesitan
- [ ] Controladores verifican `req.user` antes de usarlo (aunque el MW lo garantice)
- [ ] `cookie-parser` registrado en `app.ts` antes de las rutas
