/**
 * Redireccionador de tarjetas de reseña — Cloudflare Worker
 *
 *   GET  /             página informativa
 *   GET  /A7K2         307 al formulario de reseñas del negocio
 *   GET  /admin        login + panel para activar tarjetas
 *
 *   POST /api/login    {clave} → cookie de sesión firmada
 *   POST /api/salir    cierra la sesión
 *   GET  /api/sesion   ¿hay sesión activa?
 *   GET  /api/modo     ¿está el modo pruebas activo?          (público)
 *   POST /api/modo     {prueba}                               (sesión)
 *   GET  /api/lista    listado de tarjetas          (sesión)
 *   POST /api/guardar  {codigo, destino, negocio, tipo, vendida, precio}  (sesión)
 *   POST /api/rango    {codigos[], ...los mismos campos}                (sesión)
 *   POST /api/desactivar {codigos[], tipo}                       (sesión)
 *   POST /api/nfc      {codigo, listo}  marca el chip como grabado    (sesión)
 *   GET  /api/gastos   listado de gastos                          (sesión)
 *   POST /api/gasto    {id?, fecha, proveedor, monto, paga, ...}  (sesión)
 *   POST /api/gasto-borrar {id}                                   (sesión)
 *   GET  /api/servicios                                           (sesión)
 *   POST /api/servicio {id?,negocio,precio,fecha,hecha,notas}     (sesión)
 *   POST /api/servicio-borrar {id}                                (sesión)
 *   GET  /api/ajustes                                             (sesión)
 *   POST /api/ajustes {socio,nombre,cedula,telefono,nota}         (sesión)
 *   GET  /api/compradores                                         (sesión)
 *   POST /api/comprador {negocio,correo,nit,telefono}             (sesión)
 *   POST /api/comprobante {correo,negocio,archivo,pdf,total}      (sesión)
 *   GET  /api/comprobantes                                        (sesión)
 *   POST /api/comprobante-borrar {negocio}                        (sesión)
 *   POST /api/comprobante-cerrar {negocio,total,fecha}            (sesión)
 *   POST /api/resolver {url}  → sigue un link corto de Maps          (sesión)
 *
 * Secreto obligatorio:  ADMIN_PASSWORD
 *
 * Datos en KV (binding TARJETAS):
 *   "c:A7K2"        {"destino":"https://...","negocio":"...","tipo":"acrilico",
 *                    "vendida":"2026-09-01","precio":25000,"vendedor":"felipe",
 *                    "actualizado":"..."}
 *                   vendida vacía = vinculada pero todavía no cobrada
 *                   + la misma info como metadata, para listar en una sola llamada
 *   "n:A7K2"        existe = el chip NFC de esa tarjeta ya está grabado
 *   "g:<id>"        un gasto: qué se compró, cuánto costó, quién puso y si llegó
 *   "s:<id>"        un servicio vendido que no va en plástico: crearle al local su
 *                   ficha de Google con fotos y horarios. fecha vacía = acordado
 *                   pero todavía sin cobrar, igual que una tarjeta sin vender
 *   "b:<negocio>"   a quién se le manda el comprobante: correo, NIT y teléfono
 *   "r:<negocio>"   comprobante ya enviado: cierra esa orden y no deja tocarle
 *                   nada hasta que se borre
 *   "cfg:vendedor"  {felipe:{...},nicolas:{...}} — los dos que venden, para
 *                   firmar el comprobante con el que hizo esa venta
 *   "intentos:<ip>" contador de logins fallidos, expira solo a las 24 horas
 */

import { vistaInicio, vistaSinConfigurar, vistaAdmin, vistaPrueba } from "./vistas.js";

const RESERVADAS = new Set(["admin", "api", "favicon.ico", "robots.txt"]);
const FORMATO_CODIGO = /^[A-Z0-9]{3,12}$/;
const COOKIE = "sesion";
const DURACION_SESION = 8 * 60 * 60 * 1000; // 8 horas
const MAX_INTENTOS = 3;
const TIPOS = new Set(["acrilico", "sticker"]);
const LLAVE_MODO = "modo:prueba";
const SOCIOS = new Set(["felipe", "nicolas", "ambos"]);
// Quién hizo la venta. Va en el registro porque la declaración de renta la
// presenta cada uno por su lado, con sus propios ingresos.
function vendedorValido(valor) {
  return valor === "felipe" || valor === "nicolas" ? valor : "";
}
// El comprobante sale de este buzón. Brevo pide verificar el remitente una vez.
const CORREO_REMITENTE = "greview641@gmail.com";
const NOMBRE_REMITENTE = "Google Reviews";
const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_PDF = 4 * 1024 * 1024; // en base64; un comprobante real pesa unos 30 KB
const LLAVE_VENDEDOR = "cfg:vendedor";
// Los únicos sitios a los que el Worker sigue un enlace por su cuenta. La lista
// va cerrada a propósito: si no, esto sería un proxy para pedir lo que sea.
const ACORTADORES = new Set(["maps.app.goo.gl", "goo.gl", "g.co", "maps.google.com",
  "www.google.com", "google.com"]);
