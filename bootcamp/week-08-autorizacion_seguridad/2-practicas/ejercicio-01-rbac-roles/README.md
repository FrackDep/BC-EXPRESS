# Ejercicio 01 — RBAC: Roles y Autorización

## 🎯 Objetivo

Aplicar autorización basada en roles a Flanchito space: presentación pública, panel para miembros y listado administrativo restringido.

## 📋 Dominio asignado

**Coworking Space — Flanchito space.** Espacio de trabajo compartido en Bogotá, con zonas de patio, biblioteca y terraza. Los miembros se registran para consultar espacios; los anfitriones gestionan el catálogo en la semana 08.

## 🗂️ Estructura del starter

```text
starter/
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── .env.example
├── docker-compose.yml
└── src/
    ├── app.ts
    ├── server.ts
    ├── config/
    ├── controllers/
    ├── errors/
    ├── lib/
    ├── middlewares/
    ├── models/
    ├── repositories/
    ├── routes/
    ├── schemas/
    ├── services/
    ├── types/
    └── utils/
```

Las rutas delegan en controladores; los controladores validan entradas y llaman a servicios; los servicios aplican las reglas y utilizan repositorios Mongoose.

## 📝 Implementación

### Paso 1 — Rol en JWT

`jwt.ts` incluye role en el payload del access token.

### Paso 2 — Middleware de autorización

`requireRole.ts` acepta uno o más roles; devuelve 401 sin identidad y 403 sin permiso.

### Paso 3 — Rutas diferenciadas

`user.routes.ts` configura `/public`, `/dashboard` y `/admin/users` con sus respectivos accesos.

## ▶️ Cómo ejecutar

**Requisitos:** Node.js 22 o superior, pnpm 10.34.5 y MongoDB 8.

Desde esta carpeta:

```bash
cd starter
corepack enable
corepack prepare pnpm@10.34.5 --activate
pnpm install --frozen-lockfile
cp .env.example .env
```

Configurar las variables de entorno:

| Variable | Uso |
|---|---|
| `NODE_ENV` | `development` para pruebas locales; `production` con HTTPS |
| `PORT` | Puerto de la API; 3000 por defecto |
| `MONGODB_URI` | Conexión a la base MongoDB de este entregable |
| `JWT_ACCESS_SECRET` | Secreto aleatorio de al menos 32 caracteres |
| `JWT_REFRESH_SECRET` | Otro secreto aleatorio, diferente al de acceso |

Generar cada secreto por separado:

```bash
openssl rand -hex 32
```

Si OpenSSL no está disponible:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Después de guardar `.env`:

```bash
docker compose up -d
pnpm build
pnpm dev
```

Si MongoDB ya está disponible, omitir Docker y ajustar `MONGODB_URI`. Ejecutar un entregable a la vez en el puerto 3000. Para ejecutar compilado: `pnpm build && pnpm start`.

**Base de la API:** `http://localhost:3000/api/v1`.

## 👤 Usuarios de prueba

| Nombre | Email para login | Contraseña | Rol |
|---|---|---|---|
| Franck | `franck@flanchito.test` | `FranckSpace!2026` | user |
| Franck | `franck.admin@flanchito.test` | `FranckAdmin!2026` | admin |

El login se realiza por email. Las cuentas deben registrarse antes de iniciar sesión; no se crean automáticamente. Estas credenciales son únicamente para pruebas locales.

Registro del miembro:

```json
{
  "name": "Franck",
  "email": "franck@flanchito.test",
  "password": "FranckSpace!2026"
}
```

### Preparar la cuenta admin

1. Registrar `franck.admin@flanchito.test`, con nombre `Franck` y contraseña `FranckAdmin!2026`.
2. Desde `starter/`, abrir MongoDB:

```bash
docker compose exec mongo mongosh flanchito_space_s08_1
```

3. Dentro de `mongosh`, promover únicamente esa cuenta:

```javascript
db.users.updateOne(
  { email: "franck.admin@flanchito.test" },
  { $set: { role: "admin" } }
)
```

4. Salir con `exit` e iniciar sesión como administrador.

El registro público siempre crea `user` y rechaza el campo `role`.

## 🔐 Sistema de autenticación

