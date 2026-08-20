/**
 * Redireccionador de tarjetas de reseña — Cloudflare Worker
 *
 *   GET  /             página informativa
 *   GET  /A7K2         307 al link de reseña de esa tarjeta
 *   GET  /admin        login + panel para activar tarjetas
 *
 *   POST /api/login    {clave} → cookie de sesión firmada
 *   POST /api/salir    cierra la sesión
 *   GET  /api/sesion   ¿hay sesión activa?
 *   GET  /api/lista    listado de tarjetas          (sesión)
 *   POST /api/guardar  {codigo, destino, negocio}   (sesión)
 *   POST /api/borrar   {codigo}                     (sesión)
 *
 * Secreto obligatorio:  ADMIN_PASSWORD
 *
 * Datos en KV (binding TARJETAS):
 *   "c:A7K2"        {"destino":"https://...","negocio":"...","actualizado":"..."}
 *                   + la misma info como metadata, para listar en una sola llamada
 *   "intentos:<ip>" contador de logins fallidos, expira solo a los 15 minutos
 */

const RESERVADAS = new Set(["admin", "api", "favicon.ico", "robots.txt"]);
const FORMATO_CODIGO = /^[A-Z0-9]{3,12}$/;
const COOKIE = "sesion";
const DURACION_SESION = 8 * 60 * 60 * 1000; // 8 horas
const MAX_INTENTOS = 8;
const VENTANA_INTENTOS = 900; // segundos

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const ruta = url.pathname.replace(/^\/+|\/+$/g, "");

    if (ruta === "") return html(vistaInicio(url.host));
    if (ruta === "admin") return html(vistaAdmin(url.host));
    if (ruta.startsWith("api/")) return api(request, env, ruta.slice(4), url);
    if (RESERVADAS.has(ruta)) return new Response(null, { status: 404 });

    const codigo = normalizar(ruta);
    if (!codigo) return html(vistaSinConfigurar(ruta), 404);

    const tarjeta = await env.TARJETAS.get("c:" + codigo, "json");
    if (!tarjeta || !tarjeta.destino) return html(vistaSinConfigurar(codigo), 404);

    // 307 (temporal) a propósito: un 301 se cachea en el navegador casi para
    // siempre y dejaría la tarjeta clavada en el destino viejo si la repunteas.
    return new Response(null, {
      status: 307,
      headers: { Location: tarjeta.destino, "Cache-Control": "no-store" },
    });
  },
};

/* ---------- API ---------- */

async function api(request, env, accion, url) {
  if (!env.ADMIN_PASSWORD) {
    return json({ error: "Falta configurar el secreto ADMIN_PASSWORD" }, 500);
  }

  if (accion === "login" && request.method === "POST") return login(request, env, url);

  if (accion === "salir" && request.method === "POST") {
    return json({ ok: true }, 200, {
      "Set-Cookie": galleta("", url, 0),
    });
  }

  const sesionOk = await sesionValida(request, env);

  if (accion === "sesion" && request.method === "GET") return json({ activa: sesionOk });

  if (!sesionOk) return json({ error: "Sesión expirada o inexistente" }, 401);

  if (accion === "lista" && request.method === "GET") {
    const { keys } = await env.TARJETAS.list({ prefix: "c:" });
    const tarjetas = keys.map((k) => Object.assign({ codigo: k.name.slice(2) }, k.metadata || {}));
    tarjetas.sort((a, b) => a.codigo.localeCompare(b.codigo));
    return json({ tarjetas });
  }

  if (accion === "guardar" && request.method === "POST") {
    const cuerpo = await request.json().catch(() => ({}));
    const codigo = normalizar(cuerpo.codigo);
    if (!codigo) return json({ error: "Código inválido: 3 a 12 letras o números" }, 400);

    let destino;
    try {
      destino = new URL(String(cuerpo.destino || "").trim());
    } catch (e) {
      return json({ error: "El destino no es una URL válida" }, 400);
    }
    if (destino.protocol !== "https:" && destino.protocol !== "http:") {
      return json({ error: "El destino debe empezar por http:// o https://" }, 400);
    }

    const registro = {
      destino: destino.href,
      negocio: String(cuerpo.negocio || "").slice(0, 120),
      actualizado: new Date().toISOString(),
    };
    await env.TARJETAS.put("c:" + codigo, JSON.stringify(registro), { metadata: registro });
    return json(Object.assign({ ok: true, codigo }, registro));
  }

  if (accion === "borrar" && request.method === "POST") {
    const cuerpo = await request.json().catch(() => ({}));
    const codigo = normalizar(cuerpo.codigo);
    if (!codigo) return json({ error: "Código inválido" }, 400);
    await env.TARJETAS.delete("c:" + codigo);
    return json({ ok: true });
  }

  return json({ error: "Ruta no encontrada" }, 404);
}

