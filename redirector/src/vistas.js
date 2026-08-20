/**
 * Vistas HTML del redireccionador.
 *
 * Nota sobre el script del panel: va en un String.raw porque lleva expresiones
 * regulares. En un template literal normal, JavaScript se come las barras
 * invertidas (\d pasaría a ser d) y las rompería todas en silencio.
 * Por lo mismo, dentro de ese bloque no puede haber acentos graves ni ${...}.
 */

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const ESTILOS = `
  *{box-sizing:border-box}
  body{margin:0;padding:48px 20px;background:#f5f7fc;color:#1b2333;
    font-family:"Inter",system-ui,-apple-system,sans-serif;line-height:1.55}
  .caja{max-width:760px;margin:0 auto 20px;background:#fff;border:1px solid #e5e9f2;
    border-radius:20px;padding:28px;box-shadow:0 14px 34px -14px rgba(20,30,60,.22);
    position:relative;overflow:hidden}
  .caja.angosta{max-width:420px}
  .franja::before,.caja::before{content:"";position:absolute;top:0;left:0;right:0;height:5px;
    background:linear-gradient(90deg,#4285F4 0 25%,#EA4335 25% 50%,#FBBC05 50% 75%,#34A853 75% 100%)}
  h1{font-size:26px;margin:6px 0 10px;letter-spacing:-.02em}
  h2{font-size:16px;margin:0;letter-spacing:-.01em}
  p{color:#66718a;margin:0 0 14px}
  code,.mono{font-family:ui-monospace,"IBM Plex Mono",monospace}
  .codigo{display:inline-block;background:#f7f9fd;border:1px solid #e5e9f2;border-radius:10px;
    padding:6px 12px;font-size:18px;letter-spacing:.12em}
  label{display:block;font-weight:600;font-size:13px;margin:14px 0 6px}
  label span{font-weight:400;color:#66718a}
  input{width:100%;padding:11px 13px;border:1.5px solid #e5e9f2;border-radius:12px;
    background:#f7f9fd;font-family:ui-monospace,monospace;font-size:13px;color:#1b2333}
  input:focus{outline:none;border-color:#4285F4;box-shadow:0 0 0 4px rgba(66,133,244,.16)}
  input[readonly]{color:#66718a}
  button{border:none;border-radius:999px;padding:11px 22px;cursor:pointer;font-weight:600;
    font-size:14px;background:#4285F4;color:#fff;font-family:inherit;white-space:nowrap}
  button:hover{background:#1a68e5}
  button.gris{background:#fff;color:#66718a;border:1.5px solid #e5e9f2}
  button.gris:hover{background:#fafbff;color:#1b2333}
  .barra{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
  .fila{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap}
  table{width:100%;border-collapse:collapse;margin-top:16px;font-size:13px}
  th{text-align:left;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;
    color:#66718a;border-bottom:1px solid #e5e9f2;padding:8px 6px}
  td{padding:10px 6px;border-bottom:1px solid #f0f3f9;vertical-align:top;word-break:break-all}
  td:last-child{width:1%;white-space:nowrap}
  td button{padding:7px 12px;font-size:12.5px;margin-left:4px}
  .contador{font-family:ui-monospace,monospace;font-size:11px;color:#66718a;margin-top:10px}
  .aviso{margin-top:14px;padding:11px 13px;border-radius:12px;font-size:13px;display:none}
  .aviso.ok{display:block;background:#e9f7ee;color:#1c6b34}
  .aviso.mal{display:block;background:#fdecea;color:#a8261b}
  .ficha{margin-top:16px;padding:14px;border-radius:14px;background:#f7f9fd;
    border:1px solid #e5e9f2;font-size:13px}
  .ficha b{display:block;font-size:15px;margin-bottom:6px}
  .ficha .meta{font-family:ui-monospace,monospace;font-size:11px;color:#66718a;
    margin-top:8px;word-break:break-all}
  .opcion{display:flex;gap:9px;align-items:flex-start;font-weight:400;font-size:12.5px;
    color:#66718a;margin:0 0 8px;cursor:pointer}
  .opcion input{width:auto;margin-top:3px;flex:0 0 auto}
  .opcion b{display:inline;font-size:12.5px;color:#1b2333}

  /* ---- ventana del QR ---- */
  .modal{position:fixed;inset:0;z-index:50;display:flex;align-items:center;
    justify-content:center;padding:20px}
  .modal-fondo{position:absolute;inset:0;background:rgba(15,22,40,.55)}
  .modal-caja{position:relative;background:#fff;border-radius:20px;width:100%;max-width:540px;
    max-height:88vh;overflow:auto;padding:28px;
    box-shadow:0 30px 70px -20px rgba(15,22,40,.55)}
  .modal-cerrar{position:absolute;top:16px;right:16px;padding:0;width:32px;height:32px;
    border-radius:50%;background:#f0f3f9;color:#66718a;font-size:15px;line-height:1}
  .modal-cerrar:hover{background:#e2e7f2;color:#1b2333}

  /* el damero indica que el PNG es transparente */
  .qr-pair{display:flex;gap:18px;flex-wrap:wrap;justify-content:center;margin-top:18px}
  .qr-tile{margin:0;flex:0 0 auto;text-align:center}
  .qr-art{display:inline-block;line-height:0;border:1px solid #e5e9f2;border-radius:14px;
    padding:10px;background-color:#fff;
    background-image:linear-gradient(45deg,#eaeef6 25%,transparent 25%,transparent 75%,#eaeef6 75%),
                     linear-gradient(45deg,#eaeef6 25%,transparent 25%,transparent 75%,#eaeef6 75%);
    background-size:16px 16px;background-position:0 0,8px 8px}
  .qr-tile.inv .qr-art{border-color:#2b3140;background-color:#151922;
    background-image:linear-gradient(45deg,#222834 25%,transparent 25%,transparent 75%,#222834 75%),
                     linear-gradient(45deg,#222834 25%,transparent 25%,transparent 75%,#222834 75%)}
  .qr-art img{width:150px;height:150px;display:block}
  .qr-tile figcaption{font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.08em;
    text-transform:uppercase;color:#66718a;margin-top:9px}
  .qr-dl{display:inline-block;margin-top:8px;font-family:ui-monospace,monospace;font-size:10px;
    letter-spacing:.06em;text-transform:uppercase;color:#4285F4;text-decoration:none;
    border:1.5px solid #e5e9f2;border-radius:999px;padding:5px 13px}
  .qr-dl:hover{border-color:#4285F4;background:#f1f6ff}
  .qr-url{text-align:center;font-family:ui-monospace,monospace;font-size:12px;
    color:#1b2333;background:#f7f9fd;border:1px solid #e5e9f2;border-radius:10px;
    padding:8px 12px;display:inline-block;word-break:break-all}
  [hidden]{display:none !important}
`;

