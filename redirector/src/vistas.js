/**
 * Vistas HTML del redireccionador.
 *
 * El sistema visual está en ESTILOS, sobre variables CSS. Dos reglas que
 * conviene respetar al tocarlo:
 *
 *   · Los colores del LOGO de Google (#4285F4, #EA4335, #FBBC05, #34A853) solo
 *     se usan en la marca: la franja de la cabecera y la G. La interfaz usa los
 *     colores de producto (#1a73e8, #d93025, #f9ab00, #1e8e3e), que están menos
 *     saturados y por eso no gritan cuando hay treinta en pantalla.
 *   · Cada color tiene un papel fijo: azul = acción principal, verde = hecho o
 *     confirmado, rojo = destructivo, ámbar = identidad y secuencia.
 *
 * Nota sobre el script del panel: va en un String.raw porque lleva expresiones
 * regulares. En un template literal normal, JavaScript se come las barras
 * invertidas (\d pasaría a ser d) y las rompería todas en silencio.
 * Por lo mismo, dentro de ese bloque no puede haber acentos graves ni ${...}.
 */

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* La marca, en cuatro cuadros: a 16px una G se convierte en una mancha. */
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23ffffff'/%3E%3Crect x='5' y='5' width='9' height='9' rx='2.5' fill='%234285F4'/%3E%3Crect x='18' y='5' width='9' height='9' rx='2.5' fill='%23EA4335'/%3E%3Crect x='5' y='18' width='9' height='9' rx='2.5' fill='%23FBBC05'/%3E%3Crect x='18' y='18' width='9' height='9' rx='2.5' fill='%2334A853'/%3E%3C/svg%3E";

const LOGO_G = `<svg class="g" viewBox="0 0 48 48" aria-hidden="true">
  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.97-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
</svg>`;