/* ---------- sesión ---------- */

async function login(request, env, url) {
  const ip = request.headers.get("cf-connecting-ip") || "sin-ip";
  const llaveIntentos = "intentos:" + ip;
  const fallidos = parseInt((await env.TARJETAS.get(llaveIntentos)) || "0", 10);

  if (fallidos >= MAX_INTENTOS) {
    return json({ error: "Demasiados intentos fallidos. Espera 15 minutos." }, 429);
  }

  const cuerpo = await request.json().catch(() => ({}));
  const clave = String(cuerpo.clave || "");

  if (!igualdadConstante(clave, env.ADMIN_PASSWORD)) {
    await env.TARJETAS.put(llaveIntentos, String(fallidos + 1), {
      expirationTtl: VENTANA_INTENTOS,
    });
    const quedan = MAX_INTENTOS - fallidos - 1;
    return json({ error: "Contraseña incorrecta. Te quedan " + quedan + " intentos." }, 401);
  }

  await env.TARJETAS.delete(llaveIntentos);
  const ficha = await crearFicha(env.ADMIN_PASSWORD);
  return json({ ok: true }, 200, { "Set-Cookie": galleta(ficha, url, DURACION_SESION / 1000) });
}

async function crearFicha(secreto) {
  const expira = String(Date.now() + DURACION_SESION);
  return expira + "." + (await firmar(expira, secreto));
}

async function sesionValida(request, env) {
  const ficha = leerCookie(request, COOKIE);
  if (!ficha) return false;

  const corte = ficha.lastIndexOf(".");
  if (corte < 1) return false;

  const expira = ficha.slice(0, corte);
  const firma = ficha.slice(corte + 1);
  if (!/^\d+$/.test(expira) || Date.now() > Number(expira)) return false;

  return igualdadConstante(firma, await firmar(expira, env.ADMIN_PASSWORD));
}

