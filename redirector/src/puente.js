/**
 * Pantalla que ve el cliente al escanear el QR o acercar el NFC.
 *
 * Existe por una razón técnica: iOS solo le entrega el link a la app de Google
 * Maps si la persona lo TOCA — una redirección de servidor no cuenta como gesto.
 * Ya que hay que mostrar algo, es la versión digital de la tarjeta física, en el
 * mismo estilo que el local eligió, para que la transición no se sienta rara.
 *
 * Cuatro estilos, uno por cada diseño de tarjeta:
 *   1 ola · 2 pastel · 3 círculo · 4 oscuro
 */

import { esc } from "./vistas.js";

export const ESTILOS = [
  { id: 1, nombre: "Ola", detalle: "Degradado con onda blanca" },
  { id: 2, nombre: "Pastel", detalle: "Marco suave, tarjeta clara" },
  { id: 3, nombre: "Círculo", detalle: "Aro de colores sobre blanco" },
  { id: 4, nombre: "Oscuro", detalle: "Negro con borde dorado" },
];

export function estiloValido(n) {
  const i = parseInt(n, 10);
  return i >= 1 && i <= 4 ? i : 1;
}

const LOGO_G = `<svg class="g" viewBox="0 0 48 48" aria-hidden="true">
  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.97-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
</svg>`;

const ESTRELLA = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
const ESTRELLAS = `<div class="estrellas" role="img" aria-label="Cinco estrellas">${ESTRELLA.repeat(5)}</div>`;

// la palabra Google con sus colores, como en las tarjetas
const GOOGLE_COLOR = `<span class="wm"><i style="color:#4285F4">G</i><i style="color:#EA4335">o</i><i style="color:#FBBC05">o</i><i style="color:#4285F4">g</i><i style="color:#34A853">l</i><i style="color:#EA4335">e</i></span>`;

const OLA = `<svg class="ola" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
  <path d="M0,26 C210,84 420,80 660,52 C880,26 1100,-8 1290,6 C1360,11 1405,20 1440,30 L1440,80 L0,80 Z"/>
</svg>`;

