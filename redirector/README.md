# Redireccionador de tarjetas de reseña

Worker de Cloudflare que convierte un código impreso en la tarjeta
(`https://r.grve.workers.dev/A7K2`) en el link de reseña de Google del negocio que la tiene.

El plástico se imprime una sola vez. El destino vive en Cloudflare KV y se cambia
cuando quieras, sin reimprimir nada.

| Ruta | Qué hace | Acceso |
|---|---|---|
| `/` | Página informativa | público |
| `/A7K2` | 307 al formulario de reseñas del negocio | público |
| `/admin` | Login y panel de tarjetas | público, pero sin datos hasta iniciar sesión |
| `/api/login`, `/api/salir`, `/api/sesion` | Manejo de la sesión | público |
| `/api/lista`, `/api/guardar`, `/api/borrar` | Leer y modificar tarjetas | **requiere sesión** |

Los códigos son insensibles a mayúsculas: `/a7k2` y `/A7K2` llevan al mismo sitio.

---

## Desplegar con Wrangler

```bash
npx wrangler kv namespace create TARJETAS
```

Pega el `id` que devuelve en `wrangler.toml`, y luego:

```bash
npx wrangler secret put ADMIN_PASSWORD
```

```bash
npx wrangler deploy
```

Queda publicado en `https://r.grve.workers.dev`, sin dominio propio ni costo.

### Que la URL salga lo más corta posible

El Worker se llama `r` porque **su nombre es el subdominio**, y cada carácter de
más engorda el QR impreso. La otra mitad es el subdominio de la cuenta, ya fijado
en `grve`. Los dos se eligieron cortos a propósito, y no es cosmético:

Medido con la librería que usa el panel, corrección de errores M:

| URL de la tarjeta | Versión del QR | Módulo a 25 mm |
|---|---|---|
| `HTTPS://R.GRVE.WORKERS.DEV/A7K2` ← el nuestro | 25×25 | **0,76 mm** |
| el mismo en minúsculas (fuerza modo byte) | 29×29 | 0,68 mm |
| `HTTPS://R.MINEGOCIODEQR.WORKERS.DEV/A7K2` | 29×29 | 0,68 mm |

El subdominio de la cuenta **se elige una sola vez**: cambiarlo rompe todas las
tarjetas ya impresas, así que se queda como está.

De esas tres filas salen las dos reglas que el panel ya aplica solo:

- **La URL va en MAYÚSCULAS.** Eso permite usar el modo alfanumérico del estándar
  QR en vez del modo byte, y se ahorra una versión entera — la segunda fila de la
  tabla es exactamente ese costo. Al servidor le da igual: el host es insensible a
  mayúsculas y los códigos se normalizan.
- **Tiene que ser `https://`.** El TLD `.dev` está en la lista HSTS precargada de
  los navegadores, así que `http://` no es una opción para ahorrar un carácter.

Si algún día quieres pasarte a un dominio propio, agrégalo en
**Settings → Domains & Routes**. Ojo: las tarjetas ya impresas seguirán apuntando
a `workers.dev`, así que ese Worker no se puede apagar nunca.

### Probarlo en local

Crea un archivo `.dev.vars` (ya está en `.gitignore`, nunca se sube) con:

```
ADMIN_PASSWORD=lo-que-quieras-para-probar
```

```bash
npx wrangler dev
```

Queda en `http://localhost:8787` con un KV simulado, sin tocar el de producción.

### Alternativa sin instalar nada

En **Workers & Pages → Create → Worker**, pega el contenido de
[`src/index.js`](src/index.js) en **Edit code**. Después, en el mismo panel:
crea el namespace KV en **Storage & Databases → KV**, enlázalo en
**Settings → Bindings** con el nombre de variable `TARJETAS`, y agrega
`ADMIN_PASSWORD` en **Settings → Variables and Secrets** como tipo **Secret**.

---

## Activar una tarjeta

El panel lleva incorporado el generador de links de reseña, así que no hay que
saltar a otra herramienta:

