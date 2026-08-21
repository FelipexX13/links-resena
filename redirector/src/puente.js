/**
 * Pantalla que ve el cliente al escanear el QR o acercar el NFC.
 *
 * Existe por una razón técnica: iOS solo le entrega el link a la app de Google
 * Maps si la persona lo TOCA — una redirección de servidor no cuenta como gesto.
 *
 * El diseño está gobernado por un problema de confianza: esto es marca de Google
 * en un dominio que no es Google, que es exactamente la forma de un phishing. Por
 * eso, dentro del estilo de tarjeta que el local eligió:
 *   · manda el nombre del negocio, no la marca de Google — quien pide es el local
 *   · tipografía Roboto, en minúsculas y peso medio, como los productos de Google
 *   · se dice a dónde lleva el botón y que no se pide ningún dato
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

const OLA = `<svg class="ola" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
  <path d="M0,44 C150,14 330,4 520,26 C700,47 880,88 1080,78 C1230,70 1350,46 1440,24 L1440,100 L0,100 Z"/>
</svg>`;

const BASE = `
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{min-height:100vh;min-height:100dvh;
    font-family:"Roboto",system-ui,-apple-system,"Segoe UI",Arial,sans-serif;
    display:flex;align-items:center;justify-content:center;text-align:center;
    -webkit-font-smoothing:antialiased}
  .g{width:56px;height:56px;display:block;margin:0 auto;flex:0 0 auto}
  .estrellas{display:flex;gap:4px;justify-content:center;margin:14px 0 16px}
  .estrellas svg{width:23px;height:23px;fill:#FBBC05}
  /* el nombre del negocio manda: quien pide la reseña es el local, no Google */
  h1{font-weight:500;font-size:22px;line-height:1.25;margin:0;letter-spacing:0}
  .pregunta{font-size:15px;font-weight:400;line-height:1.4;margin:8px 0 0;opacity:.7}
  .boton{display:block;margin-top:24px;padding:15px 24px;border-radius:8px;
    font-weight:500;font-size:16px;text-decoration:none;letter-spacing:.01em;
    transition:opacity .12s ease}
  .boton:active{opacity:.85}
  /* decir a dónde lleva y que no se pide nada es lo que quita el olor a fraude */
  .nota{font-size:12px;line-height:1.45;margin:14px auto 0;max-width:30ch;opacity:.55}
  .pie{margin-top:16px;font-size:10px;letter-spacing:.12em;opacity:.3;
    font-family:ui-monospace,"SF Mono",monospace}
  @media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

/* ---------- 1 · ola ---------- */
const E1 = `
  body{background:#fff;color:#202124;align-items:stretch;padding:0}
  .lienzo{width:100%;display:flex;flex-direction:column;justify-content:flex-start}
  .cabecera{position:relative;padding:54px 26px 92px;color:#fff;
    background:linear-gradient(100deg,#FBBC05 0%,#F79B1E 17%,#F0592B 35%,#EA4335 52%,#A93BC0 75%,#4285F4 100%)}
  .cabecera::after{content:"";position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(120% 80% at 50% -12%,rgba(255,255,255,.2),transparent 62%)}
  .cabecera > *{position:relative;z-index:1}
  .cabecera .pregunta{opacity:.95;font-size:17px;max-width:22ch;margin:0 auto}
  .ola{position:absolute;left:0;right:0;bottom:-1px;width:100%;height:82px;z-index:2}
  .ola path{fill:#fff}
  .cuerpo{position:relative;z-index:3;padding:16px 26px 44px}
  .g{width:66px;height:66px}
  h1{margin-top:14px}
  .boton{background:#1a73e8;color:#fff;max-width:340px;margin-inline:auto}
  .pie{color:#202124}
`;

/* ---------- 2 · pastel ---------- */
const E2 = `
  body{padding:24px;color:#202124;
    background:linear-gradient(140deg,#F6C3AD 0%,#F4B3C4 24%,#C7D6F2 50%,#BCE2D6 74%,#F2D7A0 100%)}
  .tarjeta{background:#fff;border-radius:28px;padding:36px 28px 30px;
    max-width:380px;width:100%;box-shadow:0 20px 48px -24px rgba(30,40,70,.4)}
  .boton{background:#1a73e8;color:#fff}
`;

