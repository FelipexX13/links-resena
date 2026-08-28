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
  button.accion{border:0;color:#fff;transition:transform .12s ease,box-shadow .18s ease}
  button.accion:hover{transform:translateY(-1px);box-shadow:0 5px 12px -7px rgba(20,30,60,.55)}
  button.accion-editar{background:#4285F4}
  button.accion-editar:hover{background:#1a73e8}
  button.accion-ver{background:#FBBC05;color:#5f4500}
  button.accion-ver:hover{background:#f2ad00;color:#473500}
  button.accion-qr{background:#34A853}
  button.accion-qr:hover{background:#2d9247}
  button.accion-borrar{background:#EA4335;color:#fff}
  button.accion-borrar:hover{background:#d93025}
  .barra{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
  .fila{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap}
  table{width:100%;border-collapse:collapse;margin-top:16px;font-size:13px}
  th{text-align:left;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;
    color:#66718a;border-bottom:1px solid #e5e9f2;padding:8px 6px}
  td{padding:10px 6px;border-bottom:1px solid #f0f3f9;vertical-align:top;overflow-wrap:anywhere}
  td:last-child{width:1%;white-space:nowrap}
  td button{padding:7px 12px;font-size:12.5px;margin-left:0}
  .acciones{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;min-width:132px}
  .acciones .accion{width:100%;padding-left:8px;padding-right:8px}
  .paginacion{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:16px}
  .paginas{display:flex;align-items:center;justify-content:center;gap:5px;flex-wrap:wrap}
  button.pagina{min-width:34px;padding:7px 10px;font-size:12px;background:#fff;color:#66718a;border:1.5px solid #e5e9f2}
  button.pagina:hover:not(:disabled){background:#f1f6ff;color:#1a73e8;border-color:#4285F4}
  button.pagina.activa{background:#4285F4;color:#fff;border-color:#4285F4}
  button.pagina:disabled{opacity:.45;cursor:not-allowed}
  .contador{font-family:ui-monospace,monospace;font-size:11px;color:#66718a;margin-top:10px}
  .aviso{margin-top:14px;padding:11px 13px;border-radius:12px;font-size:13px;display:none}
  .aviso.ok{display:block;background:#e9f7ee;color:#1c6b34}
  .aviso.mal{display:block;background:#fdecea;color:#a8261b}
  .ficha{margin-top:16px;padding:14px;border-radius:14px;background:#f7f9fd;
    border:1px solid #e5e9f2;font-size:13px}
  .ficha b{display:block;font-size:15px;margin-bottom:6px}
  .ficha .meta{font-family:ui-monospace,monospace;font-size:11px;color:#66718a;
    margin-top:8px;word-break:break-all}
  .activador{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
  .activador-copy{max-width:520px}
  .activador-copy h1{margin-bottom:5px}
  .activador-copy p{margin-bottom:0}

  .ayuda{font-size:11.5px;line-height:1.5;color:#66718a;margin:9px 0 0}
  .ayuda a{color:#4285F4}
  .ayuda code{background:#f0f3f9;border-radius:5px;padding:1px 5px;font-size:11px}

  /* ---- ventanas modales ---- */
  .modal{position:fixed;inset:0;z-index:50;display:flex;align-items:center;
    justify-content:center;padding:20px}
  .modal-fondo{position:absolute;inset:0;background:rgba(15,22,40,.55)}
  .modal-caja{position:relative;background:#fff;border-radius:20px;width:100%;max-width:540px;
    max-height:88vh;overflow:auto;padding:28px;
    box-shadow:0 30px 70px -20px rgba(15,22,40,.55)}
  .qr-negocio{text-align:center;font-size:clamp(30px,6vw,42px);line-height:1.08;
    letter-spacing:-.035em;margin:4px 34px 6px;color:#1b2333;overflow-wrap:anywhere}
  .qr-titulo{text-align:center;font-family:ui-monospace,monospace;font-size:11px;
    letter-spacing:.12em;text-transform:uppercase;color:#66718a;margin:0 0 14px}
  .modal-cerrar{position:absolute;top:16px;right:16px;padding:0;width:32px;height:32px;
    border-radius:50%;background:#f0f3f9;color:#66718a;font-size:15px;line-height:1}
  .modal-cerrar:hover{background:#e2e7f2;color:#1b2333}
  .modal-tarjeta{max-width:680px}
  .modal-tarjeta h1{margin-top:2px;margin-bottom:5px}
  .modal-tarjeta .modal-subtitulo{margin-bottom:18px}
  .modal-kicker{text-transform:uppercase;font-family:ui-monospace,monospace;font-size:10px;
    letter-spacing:.12em;color:#66718a;margin-bottom:7px}
  .modal-acciones{justify-content:flex-end}

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
  .nfc{margin-top:20px;padding-top:16px;border-top:1px solid #e5e9f2;text-align:center}
  .nfc b{display:block;font-size:11px;letter-spacing:.1em;text-transform:uppercase;
    color:#66718a;margin-bottom:9px}
  .nfc .qr-url{font-size:11.5px}
  .nfc button{margin-top:10px}
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
let focoTarjeta = null;
let NOMBRE_AUTO = "";
let EDITANDO_CODIGO = "";
let PAGINA = 1;
const POR_PAGINA = 10;

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
  if (dentro) listar(); else { cerrarQR(); cerrarTarjeta(); $("clave").focus(); }
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

// El destino de la tarjeta es search.google.com/local/writereview?placeid=…, y
// ese parámetro pide el Place ID ("ChIJ…"). La URL de Google Maps no lo trae:
// lleva el identificador hexadecimal del lugar (!1s0xCELDA:0xLUGAR). Pero uno es
// el otro escrito distinto, así que el panel lo convierte solo y no hay que ir al
// buscador de Place ID por cada negocio.
//
// El Place ID es ese par de números dentro de un protobuf mínimo, en base64url:
//   0x0A  campo 1, tipo bytes
//   0x12  longitud 18
//   0x09  campo 1, entero fijo de 64 bits  → celda, little-endian
//   0x11  campo 2, entero fijo de 64 bits  → lugar, little-endian
// De ahí viene que todos empiecen por "ChIJ": es la base64 de esos tres primeros
// bytes, que son siempre los mismos.
function bytesLE(hex) {
  const salida = [];
  let v = BigInt(hex);
  for (let i = 0; i < 8; i++) { salida.push(Number(v & 0xffn)); v >>= 8n; }
  return salida;
}

function placeIdDesdeFtid(ftid) {
  const mitades = ftid.split(":");
  const bytes = [0x0a, 0x12, 0x09].concat(bytesLE(mitades[0]), [0x11], bytesLE(mitades[1]));
  let crudo = "";
  for (let i = 0; i < bytes.length; i++) crudo += String.fromCharCode(bytes[i]);
  return btoa(crudo).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function linkResena(placeId) {
  return "https://search.google.com/local/writereview?placeid=" + placeId;
}

function analizarMaps(crudo) {
  const url = String(crudo || "").trim();
  if (!url) return { error: "Pega la URL de Google Maps del negocio, o su Place ID." };

  let negocio = "";
  const nm = url.match(/\/maps\/place\/([^/@?]+)/);
  if (nm && nm[1]) {
    try { negocio = decodeURIComponent(nm[1].replace(/\+/g, " ")).trim(); } catch (e) {}
  }

  // 1 · el Place ID ya viene dado: un link de reseña hecho antes, una URL que lo
  //     lleva como parámetro, o el identificador pegado tal cual del buscador
  const dado = url.match(/[?&#](?:placeid|place_id)=([A-Za-z0-9_-]{15,})/i) ||
               url.match(/place_id[:=]([A-Za-z0-9_-]{15,})/i) ||
               url.match(/!1s(Ch[A-Za-z0-9_-]{15,})/) ||
               url.match(/^([A-Za-z0-9_-]{15,})$/);
  if (dado) {
    return { negocio: negocio, placeId: dado[1], review: linkResena(dado[1]) };
  }

  if (/maps\.app\.goo\.gl|goo\.gl\/maps/i.test(url)) {
    return { error: "Es un link corto. Ábrelo en el navegador, espera a que cargue el mapa y copia la URL larga de la barra de direcciones." };
  }

  // 2 · identificador hexadecimal: !1s0xAAAA:0xBBBB  o  ftid=0xAAAA:0xBBBB
  const ft = url.match(/(?:!1s|ftid=)(0x[0-9a-f]+:0x[0-9a-f]+)/i);
  if (ft) {
    const ftid = ft[1].toLowerCase();
    let placeId = "";
    try { placeId = placeIdDesdeFtid(ftid); } catch (e) {}
    if (!placeId) {
      return { error: "No se pudo convertir el identificador de esa URL. Busca el negocio en el buscador de Place ID y pega aquí el ChIJ… que te dé." };
    }
    return { negocio: negocio, ftid: ftid, placeId: placeId, review: linkResena(placeId) };
  }

  const cd = url.match(/(?:[?&](?:lu)?cid=)(\d{5,})/i);
  if (cd) {
    return { error: "Esa URL solo trae el CID, no el identificador completo. Abre la ficha del negocio en Google Maps y copia la URL larga, o pega su Place ID." };
  }

  return { error: "No se encontró el identificador del negocio en esa URL. Abre su ficha en Google Maps (clic en el nombre del lugar) y copia la URL completa, o pega el Place ID del buscador." };
}

$("analizar").onclick = () => {
  const r = analizarMaps($("maps").value);
  if (r.error) {
    $("ficha").hidden = true;
    avisar("aviso", r.error, false);
    return;
  }
  limpiarAviso("aviso");
  $("fichaNombre").textContent = r.negocio || "Escribe abajo el nombre del negocio";
  $("fichaReview").value = r.review;
  const bits = [];
  if (r.placeId) bits.push("Place ID: " + r.placeId);
  if (r.ftid) bits.push("ID de Maps: " + r.ftid);
  $("fichaMeta").textContent = bits.join("  ·  ");
  $("ficha").hidden = false;

  // al editar, el campo viene con el nombre anterior: si esta URL es de otro
  // local hay que actualizarlo, pero sin pisar un nombre escrito a mano
  const actual = $("negocio").value.trim();
  if (r.negocio && (!actual || actual === NOMBRE_AUTO)) {
    $("negocio").value = r.negocio;
    NOMBRE_AUTO = r.negocio;
  }
};

/* ---------- alta de tarjetas ---------- */

$("formTarjeta").onsubmit = async (e) => {
  e.preventDefault();
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
    const editaba = Boolean(EDITANDO_CODIGO);
    cerrarTarjeta();
    avisar("avisoPanel", "Tarjeta " + datos.codigo + (editaba ? " actualizada" : " activada"), true);
    await listar();
    abrirQR(datos.codigo);
  } catch (e) {
    avisar("aviso", e.message, false);
  }
};

/* ---------- edición de una tarjeta existente ---------- */

function editar(codigo) {
  const t = TARJETAS.filter((x) => x.codigo === codigo)[0];
  if (!t) return;

  EDITANDO_CODIGO = t.codigo;
  $("codigo").value = t.codigo;
  $("negocio").value = t.negocio || "";
  NOMBRE_AUTO = t.negocio || "";   // lo puso el panel, no la persona
  $("maps").value = "";
  $("fichaNombre").textContent = t.negocio || t.codigo;
  $("fichaMeta").textContent = "";
  $("fichaReview").value = t.destino;
  $("ficha").hidden = false;

  $("tarjetaModalKicker").textContent = "Editar tarjeta " + t.codigo;
  $("tarjetaModalTitulo").textContent = "Editar configuración";
  $("tarjetaModalSubtitulo").textContent = "Cambia el negocio o el link de reseña al que apunta esta tarjeta.";
  $("guardar").textContent = "Guardar cambios";
  limpiarAviso("aviso");
  abrirTarjetaModal();
}

function salirDeEdicion() {
  EDITANDO_CODIGO = "";
  $("codigo").value = $("negocio").value = $("maps").value = "";
  $("ficha").hidden = true;
  $("fichaReview").value = "";
  NOMBRE_AUTO = "";
}

function prepararNuevaTarjeta() {
  salirDeEdicion();
  $("tarjetaModalKicker").textContent = "Nueva tarjeta";
  $("tarjetaModalTitulo").textContent = "Activar una tarjeta";
  $("tarjetaModalSubtitulo").textContent = "Apunta el código impreso al link de reseña de un negocio.";
  $("guardar").textContent = "Activar tarjeta";
  limpiarAviso("aviso");
  abrirTarjetaModal();
}

function abrirTarjetaModal() {
  focoTarjeta = document.activeElement;
  $("modalTarjeta").hidden = false;
  document.body.style.overflow = "hidden";
  $("codigo").focus();
}

function cerrarTarjeta() {
  if ($("modalTarjeta").hidden) return;
  $("modalTarjeta").hidden = true;
  document.body.style.overflow = $("modalQR").hidden ? "" : "hidden";
  if (focoTarjeta && focoTarjeta.focus) focoTarjeta.focus();
  focoTarjeta = null;
  salirDeEdicion();
  limpiarAviso("aviso");
}

$("abrirActivar").onclick = prepararNuevaTarjeta;
$("cerrarTarjeta").onclick = cerrarTarjeta;
$("cancelarTarjeta").onclick = cerrarTarjeta;
$("modalTarjeta").addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-cerrar-tarjeta")) cerrarTarjeta();
});

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
    avisar("avisoPanel", e.message, false);
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

  const totalPaginas = Math.ceil(lista.length / POR_PAGINA);
  if (PAGINA > totalPaginas) PAGINA = totalPaginas;
  const inicio = (PAGINA - 1) * POR_PAGINA;
  const fin = Math.min(inicio + POR_PAGINA, lista.length);
  const visibles = lista.slice(inicio, fin);

  let filas = "";
  visibles.forEach((t) => {
    const c = escHtml(t.codigo);
    filas +=
      "<tr><td class='mono'><b>" + c + "</b><br><span style='color:#66718a'>" +
      escHtml(HOST) + "/" + c + "</span></td><td>" + (escHtml(t.negocio) || "—") +
      "</td><td class='mono' style='font-size:11px'>" + escHtml(t.destino) +
      "</td><td><div class='acciones'>" +
      "<button type='button' class='accion accion-qr' data-qr='" + c + "'>QR</button>" +
      "<button type='button' class='accion accion-editar' data-editar='" + c + "'>Editar</button>" +
      "<button type='button' class='accion accion-ver' data-ver='" + c + "'>Ver</button>" +
      "<button type='button' class='accion accion-borrar' data-borrar='" + c + "'>Borrar</button>" +
      "</div></td></tr>";
  });
  $("tabla").innerHTML =
    "<table><thead><tr><th>Código</th><th>Negocio</th><th>Destino</th><th></th></tr></thead><tbody>" +
    filas + "</tbody></table>" + paginacion(PAGINA, totalPaginas);
  $("contador").textContent = busca
    ? "Mostrando " + (inicio + 1) + "–" + fin + " de " + lista.length + " resultados (" + TARJETAS.length + " tarjetas)"
    : "Mostrando " + (inicio + 1) + "–" + fin + " de " + TARJETAS.length + " tarjetas";
}

function paginacion(actual, total) {
  if (total <= 1) return "";
  let html = "<nav class='paginacion' aria-label='Paginación de tarjetas'>";
  html += "<button type='button' class='pagina' data-pagina='" + (actual - 1) + "'" +
    (actual === 1 ? " disabled" : "") + ">Anterior</button>";
  html += "<div class='paginas'>";
  for (let i = 1; i <= total; i++) {
    html += "<button type='button' class='pagina" + (i === actual ? " activa" : "") +
      "' data-pagina='" + i + "' aria-label='Página " + i + "'" +
      (i === actual ? " aria-current='page'" : "") + ">" + i + "</button>";
  }
  html += "</div><button type='button' class='pagina' data-pagina='" + (actual + 1) + "'" +
    (actual === total ? " disabled" : "") + ">Siguiente</button></nav>";
  return html;
}

$("buscar").addEventListener("input", () => { PAGINA = 1; pintarTabla(); });
$("limpiarBusca").onclick = () => { $("buscar").value = ""; PAGINA = 1; pintarTabla(); $("buscar").focus(); };
$("recargar").onclick = () => listar();

$("tabla").addEventListener("click", async (e) => {
  const pg = e.target.closest("[data-pagina]");
  if (pg && !pg.disabled) { PAGINA = parseInt(pg.dataset.pagina, 10) || 1; pintarTabla(); return; }

  const ed = e.target.closest("[data-editar]");
  if (ed) { editar(ed.dataset.editar); return; }

  const v = e.target.closest("[data-ver]");
  if (v) { window.open("/" + v.dataset.ver + "?ver=1", "_blank", "noopener"); return; }

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
    avisar("avisoPanel", "Tarjeta " + b.dataset.borrar + " borrada", true);
    cerrarQR();
    listar();
  } catch (err) {
    avisar("avisoPanel", err.message, false);
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
  const tarjeta = TARJETAS.filter((x) => x.codigo === codigo)[0];
  $("qrNegocio").textContent = tarjeta && tarjeta.negocio ? tarjeta.negocio : "Tarjeta " + codigo;
  $("qrTitulo").textContent = "QR de la tarjeta " + codigo;
  $("qrUrl").textContent = url;
  $("nfcUrl").textContent = ORIGEN + "/" + codigo;

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

$("copiarNfc").onclick = async () => {
  const b = $("copiarNfc");
  try {
    await navigator.clipboard.writeText($("nfcUrl").textContent);
    b.textContent = "Copiado";
    setTimeout(() => { b.textContent = "Copiar"; }, 1500);
  } catch (e) {
    avisar("avisoQR", "No se pudo copiar: seleccióna la URL a mano.", false);
  }
};

$("cerrarQR").onclick = cerrarQR;
$("modalQR").addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-cerrar")) cerrarQR();
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!$("modalTarjeta").hidden) cerrarTarjeta();
  else cerrarQR();
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
  <div class="caja activador">
    <div class="activador-copy">
      <h1>Activar una tarjeta</h1>
      <p>Apunta un código impreso al link de reseña de un negocio, desde una ventana rápida.</p>
    </div>
    <div class="fila" style="margin-top:0">
      <button type="button" id="abrirActivar">Activar tarjeta</button>
      <button type="button" class="gris" id="salir">Cerrar sesión</button>
    </div>
  </div>

  <div class="caja">
    <div class="barra">
      <h2>Tarjetas activadas</h2>
      <button class="gris" id="recargar">Refrescar</button>
    </div>
    <div class="aviso" id="avisoPanel"></div>

    <label for="buscar">Buscar <span>— por código o por negocio</span></label>
    <div style="display:flex;gap:10px">
      <input id="buscar" placeholder="A7K2, panadería…" autocomplete="off">
      <button class="gris" id="limpiarBusca">Limpiar</button>
    </div>

    <div id="tabla"></div>
    <div class="contador" id="contador"></div>
  </div>
</div>

<div class="modal" id="modalTarjeta" hidden>
  <div class="modal-fondo" data-cerrar-tarjeta></div>
  <div class="modal-caja modal-tarjeta franja" role="dialog" aria-modal="true" aria-labelledby="tarjetaModalTitulo" aria-describedby="tarjetaModalSubtitulo">
    <button type="button" class="modal-cerrar" id="cerrarTarjeta" aria-label="Cerrar">✕</button>
    <div class="modal-kicker" id="tarjetaModalKicker">Nueva tarjeta</div>
    <h1 id="tarjetaModalTitulo">Activar una tarjeta</h1>
    <p class="modal-subtitulo" id="tarjetaModalSubtitulo">Apunta el código impreso al link de reseña de un negocio.</p>

    <form id="formTarjeta">
      <label for="codigo">Código impreso en la tarjeta</label>
      <input id="codigo" placeholder="A7K2" autocomplete="off">

      <label for="maps">URL de Google Maps del negocio
        <span>— o su Place ID, o un link de reseña ya hecho</span></label>
      <input id="maps" placeholder="https://www.google.com/maps/place/Mercacentro+No.+4+Av.+Guabinal/@4.4416918,-75.2070794,16z/data=..." autocomplete="off">

      <div class="fila"><button type="button" class="gris" id="analizar">Leer la URL</button></div>
      <p class="ayuda">El panel saca el <b>Place ID</b> solo a partir de la URL de Maps. Si esa URL
        no lo trae, búscalo por nombre y ciudad en el
        <a href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
           target="_blank" rel="noopener">buscador de Place ID</a> y pega aquí el <code>ChIJ…</code>.</p>

      <div class="ficha" id="ficha" hidden>
        <b id="fichaNombre"></b>

        <label for="fichaReview">Link de reseña que va a quedar en la tarjeta</label>
        <input id="fichaReview" readonly>
        <div class="meta" id="fichaMeta"></div>
      </div>

      <label for="negocio">Negocio <span>— solo para tu referencia</span></label>
      <input id="negocio" placeholder="Mercacentro Av. Guabinal" autocomplete="off">

      <div class="fila modal-acciones">
        <button type="button" class="gris" id="cancelarTarjeta">Cancelar</button>
        <button type="submit" id="guardar">Activar tarjeta</button>
      </div>

      <div class="aviso" id="aviso"></div>
    </form>
  </div>
</div>

<div class="modal" id="modalQR" hidden>
  <div class="modal-fondo" data-cerrar></div>
  <div class="modal-caja franja" role="dialog" aria-modal="true" aria-labelledby="qrNegocio">
    <button class="modal-cerrar" id="cerrarQR" aria-label="Cerrar">✕</button>
    <h1 id="qrNegocio" class="qr-negocio">Nombre del negocio</h1>
    <p id="qrTitulo" class="qr-titulo">QR de la tarjeta</p>
    <p style="margin:0 0 14px">Esto es lo que va impreso en el plástico, no el link de Google.</p>
    <div style="text-align:center"><span class="qr-url" id="qrUrl"></span></div>
    <div class="qr-pair" id="qrPar"></div>
    <p class="mono" style="text-align:center;font-size:11px;margin:16px 0 0" id="qrDato"></p>

    <div class="nfc">
      <b>Para grabar en el tag NFC</b>
      <span class="qr-url" id="nfcUrl"></span>
      <p class="ayuda" style="text-align:center">El mismo link del QR. Los tags que ya grabaste
        con <code>?n=1</code> al final siguen funcionando igual.</p>
      <div><button class="gris" id="copiarNfc">Copiar</button></div>
    </div>
    <div class="aviso" id="avisoQR"></div>
  </div>
</div>

<script>
const ORIGEN = ${JSON.stringify(origen)};
const HOST = ${JSON.stringify(host)};
</script>
<script>${SCRIPT_PANEL}</script>`;
}