1. Entra a `https://r.grve.workers.dev/admin` e inicia sesión.
2. Escribe el **código impreso** en la tarjeta.
3. Pega la **URL de Google Maps** del negocio y dale a **Leer la URL**. De ahí sale
   el **Place ID** del local y el link que abre el formulario de reseñas. El campo
   también acepta el Place ID pegado tal cual, o un link de reseña ya hecho.
4. **Guardar tarjeta**. Queda activa de inmediato y aparece el **QR para imprimir**.

Ese QR codifica `HTTPS://R.GRVE.WORKERS.DEV/CODIGO`, **no** el link de Google: es
lo que hace que la tarjeta se pueda reasignar después. Sale en dos versiones PNG
con fondo transparente — negra para fondos claros, blanca para fondos oscuros — y
el botón **QR** de cada fila de la tabla lo vuelve a mostrar cuando quieras.

En el tag NFC va **ese mismo link**. Los tags grabados antes con `?n=1` al final
siguen sirviendo: ese parámetro ya no se mira.

Borrar una tarjeta no la rompe: vuelve a mostrar la página de "todavía no está
activada", así que puedes reasignarla a otro negocio cuando quieras.

---

## Cómo funciona el acceso

`/admin` es una página pública, pero **no trae ningún dato**: lo único que se
puede hacer sin sesión es ver el formulario de login. Todo lo que lee o modifica
tarjetas vive en `/api/*` y responde **401** sin una sesión válida.

- La contraseña es el secreto `ADMIN_PASSWORD`, guardado cifrado en Cloudflare.
  No está en el código ni en este repositorio.
- Al iniciar sesión, el servidor entrega una **cookie firmada con HMAC-SHA256**
  (`HttpOnly`, `Secure` en https, `SameSite=Strict`, 8 horas). Al ser `HttpOnly`,
  el JavaScript de la página no puede leerla; y `SameSite=Strict` impide que otro
  sitio la use para hacer peticiones en tu nombre.
- La cookie lleva su propia fecha de vencimiento **dentro de la firma**, así que
  no sirve de nada editarla: cambiar la fecha invalida la firma.
- Las comparaciones de contraseña y de firma son en **tiempo constante**.
- **Ocho intentos fallidos por IP** bloquean el login 15 minutos. El bloqueo no
  afecta la redirección de las tarjetas: aunque alguien esté martillando el login,
  los QR impresos siguen funcionando.

Si alguna vez sospechas que la contraseña se filtró, cámbiala con
`wrangler secret put ADMIN_PASSWORD`: como la firma de las sesiones se deriva de
ella, **todas las sesiones abiertas quedan invalidadas al instante**.

---

## Aguante y abuso

El DDoS volumétrico lo filtra Cloudflare en el borde para todas las cuentas, plan
gratuito incluido: no hay nada que programar contra eso.

Lo que sí está expuesto son las **cuotas diarias del plan gratuito**, porque
agotarlas deja las tarjetas sin servicio hasta el día siguiente:

| Recurso | Límite diario | Consumo por visita |
|---|---|---|
| Peticiones a Workers | 100.000 | 1 |
| Lecturas de KV | 100.000 | 1, **0 si la tarjeta está en caché** |
| Escrituras de KV | 1.000 | solo al activar o borrar tarjetas |

Por eso las tarjetas se leen a través de la caché del borde: un aluvión sobre el
mismo código se resuelve sin tocar KV. Las peticiones al Worker no se pueden
evitar — esas se cuentan igual.

Lo que **no** se puede montar aquí son las reglas de rate limiting y el WAF de
Cloudflare: necesitan una zona, y `workers.dev` no lo es. Si algún día el
proyecto justifica un dominio propio, eso es lo primero que se desbloquea.

El login ya tiene su propio freno, aparte de todo esto: ocho intentos fallidos
por IP y quince minutos de bloqueo.

## Decisiones que conviene no cambiar

