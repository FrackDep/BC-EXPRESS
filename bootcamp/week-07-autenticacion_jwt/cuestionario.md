# Cuestionario · Semana 07

Flanchito space — Coworking Space

## 1. ¿Por qué no almacenar contraseñas en texto plano ni usar MD5/SHA-256 directamente?

Una filtración de la base expondría cada contraseña y facilitaría probarla en otros servicios. MD5 y SHA-256 son rápidos: un atacante puede intentar muchas combinaciones. bcrypt incorpora salt y un coste configurable que encarece cada intento.

## 2. ¿Qué es el salt de bcrypt?

Es un valor aleatorio distinto para cada hash. Dos miembros con la misma contraseña obtienen hashes diferentes. Esto inutiliza tablas precalculadas genéricas; no impide por sí solo adivinar contraseñas débiles. bcrypt guarda el salt y el coste dentro del hash.

## 3. ¿Cuáles son las partes de un JWT?

El header indica el tipo y algoritmo; el payload contiene claims como sub, role y exp; la signature permite comprobar integridad. Header y payload están codificados en Base64URL, no cifrados. Se pueden leer y editar, pero una edición invalida la firma y el servidor debe rechazarla.

## 4. ¿Access y refresh: en qué se diferencian?

El access permite usar recursos privados y vive 15 minutos. El refresh solo renueva la sesión y dura 7 días en este proyecto. La vida corta del access limita la exposición y la larga del refresh evita pedir la contraseña continuamente; el refresh se almacena hasheado y se rota.

## 5. ¿Por qué una cookie HttpOnly frente a localStorage?

Un script no puede leer directamente una cookie HttpOnly mediante document.cookie, mientras que sí puede leer localStorage. Esto reduce el robo de tokens por XSS, pero un script malicioso todavía podría hacer peticiones. Como las cookies viajan automáticamente, también hay que considerar CSRF, SameSite y HTTPS.

## 6. ¿Qué es la rotación de refresh tokens?

Cada renovación entrega otro refresh e invalida el hash anterior. Así un token ya consumido no puede renovarse de nuevo. En Flanchito space se usa un jti aleatorio y una actualización condicional para que solo una renovación simultánea tenga éxito.

## 7. ¿Qué devolver si la firma es correcta pero expiró?

401 Unauthorized. Una firma correcta no basta: exp también debe ser vigente. No se usa 403, porque no se ha establecido una autenticación válida para esta solicitud.

## 8. ¿Por qué el mismo mensaje de error en login?

Para no confirmar qué emails tienen cuenta. Tanto un correo inexistente como una contraseña equivocada responden 401 Credenciales inválidas. Esto reduce enumeración por contenido, aunque no elimina todos los canales de información como diferencias temporales.

## 9. ¿Qué hace select: false?

Excluye el campo de las consultas por defecto. Para comparar la contraseña se solicita expresamente +password. No cifra ni hashea el campo y no garantiza ocultarlo en un documento recién creado; por eso las respuestas se construyen con una lista explícita de campos públicos.

## 10. ¿Cuántos secretos se usan y por qué?

Dos: JWT_ACCESS_SECRET y JWT_REFRESH_SECRET. Separan la validación de cada clase de token y evitan aceptar un refresh como access. También se valida el tipo de token y se restringe HS256. Ambos valores vienen del entorno y deben ser diferentes.