const CABEZA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" href="${FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap">`;

const ESTILOS = `
  :root{
    /* marca — solo para la franja y la G */
    --logo-azul:#4285F4; --logo-rojo:#EA4335; --logo-amarillo:#FBBC05; --logo-verde:#34A853;

    /* producto — todo lo demás */
    --azul:#1a73e8; --azul-fuerte:#1557b0; --azul-piel:#e8f0fe; --azul-borde:#c5dafb;
    --rojo:#d93025; --rojo-fuerte:#b3261e; --rojo-piel:#fce8e6; --rojo-borde:#f5c6c2;
    --ambar:#f9ab00; --ambar-tinta:#8a6100; --ambar-piel:#fef7e0; --ambar-borde:#fae3a8;
    --verde:#1e8e3e; --verde-fuerte:#166b2e; --verde-piel:#e6f4ea; --verde-borde:#bfe2ca;

    /* neutros, todos con el mismo tinte frío */
    --tinta:#16202e; --tinta-2:#5b6779; --tinta-3:#667287;
    --linea:#e2e7f0; --linea-suave:#eef1f7;
    --papel:#fff; --papel-2:#f8fafd; --fondo:#f2f5fa;

    /* sombras tintadas con el azul del fondo, nunca negro puro */
    --sombra-1:0 1px 2px rgba(22,32,46,.05),0 4px 14px -8px rgba(22,32,46,.14);
    --sombra-2:0 1px 2px rgba(22,32,46,.05),0 20px 44px -24px rgba(22,32,46,.30);
    --sombra-3:0 44px 90px -30px rgba(13,20,36,.48);

    /* radios: contenedor suave, interior apretado */
    --r-xl:24px; --r-l:16px; --r-m:11px; --r-s:8px;

    --ancho:1120px;
    --z-grano:5; --z-modal:100;
    --paso:.16s cubic-bezier(.2,.7,.3,1);
  }

  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{margin:0;padding:0;background:var(--fondo);color:var(--tinta);
    font-family:"Geist","Inter",system-ui,-apple-system,"Segoe UI",sans-serif;
    font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased;
    font-variant-numeric:tabular-nums}
  .mono,code,input,.cod{font-family:"Geist Mono",ui-monospace,"SF Mono","Cascadia Mono",monospace}

  /* rompe la planitud digital: ruido fijo, invisible de cerca */
  .grano{position:fixed;inset:0;pointer-events:none;z-index:var(--z-grano);opacity:.03;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E")}

  .saltar{position:absolute;left:-9999px;top:8px;z-index:200;background:var(--azul);color:#fff;
    padding:10px 16px;border-radius:var(--r-m);font-weight:600;font-size:13px;text-decoration:none}
  .saltar:focus{left:16px}

  h1{font-size:clamp(25px,3vw,31px);font-weight:600;letter-spacing:-.028em;line-height:1.15;
    margin:0 0 8px;text-wrap:balance}
  h2{font-size:17px;font-weight:600;letter-spacing:-.015em;margin:0}
  p{color:var(--tinta-2);margin:0 0 14px;max-width:64ch;text-wrap:pretty}
  a{color:var(--azul)}

  /* ---------- superficies ---------- */
  .lamina{background:var(--papel);border:1px solid var(--linea);border-radius:var(--r-xl);
    box-shadow:var(--sombra-1);position:relative;overflow:hidden}
  .franja::before{content:"";position:absolute;top:0;left:0;right:0;height:4px;z-index:1;
    background:linear-gradient(90deg,var(--logo-azul) 0 25%,var(--logo-rojo) 25% 50%,
      var(--logo-amarillo) 50% 75%,var(--logo-verde) 75% 100%)}

  .g{width:30px;height:30px;display:block;flex:0 0 auto}

  /* ---------- cabecera de la aplicación ---------- */
  .envoltorio{max-width:var(--ancho);margin:0 auto;padding:0 22px}
  .cabecera{position:sticky;top:0;z-index:10;background:rgba(242,245,250,.82);
    -webkit-backdrop-filter:blur(14px) saturate(1.6);
    backdrop-filter:blur(14px) saturate(1.6);border-bottom:1px solid var(--linea)}
  .cabecera-fila{display:flex;align-items:center;justify-content:space-between;gap:18px;
    flex-wrap:wrap;padding:20px 0}
  .marca{display:flex;align-items:center;gap:11px;min-width:0}
  .marca-texto{display:flex;flex-direction:column;line-height:1.25;min-width:0}
  .marca-texto strong{font-size:15px;font-weight:600;letter-spacing:-.015em}
  .marca-host{font-family:"Geist Mono",ui-monospace,monospace;font-size:11px;color:var(--tinta-3)}
  .cabecera-acciones{display:flex;gap:9px;flex-wrap:wrap}

  .contenido{padding-top:34px;padding-bottom:80px}
  section+section{margin-top:20px}

  /* ---------- botones ---------- */
  button{border:none;border-radius:999px;padding:10px 20px;cursor:pointer;
    font-family:inherit;font-weight:600;font-size:13.5px;letter-spacing:-.005em;
    background:var(--azul);color:#fff;white-space:nowrap;
    transition:background var(--paso),color var(--paso),border-color var(--paso),
      transform var(--paso),box-shadow var(--paso)}
  button:hover{background:var(--azul-fuerte)}
  button:active{transform:translateY(1px)}
  :focus-visible{outline:2px solid var(--azul);outline-offset:2px}
  button.fantasma{background:var(--papel);color:var(--tinta-2);border:1px solid var(--linea)}
  button.fantasma:hover{background:var(--papel-2);color:var(--tinta);border-color:var(--tinta-3)}
  button.leer{background:var(--azul-piel);color:var(--azul-fuerte);border:1px solid var(--azul-borde)}
  button.leer:hover{background:var(--azul);color:#fff;border-color:var(--azul)}
  button[disabled]{opacity:.45;cursor:not-allowed}
  button[disabled]:active{transform:none}

  /* Tintados, no rellenos: con diez filas en pantalla hay treinta de estos, y
     treinta pastillas saturadas convierten la tabla en un semáforo. */
  .acciones{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;min-width:210px}
  .acciones button{width:100%;padding:7px 6px;font-size:12.5px;border:1px solid transparent}
  .accion-qr{background:var(--verde-piel);color:var(--verde-fuerte);border-color:var(--verde-borde)}
  .accion-qr:hover{background:var(--verde);color:#fff;border-color:var(--verde)}
  .accion-editar{background:var(--azul-piel);color:var(--azul-fuerte);border-color:var(--azul-borde)}
  .accion-editar:hover{background:var(--azul);color:#fff;border-color:var(--azul)}
  .accion-borrar{background:var(--rojo-piel);color:var(--rojo-fuerte);border-color:var(--rojo-borde)}
  .accion-borrar:hover{background:var(--rojo);color:#fff;border-color:var(--rojo)}
  .accion-borrar.confirmando{background:var(--rojo);color:#fff;border-color:var(--rojo);
    box-shadow:0 0 0 3px var(--rojo-piel)}

  /* ---------- campos ---------- */
  label{display:block;font-weight:600;font-size:13px;margin:16px 0 6px;letter-spacing:-.005em}
  label .suave{font-weight:400;color:var(--tinta-2)}
  input{width:100%;padding:11px 13px;border:1px solid var(--linea);border-radius:var(--r-m);
    background:var(--papel-2);font-size:13px;color:var(--tinta);
    transition:border-color var(--paso),box-shadow var(--paso),background var(--paso)}
  input::placeholder{color:var(--tinta-3)}
  input:focus{outline:none;background:var(--papel);border-color:var(--azul);
    box-shadow:0 0 0 3px var(--azul-piel)}
  input[readonly]{color:var(--tinta-2)}

  /* ---------- resumen ---------- */
  .resumen{display:flex;flex-wrap:wrap;gap:0;padding:2px 0}
  .dato{flex:1 1 150px;padding:15px 24px;border-left:1px solid var(--linea)}
  .dato:first-child{border-left:0;padding-left:24px}
  .dato-valor{font-size:27px;font-weight:600;letter-spacing:-.035em;line-height:1.05}
  .dato-valor.cod{font-size:24px;letter-spacing:.02em;color:var(--ambar-tinta)}
  .dato-pie{font-size:12px;color:var(--tinta-2);margin-top:3px}

  /* ---------- panel de tarjetas ---------- */
  .panel{padding:24px}
  .panel-barra{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .busca{display:flex;gap:9px;margin-top:16px}
  .busca-campo{position:relative;flex:1 1 auto;min-width:0}
  .busca-campo input{padding-left:38px}
  .busca-lupa{position:absolute;left:13px;top:50%;transform:translateY(-50%);
    width:15px;height:15px;color:var(--tinta-3);pointer-events:none}

  table{width:100%;border-collapse:collapse;margin-top:18px;font-size:13.5px}
  th{text-align:left;font-size:12px;font-weight:500;color:var(--tinta-2);
    border-bottom:1px solid var(--linea);padding:0 10px 9px}
  td{padding:11px 10px;border-bottom:1px solid var(--linea-suave);vertical-align:middle}
  tbody tr{transition:background var(--paso)}
  tbody tr:hover{background:var(--papel-2)}
  td:last-child{width:1%;white-space:nowrap}
  .cod{font-weight:500;font-size:14px;letter-spacing:.06em}
  .fila-num{font-size:11.5px;color:var(--tinta-3);margin-top:1px}
  .negocio{font-weight:500}
  .place{font-family:"Geist Mono",ui-monospace,monospace;font-size:11.5px;color:var(--tinta-2);
    background:var(--papel-2);border:1px solid var(--linea);border-radius:var(--r-s);
    padding:3px 8px;display:inline-block;max-width:26ch;overflow:hidden;
    text-overflow:ellipsis;white-space:nowrap;vertical-align:middle}
  @media (max-width:820px){.col-destino{display:none}}

  /* ---------- teléfono ---------- */
  @media (max-width:640px){
    /* Sin esto la fila reparte 230px a los botones y deja el nombre del negocio
       en 72px. Una tabla de 4 columnas no cabe: cada fila pasa a ser un bloque. */
    table,tbody,tr,td{display:block;width:auto}
    thead{display:none}
    table{margin-top:10px}
    tr{padding:14px 0;border-bottom:1px solid var(--linea-suave)}
    tr:hover{background:transparent}
    td{border:0;padding:0}
    td:last-child{width:auto;white-space:normal;padding-top:11px}
    .negocio{font-size:15px;margin-top:2px}
    .acciones{grid-template-columns:repeat(3,minmax(0,1fr));min-width:0}
    .acciones button{padding:9px 6px}

    /* 132px de cabecera fija en una pantalla de 844 es peaje permanente */
    .cabecera{position:static}
    .cabecera-fila{padding:14px 0;gap:12px}
    .cabecera-acciones{width:100%}
    .cabecera-acciones button{flex:1 1 0}

    .envoltorio{padding:0 16px}
    .contenido{padding-top:20px;padding-bottom:56px}
    /* Envuelto a 2+1 el tercero heredaba un borde izquierdo suelto. Apilado sin
       más subía a 214px; con número y etiqueta enfrentados baja a una línea. */
    .resumen{display:block}
    .dato{display:flex;align-items:baseline;justify-content:space-between;gap:12px;
      border-left:0;border-top:1px solid var(--linea);padding:11px 16px}
    .dato:first-child{border-top:0}
    .dato-valor{font-size:21px}
    .dato-valor.cod{font-size:19px}
    .dato-pie{margin-top:0;text-align:right}
    .dato-valor{font-size:23px}
    .dato-valor.cod{font-size:20px}
    .panel{padding:18px 16px}

    /* menos de 16px y iOS hace zoom al enfocar el campo */
    input{font-size:16px}

    .modal{padding:12px}
    .modal-caja{padding:24px 18px;max-height:92vh}
    .qr-negocio{margin-left:8px;margin-right:34px}
    .qr-pair{grid-template-columns:1fr;justify-items:center}
    .rango-fila{grid-template-columns:1fr}
    .segmento{display:flex;width:100%}
    .segmento button{flex:1 1 0;padding:8px 6px}
    .modal-acciones button{flex:1 1 auto}
    .obligatorios{width:100%;margin-bottom:2px}
  }

  /* ---------- carga, vacío ---------- */
  .hueso{display:block;height:11px;border-radius:999px;
    background:linear-gradient(90deg,var(--linea-suave) 25%,var(--linea) 37%,var(--linea-suave) 63%);
    background-size:400% 100%;animation:brillo 1.3s ease-in-out infinite}
  .hueso.corto{width:52%}
  .hueso.medio{width:74%}
  @keyframes brillo{0%{background-position:100% 0}100%{background-position:0 0}}

  .vacio{text-align:center;padding:52px 20px 46px}
  .vacio-marca{display:flex;gap:7px;justify-content:center;margin-bottom:18px}
  .vacio-marca i{width:11px;height:11px;border-radius:3px;display:block}
  .vacio h2{margin-bottom:7px}
  .vacio p{margin:0 auto 20px;max-width:42ch;color:var(--tinta-2)}

  /* ---------- paginación ---------- */
  .paginacion{display:flex;align-items:center;justify-content:space-between;gap:12px;
    flex-wrap:wrap;margin-top:18px}
  .paginas{display:flex;align-items:center;gap:4px;flex-wrap:wrap}
  button.pagina{min-width:34px;padding:6px 10px;font-size:12.5px;font-weight:500;
    background:transparent;color:var(--tinta-2);border:1px solid transparent;border-radius:var(--r-s)}
  button.pagina:hover:not(:disabled){background:var(--azul-piel);color:var(--azul-fuerte)}
  button.pagina.activa{background:var(--azul);color:#fff}
  .salto{color:var(--tinta-3);padding:0 3px;font-size:12.5px;user-select:none}
  .contador{font-size:12px;color:var(--tinta-3);margin-top:11px}

  /* ---------- avisos ---------- */
  .aviso{margin-top:14px;padding:11px 14px;border-radius:var(--r-m);font-size:13px;display:none;
    border:1px solid transparent}
  .aviso.ok{display:block;background:var(--verde-piel);color:var(--verde-fuerte);border-color:var(--verde-borde)}
  .aviso.mal{display:block;background:var(--rojo-piel);color:var(--rojo-fuerte);border-color:var(--rojo-borde)}

  .ayuda{font-size:12px;line-height:1.5;color:var(--tinta-2);margin:9px 0 0;max-width:62ch}
  .ayuda-alta{margin:0 0 8px}
  .ayuda code{background:var(--papel-2);border:1px solid var(--linea);border-radius:5px;
    padding:1px 5px;font-size:11px}

  /* ---------- entrada ---------- */
  .entrada{display:flex;align-items:center;justify-content:center;
    min-height:100vh;min-height:100dvh;padding:24px}
  .entrada-caja{width:100%;max-width:392px;padding:34px 30px 30px}
  .entrada-caja .g{width:36px;height:36px;margin-bottom:16px}
  .entrada-caja p{font-size:13.5px;margin-bottom:6px}

  /* ---------- ventanas modales ---------- */
  .modal{position:fixed;inset:0;z-index:var(--z-modal);display:flex;align-items:center;
    justify-content:center;padding:22px}
  .modal-fondo{position:absolute;inset:0;background:rgba(13,20,36,.52);backdrop-filter:blur(3px)}
  .modal-caja{position:relative;background:var(--papel);border-radius:var(--r-xl);width:100%;
    max-width:540px;max-height:88vh;overflow:auto;padding:30px;box-shadow:var(--sombra-3);
    animation:entra .22s cubic-bezier(.2,.7,.3,1)}
  @keyframes entra{from{opacity:0;transform:translateY(10px) scale(.985)}}
  .modal-cerrar{position:absolute;top:16px;right:16px;z-index:3;padding:0;width:32px;height:32px;
    border-radius:50%;background:var(--papel-2);color:var(--tinta-2);font-size:14px;line-height:1;
    border:1px solid var(--linea)}
  .modal-cerrar:hover{background:var(--linea-suave);color:var(--tinta)}
  .modal-tarjeta{max-width:620px}
  .modal-subtitulo{margin-bottom:20px;font-size:13.5px}
  .modal-kicker{display:inline-block;font-size:11.5px;font-weight:600;color:var(--azul-fuerte);
    background:var(--azul-piel);border-radius:999px;padding:4px 12px;margin-bottom:12px}
  .modal-acciones{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:24px}
  /* radial y no lineal: un degradado recto de lado a lado se lee como plantilla */
  .modal-tarjeta::after{content:"";position:absolute;top:0;left:0;right:0;height:190px;
    pointer-events:none;z-index:0;
    background:radial-gradient(120% 100% at 22% 0%,rgba(26,115,232,.10),rgba(26,115,232,0) 62%)}
  .modal-tarjeta > *:not(.modal-cerrar){position:relative;z-index:1}

  /* los tres pasos, cada uno con su color */
  label.paso{display:flex;align-items:center;gap:10px;margin:20px 0 6px}
  label.paso .n{width:21px;height:21px;border-radius:50%;flex:0 0 auto;
    display:inline-flex;align-items:center;justify-content:center;
    font-size:11.5px;font-weight:600;color:#fff}
  .n1{background:var(--azul)}
  .n2{background:var(--rojo)}
  .n3{background:var(--verde)}
  .num{margin-left:auto;font-family:"Geist Mono",ui-monospace,monospace;font-weight:500;
    font-size:11.5px;color:var(--ambar-tinta);background:var(--ambar-piel);
    border:1px solid var(--ambar-borde);border-radius:999px;padding:2px 10px}
  .c1:focus{border-color:var(--azul);box-shadow:0 0 0 3px var(--azul-piel)}
  .c2:focus{border-color:var(--rojo);box-shadow:0 0 0 3px var(--rojo-piel)}
  .c3:focus{border-color:var(--verde);box-shadow:0 0 0 3px var(--verde-piel)}
  .obligatorios{margin-right:auto;font-size:12px;color:var(--tinta-3)}
  .n4{background:var(--ambar);color:#4a3400}

  /* ---- segmentados: tipo de tarjeta, modo del formulario, filtro ---- */
  .segmento{display:inline-flex;gap:3px;padding:3px;background:var(--papel-2);
    border:1px solid var(--linea);border-radius:999px}
  .segmento button{background:transparent;color:var(--tinta-2);font-size:12.5px;
    padding:6px 15px;border-radius:999px}
  .segmento button:hover{background:var(--papel);color:var(--tinta)}
  .segmento button.activa{background:var(--azul);color:#fff}
  .segmento button.activa:hover{background:var(--azul-fuerte)}

  .tipo{display:inline-block;margin-top:4px;font-size:11px;font-weight:500;
    border-radius:999px;padding:2px 9px;border:1px solid transparent}
  .tipo-acrilico{background:var(--azul-piel);color:var(--azul-fuerte);border-color:var(--azul-borde)}
  .tipo-sticker{background:var(--ambar-piel);color:var(--ambar-tinta);border-color:var(--ambar-borde)}

  .filtros{margin-top:12px}
  .rango-fila{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .rango-resumen{margin-top:10px;padding:10px 13px;border-radius:var(--r-m);
    background:var(--ambar-piel);border:1px solid var(--ambar-borde);
    color:var(--ambar-tinta);font-size:12.5px}
  .acciones-izq{justify-content:flex-start;margin-top:14px}
  .nota-mono{font-family:"Geist Mono",ui-monospace,monospace;font-size:13px;color:var(--tinta-3)}
  .centrado{margin-left:auto;margin-right:auto}
  .vacio-marca .m1{background:var(--logo-azul)}
  .vacio-marca .m2{background:var(--logo-rojo)}
  .vacio-marca .m3{background:var(--logo-amarillo)}
  .vacio-marca .m4{background:var(--logo-verde)}

  .ficha{margin-top:18px;padding:15px 16px;border-radius:var(--r-l);background:var(--verde-piel);
    border:1px solid var(--verde-borde);border-left:3px solid var(--verde);font-size:13px}
  .ficha b{display:block;font-size:15px;font-weight:600;margin-bottom:2px;color:var(--verde-fuerte);
    letter-spacing:-.015em}
  .ficha label{margin-top:12px;color:var(--verde-fuerte)}
  .ficha input{background:var(--papel);border-color:var(--verde-borde)}
  .ficha .meta{font-family:"Geist Mono",ui-monospace,monospace;font-size:11px;
    color:var(--tinta-2);margin-top:9px;word-break:break-all}

  /* ---------- ventana del QR ---------- */
  .qr-negocio{text-align:center;font-size:clamp(26px,5.2vw,36px);font-weight:600;line-height:1.1;
    letter-spacing:-.035em;margin:2px 36px 4px;text-wrap:balance;overflow-wrap:anywhere}
  .qr-titulo{text-align:center;font-family:"Geist Mono",ui-monospace,monospace;font-size:11.5px;
    color:var(--tinta-3);margin:0 0 16px}
  .qr-nota{text-align:center;font-size:13px;color:var(--tinta-2);margin:0 auto 14px;max-width:44ch}
  .qr-url{text-align:center;font-family:"Geist Mono",ui-monospace,monospace;font-size:12px;
    color:var(--tinta);background:var(--papel-2);border:1px solid var(--linea);
    border-radius:var(--r-m);padding:8px 13px;display:inline-block;word-break:break-all}
  .centrado{text-align:center}
  /* el damero indica que el PNG es transparente */
  .qr-pair{display:grid;grid-template-columns:repeat(2,max-content);gap:16px;
    justify-content:center;margin-top:20px}
  .qr-tile{margin:0;flex:0 0 auto;text-align:center}
  .qr-art{display:inline-block;line-height:0;border:1px solid var(--linea);border-radius:var(--r-l);
    padding:11px;background-color:#fff;
    background-image:linear-gradient(45deg,#eaeef6 25%,transparent 25%,transparent 75%,#eaeef6 75%),
                     linear-gradient(45deg,#eaeef6 25%,transparent 25%,transparent 75%,#eaeef6 75%);
    background-size:16px 16px;background-position:0 0,8px 8px}
  .qr-tile.inv .qr-art{border-color:#2b3140;background-color:#151922;
    background-image:linear-gradient(45deg,#222834 25%,transparent 25%,transparent 75%,#222834 75%),
                     linear-gradient(45deg,#222834 25%,transparent 25%,transparent 75%,#222834 75%)}
  .qr-art img{width:150px;height:150px;display:block}
  .qr-dl{display:block;margin-top:9px;font-size:11.5px;font-weight:500;color:var(--azul);
    text-decoration:none;border:1px solid var(--linea);border-radius:999px;padding:5px 13px;
    transition:background var(--paso),border-color var(--paso)}
  .qr-dl:hover{border-color:var(--azul);background:var(--azul-piel)}
  .qr-dato{text-align:center;font-family:"Geist Mono",ui-monospace,monospace;font-size:11px;
    color:var(--tinta-3);margin:18px 0 0}
  .nfc{margin-top:22px;padding-top:18px;border-top:1px solid var(--linea);text-align:center}
  .nfc b{display:block;font-size:13px;font-weight:600;margin-bottom:10px}
  .nfc .qr-url{font-size:11.5px}
  .nfc button{margin-top:11px}

  /* ---------- páginas públicas ---------- */
  .publica{display:flex;align-items:center;justify-content:center;
    min-height:100vh;min-height:100dvh;padding:24px}
  .publica-caja{width:100%;max-width:470px;padding:36px 32px 32px}
  .publica-caja .g{width:34px;height:34px;margin-bottom:16px}
  .codigo-grande{display:inline-block;background:var(--ambar-piel);border:1px solid var(--ambar-borde);
    color:var(--ambar-tinta);border-radius:var(--r-m);padding:7px 15px;font-size:19px;
    font-weight:500;letter-spacing:.14em;
    font-family:"Geist Mono",ui-monospace,monospace}

  [hidden]{display:none !important}
  @media (prefers-reduced-motion:reduce){
    *{animation-duration:.01ms !important;transition-duration:.01ms !important}
    html{scroll-behavior:auto}
  }
`;

export function vistaInicio(host) {
  return `<!doctype html>${CABEZA}
<meta name="robots" content="noindex,nofollow">
<title>Tarjetas de reseña</title><style>${ESTILOS}</style>
<div class="grano"></div>
<main class="publica">
  <div class="lamina franja publica-caja">
    ${LOGO_G}
    <h1>Tarjetas de reseña</h1>
    <p>Cada tarjeta lleva a la ficha de reseñas del negocio que la tiene. Escanea
    su QR, acércala al teléfono, o entra con su código:</p>
    <p class="nota-mono">${esc(host)}/TUCODIGO</p>
  </div>
</main>`;
}

export function vistaSinConfigurar(codigo) {
  return `<!doctype html>${CABEZA}
<meta name="robots" content="noindex,nofollow">
<title>Tarjeta sin activar</title><style>${ESTILOS}</style>
<div class="grano"></div>
<main class="publica">
  <div class="lamina franja publica-caja">
    ${LOGO_G}
    <h1>Esta tarjeta todavía no está activada</h1>
    <p>El código <span class="codigo-grande">${esc(codigo)}</span> aún no tiene un
    negocio asignado, así que no hay a dónde llevarte.</p>
    <p>Si acabas de recibir la tarjeta, avísanos y la activamos en un minuto.</p>
  </div>
</main>`;
}

const SCRIPT_PANEL = String.raw`
const $ = (id) => document.getElementById(id);
let TARJETAS = [];
let CARGANDO = true;
let focoPrevio = null;
let focoTarjeta = null;
let NOMBRE_AUTO = "";
let URL_LEIDA = "";
let EDITANDO_CODIGO = "";
let CONFIRMANDO = "";
let RELOJ_CONFIRMA = null;
let BOTON_CONFIRMA = null;
let PAGINA = 1;
let TIPO = "acrilico";
let FILTRO_TIPO = "";
let MODO = "una";
const POR_PAGINA = 10;
// tandas de 25: el plan gratuito corta a 50 subpeticiones y cada escritura cuenta
const TANDA = 25;
const TIPO_NOMBRE = { acrilico: "Acrílico", sticker: "Sticker" };

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
  if (dentro) { CARGANDO = true; pintarTabla(); listar(); }
  else { cerrarQR(); cerrarTarjeta(); $("clave").focus(); }
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

/* ---------- numeración de los códigos ---------- */

// Los códigos van en orden alfabético y son un contador en base 26: AAAA es la
// tarjeta nº 1, AAAB la nº 2, AADV la nº 100. Al abrir una tarjeta nueva el panel
// propone la siguiente libre, para no tener que llevar la cuenta a mano.
const LETRAS = 26;
const LARGO_CODIGO = 4;
const TOPE = Math.pow(LETRAS, LARGO_CODIGO);

function indiceDeCodigo(codigo) {
  if (!/^[A-Z]{4}$/.test(String(codigo || ""))) return -1;
  let n = 0;
  for (let i = 0; i < codigo.length; i++) n = n * LETRAS + (codigo.charCodeAt(i) - 65);
  return n;
}

function codigoDeIndice(n) {
  let salida = "";
  for (let i = 0; i < LARGO_CODIGO; i++) {
    salida = String.fromCharCode(65 + (n % LETRAS)) + salida;
    n = Math.floor(n / LETRAS);
  }
  return salida;
}

// Se salta los códigos que no sean cuatro letras: si alguna vez se activa uno a
// mano con números, la secuencia sigue contando por su lado sin romperse.
function siguienteCodigo() {
  let mayor = -1;
  TARJETAS.forEach((t) => {
    const n = indiceDeCodigo(t.codigo);
    if (n > mayor) mayor = n;
  });
  const proximo = mayor + 1;
  if (proximo >= TOPE) return { codigo: "", numero: 0 };
  return { codigo: codigoDeIndice(proximo), numero: proximo + 1 };
}

// Las 100 primeras se imprimieron en acrílico, de la 101 en adelante son
// stickers para mesa. Solo es el valor por defecto: el formulario lo cambia.
function tipoPorDefecto(codigo) {
  return indiceDeCodigo(codigo) >= 100 ? "sticker" : "acrilico";
}

function tipoDe(tarjeta) {
  return TIPO_NOMBRE[tarjeta.tipo] ? tarjeta.tipo : tipoPorDefecto(tarjeta.codigo);
}

function pintarTipo(valor) {
  TIPO = TIPO_NOMBRE[valor] ? valor : "acrilico";
  marcarSegmento("tipoTarjeta", TIPO);
}

function marcarSegmento(caja, valor) {
  const botones = $(caja).querySelectorAll("button");
  for (let i = 0; i < botones.length; i++) {
    botones[i].classList.toggle("activa", botones[i].dataset.valor === valor);
  }
}

function pintarNumero(codigo) {
  const n = indiceDeCodigo(codigo);
  $("numeroTarjeta").textContent = n < 0 ? "" : "nº " + (n + 1);
}

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

function placeIdDeDestino(destino) {
  const m = String(destino || "").match(/placeid=([A-Za-z0-9_-]+)/i);
  return m ? m[1] : "";
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
  URL_LEIDA = $("maps").value.trim();
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

function codigosDelRango() {
  const desde = parseInt($("desde").value, 10);
  const hasta = parseInt($("hasta").value, 10);
  if (!(desde >= 1) || !(hasta >= desde) || hasta > TOPE) return [];
  const lista = [];
  for (let n = desde; n <= hasta; n++) lista.push(codigoDeIndice(n - 1));
  return lista;
}

function pintarResumenRango() {
  const lista = codigosDelRango();
  const caja = $("rangoResumen");
  if (!lista.length) {
    caja.textContent = "Escribe un rango válido: del menor al mayor.";
    return;
  }
  caja.textContent = lista.length + (lista.length === 1 ? " tarjeta · " : " tarjetas · ") +
    lista[0] + " → " + lista[lista.length - 1];
}

$("formTarjeta").onsubmit = async (e) => {
  e.preventDefault();
  const destino = $("fichaReview").value.trim();
  if (!destino) {
    avisar("aviso", "Primero pega la URL de Google Maps y dale a Leer la URL.", false);
    return;
  }
  // sin esto, cambiar la URL y guardar sin releerla dejaría el destino viejo
  if ($("maps").value.trim() !== URL_LEIDA) {
    avisar("aviso", "Cambiaste la URL: dale a Leer la URL para confirmar el link nuevo.", false);
    return;
  }
  if (!$("negocio").value.trim()) {
    avisar("aviso", "Falta el nombre del negocio.", false);
    return;
  }
  const boton = $("guardar");
  const etiqueta = boton.textContent;
  boton.disabled = true;
  try {
    if (MODO === "rango") {
      const codigos = codigosDelRango();
      if (!codigos.length) {
        avisar("aviso", "El rango no es válido: el número final debe ser mayor o igual que el inicial.", false);
        return;
      }
      for (let i = 0; i < codigos.length; i += TANDA) {
        const tanda = codigos.slice(i, i + TANDA);
        boton.textContent = "Guardando " + Math.min(i + TANDA, codigos.length) + " de " + codigos.length + "…";
        await llamar("rango", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            codigos: tanda,
            negocio: $("negocio").value,
            destino: destino,
            tipo: TIPO,
          }),
        });
      }
      cerrarTarjeta();
      avisar("avisoPanel", codigos.length + " tarjetas apuntando a " + $("negocio").value +
        " (" + codigos[0] + " → " + codigos[codigos.length - 1] + ")", true);
      await listar();
      return;
    }

    boton.textContent = "Guardando…";
    const datos = await llamar("guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo: $("codigo").value,
        negocio: $("negocio").value,
        destino: destino,
        tipo: TIPO,
      }),
    });
    const editaba = Boolean(EDITANDO_CODIGO);
    cerrarTarjeta();
    avisar("avisoPanel", "Tarjeta " + datos.codigo + (editaba ? " actualizada" : " activada"), true);
    await listar();
    abrirQR(datos.codigo);
  } catch (e) {
    avisar("aviso", e.message, false);
  } finally {
    boton.disabled = false;
    boton.textContent = etiqueta;
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
  // el destino guardado se puede releer tal cual: el lector saca de ahí el Place ID
  $("maps").value = t.destino;
  URL_LEIDA = t.destino;
  pintarNumero(t.codigo);
  pintarTipo(tipoDe(t));
  pintarModo("una");
  $("fichaNombre").textContent = t.negocio || t.codigo;
  $("fichaMeta").textContent = placeIdDeDestino(t.destino)
    ? "Place ID: " + placeIdDeDestino(t.destino) : "";
  $("fichaReview").value = t.destino;
  $("ficha").hidden = false;

  $("tarjetaModalKicker").textContent = "Editar " + t.codigo;
  $("tarjetaModalTitulo").textContent = "Editar configuración";
  $("tarjetaModalSubtitulo").textContent = "Cambia el negocio o el link de reseña al que apunta esta tarjeta.";
  $("guardar").textContent = "Guardar cambios";
  limpiarAviso("aviso");
  abrirTarjetaModal();
}

function pintarModo(valor) {
  MODO = valor === "rango" ? "rango" : "una";
  marcarSegmento("modoTarjeta", MODO);
  $("campoUna").hidden = MODO === "rango";
  $("campoRango").hidden = MODO === "una";
  $("guardar").textContent = MODO === "rango"
    ? "Aplicar al rango"
    : (EDITANDO_CODIGO ? "Guardar cambios" : "Activar tarjeta");
  if (MODO === "rango") pintarResumenRango();
}

$("modoTarjeta").addEventListener("click", (e) => {
  const b = e.target.closest("[data-valor]");
  if (b) pintarModo(b.dataset.valor);
});

$("tipoTarjeta").addEventListener("click", (e) => {
  const b = e.target.closest("[data-valor]");
  if (b) pintarTipo(b.dataset.valor);
});

$("desde").addEventListener("input", pintarResumenRango);
$("hasta").addEventListener("input", pintarResumenRango);

function salirDeEdicion() {
  EDITANDO_CODIGO = "";
  $("codigo").value = $("negocio").value = $("maps").value = "";
  $("ficha").hidden = true;
  $("fichaReview").value = "";
  NOMBRE_AUTO = "";
  URL_LEIDA = "";
  $("numeroTarjeta").textContent = "";
  $("desde").value = $("hasta").value = "";
}

function prepararNuevaTarjeta() {
  salirDeEdicion();
  const sig = siguienteCodigo();
  $("codigo").value = sig.codigo;
  $("numeroTarjeta").textContent = sig.numero ? "nº " + sig.numero : "";
  pintarTipo(tipoPorDefecto(sig.codigo));
  pintarModo("una");
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

$("abrirRango").onclick = () => {
  salirDeEdicion();
  $("tarjetaModalKicker").textContent = "Varias tarjetas";
  $("tarjetaModalTitulo").textContent = "Editar un rango";
  $("tarjetaModalSubtitulo").textContent = "Un local con diez mesas son diez códigos distintos apuntando al mismo link. Se hace de una vez.";
  pintarTipo("sticker");
  pintarModo("rango");
  limpiarAviso("aviso");
  focoTarjeta = document.activeElement;
  $("modalTarjeta").hidden = false;
  document.body.style.overflow = "hidden";
  $("desde").focus();
};
$("cerrarTarjeta").onclick = cerrarTarjeta;
$("cancelarTarjeta").onclick = cerrarTarjeta;
$("modalTarjeta").addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-cerrar-tarjeta")) cerrarTarjeta();
});

/* ---------- listado, resumen y buscador ---------- */

function sinTildes(s) {
  return String(s == null ? "" : s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

async function listar() {
  try {
    const datos = await llamar("lista");
    TARJETAS = datos.tarjetas;
    CARGANDO = false;
    pintarResumen();
    pintarTabla();
  } catch (e) {
    CARGANDO = false;
    pintarTabla();
    avisar("avisoPanel", e.message, false);
  }
}

function pintarResumen() {
  const negocios = {};
  TARJETAS.forEach((t) => { const n = String(t.negocio || "").trim(); if (n) negocios[n] = 1; });
  const sig = siguienteCodigo();
  const activas = TARJETAS.filter((t) => t.destino).length;
  $("datoTarjetas").textContent = activas;
  $("datoTarjetasPie").textContent = activas === TARJETAS.length
    ? "Tarjetas activas"
    : "Activas de " + TARJETAS.length + " impresas";
  $("datoNegocios").textContent = Object.keys(negocios).length;
  $("datoSiguiente").textContent = sig.codigo || "—";
  $("datoSiguientePie").textContent = sig.numero
    ? "Siguiente código libre · nº " + sig.numero
    : "Secuencia completa";
}

function filtradas() {
  const busca = sinTildes($("buscar").value.trim());
  return TARJETAS.filter((t) => {
    if (FILTRO_TIPO && tipoDe(t) !== FILTRO_TIPO) return false;
    if (!busca) return true;
    return sinTildes(t.codigo).includes(busca) || sinTildes(t.negocio).includes(busca);
  });
}

$("filtroTipo").addEventListener("click", (e) => {
  const b = e.target.closest("[data-valor]");
  if (!b) return;
  FILTRO_TIPO = b.dataset.valor;
  marcarSegmento("filtroTipo", FILTRO_TIPO);
  PAGINA = 1;
  pintarTabla();
});

function esqueleto() {
  let filas = "";
  for (let i = 0; i < 6; i++) {
    filas += "<tr><td><span class='hueso corto'></span></td>" +
      "<td><span class='hueso medio'></span></td>" +
      "<td class='col-destino'><span class='hueso medio'></span></td>" +
      "<td><span class='hueso corto'></span></td></tr>";
  }
  return cabeceraTabla() + filas + "</tbody></table>";
}

function cabeceraTabla() {
  return "<table><thead><tr><th>Código</th><th>Negocio</th>" +
    "<th class='col-destino'>Place ID</th><th></th></tr></thead><tbody>";
}

function pintarTabla() {
  olvidarConfirmacion();
  $("limpiarBusca").hidden = !$("buscar").value;

  if (CARGANDO) {
    $("tabla").innerHTML = esqueleto();
    $("contador").textContent = "";
    return;
  }

  if (!TARJETAS.length) {
    $("tabla").innerHTML =
      "<div class='vacio'><div class='vacio-marca'>" +
      "<i class='m1'></i><i class='m2'></i><i class='m3'></i><i class='m4'></i>" +
      "</div><h2>Todavía no hay ninguna tarjeta</h2>" +
      "<p>Activa la primera y te devuelvo su QR listo para imprimir. " +
      "El código se propone solo: la primera es la AAAA.</p>" +
      "<button type='button' data-activar>Activar la primera tarjeta</button></div>";
    $("contador").textContent = "";
    return;
  }

  const lista = filtradas();
  const busca = $("buscar").value.trim();

  if (!lista.length) {
    $("tabla").innerHTML =
      "<div class='vacio'><h2>Sin coincidencias</h2>" +
      "<p>Ninguna tarjeta coincide" + (busca ? " con <b>" + escHtml(busca) + "</b>" : "") +
      (FILTRO_TIPO ? " en " + TIPO_NOMBRE[FILTRO_TIPO] : "") + ".</p>" +
      "<button type='button' class='fantasma' data-limpiar>Quitar los filtros</button></div>";
    $("contador").textContent = "0 de " + TARJETAS.length + " tarjetas";
    return;
  }

  const totalPaginas = Math.ceil(lista.length / POR_PAGINA);
  if (PAGINA > totalPaginas) PAGINA = totalPaginas;
  const inicio = (PAGINA - 1) * POR_PAGINA;
  const fin = Math.min(inicio + POR_PAGINA, lista.length);

  let filas = "";
  lista.slice(inicio, fin).forEach((t) => {
    const c = escHtml(t.codigo);
    const n = indiceDeCodigo(t.codigo);
    const place = placeIdDeDestino(t.destino);
    const tipo = tipoDe(t);
    filas +=
      "<tr><td><div class='cod'>" + c + "</div>" +
      (n < 0 ? "" : "<div class='fila-num'>nº " + (n + 1) + "</div>") +
      "</td><td class='negocio'>" + (escHtml(t.negocio) || "—") +
      "<div class='tipo tipo-" + tipo + "'>" + TIPO_NOMBRE[tipo] + "</div>" +
      "</td><td class='col-destino'><span class='place' title='" + escHtml(t.destino) + "'>" +
      (place ? escHtml(place) : escHtml(t.destino)) +
      "</span></td><td><div class='acciones'>" +
      "<button type='button' class='accion-qr' data-qr='" + c + "'>QR</button>" +
      "<button type='button' class='accion-editar' data-editar='" + c + "'>Editar</button>" +
      "<button type='button' class='accion-borrar' data-borrar='" + c + "'>Borrar</button>" +
      "</div></td></tr>";
  });

  $("tabla").innerHTML = cabeceraTabla() + filas + "</tbody></table>" +
    paginacion(PAGINA, totalPaginas);
  const acotado = busca || FILTRO_TIPO;
  $("contador").textContent = "Mostrando " + (inicio + 1) + "–" + fin + " de " + lista.length +
    (acotado ? " tarjetas filtradas, sobre " + TARJETAS.length : " tarjetas");
}

// Con 456.976 códigos posibles, listar todas las páginas no escala: se muestran
// la primera, la última y las vecinas de la actual.
function ventanaPaginas(actual, total) {
  const vistas = {};
  [1, 2, total - 1, total, actual - 1, actual, actual + 1].forEach((n) => {
    if (n >= 1 && n <= total) vistas[n] = 1;
  });
  return Object.keys(vistas).map(Number).sort((a, b) => a - b);
}

function paginacion(actual, total) {
  if (total <= 1) return "";
  let html = "<nav class='paginacion' aria-label='Paginación de tarjetas'>";
  html += "<button type='button' class='pagina' data-pagina='" + (actual - 1) + "'" +
    (actual === 1 ? " disabled" : "") + ">Anterior</button><div class='paginas'>";
  let previa = 0;
  ventanaPaginas(actual, total).forEach((i) => {
    if (previa && i > previa + 1) html += "<span class='salto'>…</span>";
    html += "<button type='button' class='pagina" + (i === actual ? " activa" : "") +
      "' data-pagina='" + i + "' aria-label='Página " + i + "'" +
      (i === actual ? " aria-current='page'" : "") + ">" + i + "</button>";
    previa = i;
  });
  html += "</div><button type='button' class='pagina' data-pagina='" + (actual + 1) + "'" +
    (actual === total ? " disabled" : "") + ">Siguiente</button></nav>";
  return html;
}

$("buscar").addEventListener("input", () => { PAGINA = 1; pintarTabla(); });
$("limpiarBusca").onclick = () => { $("buscar").value = ""; PAGINA = 1; pintarTabla(); $("buscar").focus(); };
$("recargar").onclick = () => { CARGANDO = true; pintarTabla(); listar(); };

/* ---------- borrado en dos toques ---------- */

// Antes esto era un confirm() del navegador: bloquea la página, no se puede
// estilar y en móvil se ve como un aviso del sistema. El segundo toque sobre el
// mismo botón dice lo mismo sin sacarte de la tabla.
// Hay que devolver el botón anterior a su sitio: si no, al armar otra fila la
// primera se queda diciendo "¿Seguro?" sin estarlo, y la tabla miente.
function olvidarConfirmacion() {
  clearTimeout(RELOJ_CONFIRMA);
  if (BOTON_CONFIRMA && BOTON_CONFIRMA.isConnected) {
    BOTON_CONFIRMA.textContent = "Borrar";
    BOTON_CONFIRMA.classList.remove("confirmando");
  }
  BOTON_CONFIRMA = null;
  CONFIRMANDO = "";
}

function pedirConfirmacion(boton, codigo) {
  olvidarConfirmacion();
  CONFIRMANDO = codigo;
  BOTON_CONFIRMA = boton;
  boton.textContent = "¿Seguro?";
  boton.classList.add("confirmando");
  RELOJ_CONFIRMA = setTimeout(olvidarConfirmacion, 4000);
}

$("tabla").addEventListener("click", async (e) => {
  if (e.target.closest("[data-activar]")) { prepararNuevaTarjeta(); return; }
  if (e.target.closest("[data-limpiar]")) {
    $("buscar").value = "";
    FILTRO_TIPO = "";
    marcarSegmento("filtroTipo", "");
    PAGINA = 1;
    pintarTabla();
    return;
  }

  const pg = e.target.closest("[data-pagina]");
  if (pg && !pg.disabled) { PAGINA = parseInt(pg.dataset.pagina, 10) || 1; pintarTabla(); return; }

  const ed = e.target.closest("[data-editar]");
  if (ed) { editar(ed.dataset.editar); return; }

  const q = e.target.closest("[data-qr]");
  if (q) { abrirQR(q.dataset.qr); return; }

  const b = e.target.closest("[data-borrar]");
  if (!b) return;
  const codigo = b.dataset.borrar;
  if (CONFIRMANDO !== codigo) { pedirConfirmacion(b, codigo); return; }

  olvidarConfirmacion();
  b.disabled = true;
  try {
    await llamar("borrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo: codigo }),
    });
    avisar("avisoPanel", "Tarjeta " + codigo + " borrada", true);
    cerrarQR();
    await listar();
  } catch (err) {
    avisar("avisoPanel", err.message, false);
    pintarTabla();
  }
});

/* ---------- QR de la tarjeta ---------- */

// Solo estos caracteres caben en el modo alfanumérico del estándar QR, que es
// bastante más compacto que el modo byte. Por eso la URL va en MAYÚSCULAS.
const ALFANUM = /^[0-9A-Z $%*+\-./:]+$/;

// Diámetro del hueco, en fracción del lado del QR. 0.34 se come el 9% del área;
// la corrección H tolera el 30%, así que sobra margen para tinta y escaneo malo.
const HUECO = 0.34;

function qrPng(texto, color, cell, quiet, hueco) {
  const modo = ALFANUM.test(texto) ? "Alphanumeric" : "Byte";
  // Con hueco sube a corrección H. Cuesta pasar de 25x25 a 29x29 módulos, así
  // que el sólido se queda en M: imprime más grande cada módulo.
  const t = qrcode(0, hueco ? "H" : "M");
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
  if (hueco) {
    // destination-out borra en vez de pintar: el hueco queda transparente de
    // verdad, y el borde del círculo corta los módulos en limpio
    x.globalCompositeOperation = "destination-out";
    x.beginPath();
    x.arc(c.width / 2, c.height / 2, (n * cell * HUECO) / 2, 0, Math.PI * 2);
    x.fill();
  }
  return { src: c.toDataURL("image/png"), modulos: n, modo: modo };
}

function tile(mod, src, etiqueta, archivo) {
  return "<figure class='qr-tile " + mod + "'>" +
    "<div class='qr-art'><img src='" + src + "' alt='QR de la tarjeta, " + etiqueta + "'></div>" +
    "<a class='qr-dl' href='" + src + "' download='" + archivo + "'>" + etiqueta + "</a>" +
    "</figure>";
}

function abrirQR(codigo) {
  const url = (ORIGEN + "/" + codigo).toUpperCase();
  const tarjeta = TARJETAS.filter((x) => x.codigo === codigo)[0];
  const n = indiceDeCodigo(codigo);
  $("qrNegocio").textContent = tarjeta && tarjeta.negocio ? tarjeta.negocio : "Tarjeta " + codigo;
  $("qrTitulo").textContent = "Tarjeta " + codigo + (n < 0 ? "" : " · nº " + (n + 1));
  $("qrUrl").textContent = url;
  $("nfcUrl").textContent = ORIGEN + "/" + codigo;

  if (typeof qrcode === "undefined") {
    $("qrPar").innerHTML = "<p>No se pudo cargar el generador de QR. Revisa tu conexión y recarga la página.</p>";
  } else {
    $("qrPar").innerHTML =
      tile("", qrPng(url, "#000000", 10, 4, false).src, "Negro", codigo + "-qr-negro.png") +
      tile("inv", qrPng(url, "#ffffff", 10, 4, false).src, "Blanco", codigo + "-qr-blanco.png") +
      tile("", qrPng(url, "#000000", 10, 4, true).src, "Negro con hueco", codigo + "-qr-negro-hueco.png") +
      tile("inv", qrPng(url, "#ffffff", 10, 4, true).src, "Blanco con hueco", codigo + "-qr-blanco-hueco.png");
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
    setTimeout(() => { b.textContent = "Copiar el link"; }, 1500);
  } catch (e) {
    avisar("avisoQR", "No se pudo copiar. Selecciona la URL a mano.", false);
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
  return `<!doctype html>${CABEZA}
<meta name="robots" content="noindex,nofollow">
<meta name="description" content="Panel interno para activar y reasignar las tarjetas de reseña.">
<title>Panel de tarjetas</title><style>${ESTILOS}</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>

<div class="grano"></div>

<div id="pantallaLogin" hidden>
  <main class="entrada">
    <div class="lamina franja entrada-caja">
      ${LOGO_G}
      <h1>Panel de tarjetas</h1>
      <p>Aquí se activan y se reasignan las tarjetas de reseña.</p>
      <form id="formLogin">
        <label for="clave">Contraseña</label>
        <input id="clave" type="password" autocomplete="current-password" autofocus>
        <div class="modal-acciones"><button type="submit">Entrar</button></div>
      </form>
      <div class="aviso" id="avisoLogin" role="alert"></div>
    </div>
  </main>
</div>

<div id="pantallaPanel" hidden>
  <a class="saltar" href="#principal">Ir al contenido</a>

  <header class="cabecera">
    <div class="envoltorio cabecera-fila">
      <div class="marca">
        ${LOGO_G}
        <span class="marca-texto">
          <strong>Tarjetas de reseña</strong>
          <span class="marca-host">${esc(host)}</span>
        </span>
      </div>
      <nav class="cabecera-acciones" aria-label="Acciones de la sesión">
        <button type="button" id="abrirActivar">Activar tarjeta</button>
        <button type="button" class="fantasma" id="salir">Cerrar sesión</button>
      </nav>
    </div>
  </header>

  <main id="principal" class="envoltorio contenido">
    <section class="lamina resumen" aria-label="Resumen">
      <div class="dato">
        <div class="dato-valor" id="datoTarjetas">—</div>
        <div class="dato-pie" id="datoTarjetasPie">Tarjetas activas</div>
      </div>
      <div class="dato">
        <div class="dato-valor" id="datoNegocios">—</div>
        <div class="dato-pie">Negocios distintos</div>
      </div>
      <div class="dato">
        <div class="dato-valor cod" id="datoSiguiente">—</div>
        <div class="dato-pie" id="datoSiguientePie">Siguiente código libre</div>
      </div>
    </section>

    <section class="lamina panel">
      <div class="panel-barra">
        <h2>Tarjetas</h2>
        <div class="cabecera-acciones">
          <button type="button" id="abrirRango">Editar un rango</button>
          <button type="button" class="fantasma" id="recargar">Refrescar</button>
        </div>
      </div>
      <div class="aviso" id="avisoPanel" role="status"></div>

      <div class="busca">
        <div class="busca-campo">
          <svg class="busca-lupa" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>
          </svg>
          <input id="buscar" type="search" placeholder="Buscar por código o por negocio"
                 aria-label="Buscar por código o por negocio" autocomplete="off">
        </div>
        <button type="button" class="fantasma" id="limpiarBusca" hidden>Limpiar</button>
      </div>

      <div class="segmento filtros" id="filtroTipo" role="group" aria-label="Filtrar por tipo">
        <button type="button" class="activa" data-valor="">Todas</button>
        <button type="button" data-valor="acrilico">Acrílico</button>
        <button type="button" data-valor="sticker">Sticker</button>
      </div>

      <div id="tabla"></div>
      <div class="contador" id="contador"></div>
    </section>
  </main>
</div>

<div class="modal" id="modalTarjeta" hidden>
  <div class="modal-fondo" data-cerrar-tarjeta></div>
  <div class="modal-caja modal-tarjeta franja" role="dialog" aria-modal="true" aria-labelledby="tarjetaModalTitulo" aria-describedby="tarjetaModalSubtitulo">
    <button type="button" class="modal-cerrar" id="cerrarTarjeta" aria-label="Cerrar">✕</button>
    <div class="modal-kicker" id="tarjetaModalKicker">Nueva tarjeta</div>
    <h1 id="tarjetaModalTitulo">Activar una tarjeta</h1>
    <p class="modal-subtitulo" id="tarjetaModalSubtitulo">Apunta el código impreso al link de reseña de un negocio.</p>

    <form id="formTarjeta">
      <div class="segmento" id="modoTarjeta" role="group" aria-label="Una tarjeta o un rango">
        <button type="button" class="activa" data-valor="una">Una tarjeta</button>
        <button type="button" data-valor="rango">Un rango</button>
      </div>

      <div id="campoUna">
        <label class="paso" for="codigo"><span class="n n1">1</span>Código de la tarjeta
          <span class="num" id="numeroTarjeta"></span></label>
        <input class="c1" id="codigo" placeholder="AADW" autocomplete="off">
      </div>

      <div id="campoRango" hidden>
        <label class="paso" for="desde"><span class="n n1">1</span>Rango de tarjetas
          <span class="suave">— por número</span></label>
        <div class="rango-fila">
          <input class="c1" id="desde" type="number" min="1" placeholder="Desde el nº 101" autocomplete="off">
          <input class="c1" id="hasta" type="number" min="1" placeholder="Hasta el nº 110" autocomplete="off">
        </div>
        <div class="rango-resumen" id="rangoResumen">Escribe un rango válido: del menor al mayor.</div>
      </div>

      <label class="paso" for="maps"><span class="n n2">2</span>URL de Google Maps del negocio</label>
      <p class="ayuda ayuda-alta">También sirve su <b>Place ID</b> o un link de reseña ya hecho.</p>
      <input class="c2" id="maps" placeholder="https://www.google.com/maps/place/…" autocomplete="off" required>

      <div class="modal-acciones acciones-izq">
        <button type="button" class="leer" id="analizar">Leer la URL</button>
      </div>
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

      <label class="paso" for="negocio"><span class="n n3">3</span>Nombre del negocio</label>
      <input class="c3" id="negocio" placeholder="Mercacentro Av. Guabinal" autocomplete="off" required>

      <label class="paso"><span class="n n4">4</span>Tipo de tarjeta</label>
      <div class="segmento" id="tipoTarjeta" role="group" aria-label="Tipo de tarjeta">
        <button type="button" class="activa" data-valor="acrilico">Acrílico</button>
        <button type="button" data-valor="sticker">Sticker</button>
      </div>
      <p class="ayuda">Acrílico: pieza de mesa, un solo local. Sticker: se pega en las
        mesas y el mismo lote se reparte entre varios locales.</p>

      <div class="modal-acciones">
        <span class="obligatorios">Los tres campos son obligatorios</span>
        <button type="button" class="fantasma" id="cancelarTarjeta">Cancelar</button>
        <button type="submit" id="guardar">Activar tarjeta</button>
      </div>

      <div class="aviso" id="aviso" role="alert"></div>
    </form>
  </div>
</div>

<div class="modal" id="modalQR" hidden>
  <div class="modal-fondo" data-cerrar></div>
  <div class="modal-caja franja" role="dialog" aria-modal="true" aria-labelledby="qrNegocio">
    <button class="modal-cerrar" id="cerrarQR" aria-label="Cerrar">✕</button>
    <h1 id="qrNegocio" class="qr-negocio">Nombre del negocio</h1>
    <p id="qrTitulo" class="qr-titulo">Tarjeta</p>
    <p class="qr-nota">Esto es lo que va impreso en el plástico, no el link de Google.</p>
    <div class="centrado"><span class="qr-url" id="qrUrl"></span></div>
    <div class="qr-pair" id="qrPar"></div>

    <div class="nfc">
      <b>Para grabar en el tag NFC</b>
      <span class="qr-url" id="nfcUrl"></span>
      <div><button class="fantasma" id="copiarNfc">Copiar el link</button></div>
    </div>
    <div class="aviso" id="avisoQR" role="alert"></div>
  </div>
</div>

<script>
const ORIGEN = ${JSON.stringify(origen)};
</script>
<script>${SCRIPT_PANEL}</script>`;
}