const BASE = `
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{min-height:100vh;min-height:100dvh;
    font-family:"Poppins","Inter",system-ui,-apple-system,"Segoe UI",sans-serif;
    display:flex;align-items:center;justify-content:center;text-align:center;
    -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
  .g{width:62px;height:62px;display:block;margin:0 auto;flex:0 0 auto}
  .estrellas{display:flex;gap:5px;justify-content:center;margin:16px 0 14px}
  .estrellas svg{width:25px;height:25px;fill:#FBBC05;
    filter:drop-shadow(0 1px 2px rgba(0,0,0,.14))}
  h1{font-weight:800;font-size:23px;line-height:1.2;margin:0;letter-spacing:-.005em}
  .wm i{font-style:normal}
  .negocio{font-size:14px;font-weight:500;margin:12px 0 0;opacity:.72}
  .boton{display:block;margin-top:26px;padding:16px 24px;border-radius:999px;
    font-weight:700;font-size:16.5px;text-decoration:none;letter-spacing:.01em;
    transition:transform .12s ease}
  .boton:active{transform:scale(.985)}
  .otra{display:block;margin-top:15px;font-size:12px;text-decoration:underline;opacity:.55}
  .pie{margin-top:20px;font-size:9.5px;letter-spacing:.16em;opacity:.32;
    font-family:ui-monospace,"SF Mono",monospace}
  @media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

/* ---------- 1 · ola ---------- */
const E1 = `
  body{background:#fff;color:#1b2333;align-items:stretch;padding:0}
  .lienzo{width:100%;display:flex;flex-direction:column;justify-content:flex-start}
  .cabecera{position:relative;padding:52px 26px 74px;color:#fff;
    background:linear-gradient(100deg,#FBBC05 0%,#F79B1E 17%,#F0592B 35%,#EA4335 52%,#A93BC0 75%,#4285F4 100%)}
  .cabecera::after{content:"";position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(120% 80% at 50% -12%,rgba(255,255,255,.22),transparent 62%)}
  .cabecera > *{position:relative;z-index:1}
  .cabecera h1{text-transform:uppercase;font-size:25px;letter-spacing:.005em;
    text-shadow:0 2px 12px rgba(0,0,0,.16);max-width:16ch;margin:0 auto}
  .ola{position:absolute;left:0;right:0;bottom:-1px;width:100%;height:66px;z-index:2}
  .ola path{fill:#fff}
  .cuerpo{padding:0 26px 44px;margin-top:-14px}
  .g{width:78px;height:78px}
  .boton{background:linear-gradient(95deg,#F79B1E 0%,#EA4335 62%,#D93025 100%);color:#fff;
    box-shadow:0 14px 26px -14px rgba(234,67,53,.95);max-width:340px;margin-inline:auto}
  .otra{color:#66718a}
  .pie{color:#1b2333}
`;

/* ---------- 2 · pastel ---------- */
const E2 = `
  body{padding:24px;color:#1b2333;
    background:linear-gradient(140deg,#F6C3AD 0%,#F4B3C4 24%,#C7D6F2 50%,#BCE2D6 74%,#F2D7A0 100%)}
  .tarjeta{background:rgba(255,255,255,.94);border-radius:36px;padding:38px 28px 32px;
    max-width:390px;width:100%;box-shadow:0 26px 60px -26px rgba(30,40,70,.45)}
  h1{font-size:24px}
  .boton{background:#1a73e8;color:#fff;box-shadow:0 12px 24px -14px rgba(26,115,232,.9)}
  .otra{color:#66718a}
`;

/* ---------- 3 · círculo ---------- */
const E3 = `
  body{background:#fff;color:#1b2333;padding:20px}
  .aro{width:min(94vw,420px);aspect-ratio:1;border-radius:50%;padding:11px;
    background:conic-gradient(from 210deg,#FBBC05,#F79B1E,#EA4335,#A93BC0,#4285F4,#34A853,#FBBC05);
    box-shadow:0 22px 50px -28px rgba(20,30,60,.5)}
  .interior{height:100%;border-radius:50%;background:#fff;padding:10% 13%;
    display:flex;flex-direction:column;align-items:center;justify-content:center}
  .g{width:52px;height:52px}
  .estrellas{margin:12px 0 10px}
  .estrellas svg{width:22px;height:22px}
  h1{text-transform:uppercase;font-size:19px;line-height:1.22}
  .negocio{margin-top:8px;font-size:13px}
  .boton{margin-top:16px;padding:13px 22px;font-size:15px;background:#1a73e8;color:#fff;
    box-shadow:0 10px 20px -12px rgba(26,115,232,.9);width:100%}
  .otra{margin-top:11px;font-size:10.5px;color:#66718a;max-width:88%;margin-inline:auto}
  .pie{margin-top:12px}
  @media (max-height:640px){
    .aro{width:min(86vw,350px);padding:9px}
    .g{width:44px;height:44px}
    h1{font-size:17px}
    .estrellas{margin:9px 0 8px}
    .estrellas svg{width:19px;height:19px}
  }
`;

/* ---------- 4 · oscuro ---------- */
const E4 = `
  body{background:#000;color:#fff;padding:24px}
  .tarjeta{border:3px solid #FFC400;border-radius:32px;padding:38px 28px 32px;
    max-width:390px;width:100%;
    box-shadow:0 0 0 1px rgba(255,196,0,.25), 0 26px 60px -30px rgba(255,196,0,.35)}
  h1{text-transform:uppercase;font-size:22px;line-height:1.24}
  .negocio{opacity:.62}
  .boton{background:#FFC400;color:#12100a;box-shadow:0 14px 28px -16px rgba(255,196,0,.85)}
  .otra{color:#cfd3dc;opacity:.6}
  .pie{color:#fff}
`;

const CSS = { 1: E1, 2: E2, 3: E3, 4: E4 };

export function vistaPuente(tarjeta, codigo) {
  const estilo = estiloValido(tarjeta.estilo);
  const negocio = tarjeta.negocio
    ? `<p class="negocio">${esc(tarjeta.negocio)}</p>`
    : "";
  const alterno = tarjeta.alterno
    ? `<a class="otra" href="${esc(tarjeta.alterno)}">¿No se abrió la app? Califica en el navegador</a>`
    : "";
  const boton = `<a class="boton" href="${esc(tarjeta.destino)}">Calificar en Google</a>`;
  const pie = `<div class="pie">${esc(codigo)}</div>`;

  const titulo = estilo === 2
    ? "Apreciamos tu calificación!"
    : `Apreciamos tu calificación en ${estilo === 1 ? "Google" : GOOGLE_COLOR}`;

  let cuerpo;
  if (estilo === 1) {
    cuerpo = `<div class="lienzo">
  <div class="cabecera">
    ${ESTRELLAS}
    <h1>${titulo}</h1>
    ${OLA}
  </div>
  <div class="cuerpo">
    ${LOGO_G}
    ${negocio}
    ${boton}
    ${alterno}
    ${pie}
  </div>
</div>`;
  } else if (estilo === 3) {
    cuerpo = `<div class="aro"><div class="interior">
    ${LOGO_G}
    ${ESTRELLAS}
    <h1>${titulo}</h1>
    ${negocio}
    ${boton}
    ${alterno}
  </div></div>`;
  } else {
    cuerpo = `<div class="tarjeta">
    ${LOGO_G}
    ${ESTRELLAS}
    <h1>${titulo}</h1>
    ${negocio}
    ${boton}
    ${alterno}
    ${pie}
  </div>`;
  }

  return `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="${estilo === 4 ? "#000000" : "#EA4335"}">
<title>Califícanos en Google</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;700;800&display=swap" rel="stylesheet">
<style>${BASE}${CSS[estilo]}</style>
${cuerpo}`;
}
