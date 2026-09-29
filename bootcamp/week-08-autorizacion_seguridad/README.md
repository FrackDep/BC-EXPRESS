# Semana 08 — Autorización y Seguridad

**Proyecto: Flanchito space · Dominio: Coworking Space**

## 🏢 Flanchito space — Coworking Space

Flanchito space es un coworking en Bogotá con cabinas de concentración, puestos compartidos y salas de reunión. El recurso principal es `Space`: cada espacio tiene un código por zona, capacidad, tarifa por hora en COP y disponibilidad.

En esta semana se añaden roles y seguridad HTTP. Los miembros (`user`) consultan el catálogo; los anfitriones (`admin`) crean, modifican y eliminan espacios.

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana, el estudiante será capaz de:

- Implementar **RBAC** (Role-Based Access Control) con middleware `requireRole()`
- Aplicar **Helmet** para configurar cabeceras HTTP de seguridad
- Implementar **rate limiting** con `express-rate-limit` en endpoints públicos y de autenticación
- Configurar **CORS** correctamente para ambientes de desarrollo y producción
- Sanitizar inputs para prevenir **NoSQL injection** y **XSS**
- Entender la diferencia entre **autenticación** y **autorización**
- Identificar y mitigar al menos 5 vulnerabilidades del **OWASP Top 10**

---

## 📚 Requisitos Previos

- ✅ Semana 07 completa: `authMiddleware`, JWT, cookies HttpOnly
- ✅ Familiaridad con `req.user.role` desde el token decodificado
- ✅ Manejo de `AppError` y middleware global de errores

---

## 🗂️ Estructura de la Semana

```text
week-08-autorizacion_seguridad/
├── README.md
├── rubrica-evaluacion.md
├── cuestionario.md
├── LICENSE
├── 0-assets/
├── 1-teoria/
├── 2-practicas/
│   ├── ejercicio-01-rbac-roles/
│   └── ejercicio-02-helmet-cors-ratelimit/
├── 3-proyecto/
│   ├── README.md
│   ├── Flanchito-space.postman_collection.json
│   └── starter/
├── 4-recursos/
│   ├── ebooks-free/
│   ├── videografia/
│   └── webgrafia/
└── 5-glosario/
```

---

## 📝 Contenidos

### Teoría

| Archivo | Tema | Descripción |
|---------|------|-------------|
| [01-rbac-autorizacion.md](1-teoria/01-rbac-autorizacion.md) | RBAC | Roles, permisos, `requireRole()`, diferencia auth/authz |
| [02-helmet-headers.md](1-teoria/02-helmet-headers.md) | Helmet | Cabeceras HTTP de seguridad: CSP, HSTS, X-Frame-Options |
| [03-rate-limiting-cors.md](1-teoria/03-rate-limiting-cors.md) | Rate Limiting y CORS | Throttling, opciones de CORS, whitelist de orígenes |
| [04-sanitizacion-owasp.md](1-teoria/04-sanitizacion-owasp.md) | Sanitización y OWASP | NoSQL injection, XSS, OWASP Top 10 en APIs REST |

### Prácticas

| Ejercicio | Tema | Descripción |
|-----------|------|-------------|
| [ejercicio-01-rbac-roles](2-practicas/ejercicio-01-rbac-roles/) | RBAC | Implementar `requireRole()` y proteger rutas por rol |
| [ejercicio-02-helmet-cors-ratelimit](2-practicas/ejercicio-02-helmet-cors-ratelimit/) | Seguridad HTTP | Helmet + CORS + rate limiting en una API existente |

---

## ⏱️ Distribución del Tiempo (8 horas)

| Actividad | Tiempo |
|-----------|--------|
| Teoría (4 archivos) | 2h |
| Ejercicio 01: RBAC | 2h |
| Ejercicio 02: Helmet + CORS + Rate Limit | 2h |
| Proyecto semanal | 2h |

---

## 📌 Entregables

1. Ejercicio 01 funcionando: API con roles `user` y `admin`, rutas diferenciadas
2. Ejercicio 02 funcionando: cabeceras de seguridad, CORS configurado, rate limiting activo
3. Proyecto Flanchito space con autenticación, autorización y capas de seguridad
4. Capturas de Thunder Client/Postman: endpoints, headers, roles y respuesta 429
5. [Cuestionario resuelto](cuestionario.md), según la rúbrica

---

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
| Franck | `franck.admin@flanchito.test` | `FranckAdmin!2026` | admin |

El login utiliza email. Las cuentas se registran desde la colección; no están precargadas. La promoción de la cuenta administrativa se explica en el README del proyecto. Las contraseñas son solo para pruebas locales.

Consultar [el README del proyecto](3-proyecto/README.md) para los endpoints, el flujo de pruebas y las capturas requeridas.

## 🔗 Navegación

← [Semana 07: Autenticación JWT](../week-07-autenticacion_jwt/README.md) | [Semana 09: Testing →](https://github.com/ergrato-dev/bc-expressjs/tree/main/bootcamp/week-09-testing)

---

Material base: [Bootcamp Express.js — ergrato-dev](https://github.com/ergrato-dev/bc-expressjs). © 2026, licencia [CC BY-NC-SA 4.0](LICENSE). Adaptación de prácticas y proyecto al dominio Flanchito space.