- **Todo el mundo recibe un 307, sin pantalla de por medio.** QR o NFC, Android o
  iPhone: el mismo salto directo. Se puede porque el destino es una **página web**
  (el formulario de reseñas de Google) y no una app: no hay entrega a una app
  nativa, que era lo único que exigía un toque de la persona.

  Hubo una época en que sí hacía falta una pantalla intermedia con un botón,
  porque el destino era `google.com/maps/place//data=…!12e1` y ese link solo
  servía si la **app** de Maps lo agarraba. Ni iOS ni Android le entregan un link
  a una app cuando se llega por un salto de servidor: en iOS el Universal Link
  exige un toque real, y en Android el navegador sigue la redirección él mismo y
  termina renderizando la web de Maps. Comprobado en los dos, con QR y con NFC.

  **Tres formas de quitar ese toque, todas fallidas y comprobadas en teléfono**, por
  si a alguien se le ocurre reintentarlas:

  - **AAR** (Android Application Record) en el tag NFC. Abre Maps, pero en su
    pantalla principal: Maps no registra ninguna actividad para eventos NFC, así
    que Android se limita a lanzar la app.
  - **Redirección a un URI `intent://`**, el mecanismo de los servicios de deep
    link. Chrome bloquea el salto a un esquema externo cuando viene de una
    redirección sin gesto del usuario, y cae al `browser_fallback_url`.
  - **Grabar el link de Google directo en el tag.** Además de romper la
    reasignación, choca con lo mismo: el lanzamiento desde NFC no cuenta como toque.

  La prueba de que era un techo de la plataforma y no de este código: la web de
  Google Maps, en el dominio de Google, tampoco abre su propia app sola — muestra
  un diálogo pidiendo que toques "Continuar". La salida no fue vencer ese techo,
  sino **cambiar a un destino que no lo necesita**.

  Si algún día el destino vuelve a ser un link de app, la pantalla con el botón
  está en el historial de git, en `src/puente.js`.
- **El destino es `search.google.com/local/writereview?placeid=…`.** Ese link cae
  directo en el formulario de reseñas de Google, con la sesión que la persona ya
  tiene abierta. Reemplazó a `google.com/maps/place//data=…!12e1`, que dependía de
  que la app de Maps agarrara el link y muchas veces terminaba en la web de Maps
  sin el cuadro de estrellas.

  **El Place ID lo calcula el panel**, no hay que ir al buscador de Google por cada
  negocio. La URL de Maps trae el identificador hexadecimal del lugar
  (`!1s0xCELDA:0xLUGAR`), y el Place ID es ese mismo par de números metido en un
  protobuf mínimo y codificado en base64url:

  | Byte | Qué es |
  |---|---|
  | `0x0A` | campo 1, tipo bytes |
  | `0x12` | longitud 18 |
  | `0x09` | campo 1, entero fijo de 64 bits → celda, little-endian |
  | `0x11` | campo 2, entero fijo de 64 bits → lugar, little-endian |

  Por eso todos los Place ID empiezan por `ChIJ`: es la base64 de esos tres
  primeros bytes, que no cambian nunca. La conversión está comprobada contra el
  buscador oficial de Place ID. Si algún lugar raro no convierte, el campo del
  panel acepta el `ChIJ…` pegado a mano.

- **En el NFC va la URL corta de la tarjeta, no el link de Google**, igual que en
  el QR. Es lo que mantiene el tag reasignable después de grabado.

- **El destino se valida**: solo se aceptan URLs `http:` o `https:`, para que el
  panel no pueda convertirse en un trampolín hacia `javascript:` u otros esquemas.
- **Los códigos se normalizan** a mayúsculas y solo admiten `A-Z0-9`, de 3 a 12
  caracteres. Al generarlos para imprimir, evita los ambiguos: usa el alfabeto
  `23456789ABCDEFGHJKMNPQRSTUVWXYZ` (sin `0`/`O` ni `1`/`I`/`L`), porque alguien
  va a tener que teclear ese código a mano alguna vez.
- **Rutas reservadas**: `admin`, `api`, `favicon.ico` y `robots.txt` no pueden
  usarse como códigos de tarjeta.

## Contar escaneos

KV no sirve para llevar contadores: es de consistencia eventual y admite ~1
escritura por segundo por clave. Cuando lo quieras, la vía es Durable Objects,
Workers Analytics Engine, o un Redis de Upstash con `INCR`. No está incluido aquí.
