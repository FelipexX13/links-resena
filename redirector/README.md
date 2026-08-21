# Redireccionador de tarjetas de reseña

Worker de Cloudflare que convierte un código impreso en la tarjeta
(`https://r.grve.workers.dev/A7K2`) en el link de reseña de Google del negocio que la tiene.

El plástico se imprime una sola vez. El destino vive en Cloudflare KV y se cambia
cuando quieras, sin reimprimir nada.

| Ruta | Qué hace | Acceso |
|---|---|---|
| `/` | Página informativa | público |
| `/A7K2` | Redirige 307 al link de reseña — en iPhone, pantalla con botón | público |
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
   el identificador del local y el link que abre el cuadro de calificación. También
   acepta un link de reseña ya generado.
4. **Guardar tarjeta**. Queda activa de inmediato y aparece el **QR para imprimir**.

Ese QR codifica `HTTPS://R.GRVE.WORKERS.DEV/CODIGO`, **no** el link de Google: es
lo que hace que la tarjeta se pueda reasignar después. Sale en dos versiones PNG
con fondo transparente — negra para fondos claros, blanca para fondos oscuros — y
el botón **QR** de cada fila de la tabla lo vuelve a mostrar cuando quieras.

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

## Decisiones que conviene no cambiar

- **La redirección es 307, no 301.** Un 301 se cachea en el navegador casi para
  siempre: si algún día repunteas una tarjeta, los celulares que ya la escanearon
  seguirían yendo al destino viejo y no habría forma de arreglarlo desde el servidor.
  Por lo mismo va `Cache-Control: no-store`.
- **Hay dos formatos de destino y el panel deja elegir.** No son equivalentes:

  | Formato | Cómo abre la reseña | Dónde falla |
  |---|---|---|
  | `search.google.com/local/writereview?placeid=…` | web pura, sin app | pide sesión de Google si ese navegador no la tiene |
  | `google.com/maps/place//data=…!12e1` | dentro de la app de Maps, que ya tiene sesión | en iPhone puede quedarse en la web y mostrar solo la ficha |

  La causa de lo segundo no es el link: abierto directo en iOS funciona. Es que
  **iOS no le pasa a la app un link al que llegó por una redirección de servidor**
  — los Universal Links de Apple necesitan que el usuario toque el enlace. Como
  la tarjeta siempre llega por un 307 desde este Worker, en iPhone se queda en la
  web móvil, que ignora el `!12e1`. En Android el App Link sí se dispara.

  Para el formato web, el panel **deriva el Place ID** del identificador
  hexadecimal de la URL de Maps: es un protobuf corto en base64url,
  `0A 12 09 <cell id LE> 11 <feature id LE>`, y el prefijo `ChIJ` no es más que la
  codificación de esos tres primeros bytes. Verificado contra Google Maps: el ID
  derivado resuelve al negocio correcto, y cambiándole un carácter deja de
  resolver.

  Las tarjetas guardadas con el formato de app salen marcadas en la tabla.
- **En iPhone se sirve una pantalla con un botón en vez de redirigir.** No es
  capricho: iOS solo le entrega el link a la app de Google Maps si la persona lo
  **toca**, y una redirección de servidor no cuenta como gesto. Sin ese toque,
  Safari se queda en la web móvil y el `!12e1` se ignora — comprobado: el mismo
  link abierto directo sí abre la app. Android no lo necesita porque su App Link
  sí se dispara con la redirección, así que allá sigue el 307 instantáneo.

  La pantalla muestra el nombre del negocio, un botón grande al destino de la
  tarjeta y, debajo, el otro formato como salida por si la app no está instalada.

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
