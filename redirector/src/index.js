/**
 * Redireccionador de tarjetas de reseña — Cloudflare Worker
 *
 *   GET  /             página informativa
 *   GET  /A7K2         pantalla con el botón que abre la reseña
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

import { vistaInicio, vistaSinConfigurar, vistaAdmin } from "./vistas.js";
import { vistaPuente, estiloValido } from "./puente.js";

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
    if (ruta === "admin") return html(vistaAdmin(url.origin));
    if (ruta.startsWith("api/")) return api(request, env, ruta.slice(4), url);
    if (RESERVADAS.has(ruta.toLowerCase())) return new Response(null, { status: 404 });

    const codigo = normalizar(ruta);
    if (!codigo) return html(vistaSinConfigurar(ruta), 404);

    const tarjeta = await env.TARJETAS.get("c:" + codigo, "json");
    if (!tarjeta || !tarjeta.destino) return html(vistaSinConfigurar(codigo), 404);

    // Nunca se redirige: se sirve una pantalla con un botón.
    //
    // Ni iOS ni Android le entregan el link a la app de Google Maps cuando se
    // llega por un salto de servidor. En iOS el Universal Link exige que una
    // persona toque el enlace; en Android el intent se resuelve al abrir la URL
    // y el navegador no lo vuelve a resolver en mitad de una redirección, así
    // que se queda renderizando la web de Maps y el !12e1 se ignora.
    //
    // El botón da ese toque, que es lo único que abre la app en ambos.
    return html(vistaPuente(tarjeta, codigo));
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
    // si no, quedaría una tarjeta impresa que nunca puede resolverse
    if (RESERVADAS.has(codigo.toLowerCase())) {
      return json({ error: "Ese código está reservado por el sistema" }, 400);
    }

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
      estilo: estiloValido(cuerpo.estilo),
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
