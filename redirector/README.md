# Redireccionador de tarjetas de reseña

Worker de Cloudflare que convierte un código impreso en la tarjeta
(`https://TUDOMINIO/A7K2`) en el link de reseña de Google del negocio que la tiene.

El plástico se imprime una sola vez. El destino vive en Cloudflare KV y se cambia
cuando quieras, sin reimprimir nada.

| Ruta | Qué hace | Acceso |
|---|---|---|
| `/` | Página informativa | público |
| `/A7K2` | Redirige 307 al link de reseña de esa tarjeta | público |
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

Falta agregar tu dominio corto en **Settings → Domains & Routes** del Worker.

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

1. Entra a `https://TUDOMINIO/admin` e inicia sesión.
2. Código impreso + nombre del negocio + el link de reseña que sale del generador.
3. **Guardar tarjeta**. Queda activa de inmediato.

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
