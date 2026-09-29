# Semana 07 — Autenticación con JWT

**Proyecto: Flanchito space · Dominio: Coworking Space**

## 🏢 Flanchito space — Coworking Space

Flanchito space es un coworking en Bogotá con cabinas de concentración, puestos compartidos y salas de reunión. El recurso principal es `Space`: cada espacio tiene un código por zona, capacidad, tarifa por hora en COP y disponibilidad.

En esta semana se implementan el registro de miembros, el login con JWT, la renovación de sesión y el CRUD de espacios protegido por autenticación.

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana, serás capaz de:

1. Hashear contraseñas de forma segura con bcrypt (salt rounds, hash, compare)
2. Comprender la estructura de un JWT (header.payload.signature, claims)
3. Generar y verificar access tokens (corta duración) y refresh tokens (larga duración)
4. Almacenar tokens en cookies HttpOnly, evitando vulnerabilidades XSS
5. Implementar flujos completos de registro, login, refresh y logout
6. Proteger rutas con middleware de autenticación que verifica el JWT
7. Aplicar buenas prácticas de seguridad: secretos distintos, user enumeration prevention

## 📋 Requisitos Previos

- Semanas 01–06 completadas
- Dominio de la arquitectura en capas con Express y TypeScript (semana 03)
- Manejo de errores con `AppError` y middleware global (semana 04)
- Mongoose + MongoDB básico (semana 06) — se usa en los starters de esta semana

## 🗂️ Estructura de la Semana

```text
week-07-autenticacion_jwt/
├── README.md
├── rubrica-evaluacion.md
├── cuestionario.md
├── LICENSE
├── 0-assets/
├── 1-teoria/
├── 2-practicas/
│   ├── ejercicio-01-registro-login/
│   └── ejercicio-02-refresh-tokens/
├── 3-proyecto/
│   ├── README.md
│   ├── Flanchito-space.postman_collection.json
│   └── starter/
├── 4-recursos/
│   ├── ebook-free/
│   ├── videografia/
│   └── webgrafia/
└── 5-glosario/
```

## 📝 Contenidos

### Teoría

| Archivo | Tema | Duración |
|---------|------|----------|
| [01-hashing-bcrypt.md](1-teoria/01-hashing-bcrypt.md) | Hash de contraseñas con bcrypt, salt, salt rounds, compare | 30 min |
| [02-jwt-fundamentos.md](1-teoria/02-jwt-fundamentos.md) | JWT: estructura, claims, access token, refresh token, firma | 35 min |
| [03-auth-flow.md](1-teoria/03-auth-flow.md) | Flujos de registro, login, refresh, logout y cookies HttpOnly | 35 min |
| [04-auth-middleware.md](1-teoria/04-auth-middleware.md) | Middleware de auth, tipos extendidos de Express, rutas protegidas | 30 min |

### Prácticas

| Ejercicio | Descripción | Duración |
|-----------|-------------|----------|
| [ejercicio-01-registro-login](2-practicas/ejercicio-01-registro-login/) | Registro con hash bcrypt, login con JWT en cookie HttpOnly, ruta `/me` protegida | 80 min |
| [ejercicio-02-refresh-tokens](2-practicas/ejercicio-02-refresh-tokens/) | Refresh token con rotación, logout que invalida el token y limpia cookies | 60 min |

### Proyecto

| Entregable | Descripción |
|------------|-------------|
| [3-proyecto/](3-proyecto/) | Autenticación JWT y CRUD de espacios de Flanchito space |

## ⏱️ Distribución del Tiempo (8 horas)

| Actividad | Tiempo |
|-----------|--------|
| Teoría (4 archivos) | 2h 10min |
| Ejercicio 01 | 1h 20min |
| Ejercicio 02 | 1h |
| Proyecto semanal | 2h 30min |
| Revisión y entrega | 1h |

## 📌 Entregables

1. Ejercicio 01 funcionando: `POST /auth/register`, `POST /auth/login`, `GET /auth/me` con cookie
2. Ejercicio 02 funcionando: `POST /auth/refresh` con rotación y `POST /auth/logout`
3. Proyecto Flanchito space con autenticación integrada al catálogo de espacios
4. Capturas de Thunder Client/Postman: cookies HttpOnly, CRUD, 401, refresh y logout
5. [Cuestionario resuelto](cuestionario.md), según la rúbrica

## ▶️ Ejecutar el proyecto

Requisitos: Node.js 22+, pnpm 10.34.5 y MongoDB 8.

```bash
cd 3-proyecto/starter
corepack enable
corepack prepare pnpm@10.34.5 --activate
pnpm install --frozen-lockfile
cp .env.example .env
```

Configurar `MONGODB_URI` y generar por separado `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` con `openssl rand -hex 32`. Los secretos deben ser distintos.

```bash
docker compose up -d
pnpm build
pnpm dev
```

La API se ejecuta en `http://localhost:3000/api/v1`. Cada ejercicio tiene su propio `starter/`; ejecutar una API a la vez. Si MongoDB ya está disponible, omitir el comando de Docker.

### Datos de prueba

| Nombre | Email de acceso | Contraseña | Rol |
|---|---|---|---|
| Franck | `franck@flanchito.test` | `FranckSpace!2026` | user |

El login utiliza email. Las cuentas se registran desde la colección; no están precargadas. Las contraseñas son solo para pruebas locales.

Consultar [el README del proyecto](3-proyecto/README.md) para los endpoints, el flujo de pruebas y las capturas requeridas.

## 🔗 Navegación

← [Semana 06 — MongoDB y Mongoose](https://github.com/ergrato-dev/bc-expressjs/tree/main/bootcamp/week-06-mongodb_mongoose)
→ [Semana 08 — Autorización y Seguridad](../week-08-autorizacion_seguridad/README.md)

---

Material base: [Bootcamp Express.js — ergrato-dev](https://github.com/ergrato-dev/bc-expressjs). © 2026, licencia [CC BY-NC-SA 4.0](LICENSE). Adaptación de prácticas y proyecto al dominio Flanchito space.