- `User` contiene nombre, email único, contraseña y rol; la contraseña se excluye de las consultas normales con `select: false`.
- Registro con `bcrypt.hash(password, 10)` asíncrono; login con `bcrypt.compare`.
- Un email desconocido o una contraseña incorrecta devuelven el mismo 401: `Credenciales inválidas`.
- Access token JWT HS256 de 15 minutos, con `sub`, `email` y `role`; se comprueban firma y expiración.
- Cookie `accessToken`: HttpOnly, SameSite=Lax, Path=/ y Max-Age=900.
- En producción las cookies llevan Secure y requieren HTTPS. En desarrollo local HTTP, Secure está desactivado.
- Los tokens no se devuelven en el JSON de la respuesta.
- Refresh token con secreto independiente, duración de 7 días y cookie HttpOnly en `/api/v1/auth`, Max-Age=604800.
- Se almacena bcrypt(SHA-256(refreshToken)) para evitar la truncación de JWT largos a los 72 bytes de bcrypt.
- La rotación utiliza identificadores únicos y actualización condicional del hash; un refresh consumido no se puede reutilizar.
- Logout invalida el refresh y elimina ambas cookies. Un access copiado antes del cierre conserva validez hasta expirar.
- Un nuevo login reemplaza la sesión renovable anterior de la misma cuenta.

## 🛡️ Roles y permisos

| Operación | Visitante | Miembro (`user`) | Anfitrión (`admin`) |
|---|---|---|---|
| Registro, login, health y presentación | Sí | Sí | Sí |
| Perfil y dashboard | 401 | Sí | Sí |
| Listado de miembros | 401 | 403 | Sí |

`authMiddleware` verifica identidad; `requireRole(...roles)` verifica permisos. El rol viaja en el JWT y se contrasta con el usuario actual. 

## 📍 Endpoints

Todas las rutas usan el prefijo `/api/v1`.

| Método | Ruta | Acceso | Resultado principal |
|---|---|---|---|
| GET | `/health` | Público | 200, estado de la API |
| POST | `/auth/register` | Público | 201, perfil sin hashes |
| POST | `/auth/login` | Público | 200, perfil y cookies |
| GET | `/auth/me` | Autenticado | 200, perfil del miembro |
| POST | `/auth/refresh` | Refresh válido | 200, nuevas cookies |
| POST | `/auth/logout` | Access válido | 200, cookies eliminadas |
| GET | `/public` | Público | 200, presentación del coworking |
| GET | `/dashboard` | user o admin | 200, panel del miembro |
| GET | `/users/dashboard` | user o admin | 200, panel del miembro |
| GET | `/admin/users` | admin | 200, miembros sin hashes |

## 🧪 Probar con Thunder Client / Postman

Importar [Flanchito-space.postman_collection.json](Flanchito-space.postman_collection.json). La variable `baseUrl` apunta a `http://localhost:3000/api/v1`.

La colección usa cookies explícitas guardadas durante el login y desactiva el cookie jar por solicitud, para que las pruebas sin token salgan realmente sin cookie. Si se hacen las solicitudes manualmente, conservar las cookies en las rutas privadas y eliminarlas o deshabilitarlas en el caso 401.

### Orden de ejecución

1. **01 - Registro:** crear las cuentas en una base de prueba vacía.
2. **02 - Miembro:** probar login, perfil y acceso con el rol user.
3. Promover la cuenta administrativa en MongoDB y ejecutar **03 - Administracion**.

### Casos esperados

| Caso | Respuesta |
|---|---|
| Registrar a Franck | 201; sin password ni hashes en JSON |
| Login válido | 200; cookie accessToken HttpOnly |
| Perfil con cookie | 200; datos de Franck |
| Ruta privada sin cookie | 401 |
| Renovar sesión | 200; access y refresh nuevos |
| Logout | 200; ambas cookies expiradas |
| Enviar el refresh guardado después de logout | 401 |
| user consulta `/admin/users` | 403 |
| admin consulta `/admin/users` | 200 |

## 📸 Entregables y capturas

- [x] Código fuente funcional con el dominio Flanchito space.
- [x] README con instalación, autenticación y endpoints.
- [x] Roles y permisos documentados.
- [ ] Capturas reales de Thunder Client/Postman.

Capturar las solicitudes siguientes con su URL, estado y respuesta visibles:

1. Registro exitoso de Franck.
2. Login, mostrando las cookies y el atributo HttpOnly.
3. Perfil autenticado y acceso sin token → 401.
4. Refresh exitoso con nuevas cookies.
5. Logout y refresh posterior → 401.
6. Acceso administrativo con user → 403 y con admin → 200.

## 📊 Evaluación

Consultar la [rúbrica de la semana 08](../../rubrica-evaluacion.md).