const ESTADOS_GASTO = new Set(["pendiente", "entregado"]);
const MAX_ITEMS = 8;
const FORMATO_ID = /^[a-z0-9]{1,24}$/;
// El plan gratuito corta a 50 subpeticiones por petición, y cada escritura en KV
// cuenta como una. El panel parte los rangos largos en tandas de este tamaño.
const MAX_RANGO = 25;
const VENTANA_INTENTOS = 24 * 60 * 60; // segundos: un día entero de bloqueo
const HORAS_BLOQUEO = VENTANA_INTENTOS / 3600;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const ruta = url.pathname.replace(/^\/+|\/+$/g, "");

    if (ruta === "") return html(vistaInicio(url.host));
    if (ruta === "admin") return html(vistaAdmin(url.origin));
    if (ruta.startsWith("api/")) return api(request, env, ruta.slice(4), url, ctx);
    if (RESERVADAS.has(ruta.toLowerCase())) return new Response(null, { status: 404 });

    const codigo = normalizar(ruta);
    if (!codigo) return html(vistaSinConfigurar(ruta), 404);

    const tarjeta = await leerTarjeta(env, ctx, codigo);

    // Con las pruebas puestas la tarjeta enseña su código, para casar el plástico
    // impreso con el registro. Va antes de exigir destino, así se revisa una
    // impresión sin vincularla a ningún negocio.
    //
    // Las vendidas quedan fuera: ya están pegadas en la mesa de un local y sus
    // clientes las escanean de verdad. Probar no puede apagarle el QR a nadie.
    if (!(tarjeta && tarjeta.vendida) && await enPruebas(env, ctx)) {
      return html(vistaPrueba(codigo, tarjeta || {}));
    }

    if (!tarjeta || !tarjeta.destino) return html(vistaSinConfigurar(codigo), 404);

    // Salto directo, sin pantalla de por medio. El destino es el formulario de
    // reseñas de Google, que se abre en el navegador: no depende de que la app
    // de Maps agarre el link, así que da igual por dónde llegue la visita.
    //
    // 307 y no 301: un 301 se cachea en el navegador casi para siempre y dejaría
    // la tarjeta clavada en el destino viejo al reasignarla.
    return new Response(null, {
      status: 307,
      headers: { Location: tarjeta.destino, "Cache-Control": "no-store" },
    });
  },
};

/* ---------- validación compartida ---------- */

function urlDestino(valor) {
  let u;
  try { u = new URL(String(valor || "").trim()); } catch (e) { return ""; }
  // solo http(s): si no, el panel sería un trampolín hacia javascript: u otros
  return u.protocol === "https:" || u.protocol === "http:" ? u.href : "";
}

function tipoValido(valor) {
  const t = String(valor || "").toLowerCase();
  return TIPOS.has(t) ? t : "acrilico";
}

