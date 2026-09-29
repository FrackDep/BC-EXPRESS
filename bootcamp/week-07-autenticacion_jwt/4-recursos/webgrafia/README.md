# 🌐 Webgrafía — Semana 07: Autenticación JWT

## Documentación Oficial

| Recurso | URL | Sección relevante |
|---------|-----|-------------------|
| jwt.io — Debugger y especificación | https://jwt.io | Debugger interactivo para inspeccionar tokens |
| RFC 7519 — JSON Web Token spec | https://datatracker.ietf.org/doc/html/rfc7519 | Claims registrados (sub, iat, exp, etc.) |
| jsonwebtoken (npm) | https://www.npmjs.com/package/jsonwebtoken | API completa, opciones y manejo de errores |
| bcrypt (npm) | https://www.npmjs.com/package/bcrypt | hash(), compare(), salt rounds |
| cookie-parser (npm) | https://www.npmjs.com/package/cookie-parser | Integración con Express |
| MDN — HTTP Cookies | https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies | HttpOnly, Secure, SameSite, Path |
| Express 5 — Response API | https://expressjs.com/en/5x/api.html#res.cookie | `res.cookie()` y `res.clearCookie()` |

---

## Seguridad y Mejores Prácticas

| Recurso | URL | Descripción |
|---------|-----|-------------|
| OWASP Authentication Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html | Guía completa de mejores prácticas de autenticación |
| OWASP Session Management Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html | Gestión de sesiones con tokens |
| OWASP XSS Prevention Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html | Por qué HttpOnly previene XSS |
| OWASP CSRF Prevention Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html | SameSite cookies vs tokens CSRF |
| Have I Been Pwned — API | https://haveibeenpwned.com/API/v3 | API pública para verificar contraseñas comprometidas |

---

## Artículos Técnicos Recomendados

| Artículo | URL | Tema |
|----------|-----|------|
| Stop using JWT for sessions (joepie91) | http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/ | Reflexión crítica sobre cuándo usar JWT vs sesiones |
| JWT vs Session Tokens | https://blog.logrocket.com/jwt-authentication-best-practices/ | Comparativa y mejores prácticas |
| Refresh Token Rotation | https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation | Explicación oficial de Auth0 sobre rotación |
| bcrypt vs Argon2 vs scrypt | https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html | OWASP: qué algoritmo usar para contraseñas |

---

## Herramientas Útiles

| Herramienta | URL | Uso |
|-------------|-----|-----|
| jwt.io Debugger | https://jwt.io/#debugger-io | Decodificar y verificar JWTs manualmente |
| CyberChef | https://gchq.github.io/CyberChef/ | Decodificar Base64URL y explorar encoding |
| bcrypt-generator.com | https://bcrypt-generator.com | Probar hashes bcrypt interactivamente |
| Random.org Strings | https://www.random.org/strings/ | Generar secrets aleatorios para desarrollo |