/* ---------- 3 · círculo ---------- */
const E3 = `
  body{background:#fff;color:#202124;padding:20px}
  .aro{width:min(94vw,420px);aspect-ratio:1;border-radius:50%;padding:11px;
    background:conic-gradient(from 210deg,#FBBC05,#F79B1E,#EA4335,#A93BC0,#4285F4,#34A853,#FBBC05);
    box-shadow:0 20px 46px -30px rgba(20,30,60,.45)}
  .interior{height:100%;border-radius:50%;background:#fff;padding:9% 13%;
    display:flex;flex-direction:column;align-items:center;justify-content:center}
  .g{width:46px;height:46px}
  .estrellas{margin:10px 0 12px}
  .estrellas svg{width:20px;height:20px}
  h1{font-size:19px}
  .pregunta{font-size:13.5px;margin-top:6px}
  .boton{margin-top:16px;padding:12px 22px;font-size:15px;background:#1a73e8;color:#fff;width:100%}
  .nota{font-size:11px;margin-top:10px;max-width:26ch}
  .pie{margin-top:10px}
  @media (max-height:660px){
    .aro{width:min(86vw,350px);padding:9px}
    .g{width:40px;height:40px}
    h1{font-size:17px}
    .pregunta{font-size:12.5px}
    .estrellas{margin:8px 0 9px}
    .estrellas svg{width:18px;height:18px}
    .nota{font-size:10.5px;margin-top:8px}
  }
`;

/* ---------- 4 · oscuro ---------- */
const E4 = `
  body{background:#000;color:#fff;padding:24px}
  .tarjeta{border:2px solid #FFC400;border-radius:28px;padding:36px 28px 30px;
    max-width:380px;width:100%}
  .pregunta{opacity:.75}
  .nota{opacity:.5}
  .boton{background:#FFC400;color:#1a1508;font-weight:700}
  .pie{color:#fff}
`;

const CSS = { 1: E1, 2: E2, 3: E3, 4: E4 };

export function vistaPuente(tarjeta, codigo) {
  const estilo = estiloValido(tarjeta.estilo);
  const nombre = String(tarjeta.negocio || "").trim();

  const titulo = nombre
    ? `<h1>${esc(nombre)}</h1>`
    : `<h1>¿Nos dejas tu calificación?</h1>`;
  const pregunta = nombre
    ? `<p class="pregunta">agradece tu calificación en Google</p>`
    : "";

  const boton = `<a class="boton" href="${esc(tarjeta.destino)}">Calificar en Google Maps</a>`;
  const nota = `<p class="nota">Se abre Google Maps para que dejes tu reseña.
    No te pedimos ningún dato.</p>`;
  const pie = `<div class="pie">${esc(codigo)}</div>`;

  let cuerpo;
  if (estilo === 1) {
    cuerpo = `<div class="lienzo">
  <div class="cabecera">
    ${ESTRELLAS}
    <p class="pregunta">¿Nos dejas tu calificación en Google?</p>
    ${OLA}
  </div>
  <div class="cuerpo">
    ${LOGO_G}
    ${titulo}
    ${boton}
    ${nota}
    ${pie}
  </div>
</div>`;
  } else if (estilo === 3) {
    cuerpo = `<div class="aro"><div class="interior">
    ${LOGO_G}
    ${ESTRELLAS}
    ${titulo}
    ${pregunta}
    ${boton}
    ${nota}
  </div></div>`;
  } else {
    cuerpo = `<div class="tarjeta">
    ${LOGO_G}
    ${ESTRELLAS}
    ${titulo}
    ${pregunta}
    ${boton}
    ${nota}
    ${pie}
  </div>`;
  }

  return `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="${estilo === 4 ? "#000000" : "#ffffff"}">
<title>${nombre ? esc(nombre) : "Califícanos"} · Reseña en Google</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
<style>${BASE}${CSS[estilo]}</style>
${cuerpo}`;
}