// La tarjeta ES la unidad de venta: cada acrílico y cada sticker es un registro.
// Por eso la venta vive aquí y no en una entidad aparte que habría que mantener
// sincronizada. vendida vacía = vinculada al local pero todavía no cobrada.
function fechaValida(valor) {
  const f = String(valor || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(f) ? f : "";
}

function precioValido(valor) {
  const n = Number(valor);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0;
}

function registroDe(cuerpo) {
  const destino = urlDestino(cuerpo.destino);
  if (!destino) return { error: "El destino debe ser una URL http:// o https://" };
  const negocio = String(cuerpo.negocio || "").trim().slice(0, 120);
  if (!negocio) return { error: "Falta el nombre del negocio" };
  return {
    registro: {
      destino: destino,
      negocio: negocio,
      tipo: tipoValido(cuerpo.tipo),
      vendida: fechaValida(cuerpo.vendida),
      precio: precioValido(cuerpo.precio),
      vendedor: vendedorValido(String(cuerpo.vendedor || "")),
      actualizado: new Date().toISOString(),
    },
  };
}

async function escribir(env, codigo, registro) {
  await env.TARJETAS.put("c:" + codigo, JSON.stringify(registro), { metadata: registro });
  await olvidarTarjeta(codigo);
}

/* ---------- gastos ---------- */

// El gasto entero cabe en la metadata de KV (tope 1024 bytes), así que el listado
// del panel es una sola llamada a list() en vez de una lectura por gasto.
function gastoDe(cuerpo) {
  const fecha = fechaValida(cuerpo.fecha);
  if (!fecha) return { error: "La fecha del gasto va en formato AAAA-MM-DD" };

  const monto = Number(cuerpo.monto);
  if (!Number.isFinite(monto) || monto < 0) return { error: "El monto no es válido" };

  const proveedor = String(cuerpo.proveedor || "").trim().slice(0, 60);
  if (!proveedor) return { error: "Falta de dónde salió el gasto" };

  const paga = SOCIOS.has(String(cuerpo.paga)) ? String(cuerpo.paga) : "ambos";
  const estado = ESTADOS_GASTO.has(String(cuerpo.estado)) ? String(cuerpo.estado) : "pendiente";

  const items = (Array.isArray(cuerpo.items) ? cuerpo.items : [])
    .slice(0, MAX_ITEMS)
    .map((it) => ({
      que: String(it.que || "").trim().slice(0, 40),
      cuantos: Math.max(0, Math.round(Number(it.cuantos) || 0)),
      malos: Math.max(0, Math.round(Number(it.malos) || 0)),
    }))
    .filter((it) => it.que && it.cuantos);

  return {
    gasto: {
      fecha: fecha,
      proveedor: proveedor,
      descripcion: String(cuerpo.descripcion || "").trim().slice(0, 120),
      monto: Math.round(monto),
      paga: paga,
      estado: estado,
      entrega: estado === "entregado" ? fechaValida(cuerpo.entrega) : "",
      notas: String(cuerpo.notas || "").trim().slice(0, 200),
      items: items,
    },
  };
}

// La ficha de Google se cobra aparte y no cuelga de ninguna tarjeta: un local
// puede pedirla sin comprar un solo acrílico. Por eso vive en su propia clave y
// se une a la orden por el nombre del negocio.
function servicioDe(cuerpo) {
  const negocio = String(cuerpo.negocio || "").trim().slice(0, 60);
  if (!negocio) return { error: "Falta el nombre del local" };

  const precio = Number(cuerpo.precio);
  if (!Number.isFinite(precio) || precio < 0) return { error: "El precio no es válido" };

  const cruda = String(cuerpo.fecha || "");
  const fecha = cruda ? fechaValida(cruda) : "";
  if (cruda && !fecha) return { error: "La fecha del cobro va en formato AAAA-MM-DD" };

  return {
    servicio: {
      negocio: negocio,
      precio: Math.round(precio),
      fecha: fecha,
      vendedor: vendedorValido(String(cuerpo.vendedor || "")),
      hecha: Boolean(cuerpo.hecha),
      notas: String(cuerpo.notas || "").trim().slice(0, 200),
    },
  };
}

// Un comprobante de venta, no una factura: sin numeración consecutiva, sin CUFE
// y sin QR. El PDF se arma en el panel y aquí solo se despacha.
function vendedorDe(cuerpo) {
  const socio = String(cuerpo.socio || "");
  if (socio !== "felipe" && socio !== "nicolas") return { error: "Ese socio no existe" };

  const nombre = String(cuerpo.nombre || "").trim().slice(0, 80);
  if (!nombre) return { error: "Falta el nombre completo" };
  const cedula = String(cuerpo.cedula || "").trim().slice(0, 30);
  if (!cedula) return { error: "Falta el número de cédula" };
  return {
    socio: socio,
    vendedor: {
      nombre: nombre,
      cedula: cedula,
      nota: String(cuerpo.nota || "").trim().slice(0, 160),
      telefono: String(cuerpo.telefono || "").trim().slice(0, 30),
    },
  };
}

// Antes era un solo vendedor suelto. Lo que se guardó así era de Felipe, que es
// quien montó el panel; se sube al mapa la primera vez que se lee.
function mapaDeVendedores(guardado) {
  if (!guardado) return { felipe: null, nicolas: null };
  if (guardado.nombre) return { felipe: guardado, nicolas: null };
  return { felipe: guardado.felipe || null, nicolas: guardado.nicolas || null };
}

function compradorDe(cuerpo) {
  const negocio = String(cuerpo.negocio || "").trim().slice(0, 60);
  if (!negocio) return { error: "Falta el nombre del local" };
  const correo = String(cuerpo.correo || "").trim().slice(0, 120);
  if (correo && !FORMATO_CORREO.test(correo)) return { error: "Ese correo no es válido" };
  return {
    comprador: {
      negocio: negocio,
      correo: correo,
      nit: String(cuerpo.nit || "").trim().slice(0, 30),
      telefono: String(cuerpo.telefono || "").trim().slice(0, 30),
    },
  };
}

function escapar(t) {
  return String(t == null ? "" : t)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Correo en tablas y estilos en línea, que es lo único que respetan Gmail y
// Outlook. La franja de cuatro colores son cuatro celdas al 25%: un degradado
// CSS ahí se cae en la mitad de los clientes.
function correoComprobante(d) {
  const gris = "#5b6779";
  const tinta = "#16202e";
  const linea = "#e2e7f0";
  const fila = (rotulo, valor) => !valor ? "" :
    "<tr><td style=\"padding:6px 0;font-size:13px;color:" + gris + "\">" + escapar(rotulo) +
    "</td><td align=\"right\" style=\"padding:6px 0;font-size:13px;color:" + tinta +
    ";font-weight:600\">" + escapar(valor) + "</td></tr>";

  // el charset va explícito: sin él hay clientes que leen el UTF-8 como latin-1
  // y las tildes salen partidas
  return '<!doctype html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1"></head>' +
    '<body style="margin:0;padding:0;background:#f4f7fb">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" ' +
    'style="background:#f4f7fb;padding:28px 12px">' +
    '<tr><td align="center">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" ' +
    'style="max-width:544px;background:#ffffff;border:1px solid ' + linea + ';border-radius:14px">' +

    // la franja de la marca
    '<tr><td style="padding:0"><table role="presentation" width="100%" cellpadding="0" ' +
    'cellspacing="0"><tr>' +
    '<td width="25%" style="height:4px;line-height:4px;font-size:0;background:#4285F4">&nbsp;</td>' +
    '<td width="25%" style="height:4px;line-height:4px;font-size:0;background:#EA4335">&nbsp;</td>' +
    '<td width="25%" style="height:4px;line-height:4px;font-size:0;background:#FBBC05">&nbsp;</td>' +
    '<td width="25%" style="height:4px;line-height:4px;font-size:0;background:#34A853">&nbsp;</td>' +
    '</tr></table></td></tr>' +

    '<tr><td style="padding:30px 32px 8px;font-family:Helvetica,Arial,sans-serif">' +
    '<div style="font-size:11px;font-weight:700;letter-spacing:1.4px;color:' + gris +
    ';text-transform:uppercase">Comprobante de venta</div>' +
    '<div style="margin-top:8px;font-size:22px;font-weight:700;color:' + tinta +
    ';line-height:1.25">' + escapar(d.negocio) + '</div>' +
    '<p style="margin:14px 0 0;font-size:14px;line-height:1.6;color:' + gris + '">' +
    'Gracias por tu compra. Adjunto va el comprobante en PDF con el detalle de lo ' +
    'entregado.</p>' +
    '</td></tr>' +

    '<tr><td style="padding:20px 32px 0;font-family:Helvetica,Arial,sans-serif">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" ' +
    'style="background:#f8fafd;border:1px solid ' + linea + ';border-radius:10px">' +
    '<tr><td style="padding:14px 16px">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" ' +
    'style="font-family:Helvetica,Arial,sans-serif">' +
    fila("Fecha", d.fecha) +
    fila("Referencia", d.referencia) +
    (d.ahorro ? "<tr><td style=\"padding:6px 0;font-size:13px;color:#1e8e3e\">Te ahorras" +
      "</td><td align=\"right\" style=\"padding:6px 0;font-size:13px;color:#1e8e3e;" +
      "font-weight:600\">-" + escapar(d.ahorro) + "</td></tr>" : "") +
    '<tr><td colspan="2" style="padding:4px 0"><div style="border-top:1px solid ' + linea +
    '"></div></td></tr>' +
    '<tr><td style="padding:6px 0;font-size:14px;color:' + tinta + ';font-weight:600">Total</td>' +
    '<td align="right" style="padding:6px 0;font-size:18px;color:' + tinta +
    ';font-weight:700">' + escapar(d.total) + '</td></tr>' +
    '</table></td></tr></table></td></tr>' +

    '<tr><td style="padding:24px 32px 30px;font-family:Helvetica,Arial,sans-serif">' +
    '<p style="margin:0;font-size:14px;line-height:1.6;color:' + gris + '">' +
    'Cualquier duda, responde a este correo' +
    (d.telefonoVendedor ? ' o escríbenos al ' + escapar(d.telefonoVendedor) : '') + '.</p>' +
    '<div style="margin-top:22px;padding-top:18px;border-top:1px solid ' + linea + '">' +
    '<div style="font-size:14px;font-weight:600;color:' + tinta + '">' +
    escapar(d.vendedor) + '</div>' +
    '<div style="margin-top:3px;font-size:12px;color:' + gris + '">' +
    escapar(NOMBRE_REMITENTE) + ' · ' + escapar(CORREO_REMITENTE) + '</div>' +
    '<p style="margin:14px 0 0;font-size:11px;line-height:1.5;color:#8c95a5">' +
    'Este documento no es una factura de venta ni una factura electrónica. ' +
    'Es un comprobante comercial de la operación.</p>' +
    '</div></td></tr>' +

    '</table></td></tr></table></body></html>';
}

// Un comprobante enviado es un papel que ya está en manos del cliente: a partir
// de ahí la orden no se toca, ni el link, ni el NFC, ni el precio. Para volver a
// abrirla hay que borrar el comprobante a propósito.
async function ordenCerrada(env, negocio) {
  const nombre = String(negocio || "").trim();
  if (!nombre) return false;
  return Boolean(await env.TARJETAS.get("r:" + nombre));
}

function cerrada(negocio) {
  return json({ error: "Esa orden ya tiene comprobante enviado" +
    (negocio ? " (" + negocio + ")" : "") +
    ". Bórralo desde el cobro si de verdad hay que cambiarla." }, 409);
}

/* ---------- API ---------- */

async function api(request, env, accion, url, ctx) {
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

  if (accion === "modo" && request.method === "GET") {
    return json({ prueba: (await env.TARJETAS.get(LLAVE_MODO)) === "1" });
  }

  if (!sesionOk) return json({ error: "Sesión expirada o inexistente" }, 401);

  if (accion === "modo" && request.method === "POST") {
    const cuerpo = await request.json().catch(() => ({}));
    const prueba = Boolean(cuerpo.prueba);
    await env.TARJETAS.put(LLAVE_MODO, prueba ? "1" : "0");
    try { await caches.default.delete(new Request(LLAVE_CACHE_MODO)); } catch (e) {}
    return json({ ok: true, prueba: prueba });
  }

  if (accion === "lista" && request.method === "GET") {
    const { keys } = await env.TARJETAS.list({ prefix: "c:" });
    const tarjetas = keys.map((k) => Object.assign({ codigo: k.name.slice(2) }, k.metadata || {}));
    tarjetas.sort((a, b) => a.codigo.localeCompare(b.codigo));

    // El chip grabado es un hecho físico del plástico: sigue siendo verdad
    // aunque la tarjeta se reasigne o se desactive. Por eso vive en su propia
    // clave y no dentro del registro, donde cualquier escritura lo pisaría.
    const grabados = await env.TARJETAS.list({ prefix: "n:" });
    const nfc = grabados.keys.map((k) => k.name.slice(2));
    return json({ tarjetas, nfc });
  }

  if (accion === "nfc" && request.method === "POST") {
    const cuerpo = await request.json().catch(() => ({}));
    const codigo = normalizar(cuerpo.codigo);
    if (!codigo) return json({ error: "Código inválido" }, 400);

    const duena = await env.TARJETAS.get("c:" + codigo, "json");
    if (duena && await ordenCerrada(env, duena.negocio)) return cerrada(duena.negocio);

    if (cuerpo.listo) await env.TARJETAS.put("n:" + codigo, "1");
    else await env.TARJETAS.delete("n:" + codigo);
    return json({ ok: true, codigo: codigo, listo: Boolean(cuerpo.listo) });
  }

  if (accion === "guardar" && request.method === "POST") {
    const cuerpo = await request.json().catch(() => ({}));
    const codigo = normalizar(cuerpo.codigo);
    if (!codigo) return json({ error: "Código inválido: 3 a 12 letras o números" }, 400);
    // si no, quedaría una tarjeta impresa que nunca puede resolverse
    if (RESERVADAS.has(codigo.toLowerCase())) {
      return json({ error: "Ese código está reservado por el sistema" }, 400);
    }

    const hecho = registroDe(cuerpo);
    if (hecho.error) return json({ error: hecho.error }, 400);

    // dos puertas: ni se saca una tarjeta de una orden cerrada, ni se mete en ella
    const antes = await env.TARJETAS.get("c:" + codigo, "json");
    if (antes && await ordenCerrada(env, antes.negocio)) return cerrada(antes.negocio);
    if (await ordenCerrada(env, hecho.registro.negocio)) {
      return cerrada(hecho.registro.negocio);
    }

    await escribir(env, codigo, hecho.registro);
    return json(Object.assign({ ok: true, codigo }, hecho.registro));
  }

  // Un local que compra diez mesas quiere diez códigos distintos apuntando al
  // mismo sitio. Los códigos llegan ya calculados desde el panel, que es quien
  // sabe convertir número de tarjeta a código.
  if (accion === "rango" && request.method === "POST") {
    const cuerpo = await request.json().catch(() => ({}));
    const codigos = (Array.isArray(cuerpo.codigos) ? cuerpo.codigos : [])
      .map(normalizar)
      .filter((c) => c && !RESERVADAS.has(c.toLowerCase()));
    if (!codigos.length) return json({ error: "El rango no tiene códigos válidos" }, 400);
    if (codigos.length > MAX_RANGO) {
      return json({ error: "Máximo " + MAX_RANGO + " tarjetas por tanda" }, 400);
    }

    const hecho = registroDe(cuerpo);
    if (hecho.error) return json({ error: hecho.error }, 400);

    if (await ordenCerrada(env, hecho.registro.negocio)) {
      return cerrada(hecho.registro.negocio);
    }
    // de dónde salen las tarjetas lo sabe el panel, que manda el nombre; leer las
    // veinticinco aquí para comprobarlo se saldría del presupuesto de subpeticiones
    if (await ordenCerrada(env, cuerpo.desde)) return cerrada(cuerpo.desde);

    for (const codigo of codigos) await escribir(env, codigo, hecho.registro);
    return json({ ok: true, total: codigos.length });
  }

  // Desactivar, no borrar: la tarjeta existe en plástico y su código está
  // impreso. Se le quita el destino y vuelve a la lista como libre, lista para
  // reasignar. Borrar la clave la haría desaparecer del panel sin dejar de
  // existir en el mundo.
  if (accion === "gastos" && request.method === "GET") {
    const { keys } = await env.TARJETAS.list({ prefix: "g:" });
    const gastos = keys.map((k) => Object.assign({ id: k.name.slice(2) }, k.metadata || {}));
    gastos.sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));
    return json({ gastos });
  }

  if (accion === "gasto" && request.method === "POST") {
    const cuerpo = await request.json().catch(() => ({}));
    const hecho = gastoDe(cuerpo);
    if (hecho.error) return json({ error: hecho.error }, 400);

    const id = FORMATO_ID.test(String(cuerpo.id || ""))
      ? String(cuerpo.id)
      : Date.now().toString(36);
    await env.TARJETAS.put("g:" + id, JSON.stringify(hecho.gasto), { metadata: hecho.gasto });
    return json(Object.assign({ ok: true, id: id }, hecho.gasto));
  }

  if (accion === "servicios" && request.method === "GET") {
    const { keys } = await env.TARJETAS.list({ prefix: "s:" });
    const servicios = keys.map((k) => Object.assign({ id: k.name.slice(2) }, k.metadata || {}));
    servicios.sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));
    return json({ servicios });
  }

  if (accion === "servicio" && request.method === "POST") {
    const cuerpo = await request.json().catch(() => ({}));
    const hecho = servicioDe(cuerpo);
    if (hecho.error) return json({ error: hecho.error }, 400);
    if (await ordenCerrada(env, hecho.servicio.negocio)) {
      return cerrada(hecho.servicio.negocio);
    }

    const id = FORMATO_ID.test(String(cuerpo.id || ""))
      ? String(cuerpo.id)
      : Date.now().toString(36);
    await env.TARJETAS.put("s:" + id, JSON.stringify(hecho.servicio), { metadata: hecho.servicio });
    return json(Object.assign({ ok: true, id: id }, hecho.servicio));
  }

  if (accion === "servicio-borrar" && request.method === "POST") {
    const cuerpo = await request.json().catch(() => ({}));
    const id = String(cuerpo.id || "");
    if (!FORMATO_ID.test(id)) return json({ error: "Identificador inválido" }, 400);

    const antes = await env.TARJETAS.get("s:" + id, "json");
    if (antes && await ordenCerrada(env, antes.negocio)) return cerrada(antes.negocio);

    await env.TARJETAS.delete("s:" + id);
    return json({ ok: true });
  }

  if (accion === "comprobantes" && request.method === "GET") {
    const { keys } = await env.TARJETAS.list({ prefix: "r:" });
    const comprobantes = keys.map((k) =>
      Object.assign({ negocio: k.name.slice(2) }, k.metadata || {}));
    return json({ comprobantes });
  }

  // Hay clientes que no quieren papel —"la contabilidad no, gracias"— pero
  // pagaron igual. La orden se cierra lo mismo, solo que sin correo.
  if (accion === "comprobante-cerrar" && request.method === "POST") {
    const cuerpo = await request.json().catch(() => ({}));
    const negocio = String(cuerpo.negocio || "").trim().slice(0, 60);
    if (!negocio) return json({ error: "Falta el local" }, 400);

    const acta = {
      correo: "",
      sinEnviar: true,
      total: String(cuerpo.total || "").slice(0, 30),
      fecha: String(cuerpo.fecha || "").slice(0, 40),
      referencia: "",
      vendedor: String(cuerpo.vendedor || "").slice(0, 80),
      enviado: new Date().toISOString(),
    };
    await env.TARJETAS.put("r:" + negocio, JSON.stringify(acta), { metadata: acta });
    return json({ ok: true, negocio: negocio, comprobante: acta });
  }

  if (accion === "comprobante-borrar" && request.method === "POST") {
    const cuerpo = await request.json().catch(() => ({}));
    const negocio = String(cuerpo.negocio || "").trim();
    if (!negocio) return json({ error: "Falta el local" }, 400);
    await env.TARJETAS.delete("r:" + negocio);
    return json({ ok: true, negocio: negocio });
  }

  // El teléfono comparte "maps.app.goo.gl/xxxx", que no lleva dentro ningún
  // identificador: hay que seguirlo para llegar a la URL larga.
  if (accion === "resolver" && request.method === "POST") {
    const cuerpo = await request.json().catch(() => ({}));
    let destino;
    try { destino = new URL(String(cuerpo.url || "")); } catch (e) {
      return json({ error: "Esa no es una URL" }, 400);
    }
    if (destino.protocol !== "https:" && destino.protocol !== "http:") {
      return json({ error: "Solo http o https" }, 400);
    }
    if (!ACORTADORES.has(destino.hostname)) {
      return json({ error: "Solo sigo enlaces de Google Maps" }, 400);
    }

    try {
      const r = await fetch(destino.toString(), {
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 (Android 14; Mobile) Chrome/126" },
      });
      const largo = r.url || "";
      if (!largo || largo === destino.toString()) {
        return json({ error: "El enlace no llevó a ninguna parte" }, 502);
      }
      return json({ ok: true, url: largo });
    } catch (e) {
      return json({ error: "No se pudo abrir el enlace: " + e.message }, 502);
    }
  }

  if (accion === "ajustes" && request.method === "GET") {
    const guardado = await env.TARJETAS.get(LLAVE_VENDEDOR, "json");
    return json({ vendedores: mapaDeVendedores(guardado) });
  }

  if (accion === "ajustes" && request.method === "POST") {
    const cuerpo = await request.json().catch(() => ({}));
    const hecho = vendedorDe(cuerpo);
    if (hecho.error) return json({ error: hecho.error }, 400);

    const mapa = mapaDeVendedores(await env.TARJETAS.get(LLAVE_VENDEDOR, "json"));
    mapa[hecho.socio] = hecho.vendedor;
    await env.TARJETAS.put(LLAVE_VENDEDOR, JSON.stringify(mapa));
    return json({ ok: true, vendedores: mapa });
  }

  if (accion === "compradores" && request.method === "GET") {
    const { keys } = await env.TARJETAS.list({ prefix: "b:" });
    const compradores = keys.map((k) => Object.assign({ negocio: k.name.slice(2) }, k.metadata || {}));
    return json({ compradores });
  }

  if (accion === "comprador" && request.method === "POST") {
    const cuerpo = await request.json().catch(() => ({}));
    const hecho = compradorDe(cuerpo);
    if (hecho.error) return json({ error: hecho.error }, 400);
    const dato = {
      correo: hecho.comprador.correo,
      nit: hecho.comprador.nit,
      telefono: hecho.comprador.telefono,
    };
    await env.TARJETAS.put("b:" + hecho.comprador.negocio, JSON.stringify(dato),
      { metadata: dato });
    return json(Object.assign({ ok: true }, hecho.comprador));
  }

  if (accion === "comprobante" && request.method === "POST") {
    if (!env.BREVO_API_KEY) {
      return json({ error: "Falta el secreto BREVO_API_KEY para poder mandar correos" }, 500);
    }
    const cuerpo = await request.json().catch(() => ({}));
    const correo = String(cuerpo.correo || "").trim();
    if (!FORMATO_CORREO.test(correo)) return json({ error: "Ese correo no es válido" }, 400);

    const pdf = String(cuerpo.pdf || "");
    if (!pdf || pdf.length > MAX_PDF) return json({ error: "El PDF no llegó completo" }, 400);

    const negocio = String(cuerpo.negocio || "").trim().slice(0, 60) || "tu compra";
    const archivo = String(cuerpo.archivo || "comprobante.pdf").slice(0, 80);
    const total = String(cuerpo.total || "").slice(0, 30);
    const datos = {
      negocio: negocio,
      total: total,
      // "12 de septiembre de 2026" son 24: con 20 se comía el año
      fecha: String(cuerpo.fecha || "").slice(0, 40),
      referencia: String(cuerpo.referencia || "").slice(0, 30),
      ahorro: String(cuerpo.ahorro || "").slice(0, 30),
      vendedor: String(cuerpo.vendedor || "").slice(0, 80),
      telefonoVendedor: String(cuerpo.telefonoVendedor || "").slice(0, 30),
    };

    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": env.BREVO_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: { name: NOMBRE_REMITENTE, email: CORREO_REMITENTE },
        replyTo: { email: CORREO_REMITENTE },
        to: [{ email: correo }],
        subject: "Comprobante de venta · " + negocio,
        htmlContent: correoComprobante(datos),
        textContent: "Gracias por tu compra. Adjunto va el comprobante de venta" +
          (total ? " por " + total : "") + ".\n\n" +
          (datos.fecha ? "Fecha: " + datos.fecha + "\n" : "") +
          (datos.referencia ? "Referencia: " + datos.referencia + "\n" : "") +
          "\nCualquier duda, responde a este correo.\n\n" +
          datos.vendedor + "\n" + NOMBRE_REMITENTE + " · " + CORREO_REMITENTE + "\n\n" +
          "Este documento no es una factura de venta ni una factura electrónica.",
        attachment: [{ name: archivo, content: pdf }],
      }),
    });

    if (!r.ok) {
      const detalle = await r.text().catch(() => "");
      return json({ error: "El correo no salió (" + r.status + "). " + detalle.slice(0, 200) }, 502);
    }

    const acta = {
      correo: correo,
      total: total,
      fecha: datos.fecha,
      referencia: datos.referencia,
      vendedor: datos.vendedor,
      enviado: new Date().toISOString(),
    };
    await env.TARJETAS.put("r:" + negocio, JSON.stringify(acta), { metadata: acta });
    return json({ ok: true, correo: correo, negocio: negocio, comprobante: acta });
  }

  if (accion === "gasto-borrar" && request.method === "POST") {
    const cuerpo = await request.json().catch(() => ({}));
    const id = String(cuerpo.id || "");
    if (!FORMATO_ID.test(id)) return json({ error: "Identificador inválido" }, 400);
    await env.TARJETAS.delete("g:" + id);
    return json({ ok: true });
  }

  if (accion === "desactivar" && request.method === "POST") {
    const cuerpo = await request.json().catch(() => ({}));
    const codigos = (Array.isArray(cuerpo.codigos) ? cuerpo.codigos : [])
      .map(normalizar)
      .filter(Boolean);
    if (!codigos.length) return json({ error: "No hay códigos que desactivar" }, 400);
    if (codigos.length > MAX_RANGO) {
      return json({ error: "Máximo " + MAX_RANGO + " tarjetas por tanda" }, 400);
    }
    if (await ordenCerrada(env, cuerpo.desde)) return cerrada(cuerpo.desde);

    const registro = {
      destino: "",
      negocio: "",
      tipo: tipoValido(cuerpo.tipo),
      vendida: "",
      precio: 0,
      vendedor: "",
      actualizado: new Date().toISOString(),
    };
    for (const codigo of codigos) await escribir(env, codigo, registro);
    return json({ ok: true, total: codigos.length });
  }

  return json({ error: "Ruta no encontrada" }, 404);
}