async function firmar(datos, secreto) {
  const cod = new TextEncoder();
  const llave = await crypto.subtle.importKey(
    "raw", cod.encode(secreto), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const firma = await crypto.subtle.sign("HMAC", llave, cod.encode(datos));
  let s = "";
  for (const b of new Uint8Array(firma)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function igualdadConstante(a, b) {
  a = String(a);
  b = String(b || "");
  if (!b || a.length !== b.length) return false;
  let dif = 0;
  for (let i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return dif === 0;
}

function galleta(valor, url, maxAge) {
  // Secure solo en https, para que wrangler dev funcione en http://localhost
  const seguro = url.protocol === "https:" ? " Secure;" : "";
  return COOKIE + "=" + valor + "; Path=/; HttpOnly;" + seguro +
    " SameSite=Strict; Max-Age=" + maxAge;
}

function leerCookie(request, nombre) {
  const crudo = request.headers.get("cookie") || "";
  for (const parte of crudo.split(";")) {
    const [k, ...v] = parte.trim().split("=");
    if (k === nombre) return v.join("=");
  }
  return "";
}

/* ---------- utilidades ---------- */

function normalizar(s) {
  const c = String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return FORMATO_CODIGO.test(c) ? c : "";
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function html(cuerpo, estado) {
  return new Response(cuerpo, {
    status: estado || 200,
    headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-store" },
  });
}

function json(datos, estado, cabeceras) {
  return new Response(JSON.stringify(datos), {
    status: estado || 200,
    headers: Object.assign(
      { "Content-Type": "application/json;charset=utf-8", "Cache-Control": "no-store" },
      cabeceras || {}
    ),
  });
}

/* ---------- vistas ---------- */

const ESTILOS = `
  *{box-sizing:border-box}
  body{margin:0;padding:48px 20px;background:#f5f7fc;color:#1b2333;
    font-family:"Inter",system-ui,-apple-system,sans-serif;line-height:1.55}
  .caja{max-width:720px;margin:0 auto;background:#fff;border:1px solid #e5e9f2;
    border-radius:20px;padding:28px;box-shadow:0 14px 34px -14px rgba(20,30,60,.22);
    position:relative;overflow:hidden}
  .caja.angosta{max-width:420px}
  .caja::before{content:"";position:absolute;top:0;left:0;right:0;height:5px;
    background:linear-gradient(90deg,#4285F4 0 25%,#EA4335 25% 50%,#FBBC05 50% 75%,#34A853 75% 100%)}
  h1{font-size:26px;margin:6px 0 10px;letter-spacing:-.02em}
  p{color:#66718a;margin:0 0 14px}
  code,.mono{font-family:ui-monospace,"IBM Plex Mono",monospace}
  .codigo{display:inline-block;background:#f7f9fd;border:1px solid #e5e9f2;border-radius:10px;
    padding:6px 12px;font-size:18px;letter-spacing:.12em}
  label{display:block;font-weight:600;font-size:13px;margin:14px 0 6px}
  input{width:100%;padding:11px 13px;border:1.5px solid #e5e9f2;border-radius:12px;
    background:#f7f9fd;font-family:ui-monospace,monospace;font-size:13px;color:#1b2333}
  input:focus{outline:none;border-color:#4285F4;box-shadow:0 0 0 4px rgba(66,133,244,.16)}
  button{border:none;border-radius:999px;padding:11px 22px;cursor:pointer;font-weight:600;
    font-size:14px;background:#4285F4;color:#fff;font-family:inherit;white-space:nowrap}
  button:hover{background:#1a68e5}
  button.gris{background:#fff;color:#66718a;border:1.5px solid #e5e9f2}
  button.gris:hover{background:#fafbff;color:#1b2333}
  .barra{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
  table{width:100%;border-collapse:collapse;margin-top:20px;font-size:13px}
  th{text-align:left;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;
    color:#66718a;border-bottom:1px solid #e5e9f2;padding:8px 6px}
  td{padding:10px 6px;border-bottom:1px solid #f0f3f9;vertical-align:top;word-break:break-all}
  td:last-child{width:1%;white-space:nowrap}
  td button{padding:7px 14px;font-size:12.5px}
  .aviso{margin-top:14px;padding:11px 13px;border-radius:12px;font-size:13px;display:none}
  .aviso.ok{display:block;background:#e9f7ee;color:#1c6b34}
  .aviso.mal{display:block;background:#fdecea;color:#a8261b}
  [hidden]{display:none !important}
`;

function vistaInicio(host) {
  return `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tarjetas de reseña</title><style>${ESTILOS}</style>
<div class="caja">
  <h1>Tarjetas de reseña</h1>
  <p>Este dominio redirige cada tarjeta al formulario de calificación del negocio
  que la tiene. Escanea el QR de una tarjeta o entra con su código:
  <code>${esc(host)}/TUCODIGO</code>.</p>
</div>`;
}

function vistaSinConfigurar(codigo) {
  return `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tarjeta sin configurar</title><style>${ESTILOS}</style>
<div class="caja">
  <h1>Esta tarjeta todavía no está activada</h1>
  <p>El código <span class="codigo">${esc(codigo)}</span> aún no tiene un negocio asignado.</p>
  <p>Si acabas de recibir la tarjeta, avísanos y la activamos en un minuto.</p>
</div>`;
}

function vistaAdmin(host) {
  return `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Panel de tarjetas</title><style>${ESTILOS}</style>

<div class="caja angosta" id="pantallaLogin" hidden>
  <h1>Entrar</h1>
  <p>Panel de tarjetas de reseña.</p>
  <form id="formLogin">
    <label for="clave">Contraseña</label>
    <input id="clave" type="password" autocomplete="current-password" autofocus>
    <div style="margin-top:18px"><button type="submit">Entrar</button></div>
  </form>
  <div class="aviso" id="avisoLogin"></div>
</div>

<div class="caja" id="pantallaPanel" hidden>
  <div class="barra">
    <h1 style="margin:0">Panel de tarjetas</h1>
    <button class="gris" id="salir">Cerrar sesión</button>
  </div>
  <p style="margin-top:10px">Asigna el link de reseña de Google a cada código impreso.</p>

  <label for="codigo">Código de la tarjeta</label>
  <input id="codigo" placeholder="A7K2" autocomplete="off">

  <label for="negocio">Negocio <span style="font-weight:400;color:#66718a">— solo para tu referencia</span></label>
  <input id="negocio" placeholder="Mercacentro Av. Guabinal" autocomplete="off">

  <label for="destino">Link de reseña</label>
  <input id="destino" placeholder="https://www.google.com/maps/place//data=!4m3!3m2!1s0x...!12e1" autocomplete="off">

  <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">
    <button id="guardar">Guardar tarjeta</button>
    <button class="gris" id="recargar">Refrescar lista</button>
  </div>

  <div class="aviso" id="aviso"></div>
  <div id="tabla"></div>
</div>

<script>
const HOST = ${JSON.stringify(host)};
const $ = (id) => document.getElementById(id);

function avisar(caja, texto, ok) {
  const a = $(caja);
  a.textContent = texto;
  a.className = "aviso " + (ok ? "ok" : "mal");
}

// la sesión viaja en una cookie HttpOnly: el JS de esta página nunca la ve
async function llamar(ruta, opciones) {
  const cfg = opciones || {};
  cfg.credentials = "same-origin";
  const r = await fetch("/api/" + ruta, cfg);
  const datos = await r.json().catch(() => ({ error: "Respuesta ilegible" }));
  if (r.status === 401 && ruta !== "login") { mostrar(false); throw new Error("Tu sesión expiró"); }
  if (!r.ok) throw new Error(datos.error || "Error " + r.status);
  return datos;
}

function mostrar(dentro) {
  $("pantallaPanel").hidden = !dentro;
  $("pantallaLogin").hidden = dentro;
  if (dentro) listar(); else $("clave").focus();
}

$("formLogin").onsubmit = async (e) => {
  e.preventDefault();
  try {
    await llamar("login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clave: $("clave").value }),
    });
    $("clave").value = "";
    $("avisoLogin").className = "aviso";
    mostrar(true);
  } catch (err) {
    avisar("avisoLogin", err.message, false);
  }
};

$("salir").onclick = async () => {
  await llamar("salir", { method: "POST" }).catch(() => {});
  mostrar(false);
};

$("guardar").onclick = async () => {
  try {
    const datos = await llamar("guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo: $("codigo").value,
        negocio: $("negocio").value,
        destino: $("destino").value,
      }),
    });
    avisar("aviso", "Tarjeta " + datos.codigo + " activada", true);
    $("codigo").value = $("negocio").value = $("destino").value = "";
    listar();
  } catch (e) {
    avisar("aviso", e.message, false);
  }
};

$("recargar").onclick = () => listar();

async function listar() {
  try {
    const datos = await llamar("lista");
    if (!datos.tarjetas.length) {
      $("tabla").innerHTML = "<p style='margin-top:20px'>Todavía no hay tarjetas activadas.</p>";
      return;
    }
    let filas = "";
    datos.tarjetas.forEach((t) => {
      filas +=
        "<tr><td class='mono'><b>" + t.codigo + "</b><br><span style='color:#66718a'>" +
        HOST + "/" + t.codigo + "</span></td><td>" + (t.negocio || "—") +
        "</td><td class='mono' style='font-size:11px'>" + (t.destino || "") +
        "</td><td><button class='gris' data-borrar='" + t.codigo + "'>Borrar</button></td></tr>";
    });
    $("tabla").innerHTML =
      "<table><thead><tr><th>Código</th><th>Negocio</th><th>Destino</th><th></th></tr></thead><tbody>" +
      filas + "</tbody></table>";
  } catch (e) {
    avisar("aviso", e.message, false);
  }
}

$("tabla").addEventListener("click", async (e) => {
  const b = e.target.closest("[data-borrar]");
  if (!b) return;
  if (!confirm("¿Borrar la tarjeta " + b.dataset.borrar + "? Quedará sin destino.")) return;
  try {
    await llamar("borrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo: b.dataset.borrar }),
    });
    avisar("aviso", "Tarjeta " + b.dataset.borrar + " borrada", true);
    listar();
  } catch (err) {
    avisar("aviso", err.message, false);
  }
});

llamar("sesion").then((s) => mostrar(s.activa)).catch(() => mostrar(false));
</script>`;
}
