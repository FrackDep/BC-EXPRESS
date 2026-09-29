# Rúbrica de Evaluación — Semana 07: Autenticación con JWT

## 🧠 Conocimiento (30%) — Cuestionario

Responde cada pregunta con tus propias palabras.

1. ¿Por qué NO se deben almacenar contraseñas en texto plano y por qué MD5/SHA-256 no son seguros para este caso?
2. ¿Qué es el "salt" en bcrypt y cómo previene los ataques de rainbow table?
3. Explica las tres partes de un JWT (header, payload, signature). ¿Por qué la información del payload es legible pero no modificable?
4. ¿Cuál es la diferencia entre un access token y un refresh token? ¿Por qué tienen duraciones distintas?
5. ¿Por qué almacenar el JWT en una cookie HttpOnly es más seguro que almacenarlo en `localStorage`?
6. ¿Qué es la "rotación de refresh tokens"? ¿Qué problema de seguridad resuelve?
7. En el middleware de autenticación, ¿qué respuesta debe retornar si el token es válido pero ya expiró?
8. ¿Por qué el endpoint de login debe devolver el mismo mensaje de error para "email no encontrado" y "contraseña incorrecta"?
9. ¿Qué hace `{ select: false }` en un campo de Mongoose y para qué se usa en el campo `password`?
10. ¿Cuántos secretos JWT distintos se usan en el patrón access/refresh y por qué son dos, no uno?

---

## 💪 Desempeño (40%) — Ejercicios

### Ejercicio 01 — Registro y Login (20 puntos)

| Criterio | Puntos |
|----------|--------|
| Schema `User` con campo `password: { select: false }` | 3 |
| `bcrypt.hash()` con salt rounds ≥ 10 en el registro | 3 |
| `bcrypt.compare()` para verificar contraseña en login | 3 |
| Access token firmado con `jwt.sign()` y expiración de 15 min | 3 |
| Token almacenado en cookie `httpOnly: true` | 3 |
| Middleware `authMiddleware` lee y verifica el token de la cookie | 3 |
| Ruta `GET /auth/me` retorna datos del usuario (sin password) | 2 |
| **Total** | **20** |

### Ejercicio 02 — Refresh Tokens (20 puntos)

| Criterio | Puntos |
|----------|--------|
| Campo `refreshToken` añadido al User Schema | 3 |
| Refresh token firmado con secreto distinto al access token | 3 |
| Hash del refresh token almacenado en el documento del usuario | 3 |
| `POST /auth/refresh` verifica refresh token y rota correctamente | 4 |
| `POST /auth/logout` limpia ambas cookies y anula el refreshToken en DB | 4 |
| Expiración de cookies coherente con duración de los tokens | 3 |
| **Total** | **20** |

---

## 📦 Producto (30%) — Proyecto Semanal (100 puntos)

| Criterio | Puntos |
|----------|--------|
| Schema `User` coherente con el dominio (email, password, name, role) | 10 |
| Contraseña hasheada con bcrypt en el registro (salt rounds ≥ 10) | 10 |
| Login verifica con `bcrypt.compare` (mismo mensaje de error para email/pass incorrectos) | 10 |
| Access token firmado con JWT y expiración ≤ 15 min | 5 |
| Refresh token firmado con secreto distinto y duración ≥ 1d | 5 |
| Ambos tokens en cookies `httpOnly`, `secure` y `sameSite` | 10 |
| Middleware `authMiddleware` protege al menos una ruta del dominio | 10 |
| `POST /auth/refresh` funcional con rotación de refresh token | 8 |
| `POST /auth/logout` limpia cookies e invalida el token en DB | 7 |
| Secretos JWT en variables de entorno (no hardcodeados) | 5 |
| Dominio propio y no copiado de otro aprendiz | 10 |
| README con descripción del sistema de auth e instrucciones de uso | 10 |
| **Total** | **100** |

---

## ⚠️ Penalizaciones

| Infracción | Penalización |
|------------|-------------|
| Contraseña almacenada en texto plano | -40 pts |
| Secreto JWT hardcodeado en el código (no en `.env`) | -25 pts |
| Token almacenado en `localStorage` (no en cookie) | -20 pts |
| Cookie sin `httpOnly: true` | -15 pts |
| Mismo secreto para access y refresh token | -15 pts |
| Mensaje de error diferente para email no encontrado vs password incorrecta (user enumeration) | -10 pts |
| Middleware no verifica expiración del token | -10 pts |
| `bcrypt.hashSync()` en lugar de `bcrypt.hash()` (bloqueante en producción) | -5 pts |