/* ---------- modo pruebas ---------- */

// Se lee en cada visita, así que va por la misma caché del borde que las
// tarjetas: si no, cada escaneo gastaría una lectura de KV de más.
const LLAVE_CACHE_MODO = "https://tarjetas.interno/__modo";

async function enPruebas(env, ctx) {
  const cache = caches.default;
  const llave = new Request(LLAVE_CACHE_MODO);
  const guardada = await cache.match(llave);
  if (guardada) return (await guardada.text()) === "1";

  const valor = (await env.TARJETAS.get(LLAVE_MODO)) === "1";
  const copia = new Response(valor ? "1" : "0", {
    headers: { "Cache-Control": "max-age=" + CACHE_TARJETA },
  });
  if (ctx) ctx.waitUntil(cache.put(llave, copia.clone()));
  return valor;
}

/* ---------- lectura de tarjetas con caché de borde ---------- */

// Cada visita a una tarjeta era una lectura de KV, y el plan gratuito da 100.000
// al día: bastaría con que alguien martillara un código para dejar las tarjetas
// sin servicio hasta el día siguiente. Guardando el dato en la caché del borde,
// un aluvión sobre el mismo código se resuelve sin tocar KV.
//
// El minuto de vida es el precio: al reasignar una tarjeta, el destino viejo
// puede seguir vivo hasta 60 s en las regiones donde ya estaba cacheado. Al
// guardar se borra la copia de esta región, así que la prueba desde el panel se
// ve al instante.
const CACHE_TARJETA = 60;