export function vistaInicio(host) {
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

export function vistaSinConfigurar(codigo) {
  return `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tarjeta sin configurar</title><style>${ESTILOS}</style>
<div class="caja">
  <h1>Esta tarjeta todavía no está activada</h1>
  <p>El código <span class="codigo">${esc(codigo)}</span> aún no tiene un negocio asignado.</p>
  <p>Si acabas de recibir la tarjeta, avísanos y la activamos en un minuto.</p>
</div>`;
}

const SCRIPT_PANEL = String.raw`
const $ = (id) => document.getElementById(id);
let TARJETAS = [];
let focoPrevio = null;
let URL_WEB = "";
let URL_APP = "";

function aplicarFormato() {
  const usarApp = document.querySelector("input[name=formato]:checked").value === "app";
  $("fichaReview").value = usarApp && URL_APP ? URL_APP : URL_WEB;
  $("ficha").hidden = false;
}

function escHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function avisar(caja, texto, ok) {
  const a = $(caja);
  a.textContent = texto;
  a.className = "aviso " + (ok ? "ok" : "mal");
}

function limpiarAviso(caja) { $(caja).className = "aviso"; }

/* ---------- sesión ---------- */
// la cookie es HttpOnly: este script nunca la ve, solo la manda el navegador
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
  if (dentro) listar(); else { cerrarQR(); $("clave").focus(); }
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
    limpiarAviso("avisoLogin");
    mostrar(true);
  } catch (err) {
    avisar("avisoLogin", err.message, false);
  }
};

$("salir").onclick = async () => {
  await llamar("salir", { method: "POST" }).catch(() => {});
  mostrar(false);
};

/* ---------- lectura de la URL de Google Maps ---------- */

// El Place ID de Google es un protobuf corto en base64url:
//   0A 12 09 <cell id little endian> 11 <feature id little endian>
// El prefijo "ChIJ" que todos reconocen es la codificación de esos tres bytes.
// Derivarlo del hexadecimal nos deja armar el link de reseña que funciona en la
// web, sin depender de que el celular le pase el link a la app de Maps.
function ftidAPlaceId(ftid) {
  const partes = ftid.split(":");
  const bytes = [0x0a, 0x12, 0x09];
  const meter = (hex) => {
    let v = BigInt(hex);
    for (let i = 0; i < 8; i++) { bytes.push(Number(v & 255n)); v >>= 8n; }
  };
  meter(partes[0]);
  bytes.push(0x11);
  meter(partes[1]);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function analizarMaps(crudo) {
  const url = String(crudo || "").trim();
  if (!url) return { error: "Pega la URL de Google Maps del negocio." };

  if (/maps\.app\.goo\.gl|goo\.gl\/maps/i.test(url)) {
    return { error: "Es un link corto. Ábrelo en el navegador, espera a que cargue el mapa y copia la URL larga de la barra de direcciones." };
  }

  let negocio = "";
  const nm = url.match(/\/maps\/place\/([^/@?]+)/);
  if (nm && nm[1]) {
    try { negocio = decodeURIComponent(nm[1].replace(/\+/g, " ")).trim(); } catch (e) {}
  }

  // identificador hexadecimal: !1s0xAAAA:0xBBBB  o  ftid=0xAAAA:0xBBBB
  const ft = url.match(/(?:!1s|ftid=)(0x[0-9a-f]+:0x[0-9a-f]+)/i);
  if (ft) {
    const ftid = ft[1].toLowerCase();
    let cid = "";
    try { cid = BigInt(ftid.split(":")[1]).toString(); } catch (e) {}
    let placeId = "";
    try { placeId = ftidAPlaceId(ftid); } catch (e) {}
    if (!placeId) {
      return { error: "No se pudo derivar el Place ID de esa URL. Prueba con otra URL del mismo negocio." };
    }
    return {
      negocio: negocio,
      ftid: ftid,
      cid: cid,
      placeId: placeId,
      // web pura: no necesita la app, pero pide sesión de Google en ese navegador
      review: "https://search.google.com/local/writereview?placeid=" + placeId,
      // abre el cuadro de calificación dentro de la app de Maps, que ya tiene sesión.
      // iOS solo le pasa el link a la app si el usuario lo toca: en una redirección
      // de servidor no dispara el Universal Link y se queda en la web móvil.
      reviewApp: "https://www.google.com/maps/place//data=!4m3!3m2!1s" + ftid + "!12e1",
    };
  }

  const cd = url.match(/(?:[?&](?:lu)?cid=)(\d{5,})/i);
  if (cd) {
    return { error: "Esa URL solo trae el CID, no el identificador completo. Abre la ficha del negocio en Google Maps y copia la URL larga de la barra de direcciones." };
  }

  const pid = url.match(/\b(ChI[0-9A-Za-z_-]{10,})\b/);
  if (pid) {
    return {
      negocio: negocio,
      review: "https://search.google.com/local/writereview?placeid=" + pid[1],
    };
  }

  return { error: "No se encontró el identificador del negocio en esa URL. Abre su ficha en Google Maps (clic en el nombre del lugar) y copia la URL completa." };
}

$("analizar").onclick = () => {
  const r = analizarMaps($("maps").value);
  if (r.error) {
    $("ficha").hidden = true;
    avisar("aviso", r.error, false);
    return;
  }
  limpiarAviso("aviso");
  $("fichaNombre").textContent = r.negocio || "Negocio sin nombre en la URL";
  URL_WEB = r.review;
  URL_APP = r.reviewApp || "";
  $("elegirFormato").hidden = !URL_APP;
  aplicarFormato();
  const bits = [];
  if (r.placeId) bits.push("Place ID: " + r.placeId);
  if (r.ftid) bits.push("ID: " + r.ftid);
  if (r.cid) bits.push("CID: " + r.cid);
  $("fichaMeta").textContent = bits.join("  ·  ");
  $("ficha").hidden = false;
  if (!$("negocio").value.trim() && r.negocio) $("negocio").value = r.negocio;
};

/* ---------- alta de tarjetas ---------- */

$("guardar").onclick = async () => {
  const destino = $("fichaReview").value.trim();
  if (!destino) {
    avisar("aviso", "Primero pega la URL de Google Maps y dale a Leer la URL.", false);
    return;
  }
  try {
    const datos = await llamar("guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo: $("codigo").value,
        negocio: $("negocio").value,
        destino: destino,
      }),
    });
    avisar("aviso", "Tarjeta " + datos.codigo + " activada", true);
    $("codigo").value = $("negocio").value = $("maps").value = "";
    $("ficha").hidden = true;
    await listar();
    abrirQR(datos.codigo);
  } catch (e) {
    avisar("aviso", e.message, false);
  }
};

/* ---------- listado y buscador ---------- */

function sinTildes(s) {
  return String(s == null ? "" : s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function listar() {
  try {
    const datos = await llamar("lista");
    TARJETAS = datos.tarjetas;
    pintarTabla();
  } catch (e) {
    avisar("aviso", e.message, false);
  }
}

function pintarTabla() {
  const busca = sinTildes($("buscar").value.trim());
  const lista = busca
    ? TARJETAS.filter((t) => sinTildes(t.codigo).includes(busca) || sinTildes(t.negocio).includes(busca))
    : TARJETAS;

  if (!TARJETAS.length) {
    $("tabla").innerHTML = "<p style='margin-top:18px'>Todavía no hay tarjetas activadas.</p>";
    $("contador").textContent = "";
    return;
  }

  if (!lista.length) {
    $("tabla").innerHTML = "<p style='margin-top:18px'>Ninguna tarjeta coincide con esa búsqueda.</p>";
    $("contador").textContent = "0 de " + TARJETAS.length;
    return;
  }

  let filas = "";
  lista.forEach((t) => {
    const c = escHtml(t.codigo);
    // el formato viejo depende de que el celular le pase el link a la app de Maps
    const viejo = /\/maps\/place\/\/data=/.test(t.destino || "");
    const marca = viejo
      ? "<br><span style='color:#a8261b;font-size:10.5px'>formato app · en iPhone puede quedarse en la ficha</span>"
      : "";
    filas +=
      "<tr><td class='mono'><b>" + c + "</b><br><span style='color:#66718a'>" +
      escHtml(HOST) + "/" + c + "</span></td><td>" + (escHtml(t.negocio) || "—") +
      "</td><td class='mono' style='font-size:11px'>" + escHtml(t.destino) + marca +
      "</td><td><button class='gris' data-qr='" + c + "'>QR</button>" +
      "<button class='gris' data-borrar='" + c + "'>Borrar</button></td></tr>";
  });
  $("tabla").innerHTML =
    "<table><thead><tr><th>Código</th><th>Negocio</th><th>Destino</th><th></th></tr></thead><tbody>" +
    filas + "</tbody></table>";
  $("contador").textContent = busca
    ? lista.length + " de " + TARJETAS.length
    : TARJETAS.length + (TARJETAS.length === 1 ? " tarjeta" : " tarjetas");
}

document.querySelectorAll("input[name=formato]").forEach((r) => {
  r.addEventListener("change", aplicarFormato);
});

$("buscar").addEventListener("input", pintarTabla);
$("limpiarBusca").onclick = () => { $("buscar").value = ""; pintarTabla(); $("buscar").focus(); };
$("recargar").onclick = () => listar();

$("tabla").addEventListener("click", async (e) => {
  const q = e.target.closest("[data-qr]");
  if (q) { abrirQR(q.dataset.qr); return; }

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
    cerrarQR();
    listar();
  } catch (err) {
    avisar("aviso", err.message, false);
  }
});

/* ---------- QR de la tarjeta ---------- */

// Solo estos caracteres caben en el modo alfanumérico del estándar QR, que es
// bastante más compacto que el modo byte. Por eso la URL va en MAYÚSCULAS.
const ALFANUM = /^[0-9A-Z $%*+\-./:]+$/;

function qrPng(texto, color, cell, quiet) {
  const modo = ALFANUM.test(texto) ? "Alphanumeric" : "Byte";
  const t = qrcode(0, "M");
  t.addData(texto, modo);
  t.make();
  const n = t.getModuleCount();
  const c = document.createElement("canvas");
  c.width = c.height = (n + quiet * 2) * cell;   // el canvas nace transparente
  const x = c.getContext("2d");
  x.fillStyle = color;                           // solo se pintan los módulos
  for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) {
    if (t.isDark(r, k)) x.fillRect((k + quiet) * cell, (r + quiet) * cell, cell, cell);
  }
  return { src: c.toDataURL("image/png"), modulos: n, modo: modo };
}

function tile(mod, src, pie, archivo) {
  return "<figure class='qr-tile " + mod + "'>" +
    "<div class='qr-art'><img src='" + src + "' alt='" + pie + "'></div>" +
    "<figcaption>" + pie + "</figcaption><br>" +
    "<a class='qr-dl' href='" + src + "' download='" + archivo + "'>Descargar PNG</a>" +
    "</figure>";
}

function abrirQR(codigo) {
  const url = (ORIGEN + "/" + codigo).toUpperCase();
  $("qrTitulo").textContent = "QR de la tarjeta " + codigo;
  $("qrUrl").textContent = url;

  if (typeof qrcode === "undefined") {
    $("qrPar").innerHTML = "<p>No se pudo cargar el generador de QR. Revisa tu conexión y recarga la página.</p>";
    $("qrDato").textContent = "";
  } else {
    const negro = qrPng(url, "#000000", 10, 4);
    const blanco = qrPng(url, "#ffffff", 10, 4);
    $("qrPar").innerHTML =
      tile("", negro.src, "Negro · PNG transparente", codigo + "-qr-negro.png") +
      tile("inv", blanco.src, "Blanco · PNG transparente", codigo + "-qr-blanco.png");
    $("qrDato").textContent =
      negro.modulos + "×" + negro.modulos + " módulos · modo " + negro.modo + " · corrección M";
  }

  focoPrevio = document.activeElement;
  $("modalQR").hidden = false;
  document.body.style.overflow = "hidden";
  $("cerrarQR").focus();
}

function cerrarQR() {
  if ($("modalQR").hidden) return;
  $("modalQR").hidden = true;
  document.body.style.overflow = "";
  if (focoPrevio && focoPrevio.focus) focoPrevio.focus();
  focoPrevio = null;
}

$("cerrarQR").onclick = cerrarQR;
$("modalQR").addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-cerrar")) cerrarQR();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarQR();
});

llamar("sesion").then((s) => mostrar(s.activa)).catch(() => mostrar(false));
`;

export function vistaAdmin(origen) {
  const host = origen.replace(/^https?:\/\//, "");
  return `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Panel de tarjetas</title><style>${ESTILOS}</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>

<div class="caja angosta" id="pantallaLogin" hidden>
  <h1>Entrar</h1>
  <p>Panel de tarjetas de reseña.</p>
  <form id="formLogin">
    <label for="clave">Contraseña</label>
    <input id="clave" type="password" autocomplete="current-password" autofocus>
    <div class="fila"><button type="submit">Entrar</button></div>
  </form>
  <div class="aviso" id="avisoLogin"></div>
</div>

<div id="pantallaPanel" hidden>
  <div class="caja">
    <div class="barra">
      <h1 style="margin:0">Activar una tarjeta</h1>
      <button class="gris" id="salir">Cerrar sesión</button>
    </div>

    <label for="codigo">Código impreso en la tarjeta</label>
    <input id="codigo" placeholder="A7K2" autocomplete="off">

    <label for="maps">URL de Google Maps del negocio
      <span>— o un link de reseña ya generado</span></label>
    <input id="maps" placeholder="https://www.google.com/maps/place/Mercacentro+No.+4+Av.+Guabinal/@4.4416918,-75.2070794,16z/data=..." autocomplete="off">

    <div class="fila"><button class="gris" id="analizar">Leer la URL</button></div>

    <div class="ficha" id="ficha" hidden>
      <b id="fichaNombre"></b>

      <div id="elegirFormato" hidden>
        <label style="margin-top:4px">A dónde manda la tarjeta</label>
        <label class="opcion"><input type="radio" name="formato" value="web" checked>
          <span><b>Web de Google.</b> No necesita la app instalada, pero pide sesión
          de Google en ese navegador.</span></label>
        <label class="opcion"><input type="radio" name="formato" value="app">
          <span><b>App de Google Maps.</b> Más directo si la app está instalada y ya
          tiene sesión. En iPhone puede quedarse en la web, porque iOS no le pasa a
          la app los links a los que llega por redirección.</span></label>
      </div>

      <label for="fichaReview">Link de reseña que va a quedar en la tarjeta</label>
      <input id="fichaReview" readonly>
      <div class="meta" id="fichaMeta"></div>
    </div>

    <label for="negocio">Negocio <span>— solo para tu referencia</span></label>
    <input id="negocio" placeholder="Mercacentro Av. Guabinal" autocomplete="off">

    <div class="fila"><button id="guardar">Guardar tarjeta</button></div>

    <div class="aviso" id="aviso"></div>
  </div>

  <div class="caja">
    <div class="barra">
      <h2>Tarjetas activadas</h2>
      <button class="gris" id="recargar">Refrescar</button>
    </div>

    <label for="buscar">Buscar <span>— por código o por negocio</span></label>
    <div style="display:flex;gap:10px">
      <input id="buscar" placeholder="A7K2, panadería…" autocomplete="off">
      <button class="gris" id="limpiarBusca">Limpiar</button>
    </div>

    <div id="tabla"></div>
    <div class="contador" id="contador"></div>
  </div>
</div>

<div class="modal" id="modalQR" hidden>
  <div class="modal-fondo" data-cerrar></div>
  <div class="modal-caja franja" role="dialog" aria-modal="true" aria-labelledby="qrTitulo">
    <button class="modal-cerrar" id="cerrarQR" aria-label="Cerrar">✕</button>
    <h1 id="qrTitulo" style="margin:6px 0 6px;font-size:22px">QR de la tarjeta</h1>
    <p style="margin:0 0 14px">Esto es lo que va impreso en el plástico, no el link de Google.</p>
    <div style="text-align:center"><span class="qr-url" id="qrUrl"></span></div>
    <div class="qr-pair" id="qrPar"></div>
    <p class="mono" style="text-align:center;font-size:11px;margin:16px 0 0" id="qrDato"></p>
  </div>
</div>

<script>
const ORIGEN = ${JSON.stringify(origen)};
const HOST = ${JSON.stringify(host)};
</script>
<script>${SCRIPT_PANEL}</script>`;
}