function llaveCache(codigo) {
  return new Request("https://tarjetas.interno/" + codigo);
}

async function leerTarjeta(env, ctx, codigo) {
  const cache = caches.default;
  const llave = llaveCache(codigo);

  const guardada = await cache.match(llave);
  if (guardada) return guardada.json();

  const tarjeta = await env.TARJETAS.get("c:" + codigo, "json");
  // los códigos inexistentes no se cachean: si no, activar una tarjeta que
  // alguien ya intentó abrir tardaría un minuto en responder
  if (!tarjeta) return null;

  const copia = new Response(JSON.stringify(tarjeta), {
    headers: { "Cache-Control": "max-age=" + CACHE_TARJETA },
  });
  if (ctx) ctx.waitUntil(cache.put(llave, copia.clone()));
  return tarjeta;
}

async function olvidarTarjeta(codigo) {
  try { await caches.default.delete(llaveCache(codigo)); } catch (e) {}
}

/* ---------- sesión ---------- */

async function login(request, env, url) {
  const ip = request.headers.get("cf-connecting-ip") || "sin-ip";
  const llaveIntentos = "intentos:" + ip;
  const fallidos = parseInt((await env.TARJETAS.get(llaveIntentos)) || "0", 10);

  if (fallidos >= MAX_INTENTOS) {
    return json({ error: "Demasiados intentos fallidos. Bloqueado " + HORAS_BLOQUEO +
      " horas desde el último intento." }, 429);
  }

  const cuerpo = await request.json().catch(() => ({}));
  const clave = String(cuerpo.clave || "");

  if (!igualdadConstante(clave, env.ADMIN_PASSWORD)) {
    await env.TARJETAS.put(llaveIntentos, String(fallidos + 1), {
      expirationTtl: VENTANA_INTENTOS,
    });
    const quedan = MAX_INTENTOS - fallidos - 1;
    return json({ error: quedan
      ? "Contraseña incorrecta. Te queda" + (quedan === 1 ? "" : "n") + " " + quedan +
        " intento" + (quedan === 1 ? "" : "s") + " antes del bloqueo."
      : "Contraseña incorrecta. Bloqueado " + HORAS_BLOQUEO + " horas." }, 401);
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
