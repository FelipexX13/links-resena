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
    /* los avisos van en relleno sólido con letra blanca: estos dos son los
       tonos más claros que todavía pasan AA contra el blanco */
    --verde-aviso:#1a7f3c; --rojo-aviso:#c0392f;

    /* neutros, todos con el mismo tinte frío */
    --tinta:#16202e; --tinta-2:#5b6779; --tinta-3:#667287;
    --linea:#e2e7f0; --linea-suave:#eef1f7;
    --papel:#fff; --papel-2:#f8fafd; --fondo:#f4f7fb;

    /* sombras tintadas con el azul del fondo, nunca negro puro */
    --sombra-1:0 1px 2px rgba(22,32,46,.05),0 4px 14px -8px rgba(22,32,46,.14);
    --sombra-2:0 1px 2px rgba(22,32,46,.05),0 20px 44px -24px rgba(22,32,46,.30);
    --sombra-3:0 44px 90px -30px rgba(13,20,36,.48);

    /* radios: contenedor suave, interior apretado */
    --r-xl:24px; --r-l:16px; --r-m:11px; --r-s:8px;

    /* filo de luz en el canto de arriba de cada superficie */
    --filo:inset 0 1px 0 rgba(255,255,255,.9);

    --ancho:1120px;
    --z-grano:5; --z-modal:100; --z-tostada:200;
    --paso:.16s cubic-bezier(.2,.7,.3,1);
    /* salida exponencial: arranca rápido y se posa, sin rebote */
    --paso-l:.34s cubic-bezier(.16,1,.3,1);
  }

  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  /* Una malla con los cuatro colores de la marca, diluida y anclada a la
     pantalla. El velo blanco va listado primero, así que pinta por encima y deja
     el centro tranquilo: el color vive en los bordes, donde no hay nada que
     leer, y las láminas van blancas encima sin perder contraste. */
  body{margin:0;padding:0;color:var(--tinta);
    background-color:var(--fondo);
    background-image:
      radial-gradient(72% 62% at 50% 46%,rgba(255,255,255,.86),transparent 78%),
      radial-gradient(64% 54% at 4% -6%,rgba(66,133,244,.20),transparent 66%),
      radial-gradient(56% 50% at 98% 0%,rgba(234,67,53,.15),transparent 66%),
      radial-gradient(58% 50% at 94% 102%,rgba(52,168,83,.16),transparent 66%),
      radial-gradient(58% 50% at 0% 100%,rgba(251,188,5,.18),transparent 66%);
    background-repeat:no-repeat;
    background-attachment:fixed;
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
  /* El filo claro de arriba las despega del fondo: sin él, sobre la malla de
     color, las láminas parecían recortadas y pegadas. */
  .lamina{background:var(--papel);border:1px solid var(--linea);border-radius:var(--r-xl);
    box-shadow:var(--sombra-1),var(--filo);position:relative;overflow:hidden}
  .franja::before{content:"";position:absolute;top:0;left:0;right:0;height:4px;z-index:1;
    background:linear-gradient(90deg,var(--logo-azul) 0 25%,var(--logo-rojo) 25% 50%,
      var(--logo-amarillo) 50% 75%,var(--logo-verde) 75% 100%)}

  .g{width:30px;height:30px;display:block;flex:0 0 auto}

  /* ---------- cabecera de la aplicación ---------- */
  .envoltorio{max-width:var(--ancho);margin:0 auto;padding:0 22px}
  /* Casi blanca y translúcida: es fija, así que el panel pasa desenfocado por
     debajo. Lo que la separa del fondo no es el color, es la sombra y la franja
     de la marca que la cierra por abajo. */
  .cabecera{position:sticky;top:0;z-index:10;background:rgba(255,255,255,.94);
    -webkit-backdrop-filter:blur(16px) saturate(1.4);
    backdrop-filter:blur(16px) saturate(1.4);
    box-shadow:0 1px 0 var(--linea),0 8px 24px -18px rgba(22,32,46,.5)}
  /* la franja de la marca cierra la barra por abajo */
  .cabecera::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;
    background:linear-gradient(90deg,var(--logo-azul) 0 25%,var(--logo-rojo) 25% 50%,
      var(--logo-amarillo) 50% 75%,var(--logo-verde) 75% 100%)}
  .cabecera-fila{display:flex;align-items:center;justify-content:space-between;gap:18px;
    flex-wrap:wrap;padding:20px 0}
  .marca{display:flex;align-items:center;gap:11px;min-width:0}
  .marca-texto{display:flex;flex-direction:column;line-height:1.25;min-width:0}
  .marca-texto strong{font-size:15px;font-weight:600;letter-spacing:-.015em}
  .marca-host{font-family:"Geist Mono",ui-monospace,monospace;font-size:11px;color:var(--tinta-3)}
  .cabecera-acciones{display:flex;gap:9px;flex-wrap:wrap}
  /* estos tres iconos solo salen cuando el botón se queda sin texto, en el
     teléfono; en pantalla grande el rótulo se explica solo */
  .icono-barra{display:none}

  .contenido{padding-top:34px;padding-bottom:80px}
  section+section{margin-top:20px}

  /* ---------- botones ---------- */
  button,a.boton{border:none;border-radius:999px;padding:10px 20px;cursor:pointer;
    font-family:inherit;font-weight:600;font-size:13.5px;letter-spacing:-.005em;
    background:var(--azul);color:#fff;white-space:nowrap;
    transition:background var(--paso),color var(--paso),border-color var(--paso),
      transform var(--paso),box-shadow var(--paso)}
  a.boton{display:inline-flex;align-items:center;gap:7px;text-decoration:none;line-height:1}
  button:hover,a.boton:hover{background:var(--azul-fuerte);color:#fff}
  button:active,a.boton:active{transform:translateY(1px)}
  :focus-visible{outline:2px solid var(--azul);outline-offset:2px}
  button.fantasma,a.boton.fantasma{background:var(--papel);color:var(--tinta-2);
    border:1px solid var(--linea)}
  button.fantasma:hover,a.boton.fantasma:hover{background:var(--papel-2);
    color:var(--tinta);border-color:var(--tinta-3)}
  button.leer{background:var(--azul-piel);color:var(--azul-fuerte);border:1px solid var(--azul-borde)}
  button.confirmando{background:var(--rojo);color:#fff;border-color:var(--rojo)}
  button.leer:hover{background:var(--azul);color:#fff;border-color:var(--azul)}
  button[disabled]{opacity:.45;cursor:not-allowed}
  button[disabled]:active{transform:none}

  /* Tres niveles, y cada uno significa algo. En reposo el botón es blanco con
     un filo gris y la letra de su color: se distingue cuál es cuál sin que diez
     filas se conviertan en cuarenta manchas. Al pasar por encima se rellena del
     tinte. Y el relleno sólido queda reservado para confirmar el apagado, que
     es el único momento en que el rojo tiene que alarmar de verdad.

     Los selectores van con .acciones delante a propósito: .acciones button pesa
     (0,1,1) y se comía los border-color de una sola clase. */
  .acciones{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;min-width:252px}
  .acciones button{width:100%;padding:7px 6px;font-size:12.5px;font-weight:500;
    background:var(--papel);color:var(--tinta-2);border:1px solid var(--linea)}
  .acciones .accion-qr{color:var(--verde-fuerte)}
  .acciones .accion-qr:hover{background:var(--verde-piel);border-color:var(--verde-borde)}
  .acciones .accion-editar{color:var(--azul-fuerte)}
  .acciones .accion-editar:hover{background:var(--azul-piel);border-color:var(--azul-borde)}
  .acciones .accion-apagar{color:var(--rojo-fuerte)}
  .acciones .accion-apagar:hover{background:var(--rojo-piel);border-color:var(--rojo-borde)}
  .acciones .accion-apagar.confirmando,
  .acciones .accion-apagar.confirmando:hover{background:var(--rojo);color:#fff;
    border-color:var(--rojo);box-shadow:0 0 0 3px var(--rojo-piel)}

  /* ---------- campos ---------- */
  label{display:block;font-weight:600;font-size:13px;margin:16px 0 6px;letter-spacing:-.005em}
  label .suave{font-weight:400;color:var(--tinta-2)}
  input,select{width:100%;padding:11px 13px;border:1px solid var(--linea);border-radius:var(--r-m);
    background:var(--papel-2);font-size:13px;color:var(--tinta);font-family:inherit;
    transition:border-color var(--paso),box-shadow var(--paso),background var(--paso)}
  select{cursor:pointer;appearance:none;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%235b6779' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat:no-repeat;background-position:right 13px center;padding-right:34px}
  input::placeholder{color:var(--tinta-3)}
  input:focus,select:focus{outline:none;background:var(--papel);border-color:var(--azul);
    box-shadow:0 0 0 3px var(--azul-piel)}
  input[readonly]{color:var(--tinta-2)}

  /* ---------- panel de tarjetas ---------- */
  .panel{padding:24px}
  /* la barra de mandos es la cabecera del panel: se separa del contenido con
     una línea, y así el buscador y los filtros se leen como una sola fila */
  .panel-barra{display:flex;align-items:center;justify-content:space-between;gap:14px;
    flex-wrap:wrap;padding-bottom:16px;border-bottom:1px solid var(--linea-suave)}
  .busca{display:flex;align-items:center;gap:9px;margin-top:16px;flex-wrap:wrap}
  .busca-campo{position:relative;flex:1 1 260px;min-width:0}
  .busca-campo input{padding-left:38px}
  .busca-lupa{position:absolute;left:13px;top:50%;transform:translateY(-50%);
    width:15px;height:15px;color:var(--tinta-3);pointer-events:none}

  /* una tabla ancha scrollea dentro de su caja; la página nunca */
  #tabla,#tablaLocales,#tablaGastos,#tablaInventario{overflow-x:auto}
  table{width:100%;border-collapse:collapse;margin-top:18px;font-size:13.5px}
  /* mismo tono que .cejilla: rótulos de instrumento, no frases */
  th{text-align:left;font-family:"Geist Mono",ui-monospace,monospace;font-size:10.5px;
    font-weight:500;letter-spacing:.09em;text-transform:uppercase;color:var(--tinta-3);
    border-bottom:1px solid var(--linea);padding:0 10px 9px;white-space:nowrap}
  td{padding:11px 10px;border-bottom:1px solid var(--linea-suave);vertical-align:middle}
  tbody tr{transition:background var(--paso)}
  tbody tr:hover{background:var(--papel-2)}
  td:last-child{width:1%;white-space:nowrap}
  .cod{font-weight:500;font-size:14px;letter-spacing:.06em}
  .fila-num{font-size:11.5px;color:var(--tinta-3);margin-top:1px}
  .negocio{font-weight:500}
  /* Los anchos se recalculaban con el contenido de cada página: una página sin
     place ids encogía esa columna y partía su rótulo en dos renglones. Con el
     código y el place id a medida fija, el negocio se queda con el sobrante y
     las columnas no se mueven al pasar de página. 30ch entra el id entero. */
  /* fixed y no auto: en auto el width es una sugerencia y el navegador la
     recalcula con lo que haya en la página */
  #tabla table{table-layout:fixed}
  #tabla th:first-child,#tabla td:first-child{width:96px}
  /* 318 del grid de botones + los 20 de padding de la celda */
  #tabla th:last-child,#tabla td:last-child{width:338px}
  .col-destino{width:240px}
  .place{font-family:"Geist Mono",ui-monospace,monospace;font-size:11.5px;color:var(--tinta-2);
    background:var(--papel-2);border:1px solid var(--linea);border-radius:var(--r-s);
    padding:3px 8px;display:inline-block;max-width:30ch;overflow:hidden;
    text-overflow:ellipsis;white-space:nowrap;vertical-align:middle}
  .sin-dato{color:var(--tinta-3)}
  @media (max-width:820px){.col-destino{display:none}}


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
  /* Flotan arriba a la derecha: un aviso metido en el flujo empujaba el panel
     entero hacia abajo cada vez que aparecía. */
  .tostadas{position:fixed;top:16px;right:16px;z-index:var(--z-tostada);display:flex;
    flex-direction:column;align-items:flex-end;gap:9px;pointer-events:none;
    max-width:min(420px,calc(100vw - 32px))}
  .tostada{display:flex;align-items:flex-start;gap:9px;pointer-events:auto;
    padding:11px 11px 11px 14px;border-radius:var(--r-m);font-size:13px;line-height:1.45;
    font-weight:500;color:#fff;box-shadow:var(--sombra-2);
    animation:tostada-entra .2s cubic-bezier(.2,.7,.3,1)}
  .tostada.ok{background:var(--verde-aviso)}
  .tostada.mal{background:var(--rojo-aviso)}
  .tostada::before{content:"";width:16px;height:16px;flex:0 0 auto;margin-top:1px;
    background-repeat:no-repeat;background-position:center;background-size:16px 16px}
  .tostada.ok::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E")}
  .tostada.mal::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M12 7.5v5.5M12 16.4v.01'/%3E%3C/svg%3E")}
  .tostada-x{flex:0 0 auto;width:20px;height:20px;padding:0;margin-top:-1px;border-radius:50%;
    background:rgba(255,255,255,.16);color:#fff;font-size:11px;line-height:1}
  .tostada-x:hover{background:rgba(255,255,255,.3)}
  .tostada.sale{animation:tostada-sale .18s ease-in forwards}
  @keyframes tostada-entra{from{opacity:0;transform:translateX(14px)}}
  @keyframes tostada-sale{to{opacity:0;transform:translateX(14px)}}

  .ayuda{font-size:12px;line-height:1.5;color:var(--tinta-2);margin:9px 0 0;max-width:62ch}
  .ayuda-alta{margin:0 0 8px}
  .enlace-mini{align-self:center;font-size:12px;color:var(--azul);text-decoration:none}
  .enlace-mini:hover{text-decoration:underline}
  .sobre-buscador{margin-top:8px}
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
  .modal-fondo{position:absolute;inset:0;background:rgba(9,15,28,.58);
    -webkit-backdrop-filter:blur(5px) saturate(.9);backdrop-filter:blur(5px) saturate(.9)}
  .modal-caja{position:relative;background:var(--papel);border-radius:var(--r-xl);width:100%;
    max-width:540px;max-height:88vh;overflow:auto;padding:30px;
    box-shadow:var(--sombra-3),var(--filo);
    animation:entra var(--paso-l) cubic-bezier(.16,1,.3,1)}
  @keyframes entra{from{opacity:0;transform:translateY(14px) scale(.982)}}
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
  .n4{background:var(--ambar);color:#4a3400}

  /* ---- segmentados: tipo de tarjeta, modo del formulario, filtro ---- */
  .segmento{display:inline-flex;gap:3px;padding:3px;background:var(--papel-2);
    border:1px solid var(--linea);border-radius:999px}
  .segmento button{background:transparent;color:var(--tinta-2);font-size:12.5px;
    padding:6px 15px;border-radius:999px}
  .segmento button:hover{background:var(--papel);color:var(--tinta)}
  .segmento button.activa{background:var(--azul);color:#fff}
  .segmento button.activa:hover{background:var(--azul-fuerte)}

  .tipo{display:inline-block;margin:4px 0 0 12px;font-size:11px;font-weight:500;
    border-radius:999px;padding:2px 9px;border:1px solid transparent}
  .tipo-acrilico{background:var(--azul-piel);color:var(--azul-fuerte);border-color:var(--azul-borde)}
  .tipo-sticker{background:var(--ambar-piel);color:var(--ambar-tinta);border-color:var(--ambar-borde)}

  .filtros{flex:0 0 auto}
  .mini{font-size:11.5px;font-weight:500;color:var(--tinta-2);margin:0 0 5px}

  /* ---- ventas: tarjeta de gráfica al estilo mono, con la paleta del panel ---- */
  /* dentro del panel, no es otra tarjeta: solo un bloque con su separador */
  .grafica{padding:18px 0 20px;margin-bottom:4px;border-bottom:1px solid var(--linea-suave)}
  .grafica-alto{display:flex;align-items:flex-start;justify-content:space-between;
    gap:14px;flex-wrap:wrap;margin-bottom:14px}
  .cejilla{font-size:11px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;
    color:var(--tinta-3);margin:0 0 5px}
  .metrica{font-size:23px;font-weight:700;letter-spacing:-.03em;line-height:1}
  .metrica .unidad{font-size:12px;font-weight:400;opacity:.65;margin-left:5px}
  .pozo{background:var(--papel-2);border:1px solid var(--linea-suave);border-radius:14px;
    padding:14px 12px 8px}
  .pozo svg{display:block;width:100%;height:auto}
  .grafica-pie{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;
    margin-top:14px;padding-top:12px;border-top:1px solid var(--linea-suave);
    font-family:"Geist Mono",ui-monospace,monospace;font-size:11px;color:var(--tinta-3)}
  .grafica-pie b{font-weight:500;color:var(--tinta)}
  .leyenda{display:flex;gap:14px;flex-wrap:wrap;align-items:center;font-size:12.5px;
    color:var(--tinta-2)}
  .leyenda span{display:inline-flex;align-items:center;gap:6px}
  .leyenda span::before{content:"";width:9px;height:9px;border-radius:3px;flex:0 0 auto}
  .leyenda .marca-entra::before{background:var(--verde)}
  .leyenda .marca-sale::before{background:var(--rojo)}

  .estado{display:inline-block;font-size:11px;font-weight:500;border-radius:999px;
    padding:2px 9px;border:1px solid transparent}
  .estado-vendido{background:var(--verde-piel);color:var(--verde-fuerte);border-color:var(--verde-borde)}
  .estado-pendiente{background:var(--ambar-piel);color:var(--ambar-tinta);border-color:var(--ambar-borde)}
  .piezas{font-family:"Geist Mono",ui-monospace,monospace;font-size:12px;color:var(--tinta-2)}
  .importe{font-family:"Geist Mono",ui-monospace,monospace;font-weight:500}
  .acciones-tarjeta{grid-template-columns:repeat(4,minmax(0,1fr));min-width:318px}
  /* El único que nace relleno, porque no es una acción: dice si el chip ya está
     grabado. Ahora que los otros tres van en blanco, el ámbar se ve de un
     vistazo y la columna se lee como lo que es, un inventario de lo hecho. */
  .acciones .accion-nfc{color:var(--tinta-3)}
  .acciones .accion-nfc:hover{background:var(--ambar-piel);color:var(--ambar-tinta);
    border-color:var(--ambar-borde)}
  .acciones .accion-nfc.puesto{background:var(--ambar-piel);color:var(--ambar-tinta);
    border-color:var(--ambar-borde)}
  .acciones .accion-nfc.puesto:hover{background:var(--ambar);color:#4a3400;
    border-color:var(--ambar)}
  .acciones-orden{grid-template-columns:repeat(3,minmax(0,1fr));min-width:240px}
  .tope{margin-top:20px;padding:13px 15px;border-radius:var(--r-m);
    background:var(--papel-2);border:1px solid var(--linea)}
  .tope .cejilla{margin-bottom:11px}
  .tope-socio+.tope-socio{margin-top:12px}
  .tope-alto{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;
    font-size:12.5px;color:var(--tinta-2)}
  .tope-alto b{color:var(--tinta);font-family:"Geist Mono",ui-monospace,monospace;font-weight:500}
  .tope-barra{margin-top:9px;height:7px;border-radius:999px;background:var(--linea);overflow:hidden}
  .tope-barra i{display:block;height:100%;border-radius:999px;background:var(--verde)}
  .tope.cerca .tope-barra i{background:var(--ambar)}
  .tope.pasado .tope-barra i{background:var(--rojo)}
  .tope-nota{margin-top:9px;font-size:11.5px;color:var(--tinta-3)}
  .tope-nota b{color:var(--tinta-2);font-weight:500}
  /* el comprobante no es parte del formulario: se manda con lo que ya está
     guardado, así que va en su propio bloque debajo */
  /* la cámara para leer el QR impreso: apunta y ya */
  .camara{position:relative;margin-top:12px;border-radius:var(--r-l);overflow:hidden;
    background:#0d1522}
  .camara video{display:block;width:100%;max-height:280px;object-fit:cover}
  .camara button{position:absolute;top:10px;right:10px;padding:6px 13px;font-size:12.5px}
  .camara-mira{position:absolute;left:50%;top:50%;width:150px;height:150px;margin:-75px 0 0 -75px;
    border:2px solid rgba(255,255,255,.85);border-radius:16px;pointer-events:none;
    box-shadow:0 0 0 2000px rgba(9,15,28,.35)}
  .escaneo{align-self:center;margin:0}
  /* las piezas escogidas una a una, para cuando el montón está revuelto */
  .chips .pieza{background:var(--azul-piel);color:var(--azul-fuerte);
    border-color:var(--azul-borde);font-family:"Geist Mono",ui-monospace,monospace}
  .chips .pieza b{font-weight:500;margin-left:6px;opacity:.7}
  .escaneo.malo{color:var(--rojo-fuerte)}

  /* precios a un toque: pastillas pequeñas, la sugerida marcada */
  /* Lo que va encontrando el buscador, ahí mismo: antes había que abrir el
     desplegable para ver si algo había coincidido. */
  .sugerencias{margin-top:6px;border:1px solid var(--linea);border-radius:var(--r-m);
    background:var(--papel);overflow:hidden;box-shadow:var(--sombra-1)}
  .sugerencias button{display:block;width:100%;text-align:left;padding:9px 13px;
    background:var(--papel);color:var(--tinta);border:0;border-radius:0;font-size:13.5px;
    font-weight:500;white-space:normal}
  .sugerencias button+button{border-top:1px solid var(--linea-suave)}
  .sugerencias button:hover{background:var(--azul-piel);color:var(--azul-fuerte)}
  .sugerencias .detalle{display:block;font-size:11.5px;font-weight:400;color:var(--tinta-3);
    margin-top:2px}
  .sugerencias .nada{padding:9px 13px;font-size:12.5px;color:var(--tinta-3)}

  .chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}
  .chips button{padding:5px 11px;font-size:12px;font-weight:500;border-radius:999px;
    background:var(--papel-2);color:var(--tinta-2);border:1px solid var(--linea)}
  .chips button:hover:not(:disabled){background:var(--azul-piel);color:var(--azul-fuerte);
    border-color:var(--azul-borde)}
  .chips button.sugerido{background:var(--azul-piel);color:var(--azul-fuerte);
    border-color:var(--azul-borde)}
  .chips button.sugerido:hover:not(:disabled){background:var(--azul);color:#fff;
    border-color:var(--azul)}
  .chips .tramo{font-size:10.5px;opacity:.7;margin-left:4px}
  .chips button.otro{background:transparent;border-style:dashed}
  .comprobante{margin-top:22px;padding-top:18px;border-top:1px solid var(--linea-suave)}
  .comprobante .modal-acciones{margin-top:10px}
  .casilla{display:flex;align-items:center;gap:9px;margin:16px 0 0;
    font-size:13px;font-weight:500;cursor:pointer}
  .casilla input{width:18px;height:18px;flex:0 0 auto;padding:0;margin:0;
    accent-color:var(--azul);cursor:pointer}
  .rango-fila{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}
  .rango-fila[hidden]{display:none}
  #rangoOrden{margin-top:14px}
  button.alerta{background:var(--ambar);color:#4a3400}
  button.alerta:hover{background:#e09b00;color:#3a2900}
  .banner{display:flex;align-items:center;gap:12px;flex-wrap:wrap;
    background:var(--ambar-piel);border:1px solid var(--ambar-borde);
    color:var(--ambar-tinta);border-radius:var(--r-l);padding:12px 16px;
    font-size:13px;margin-bottom:20px}
  .banner b{font-weight:600}
  /* el de después de aceptar: la orden ya está guardada, no es una advertencia */
  .banner.hecho{background:var(--verde-piel);border-color:var(--verde-borde);
    color:var(--verde-fuerte)}
  .banner.hecho button{margin-left:0}
  .banner.hecho .fantasma{margin-left:auto}
  .banner button{margin-left:auto}
  /* ---- cuentas ---- */
  .socios{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;
    margin:18px 0 4px}
  .socio{border:1px solid var(--linea);border-radius:var(--r-l);padding:14px 16px}
  .socio h3{margin:0 0 10px;font-size:14px;font-weight:600;letter-spacing:-.01em}
  .socio-linea{display:flex;justify-content:space-between;gap:10px;font-size:13px;
    padding:4px 0;color:var(--tinta-2)}
  .socio-linea b{color:var(--tinta);font-weight:500;
    font-family:"Geist Mono",ui-monospace,monospace}
  .saldo{margin-top:12px;padding:11px 14px;border-radius:var(--r-m);font-size:13px;
    background:var(--verde-piel);border:1px solid var(--verde-borde);color:var(--verde-fuerte)}
  .saldo.debe{background:var(--ambar-piel);border-color:var(--ambar-borde);color:var(--ambar-tinta)}
  .bloque-titulo{display:flex;align-items:center;justify-content:space-between;gap:12px;
    flex-wrap:wrap;margin:26px 0 0;padding-top:20px;border-top:1px solid var(--linea-suave)}
  .inv{font-family:"Geist Mono",ui-monospace,monospace;font-size:13px}
  .inv-malos{color:var(--rojo-fuerte)}
  .items-fila{display:grid;grid-template-columns:2fr 1fr 1fr;gap:8px;margin-top:8px}
  .sin-aire{margin-top:0}
  .par{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .mini2{font-size:10.5px;color:var(--tinta-3);margin:0 0 4px}
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
    border:1px solid var(--verde-borde);font-size:13px}
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
  .prueba-codigo{font-family:"Geist Mono",ui-monospace,monospace;font-weight:500;
    font-size:clamp(46px,15vw,74px);letter-spacing:.1em;line-height:1;margin:14px 0 4px}
  .prueba-numero{font-family:"Geist Mono",ui-monospace,monospace;font-size:14px;
    color:var(--tinta-3);margin-bottom:20px}
  .prueba-datos{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:22px}
  .prueba-datos div{background:var(--papel-2);border:1px solid var(--linea);
    border-radius:var(--r-m);padding:10px 12px;text-align:left}
  .prueba-datos span{display:block;font-size:11px;color:var(--tinta-3);margin-bottom:2px}
  .prueba-datos b{font-size:13.5px;font-weight:500;overflow-wrap:anywhere}
  .codigo-grande{display:inline-block;background:var(--ambar-piel);border:1px solid var(--ambar-borde);
    color:var(--ambar-tinta);border-radius:var(--r-m);padding:7px 15px;font-size:19px;
    font-weight:500;letter-spacing:.14em;
    font-family:"Geist Mono",ui-monospace,monospace}

  [hidden]{display:none !important}
  /* ---------- teléfono ---------- */
  /* Va al final del CSS a propósito: una media query solo gana a lo que tiene
     encima, y a mitad de hoja estas reglas las pisaba todo lo definido después. */
  @media (max-width:640px){
    /* Sin esto la fila reparte 230px a los botones y deja el nombre del negocio
       en 72px. Una tabla de 4 columnas no cabe: cada fila pasa a ser un bloque. */
    table,tbody,tr,td{display:block;width:auto}
    thead{display:none}
    table{margin-top:14px}
    tr{padding:17px 0;border-bottom:1px solid var(--linea-suave)}
    tr:hover{background:transparent}
    td{border:0;padding:0}
    td:last-child{width:auto;white-space:normal;padding-top:14px}
    /* Las medidas fijas de la tabla llevan #tabla delante y una media query no
       suma especificidad: sin repetir el selector, la celda de los botones se
       quedaba en 338px y "Desactivar" se salía de la pantalla. */
    #tabla th:first-child,#tabla td:first-child,
    #tabla th:last-child,#tabla td:last-child{width:auto}
    .negocio{font-size:15px;margin-top:2px}
    .acciones{grid-template-columns:repeat(3,minmax(0,1fr));min-width:0}
    /* son cuatro: con tres columnas caían 3+1 */
    .acciones-tarjeta{grid-template-columns:repeat(4,minmax(0,1fr));min-width:0}
    .acciones button{padding:9px 6px}
    /* en 390px cada uno se queda con 78: "Desactivar" no entra a 12.5 */
    .acciones-tarjeta button{padding:9px 3px;font-size:11.5px}

    /* 132px de cabecera fija en una pantalla de 844 es peaje permanente */
    .cabecera{position:static}
    /* Con .cabecera-fila a secas ganaba .envoltorio, que va más abajo en este
       mismo bloque y reparte "padding:0 16px": la barra se quedaba sin aire
       arriba y la marca tocaba el borde de la pantalla. */
    .cabecera .cabecera-fila{padding:15px 16px;gap:14px}
    .marca .g{width:26px;height:26px}
    /* Estirados a media fila salían cuatro pastillas de 310x74: un cuarto de la
       pantalla para la barra. A su ancho natural caben dos por fila y la
       cabecera baja de 250px a poco más de 150. */
    .cabecera-acciones{width:100%;gap:8px}
    .cabecera-acciones button,.cabecera-acciones a.boton{padding:9px 14px;font-size:12.5px}
    /* Con rótulo, estos cuatro ocupaban dos filas enteras de la barra. En un
       teléfono el texto sobra: el icono basta y caben los cuatro en una fila.
       La etiqueta sigue en el marcado, escondida, porque es de donde el lector
       de pantalla saca el nombre del botón. */
    .cabecera .cabecera-acciones{display:flex;gap:14px}
    /* display:flex explícito: un <button> es inline-block por defecto, así que
       justify-content no hacía nada y el icono se apoyaba en la línea base */
    .cabecera .cabecera-acciones button,
    .cabecera .cabecera-acciones a.boton{width:46px;height:46px;flex:0 0 auto;
      padding:0;border-radius:50%;display:flex;align-items:center;
      justify-content:center;line-height:0;letter-spacing:0}
    .cabecera .icono-barra{display:block}
    .cabecera .cabecera-acciones svg{width:19px;height:19px}
    .cabecera .etiqueta{position:absolute;width:1px;height:1px;padding:0;margin:-1px;
      overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}

    .envoltorio{padding:0 16px}
    .contenido{padding-top:22px;padding-bottom:56px}
    .panel{padding:20px 14px}
    /* En 390px se llegaba a la primera tarjeta en el pixel 439: media pantalla
       de mandos. Los tres del panel pasan a rejilla —reparten el ancho en vez
       de envolverse 2+1— y los aires de alrededor se aprietan. */
    .panel-barra{padding-bottom:16px}
    .panel-barra .cabecera-acciones{display:grid;gap:6px;
      grid-template-columns:repeat(auto-fit,minmax(88px,1fr))}
    .panel-barra .cabecera-acciones button{width:100%;padding:9px 6px;font-size:12px}
    .busca{margin-top:16px}

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
  }
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

// Mientras el modo pruebas está puesto, la tarjeta enseña quién es en vez de
// mandar a Google: es lo que permite casar el plástico impreso con el registro.
export function vistaPrueba(codigo, tarjeta) {
  let n = 0;
  for (const c of codigo) n = n * 26 + (c.charCodeAt(0) - 65);
  const numero = /^[A-Z]{4}$/.test(codigo) ? n + 1 : 0;
  const tipo = tarjeta.tipo === "sticker" ? "Sticker" : "Acrílico";

  return `<!doctype html>${CABEZA}
<meta name="robots" content="noindex,nofollow">
<title>${esc(codigo)} · prueba</title><style>${ESTILOS}</style>
<div class="grano"></div>
<main class="publica">
  <div class="lamina franja publica-caja centrado">
    <p class="cejilla">Modo pruebas</p>
    <div class="prueba-codigo">${esc(codigo)}</div>
    ${numero ? `<div class="prueba-numero">tarjeta nº ${numero}</div>` : ""}
    <div class="prueba-datos">
      <div><span>Negocio</span><b>${esc(tarjeta.negocio || "sin asignar")}</b></div>
      <div><span>Tipo</span><b>${tipo}</b></div>
    </div>
    ${tarjeta.destino
      ? `<a class="boton" href="${esc(tarjeta.destino)}">Ir a la reseña de verdad</a>`
      : `<p class="ayuda centrado">Esta tarjeta todavía no está vinculada a ningún local.</p>`}
    <p class="ayuda centrado">Con las pruebas puestas ningún escaneo sale a Google.
    Apágalas en el panel cuando termines de revisar las impresiones.</p>
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
let focoVenta = null;
let NOMBRE_AUTO = "";
let URL_LEIDA = "";
let EDITANDO_CODIGO = "";
let CONFIRMANDO = "";
let RELOJ_CONFIRMA = null;
let BOTON_CONFIRMA = null;
let ETIQUETA_CONFIRMA = "Desactivar";
let PAGINA = 1;
let TIPO = "acrilico";
let FILTRO_TIPO = "";
let MODO = "una";
let ORIGEN_RANGO = "numero";
let VENTA_EDITADA = { vendida: "", precio: 0 };
let VISTA = "tarjetas";
let PRUEBAS = false;
let GASTOS = [];
let SERVICIOS = [];
let VENDEDORES = { felipe: null, nicolas: null };
let QUIEN_VENDE = "felipe";
let COMPRADORES = {};
let COMPROBANTES = {};
let NFC = {};
let GASTO_EDITADO = "";
const DIAS_DINERO = 30;
const SOCIO_NOMBRE = { felipe: "Felipe", nicolas: "Nicolás", ambos: "Compartido" };
let METRICA = "unidades";
let PAGINA_ORDENES = 1;
let PAGINA_GASTOS = 1;
let LOCAL_VENTA = null;
const DIAS_GRAFICA = 14;
const POR_PAGINA = 10;
// tandas de 25: el plan gratuito corta a 50 subpeticiones y cada escritura cuenta
const TANDA = 25;
const TIPO_NOMBRE = { acrilico: "Acrílico", sticker: "Sticker" };

function escHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Un aviso por cada sitio empujaba el panel al aparecer. Ahora hay una sola pila
// flotante y el primer argumento se ignora: se conserva por las llamadas de
// siempre, que dicen dónde habría salido antes.
const VIDA_TOSTADA = { ok: 6000, mal: 9000 };

function quitarTostada(t) {
  if (!t || !t.isConnected || t.classList.contains("sale")) return;
  t.classList.add("sale");
  setTimeout(() => t.remove(), 200);
}

function avisar(caja, texto, ok) {
  const t = document.createElement("div");
  t.className = "tostada " + (ok ? "ok" : "mal");

  const cuerpo = document.createElement("span");
  cuerpo.textContent = texto;

  const cerrar = document.createElement("button");
  cerrar.type = "button";
  cerrar.className = "tostada-x";
  cerrar.setAttribute("aria-label", "Cerrar el aviso");
  cerrar.textContent = "✕";
  cerrar.onclick = () => quitarTostada(t);

  t.appendChild(cuerpo);
  t.appendChild(cerrar);
  $("tostadas").appendChild(t);
  // el error dura más: hay que alcanzar a leerlo
  setTimeout(() => quitarTostada(t), ok ? VIDA_TOSTADA.ok : VIDA_TOSTADA.mal);
}

function limpiarAviso() {
  [].slice.call($("tostadas").children).forEach(quitarTostada);
}

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
  if (dentro) {
    CARGANDO = true;
    pintarTabla();
    listar();
    llamar("modo").then((r) => pintarPruebas(r.prueba)).catch(() => {});
    cargarGastos();
    cargarServicios();
    cargarAjustes();
  }
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

// El botón de compartir de la app de Maps da uno de estos, y por dentro no
// traen nada: el identificador aparece al seguirlos, que lo hace el Worker.
function esLinkCorto(url) {
  return /^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps|g\.co\/kgs)/i.test(String(url).trim());
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

  if (esLinkCorto(url)) return { corto: true };

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

// Un local que ya está en el sistema tiene su link guardado. Volver a pegar la
// URL de Maps para añadirle mesas es trabajo repetido, y una oportunidad de
// equivocarse de negocio.
function llenarLocales(filtro) {
  const busca = sinTildes(String(filtro || ""));
  const lista = locales().filter((l) => !busca || sinTildes(l.negocio).includes(busca));
  let html = "<option value=''>Local nuevo — pego su URL abajo</option>";
  lista.forEach((l) => {
    html += "<option value='" + escHtml(l.negocio) + "'>" + escHtml(l.negocio) +
      " · " + plural(l.acrilico + l.sticker, "pieza", "piezas") +
      (l.vendidas ? " · cobrado" : " · pendiente") + "</option>";
  });
  // conserva lo elegido si el local sigue existiendo; si no, cae a "Local nuevo"
  const previo = $("localExistente").value;
  $("localExistente").innerHTML = html;
  $("localExistente").value = previo;

  // el mismo listado, pero aquí responde a otra pregunta: qué tarjetas se tocan
  let ordenes = "<option value=''>Elige la orden</option>";
  lista.forEach((l) => {
    ordenes += "<option value='" + escHtml(l.negocio) + "'>" + escHtml(l.negocio) +
      " · " + plural(l.acrilico + l.sticker, "pieza", "piezas") + "</option>";
  });
  const antes = $("ordenRango").value;
  $("ordenRango").innerHTML = ordenes;
  $("ordenRango").value = antes;
}

$("buscarLocal").addEventListener("input", () => {
  llenarLocales($("buscarLocal").value);
  pintarSugerencias($("buscarLocal").value);
});

function pintarSugerencias(filtro) {
  const busca = sinTildes(String(filtro || "").trim());
  const caja = $("sugerenciasLocal");
  if (!busca) { caja.hidden = true; caja.innerHTML = ""; return; }

  const halla = locales().filter((l) => sinTildes(l.negocio).includes(busca)).slice(0, 6);
  caja.hidden = false;
  if (!halla.length) {
    caja.innerHTML = "<div class='nada'>Ningún local con ese nombre. Pega su URL abajo.</div>";
    return;
  }
  caja.innerHTML = halla.map((l) => "<button type='button' data-local-elegido='" +
    escHtml(l.negocio) + "'>" + escHtml(l.negocio) +
    "<span class='detalle'>" + plural(l.acrilico + l.sticker, "pieza", "piezas") +
    (l.cobrado ? " · cobrado" : " · pendiente") + "</span></button>").join("");
}

$("sugerenciasLocal").addEventListener("click", (e) => {
  const b = e.target.closest("[data-local-elegido]");
  if (!b) return;
  $("localExistente").value = b.dataset.localElegido;
  $("localExistente").dispatchEvent(new Event("change"));
  $("buscarLocal").value = "";
  $("sugerenciasLocal").hidden = true;
  $("sugerenciasLocal").innerHTML = "";
});

$("localExistente").addEventListener("change", () => {
  const elegido = $("localExistente").value;
  if (!elegido) return;
  const l = locales().filter((x) => x.negocio === elegido)[0];
  if (!l) return;
  $("negocio").value = l.negocio;
  NOMBRE_AUTO = l.negocio;
  $("maps").value = l.destino;
  URL_LEIDA = l.destino;
  $("fichaNombre").textContent = l.negocio;
  $("fichaReview").value = l.destino;
  const place = placeIdDeDestino(l.destino);
  $("fichaMeta").textContent = place ? "Place ID: " + place : "";
  $("ficha").hidden = false;
  limpiarAviso("aviso");
});

$("analizar").onclick = async () => {
  const boton = $("analizar");
  let crudo = $("maps").value.trim();

  // un link corto se abre primero y se vuelve a leer con la URL larga
  if (esLinkCorto(crudo)) {
    const etiqueta = boton.textContent;
    boton.disabled = true;
    boton.textContent = "Abriendo el link…";
    try {
      const r = await llamar("resolver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: crudo }),
      });
      crudo = r.url;
      $("maps").value = crudo;
    } catch (err) {
      avisar("aviso", err.message, false);
      return;
    } finally {
      boton.disabled = false;
      boton.textContent = etiqueta;
    }
  }

  const r = analizarMaps(crudo);
  if (r.corto) {
    $("ficha").hidden = true;
    avisar("aviso", "Ese link corto no llevó a una ficha con identificador.", false);
    return;
  }
  if (r.error) {
    $("ficha").hidden = true;
    avisar("aviso", r.error, false);
    return;
  }
  limpiarAviso("aviso");
  $("localExistente").value = "";
  URL_LEIDA = crudo;
  $("fichaNombre").textContent = r.negocio || "Link listo";
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

// Las tarjetas ya impresas que todavía no apuntan a ningún sitio. Se reparten en
// orden, así se agotan los códigos bajos antes de tocar los altos.
function libresPorTipo(tipo) {
  return TARJETAS.filter((t) => !t.destino && tipoDe(t) === tipo)
    .map((t) => t.codigo)
    .sort();
}

function pedidasDelLocal() {
  const na = Math.max(0, parseInt($("nAcrilicos").value, 10) || 0);
  const ns = Math.max(0, parseInt($("nStickers").value, 10) || 0);
  return { acrilicos: na, stickers: ns };
}

function primeraLibre(tipo) {
  const libres = libresPorTipo(tipo);
  return libres.length ? indiceDeCodigo(libres[0]) + 1 : "";
}

// Un bloque seguido desde el número que se pida. No salta las ocupadas: si hay
// una dentro, lo dice y no deja guardar. Saltarlas daría un lote distinto del
// que la persona tiene en la mano.
function bloqueDesde(tipo, desde, cuantas) {
  const res = { codigos: [], problema: "" };
  if (!cuantas) return res;
  if (!(desde >= 1)) { res.problema = "falta el número inicial"; return res; }
  for (let n = desde; res.codigos.length < cuantas; n++) {
    if (n > TOPE) { res.problema = "el bloque se sale de la numeración"; return res; }
    const codigo = codigoDeIndice(n - 1);
    const t = TARJETAS.filter((x) => x.codigo === codigo)[0];
    if (!t) { res.problema = "la nº " + n + " no está impresa"; return res; }
    if (tipoDe(t) !== tipo) {
      res.problema = "la nº " + n + " no es " + (tipo === "acrilico" ? "acrílico" : "sticker");
      return res;
    }
    if (t.destino) {
      res.problema = "la nº " + n + " (" + codigo + ") ya está ocupada";
      return res;
    }
    res.codigos.push(codigo);
  }
  return res;
}

// Si el negocio ya tiene una orden, esto no es un alta sino un cambio de tamaño:
// se toman las libres que falten, o se sueltan las que sobren. Las que ya tiene y
// siguen dentro no se tocan, así no se pisa su venta.
function planDelLocal() {
  const p = pedidasDelLocal();
  const nombre = $("negocio").value.trim();
  const base = locales().filter((x) => x.negocio === nombre)[0] || null;
  const plan = { base: base, tomar: {}, soltar: {}, falta: [], pedidas: p,
    sueltas: PIEZAS_SUELTAS.length > 0 };

  // Con piezas escaneadas la orden es exactamente esas, sin rangos de por medio.
  if (plan.sueltas) {
    const porTipo = { acrilico: [], sticker: [] };
    PIEZAS_SUELTAS.forEach((c) => {
      const t = TARJETAS.filter((x) => x.codigo === c)[0];
      if (t) porTipo[tipoDe(t)].push(c);
    });
    ["acrilico", "sticker"].forEach((tipo) => {
      const tiene = base ? base.codigos[tipo] : [];
      plan.tomar[tipo] = porTipo[tipo].filter((c) => tiene.indexOf(c) < 0);
      plan.soltar[tipo] = tiene.filter((c) => porTipo[tipo].indexOf(c) < 0);
      const ajenas = plan.tomar[tipo].filter((c) => {
        const t = TARJETAS.filter((x) => x.codigo === c)[0];
        return t && t.negocio && t.negocio !== nombre;
      });
      if (ajenas.length) {
        plan.falta.push(ajenas.join(", ") + (ajenas.length === 1 ? " ya tiene dueño" : " ya tienen dueño"));
      }
    });
    plan.pedidas = { acrilicos: porTipo.acrilico.length, stickers: porTipo.sticker.length };
    return plan;
  }

  [["acrilico", p.acrilicos, "acrílico", "acrílicos"],
   ["sticker", p.stickers, "sticker", "stickers"]].forEach((fila) => {
    const tipo = fila[0], quiere = fila[1];
    const tiene = base ? base[tipo] : 0;
    plan.tomar[tipo] = [];
    plan.soltar[tipo] = [];
    if (quiere > tiene) {
      const desde = parseInt($(tipo === "acrilico" ? "desdeAcrilico" : "desdeSticker").value, 10);
      const bloque = bloqueDesde(tipo, desde, quiere - tiene);
      plan.tomar[tipo] = bloque.codigos;
      if (bloque.problema) plan.falta.push(fila[3] + ": " + bloque.problema);
    } else if (quiere < tiene) {
      plan.soltar[tipo] = base.codigos[tipo].slice().sort().slice(quiere);
    }
  });
  return plan;
}

function tramo(codigos) {
  if (!codigos.length) return "";
  return codigos.length === 1
    ? codigos[0]
    : codigos[0] + " → " + codigos[codigos.length - 1];
}

function nombreTipo(tipo, n) {
  return tipo === "acrilico" ? plural(n, "acrílico", "acrílicos") : plural(n, "sticker", "stickers");
}

function pintarResumenLocal() {
  const plan = planDelLocal();
  const caja = $("localResumen");

  if (plan.falta.length) { caja.textContent = "No alcanza — " + plan.falta.join(" · "); return; }

  // escaneadas van sueltas y desordenadas: "AAAF → AAAD" se leería como un rango
  const comoSeVe = (codigos) => plan.sueltas ? codigos.join(", ") : tramo(codigos);

  const partes = [];
  ["acrilico", "sticker"].forEach((tipo) => {
    if (plan.tomar[tipo].length) {
      partes.push((plan.base ? "+" : "") + nombreTipo(tipo, plan.tomar[tipo].length) +
        " · " + comoSeVe(plan.tomar[tipo]));
    }
    if (plan.soltar[tipo].length) {
      partes.push("−" + nombreTipo(tipo, plan.soltar[tipo].length) +
        " · " + comoSeVe(plan.soltar[tipo]) + " quedan libres");
    }
  });

  if (!partes.length) {
    caja.textContent = plan.base
      ? plan.base.negocio + " ya tiene esas piezas: " +
        nombreTipo("acrilico", plan.base.acrilico) + " y " + nombreTipo("sticker", plan.base.sticker)
      : (plan.sueltas
        ? "Sigue escaneando piezas para la orden."
        : "Escribe cuántos acrílicos y cuántos stickers lleva la orden.");
    return;
  }

  let texto = partes.join("   ");
  if (plan.base) {
    texto = plan.base.negocio + ": de " + plan.base.acrilico + "+" + plan.base.sticker +
      " a " + plan.pedidas.acrilicos + "+" + plan.pedidas.stickers + "   ·   " + texto;
    if ($("fichaReview").value && $("fichaReview").value !== plan.base.destino) {
      texto += "   ·   Ojo: el link cambió, pero solo lo llevan las tarjetas nuevas.";
    }
  }
  caja.textContent = texto;
}

function codigosPorNumero() {
  const desde = parseInt($("desde").value, 10);
  const hasta = parseInt($("hasta").value, 10);
  if (!(desde >= 1) || !(hasta >= desde) || hasta > TOPE) return [];
  const lista = [];
  for (let n = desde; n <= hasta; n++) lista.push(codigoDeIndice(n - 1));
  return lista;
}

// Los códigos que hay que escribir, ya separados por tipo. Una orden mezcla
// acrílicos y stickers, y cada tanda del endpoint escribe un solo tipo: si se
// mandaran juntos, la mitad cambiaría de tipo sin querer.
function gruposDelRango() {
  if (ORIGEN_RANGO === "orden") {
    const l = locales().filter((x) => x.negocio === $("ordenRango").value)[0];
    if (!l) return [];
    return [["acrilico", l.codigos.acrilico], ["sticker", l.codigos.sticker]]
      .filter((g) => g[1].length);
  }
  const lista = codigosPorNumero();
  return lista.length ? [[TIPO, lista]] : [];
}

function totalDeGrupos(grupos) {
  return grupos.reduce((a, g) => a + g[1].length, 0);
}

function pintarResumenRango() {
  const caja = $("rangoResumen");
  const grupos = gruposDelRango();
  const total = totalDeGrupos(grupos);

  if (ORIGEN_RANGO === "orden") {
    if (!$("ordenRango").value) { caja.textContent = "Elige la orden que vas a editar."; return; }
    if (!total) { caja.textContent = "Esa orden ya no tiene tarjetas."; return; }
    const partes = grupos.map((g) =>
      plural(g[1].length, g[0] === "acrilico" ? "acrílico" : "sticker",
        g[0] === "acrilico" ? "acrílicos" : "stickers") + " · " + tramo(g[1]));
    caja.textContent = partes.join("   +   ");
    return;
  }

  if (!total) { caja.textContent = "Escribe un rango válido: del menor al mayor."; return; }
  const lista = grupos[0][1];
  caja.textContent = plural(total, "tarjeta", "tarjetas") + " · " + tramo(lista);
}

function pintarOrigenRango(valor) {
  ORIGEN_RANGO = valor === "orden" ? "orden" : "numero";
  marcarSegmento("origenRango", ORIGEN_RANGO);
  $("rangoNumeros").hidden = ORIGEN_RANGO !== "numero";
  $("rangoOrden").hidden = ORIGEN_RANGO !== "orden";
  // en una orden el tipo lo trae cada tarjeta, no se elige
  $("bloqueTipo").hidden = MODO === "local" || (MODO === "rango" && ORIGEN_RANGO === "orden");
  pintarResumenRango();
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
    if (MODO === "local") {
      const plan = planDelLocal();
      if (plan.falta.length) {
        avisar("aviso", "No hay tarjetas libres suficientes. Revisa el resumen.", false);
        return;
      }
      const aTomar = plan.tomar.acrilico.length + plan.tomar.sticker.length;
      const aSoltar = plan.soltar.acrilico.length + plan.soltar.sticker.length;
      const previa = fichaDe($("negocio").value.trim());
      const lleva = $("ordenLlevaFicha").checked;
      const fichaCambia = lleva !== Boolean(previa) ||
        (lleva && previa && (Boolean(previa.hecha) !== $("ordenFichaHecha").checked ||
          (previa.notas || "") !== $("ordenFichaNotas").value.trim()));
      if (!aTomar && !aSoltar && !fichaCambia) {
        avisar("aviso", plan.base
          ? "Esa orden ya tiene esas piezas. Cambia algo antes de guardar."
          : "Escribe cuántas piezas lleva la orden, o márcale la ficha.", false);
        return;
      }

      const total = aTomar + aSoltar;
      let hechas = 0;
      for (const tipo of ["acrilico", "sticker"]) {
        const codigos = plan.tomar[tipo];
        for (let i = 0; i < codigos.length; i += TANDA) {
          const tanda = codigos.slice(i, i + TANDA);
          hechas += tanda.length;
          boton.textContent = "Guardando " + hechas + " de " + total + "…";
          await llamar("rango", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              codigos: tanda,
              negocio: $("negocio").value,
              destino: destino,
              tipo: tipo,
            }),
          });
        }
      }
      for (const tipo of ["acrilico", "sticker"]) {
        const codigos = plan.soltar[tipo];
        for (let i = 0; i < codigos.length; i += TANDA) {
          const tanda = codigos.slice(i, i + TANDA);
          hechas += tanda.length;
          boton.textContent = "Liberando " + hechas + " de " + total + "…";
          await llamar("desactivar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codigos: tanda, tipo: tipo, desde: plan.base }),
          });
        }
      }

      // La ficha no lleva precio aquí: si es nueva nace sin cobrar y se le pone el
      // precio al aceptar la orden, con las tarjetas.
      let fichaNueva = null;
      let fichaFuera = null;
      if (fichaCambia) {
        boton.textContent = "Guardando la ficha…";
        if (lleva) {
          fichaNueva = await llamar("servicio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: previa ? previa.id : undefined,
              negocio: $("negocio").value.trim(),
              precio: previa ? Number(previa.precio) || 0 : 0,
              fecha: previa ? previa.fecha || "" : "",
              vendedor: previa ? previa.vendedor || "" : "",
              hecha: $("ordenFichaHecha").checked,
              notas: $("ordenFichaNotas").value.trim(),
            }),
          });
        } else if (previa) {
          await llamar("servicio-borrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: previa.id }),
          });
          fichaFuera = previa.id;
        }
      }

      cerrarTarjeta();
      for (const tipo of ["acrilico", "sticker"]) {
        if (plan.tomar[tipo].length) {
          parchearTarjetas(plan.tomar[tipo], {
            negocio: $("negocio").value.trim(), destino: destino, tipo: tipo,
            vendida: "", precio: 0,
          });
        }
        if (plan.soltar[tipo].length) {
          parchearTarjetas(plan.soltar[tipo], { negocio: "", destino: "", vendida: "", precio: 0 });
        }
      }
      if (fichaNueva) parchearServicio(fichaNueva.id, fichaNueva);
      if (fichaFuera) parchearServicio(fichaFuera, null);
      const cola = [];
      if (aTomar) cola.push(plural(aTomar, "tarjeta ocupada", "tarjetas ocupadas"));
      if (aSoltar) cola.push(plural(aSoltar, "tarjeta liberada", "tarjetas liberadas"));
      if (fichaNueva) cola.push("ficha de Google");
      if (fichaFuera) cola.push("ficha quitada");
      avisar("avisoPanel", "Orden de " + $("negocio").value +
        (plan.base ? " actualizada · " : " creada · ") + cola.join(" y "), true);
      return;
    }

    if (MODO === "rango") {
      const grupos = gruposDelRango();
      const total = totalDeGrupos(grupos);
      if (!total) {
        avisar("aviso", ORIGEN_RANGO === "orden"
          ? "Elige una orden con tarjetas."
          : "El rango no es válido: el número final debe ser mayor o igual que el inicial.", false);
        return;
      }
      let hechas = 0;
      for (const [tipo, codigos] of grupos) {
        for (let i = 0; i < codigos.length; i += TANDA) {
          const tanda = codigos.slice(i, i + TANDA);
          hechas += tanda.length;
          boton.textContent = "Guardando " + hechas + " de " + total + "…";
          await llamar("rango", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              codigos: tanda,
              negocio: $("negocio").value,
              destino: destino,
              tipo: tipo,
            }),
          });
        }
      }
      cerrarTarjeta();
      for (const [tipo, codigos] of grupos) {
        parchearTarjetas(codigos, { negocio: $("negocio").value.trim(), destino: destino, tipo: tipo });
      }
      avisar("avisoPanel", plural(total, "tarjeta apuntando", "tarjetas apuntando") +
        " a " + $("negocio").value, true);
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
        vendida: VENTA_EDITADA.vendida,
        precio: VENTA_EDITADA.precio,
      }),
    });
    const editaba = Boolean(EDITANDO_CODIGO);
    cerrarTarjeta();
    parchearTarjetas([datos.codigo], {
      negocio: datos.negocio, destino: datos.destino, tipo: datos.tipo,
      vendida: datos.vendida, precio: datos.precio,
    });
    avisar("avisoPanel", "Tarjeta " + datos.codigo + (editaba ? " actualizada" : " activada"), true);
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
  VENTA_EDITADA = { vendida: t.vendida || "", precio: t.precio || 0 };
  llenarLocales();
  $("localExistente").value = t.negocio || "";
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

// Si ya hay nombre escrito, el enlace abre Maps buscándolo: es lo que se hace a
// continuación, copiar la URL del sitio.
/* ---------- leer el QR impreso con la cámara ---------- */

// En la calle el camino era: escanear con la cámara del teléfono, leer el código
// de cuatro letras, buscarlo en la lista y de ahí sacar el número. Esto lo hace
// de una: apunta al cartel y deja puesto el número de esa pieza.
let flujoCamara = null;
let leyendoQR = false;
// Cuando el montón está revuelto no hay rangos que valgan: se escanea pieza por
// pieza y la orden es exactamente esa lista.
let PIEZAS_SUELTAS = [];

function codigoDeQR(texto) {
  const limpio = String(texto || "").trim().replace(/[?#].*$/, "").replace(/\/+$/, "");
  const ultimo = limpio.split("/").pop() || "";
  return normalizarCodigo(ultimo);
}

function normalizarCodigo(v) {
  return String(v || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function decirEscaneo(texto, malo) {
  $("escaneoDicho").textContent = texto;
  $("escaneoDicho").classList.toggle("malo", Boolean(malo));
}

function cerrarCamara() {
  leyendoQR = false;
  if (flujoCamara) {
    flujoCamara.getTracks().forEach((t) => t.stop());
    flujoCamara = null;
  }
  $("video").srcObject = null;
  $("camara").hidden = true;
}

function pintarPiezasSueltas() {
  const caja = $("piezasSueltas");
  $("vaciarPiezas").hidden = !PIEZAS_SUELTAS.length;
  if (!PIEZAS_SUELTAS.length) { caja.innerHTML = ""; return; }
  caja.innerHTML = PIEZAS_SUELTAS.map((c) => {
    const t = TARJETAS.filter((x) => x.codigo === c)[0];
    const n = indiceDeCodigo(c) + 1;
    return "<button type='button' class='pieza' data-quitar-pieza='" + c + "'>" + c +
      "<b>nº " + n + (t && tipoDe(t) === "acrilico" ? " · A" : " · V") + "</b> ✕</button>";
  }).join("");
}

$("piezasSueltas").addEventListener("click", (e) => {
  const b = e.target.closest("[data-quitar-pieza]");
  if (!b) return;
  PIEZAS_SUELTAS = PIEZAS_SUELTAS.filter((c) => c !== b.dataset.quitarPieza);
  pintarPiezasSueltas();
  pintarRangosSegunPiezas();
  pintarResumenLocal();
});

$("vaciarPiezas").onclick = () => {
  PIEZAS_SUELTAS = [];
  pintarPiezasSueltas();
  pintarRangosSegunPiezas();
  decirEscaneo("");
  pintarResumenLocal();
};

function usarQR(texto) {
  const codigo = codigoDeQR(texto);
  cerrarCamara();
  if (!codigo) { decirEscaneo("Ese QR no trae ningún código.", true); return; }

  const t = TARJETAS.filter((x) => x.codigo === codigo)[0];
  if (!t) { decirEscaneo(codigo + " no está en la lista de tarjetas.", true); return; }

  const numero = indiceDeCodigo(codigo) + 1;
  const tipo = tipoDe(t);
  const comoSeLlama = (tipo === "acrilico" ? "Acrílico" : "Vinilo") + " nº " + numero;

  // en una orden se van juntando; fuera de ella solo dice cuál es
  if (MODO === "local") {
    if (PIEZAS_SUELTAS.indexOf(codigo) >= 0) {
      decirEscaneo(comoSeLlama + " ya estaba en la lista.", true);
      return;
    }
    const ajeno = t.negocio && t.negocio !== $("negocio").value.trim();
    PIEZAS_SUELTAS.push(codigo);
    pintarPiezasSueltas();
    pintarRangosSegunPiezas();
    pintarResumenLocal();
    decirEscaneo(comoSeLlama + " · " + codigo + (ajeno ? " · ojo, es de " + t.negocio : "") +
      "   ·   " + plural(PIEZAS_SUELTAS.length, "pieza", "piezas") + " en la lista", ajeno);
    return;
  }

  $(tipo === "acrilico" ? "desdeAcrilico" : "desdeSticker").value = numero;
  decirEscaneo(comoSeLlama + " · " + codigo +
    (t.negocio ? " · ocupado por " + t.negocio : " · libre"), Boolean(t.negocio));
}

async function abrirCamara() {
  if (!("BarcodeDetector" in window)) {
    decirEscaneo("Este navegador no lee QR. En Chrome de Android sí.", true);
    return;
  }
  let detector;
  try {
    const formatos = await window.BarcodeDetector.getSupportedFormats();
    if (formatos.indexOf("qr_code") < 0) throw new Error("sin soporte de QR");
    detector = new window.BarcodeDetector({ formats: ["qr_code"] });
    flujoCamara = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
    });
  } catch (e) {
    decirEscaneo("No se pudo abrir la cámara: " + e.message, true);
    cerrarCamara();
    return;
  }

  const v = $("video");
  v.srcObject = flujoCamara;
  $("camara").hidden = false;
  decirEscaneo("Apunta al QR del cartel.");
  try { await v.play(); } catch (e) {}

  leyendoQR = true;
  while (leyendoQR) {
    try {
      const vistos = await detector.detect(v);
      if (vistos.length && vistos[0].rawValue) { usarQR(vistos[0].rawValue); return; }
    } catch (e) {
      // un fotograma ilegible no es motivo para cerrar la cámara
    }
    await new Promise((r) => setTimeout(r, 200));
  }
}

$("escanear").onclick = () => { if ($("camara").hidden) abrirCamara(); else cerrarCamara(); };
$("cerrarCamara").onclick = cerrarCamara;

function pintarEnlaceMaps() {
  const nombre = $("negocio").value.trim() || $("buscarLocal").value.trim();
  $("enlaceMaps").href = nombre
    ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(nombre)
    : "https://www.google.com/maps";
}

$("negocio").addEventListener("input", pintarEnlaceMaps);
$("buscarLocal").addEventListener("input", pintarEnlaceMaps);

function pintarRangosSegunPiezas() {
  const hay = PIEZAS_SUELTAS.length > 0;
  ["desdeAcrilico", "nAcrilicos", "desdeSticker", "nStickers"]
    .forEach((id) => { $(id).disabled = hay; });
}

function pintarModo(valor) {
  MODO = valor === "rango" || valor === "local" ? valor : "una";
  marcarSegmento("modoTarjeta", MODO);
  $("campoUna").hidden = MODO !== "una";
  $("campoRango").hidden = MODO !== "rango";
  $("campoLocal").hidden = MODO !== "local";
  $("guardar").textContent = MODO === "rango" ? "Aplicar al rango"
    : MODO === "local" ? "Crear la orden"
    : (EDITANDO_CODIGO ? "Guardar cambios" : "Activar tarjeta");
  if (MODO === "local") {
    if (!$("desdeAcrilico").value) $("desdeAcrilico").value = primeraLibre("acrilico");
    if (!$("desdeSticker").value) $("desdeSticker").value = primeraLibre("sticker");
  }
  if (MODO === "rango") pintarOrigenRango(ORIGEN_RANGO);
  else $("bloqueTipo").hidden = MODO === "local";   // en un local van los dos tipos
  if (MODO === "local") pintarResumenLocal();
  pintarRangosSegunPiezas();
  pintarEnlaceMaps();
}

$("ordenLlevaFicha").addEventListener("change", () => {
  $("detalleFicha").hidden = !$("ordenLlevaFicha").checked;
});

$("origenRango").addEventListener("click", (e) => {
  const b = e.target.closest("[data-valor]");
  if (b) pintarOrigenRango(b.dataset.valor);
});

$("ordenRango").addEventListener("change", pintarResumenRango);

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
$("nAcrilicos").addEventListener("input", pintarResumenLocal);
$("nStickers").addEventListener("input", pintarResumenLocal);
$("desdeAcrilico").addEventListener("input", pintarResumenLocal);
$("desdeSticker").addEventListener("input", pintarResumenLocal);
$("negocio").addEventListener("input", () => {
  if (MODO === "local") pintarResumenLocal();
});

function salirDeEdicion() {
  EDITANDO_CODIGO = "";
  $("codigo").value = $("negocio").value = $("maps").value = "";
  $("ficha").hidden = true;
  $("fichaReview").value = "";
  NOMBRE_AUTO = "";
  URL_LEIDA = "";
  $("numeroTarjeta").textContent = "";
  $("desde").value = $("hasta").value = "";
  $("nAcrilicos").value = $("nStickers").value = "";
  $("buscarLocal").value = "";
  $("desdeAcrilico").value = $("desdeSticker").value = "";
  if ($("localExistente").options.length) $("localExistente").value = "";
  if ($("ordenRango").options.length) $("ordenRango").value = "";
  VENTA_EDITADA = { vendida: "", precio: 0 };
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
  llenarLocales();
  focoTarjeta = document.activeElement;
  $("modalTarjeta").hidden = false;
  document.body.style.overflow = "hidden";
  $("codigo").focus();
}

function cerrarTarjeta() {
  cerrarCamara();
  PIEZAS_SUELTAS = [];
  pintarPiezasSueltas();
  decirEscaneo("");
  if ($("modalTarjeta").hidden) return;
  $("modalTarjeta").hidden = true;
  document.body.style.overflow = $("modalQR").hidden ? "" : "hidden";
  if (focoTarjeta && focoTarjeta.focus) focoTarjeta.focus();
  focoTarjeta = null;
  salirDeEdicion();
  limpiarAviso("aviso");
}


function abrirOrden(negocio) {
  salirDeEdicion();
  llenarLocales();
  const l = locales().filter((x) => x.negocio === negocio)[0];
  $("tarjetaModalKicker").textContent = l ? "Orden de " + l.negocio : "Orden";
  $("tarjetaModalTitulo").textContent = l ? "Cambiar la orden" : "Nueva orden";
  $("tarjetaModalSubtitulo").textContent = l
    ? "Sube o baja cuántas piezas lleva y si va con ficha de Google. Las que sobren quedan libres para otra orden."
    : "Ocupa acrílicos y stickers libres y los apunta a la ficha del local. Queda pendiente hasta que la aceptes o la canceles.";
  if (l) {
    $("localExistente").value = l.negocio;
    $("localExistente").dispatchEvent(new Event("change"));
    $("nAcrilicos").value = l.acrilico;
    $("nStickers").value = l.sticker;
  }
  ponerFichaEnOrden(l ? l.ficha : null);
  pintarModo("local");
  // pintarModo deja el botón en "Crear la orden"; si ya existe, se está editando
  if (l) $("guardar").textContent = "Guardar la orden";
  limpiarAviso("aviso");
  focoTarjeta = document.activeElement;
  $("modalTarjeta").hidden = false;
  document.body.style.overflow = "hidden";
  $("nAcrilicos").focus();
}

// La ficha es parte de lo que lleva la orden, así que se edita aquí y no en una
// ventana aparte. El precio no: ese va con el resto en el cobro.
function ponerFichaEnOrden(ficha) {
  $("ordenLlevaFicha").checked = Boolean(ficha);
  $("ordenFichaHecha").checked = Boolean(ficha && ficha.hecha);
  $("ordenFichaNotas").value = ficha ? ficha.notas || "" : "";
  $("detalleFicha").hidden = !ficha;
}

$("abrirLocal").onclick = () => {
  salirDeEdicion();
  ponerFichaEnOrden(null);
  $("tarjetaModalKicker").textContent = "Orden";
  $("tarjetaModalTitulo").textContent = "Nueva orden";
  $("tarjetaModalSubtitulo").textContent = "Ocupa acrílicos y stickers libres y los apunta a la ficha del local. Queda pendiente hasta que la aceptes o la canceles.";
  pintarModo("local");
  limpiarAviso("aviso");
  llenarLocales();
  focoTarjeta = document.activeElement;
  $("modalTarjeta").hidden = false;
  document.body.style.overflow = "hidden";
  $("nAcrilicos").focus();
};

$("abrirRango").onclick = () => {
  salirDeEdicion();
  $("tarjetaModalKicker").textContent = "Varias tarjetas";
  $("tarjetaModalTitulo").textContent = "Editar un rango";
  $("tarjetaModalSubtitulo").textContent = "Un local con diez mesas son diez códigos distintos apuntando al mismo link. Se hace de una vez.";
  pintarTipo("sticker");
  pintarModo("rango");
  limpiarAviso("aviso");
  llenarLocales();
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
    NFC = {};
    (datos.nfc || []).forEach((c) => { NFC[c] = 1; });
    CARGANDO = false;
    pintarTabla();
    pintarVentas();
  } catch (e) {
    CARGANDO = false;
    pintarTabla();
    avisar("avisoPanel", e.message, false);
  }
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
      "<p>Crea tantos registros como plásticos vayas a imprimir. La numeración " +
      "empieza en AAAA y sigue sola.</p>" +
      "<button type='button' data-activar>Activar tarjetas</button></div>";
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
    // el QR se puede seguir sacando: mirarlo no cambia nada
    const trabada = cerrada(t.negocio) ? " disabled" : "";
    filas +=
      "<tr><td><div class='cod'>" + c + "</div>" +
      (n < 0 ? "" : "<div class='fila-num'>nº " + (n + 1) + "</div>") +
      "</td><td class='negocio'>" + (escHtml(t.negocio) || "—") +
      "<div class='tipo tipo-" + tipo + "'>" + TIPO_NOMBRE[tipo] + "</div>" +
      "</td><td class='col-destino'>" +
      (t.destino
        ? "<span class='place' title='" + escHtml(t.destino) + "'>" +
          escHtml(place || t.destino) + "</span>"
        : "<span class='sin-dato'>—</span>") +
      "</td><td><div class='acciones acciones-tarjeta'>" +
      "<button type='button' class='accion-nfc" + (NFC[c] ? " puesto" : "") +
      "' data-nfc='" + c + "' aria-pressed='" + (NFC[c] ? "true" : "false") +
      "'" + trabada + ">NFC</button>" +
      "<button type='button' class='accion-qr' data-qr='" + c + "'>QR</button>" +
      "<button type='button' class='accion-editar' data-editar='" + c + "'" +
      trabada + ">Editar</button>" +
      "<button type='button' class='accion-apagar' data-apagar='" + c + "'" +
      trabada + ">Desactivar</button>" +
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

function paginacion(actual, total, que) {
  if (total <= 1) return "";
  let html = "<nav class='paginacion' aria-label='Paginación de " + (que || "tarjetas") + "'>";
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
$("recargar").onclick = () => {
  CARGANDO = true; pintarTabla(); listar(); cargarGastos(); cargarServicios();
};

/* ---------- borrado en dos toques ---------- */

// Antes esto era un confirm() del navegador: bloquea la página, no se puede
// estilar y en móvil se ve como un aviso del sistema. El segundo toque sobre el
// mismo botón dice lo mismo sin sacarte de la tabla.
//
// Desactivar no borra el registro: la tarjeta sigue impresa y su código sigue
// existiendo, así que vuelve a la lista sin negocio, lista para reasignar.
// Hay que devolver el botón anterior a su sitio: si no, al armar otra fila la
// primera se queda diciendo "¿Seguro?" sin estarlo, y la tabla miente.
function olvidarConfirmacion() {
  clearTimeout(RELOJ_CONFIRMA);
  if (BOTON_CONFIRMA && BOTON_CONFIRMA.isConnected) {
    BOTON_CONFIRMA.textContent = ETIQUETA_CONFIRMA;
    BOTON_CONFIRMA.classList.remove("confirmando");
  }
  BOTON_CONFIRMA = null;
  CONFIRMANDO = "";
}

function pedirConfirmacion(boton, codigo) {
  olvidarConfirmacion();
  ETIQUETA_CONFIRMA = boton.textContent;
  CONFIRMANDO = codigo;
  BOTON_CONFIRMA = boton;
  boton.textContent = "¿Seguro?";
  boton.classList.add("confirmando");
  RELOJ_CONFIRMA = setTimeout(olvidarConfirmacion, 4000);
}

$("tabla").addEventListener("click", async (e) => {
  if (e.target.closest("[data-activar]")) { abrirActivar(); return; }
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

  const n = e.target.closest("[data-nfc]");
  if (n) { marcarNFC(n, n.dataset.nfc); return; }

  const ed = e.target.closest("[data-editar]");
  if (ed) { editar(ed.dataset.editar); return; }

  const q = e.target.closest("[data-qr]");
  if (q) { abrirQR(q.dataset.qr); return; }

  const b = e.target.closest("[data-apagar]");
  if (!b) return;
  const codigo = b.dataset.apagar;
  if (CONFIRMANDO !== codigo) { pedirConfirmacion(b, codigo); return; }

  olvidarConfirmacion();
  b.disabled = true;
  try {
    const t = TARJETAS.filter((x) => x.codigo === codigo)[0];
    await llamar("desactivar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigos: [codigo], tipo: t ? tipoDe(t) : "",
        desde: t ? t.negocio : "" }),
    });
    parchearTarjetas([codigo], { negocio: "", destino: "", vendida: "", precio: 0, vendedor: "" });
    avisar("avisoPanel", "Tarjeta " + codigo + " desactivada. Queda libre para reasignar.", true);
    cerrarQR();
  } catch (err) {
    avisar("avisoPanel", err.message, false);
    pintarTabla();
  }
});

/* ---------- locales y ventas ---------- */

// No hay entidad "venta": la tarjeta es la unidad vendida, así que el listado de
// locales sale de agrupar las tarjetas por negocio. Nada que sincronizar.
function locales() {
  const mapa = {};
  TARJETAS.forEach((t) => {
    const nombre = String(t.negocio || "").trim();
    if (!nombre || !t.destino) return;
    if (!mapa[nombre]) {
      mapa[nombre] = { negocio: nombre, destino: t.destino, acrilico: 0, sticker: 0,
        vendidas: 0, importe: 0, fecha: "", codigos: { acrilico: [], sticker: [] } };
    }
    const g = mapa[nombre];
    const tipo = tipoDe(t);
    g[tipo]++;
    g.codigos[tipo].push(t.codigo);
    if (t.vendida) {
      g.vendidas++;
      g.importe += Number(t.precio) || 0;
      if (t.vendida > g.fecha) g.fecha = t.vendida;
    }
  });
  // La ficha de Google se vende sola: un local puede pedirla sin comprar una
  // sola tarjeta, así que también abre fila.
  SERVICIOS.forEach((s) => {
    const nombre = String(s.negocio || "").trim();
    if (!nombre) return;
    if (!mapa[nombre]) {
      mapa[nombre] = { negocio: nombre, destino: "", acrilico: 0, sticker: 0,
        vendidas: 0, importe: 0, fecha: "", codigos: { acrilico: [], sticker: [] } };
    }
    const g = mapa[nombre];
    g.ficha = s;
    if (s.fecha) {
      g.importe += Number(s.precio) || 0;
      if (s.fecha > g.fecha) g.fecha = s.fecha;
    }
  });

  // primero las que esperan respuesta: son las que piden hacer algo
  return Object.keys(mapa).map((k) => {
    const l = mapa[k];
    l.piezas = l.acrilico + l.sticker;
    l.cobrado = l.vendidas > 0 || Boolean(l.ficha && l.ficha.fecha);
    return l;
  }).sort((a, b) =>
    (a.cobrado ? 1 : 0) - (b.cobrado ? 1 : 0) ||
    (b.fecha || "").localeCompare(a.fecha || "") ||
    a.negocio.localeCompare(b.negocio));
}

function hoyISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function plural(n, uno, varios) {
  return n + " " + (n === 1 ? uno : varios);
}

function dinero(n) {
  return "$" + Math.round(Number(n) || 0).toLocaleString("es-CO");
}

// Con el comprobante en manos del cliente la orden queda cerrada: ni link, ni
// NFC, ni precio. El panel apaga los botones y el Worker lo rechaza igual.
function cerrada(negocio) {
  return Boolean(COMPROBANTES[String(negocio || "").trim()]);
}

function fichaDe(negocio) {
  return SERVICIOS.filter((x) => x.negocio === negocio)[0] || null;
}

// Lo cobrado por fichas: sin fecha es un trato hablado, no un ingreso.
function ingresoFichas() {
  return SERVICIOS.reduce((a, s) => a + (s.fecha ? Number(s.precio) || 0 : 0), 0);
}

function ventasPorDia(dias) {
  const serie = [];
  const indice = {};
  const base = new Date(hoyISO() + "T00:00:00");
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    const clave = d.toISOString().slice(0, 10);
    indice[clave] = serie.length;
    serie.push({ fecha: clave, dia: d.getDate(), unidades: 0, ingresos: 0 });
  }
  TARJETAS.forEach((t) => {
    const i = indice[t.vendida];
    if (i === undefined) return;
    serie[i].unidades += 1;
    serie[i].ingresos += Number(t.precio) || 0;
  });
  // suma al dinero pero no a las unidades: una ficha no es una pieza impresa
  SERVICIOS.forEach((s) => {
    const i = indice[s.fecha];
    if (i !== undefined) serie[i].ingresos += Number(s.precio) || 0;
  });
  return serie;
}

// Barras pill, rejilla punteada solo horizontal, sin líneas de eje: el SVG se
// dibuja a mano porque aquí no hay librería de gráficas ni hace falta.
// Ingresos y gastos no son dos cosas que mirar por turnos: son la misma
// pregunta —qué entra y qué sale— así que van en el mismo eje, uno hacia arriba
// y otro hacia abajo. Con el interruptor de antes había que recordar la otra
// mitad de memoria para saber si un día fue bueno.
function svgFlujo(serie) {
  const ancho = 660, medio = 78, pieAlto = 18;
  const alto = medio * 2;
  const tope = Math.max(1, Math.max.apply(null,
    serie.map((p) => Math.max(p.ingresos, p.gastos))));
  const paso = ancho / serie.length;
  const grosor = Math.max(6, Math.min(16, paso - 7));
  let piezas = "";

  // la línea del cero, que es de donde nacen las dos mitades
  piezas += "<line x1='0' y1='" + medio + "' x2='" + ancho + "' y2='" + medio +
    "' stroke='var(--linea)' stroke-width='1'></line>";
  [0.5, 1].forEach((f) => {
    [medio - medio * f, medio + medio * f].forEach((y) => {
      piezas += "<line x1='0' y1='" + y + "' x2='" + ancho + "' y2='" + y +
        "' stroke='rgba(22,32,46,.06)' stroke-width='1' stroke-dasharray='2 3'></line>";
    });
  });

  serie.forEach((p, i) => {
    const x = i * paso + (paso - grosor) / 2;
    if (p.ingresos > 0) {
      const h = Math.max(3, (p.ingresos / tope) * (medio - 6));
      piezas += "<rect x='" + x.toFixed(1) + "' y='" + (medio - h).toFixed(1) +
        "' width='" + grosor.toFixed(1) + "' height='" + h.toFixed(1) +
        "' rx='3' fill='var(--verde)'><title>" + p.fecha + " · entra " +
        dinero(p.ingresos) + "</title></rect>";
    }
    if (p.gastos > 0) {
      const h = Math.max(3, (p.gastos / tope) * (medio - 6));
      piezas += "<rect x='" + x.toFixed(1) + "' y='" + medio +
        "' width='" + grosor.toFixed(1) + "' height='" + h.toFixed(1) +
        "' rx='3' fill='var(--rojo)'><title>" + p.fecha + " · sale " +
        dinero(p.gastos) + "</title></rect>";
    }
    const cada = serie.length > 20 ? 5 : (serie.length > 10 ? 2 : 1);
    if (i % cada === 0 || i === serie.length - 1) {
      piezas += "<text x='" + (i * paso + paso / 2).toFixed(1) + "' y='" + (alto + 13) +
        "' text-anchor='middle' font-size='10' fill='var(--tinta-3)'>" + p.dia + "</text>";
    }
  });

  return "<svg viewBox='0 0 " + ancho + " " + (alto + pieAlto) + "' role='img' " +
    "aria-label='Lo que entra y lo que sale cada día'>" + piezas + "</svg>";
}

// Las unidades se cuentan por día: una barra por día responde bien. La plata no
// —lo que importa es cómo va sumando—, así que va como línea que crece. Con
// barras, dos ventas grandes seguidas y una semana en blanco se leen igual de
// mal; acumulada se ve el ritmo.
function svgAcumulado(serie, campo) {
  const ancho = 660, alto = 150, pieAlto = 18;
  let suma = 0;
  const puntos = serie.map((p) => { suma += p[campo]; return suma; });
  const tope = Math.max(1, suma);
  const paso = serie.length > 1 ? ancho / (serie.length - 1) : ancho;
  const enY = (v) => alto - (v / tope) * (alto - 8);

  let piezas = "";
  for (let g = 1; g <= 3; g++) {
    const y = (alto / 3) * (3 - g);
    piezas += "<line x1='0' y1='" + y + "' x2='" + ancho + "' y2='" + y +
      "' stroke='rgba(22,32,46,.06)' stroke-width='1' stroke-dasharray='2 3'></line>";
  }

  const linea = puntos.map((v, i) => (i * paso).toFixed(1) + "," + enY(v).toFixed(1));
  piezas += "<path d='M0," + alto + " L" + linea.join(" L") + " L" + ancho + "," + alto +
    " Z' fill='var(--verde-piel)'></path>";
  piezas += "<polyline points='" + linea.join(" ") +
    "' fill='none' stroke='var(--verde)' stroke-width='2.5' stroke-linejoin='round' " +
    "stroke-linecap='round'></polyline>";

  // el último punto es el que se mira: dónde va la cuenta hoy
  const ultimoX = (serie.length - 1) * paso;
  const ultimoY = enY(puntos[puntos.length - 1] || 0);
  piezas += "<circle cx='" + ultimoX.toFixed(1) + "' cy='" + ultimoY.toFixed(1) +
    "' r='4.5' fill='var(--verde)' stroke='#fff' stroke-width='2'></circle>";

  serie.forEach((p, i) => {
    const cada = serie.length > 20 ? 5 : (serie.length > 10 ? 2 : 1);
    if (i % cada === 0 || i === serie.length - 1) {
      piezas += "<text x='" + (i * paso).toFixed(1) + "' y='" + (alto + 13) +
        "' text-anchor='" + (i === 0 ? "start" : (i === serie.length - 1 ? "end" : "middle")) +
        "' font-size='10' fill='var(--tinta-3)'>" + p.dia + "</text>";
    }
  });

  return "<svg viewBox='0 0 " + ancho + " " + (alto + pieAlto) + "' role='img' " +
    "aria-label='Cómo va sumando el dinero'>" + piezas + "</svg>";
}

function svgBarras(serie, campo) {
  const ancho = 660, alto = 150, pieAlto = 18;
  const tope = Math.max(1, Math.max.apply(null, serie.map((p) => p[campo])));
  const paso = ancho / serie.length;
  const grosor = Math.max(7, Math.min(18, paso - 7));
  let piezas = "";
  for (let g = 1; g <= 3; g++) {
    const y = (alto / 3) * (3 - g);
    piezas += "<line x1='0' y1='" + y + "' x2='" + ancho + "' y2='" + y +
      "' stroke='rgba(22,32,46,.06)' stroke-width='1' stroke-dasharray='2 3'></line>";
  }
  serie.forEach((p, i) => {
    const x = i * paso + (paso - grosor) / 2;
    if (p[campo] > 0) {
      const h = Math.max(grosor, (p[campo] / tope) * alto);
      piezas += "<rect x='" + x.toFixed(1) + "' y='" + (alto - h).toFixed(1) +
        "' width='" + grosor.toFixed(1) + "' height='" + h.toFixed(1) +
        "' rx='8' fill='var(--tinta)'></rect>";
    }
    const cada = serie.length > 20 ? 5 : (serie.length > 10 ? 2 : 1);
    if (i % cada === 0 || i === serie.length - 1) {
      piezas += "<text x='" + (i * paso + paso / 2).toFixed(1) + "' y='" + (alto + 13) +
        "' text-anchor='middle' font-size='10' fill='var(--tinta-3)'>" + p.dia + "</text>";
    }
  });
  return "<svg viewBox='0 0 " + ancho + " " + (alto + pieAlto) + "' role='img' " +
    "aria-label='Ventas por día'>" + piezas + "</svg>";
}

function pintarVentas() {
  const serie = ventasPorDia(DIAS_GRAFICA);
  const campo = METRICA;
  const suma = serie.reduce((a, p) => a + p[campo], 0);
  $("graficaMetrica").innerHTML = (campo === "ingresos" ? dinero(suma) : suma) +
    "<span class='unidad'>" + (campo === "ingresos" ? "sumados en " : "unidades en ") +
    DIAS_GRAFICA + " días</span>";
  $("pozoGrafica").innerHTML = campo === "ingresos"
    ? svgAcumulado(serie, campo)
    : svgBarras(serie, campo);

  const lista = locales();
  const vendidos = lista.filter((l) => l.cobrado).length;
  const total = TARJETAS.reduce((a, t) => a + (t.vendida ? Number(t.precio) || 0 : 0), 0) +
    ingresoFichas();
  const pendientes = lista.length - vendidos;
  $("graficaPie").innerHTML = "<span>" + vendidos + " aceptadas · " + pendientes +
    " pendientes</span><span>Acumulado <b>" + dinero(total) + "</b></span>";

  if (!lista.length) {
    $("tablaLocales").innerHTML = "<div class='vacio'><h2>Todavía no hay órdenes</h2>" +
      "<p>Crea una orden para un local: sus tarjetas quedan ocupadas y apuntando a su " +
      "ficha de Google, listas para la visita.</p>" +
      "<button type='button' data-local>Crear una orden</button></div>";
    return;
  }

  const paginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  if (PAGINA_ORDENES > paginas) PAGINA_ORDENES = paginas;
  const desde = (PAGINA_ORDENES - 1) * POR_PAGINA;

  let filas = "";
  lista.slice(desde, desde + POR_PAGINA).forEach((l) => {
    const piezas = l.piezas;
    const f = l.ficha;
    // sin plástico no hay nada que abrir, cobrar ni liberar: esa fila solo tiene ficha
    // una fila sin piezas y sin ficha no existe, así que los tres botones valen
    const sinCobro = piezas === 0 && !f ? " disabled" : "";
    // con comprobante enviado solo queda entrar al cobro, que es donde se borra
    const bloqueo = cerrada(l.negocio) ? " disabled" : sinCobro;
    filas += "<tr><td class='negocio'>" + escHtml(l.negocio) + "</td>" +
      "<td class='piezas'>" + (piezas
        ? plural(l.acrilico, "acrílico", "acrílicos") + "<br>" +
          plural(l.sticker, "sticker", "stickers")
        : "<span class='sin-dato'>sin tarjetas</span>") +
      (f ? "<div class='fila-num'>ficha de Google" +
        (f.precio ? " · " + dinero(f.precio) : "") + "</div>" : "") +
      "</td>" +
      "<td><span class='estado " + (l.cobrado
        ? "estado-vendido'>Aceptada " + l.fecha
        : "estado-pendiente'>Pendiente") +
      "</span>" + (l.cobrado && piezas && l.vendidas < piezas
        ? "<div class='fila-num'>" + l.vendidas + " de " + piezas + " piezas</div>" : "") +
      (f && !f.hecha ? "<div class='fila-num'>ficha sin publicar</div>" : "") +
      (cerrada(l.negocio) ? "<div class='fila-num'>" +
        (COMPROBANTES[l.negocio].sinEnviar ? "cerrada sin comprobante" : "comprobante enviado") +
        "</div>" : "") +
      "</td><td class='importe'>" + (l.cobrado ? dinero(l.importe) : "—") + "</td>" +
      "<td><div class='acciones acciones-orden'>" +
      "<button type='button' class='accion-qr' data-piezas='" + escHtml(l.negocio) + "'" +
      bloqueo + ">Orden</button>" +
      "<button type='button' class='accion-editar' data-vender='" + escHtml(l.negocio) + "'" +
      sinCobro + ">" + (l.cobrado ? "Cobro" : "Aceptar") + "</button>" +
      "<button type='button' class='accion-apagar' data-cancelar='" + escHtml(l.negocio) +
      "'" + bloqueo + ">Cancelar</button></div></td></tr>";
  });
  $("tablaLocales").innerHTML =
    "<table><thead><tr><th>Local</th><th>Piezas</th><th>Estado</th><th>Importe</th><th></th>" +
    "</tr></thead><tbody>" + filas + "</tbody></table>" +
    paginacion(PAGINA_ORDENES, paginas, "órdenes");
}

function pintarPruebas(activo) {
  PRUEBAS = Boolean(activo);
  const b = $("togglePruebas");
  const rotulo = PRUEBAS ? "Pruebas activas" : "Modo pruebas";
  b.textContent = rotulo;
  b.title = rotulo;
  b.classList.toggle("alerta", PRUEBAS);
  b.classList.toggle("fantasma", !PRUEBAS);
  $("bannerPruebas").hidden = !PRUEBAS;
}

async function cambiarPruebas(valor) {
  try {
    const r = await llamar("modo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prueba: valor }),
    });
    pintarPruebas(r.prueba);
    avisar("avisoPanel", r.prueba
      ? "Modo pruebas activado. Los escaneos enseñan el código en vez de ir a Google."
      : "Modo pruebas apagado. Las tarjetas vuelven a redirigir.", true);
  } catch (e) {
    avisar("avisoPanel", e.message, false);
  }
}

$("togglePruebas").onclick = () => cambiarPruebas(!PRUEBAS);
$("apagarPruebas").onclick = () => cambiarPruebas(false);

/* ---------- cuentas: gastos, reparto e inventario ---------- */

// KV es de consistencia eventual: lo que se acaba de escribir puede tardar hasta
// un minuto en aparecer por list(). Volver a pedir la lista justo después no solo
// no ayuda, sino que pisa el dato bueno con el viejo y parece que no se guardó.
// Por eso lo recién guardado se aplica en local, que además es instantáneo.
function repintarTodo() {
  pintarTabla();
  pintarVentas();
  pintarCuentas();
}

function parchearTarjetas(codigos, cambios) {
  const juego = {};
  codigos.forEach((c) => { juego[c] = 1; });
  TARJETAS = TARJETAS.map((t) => (juego[t.codigo] ? Object.assign({}, t, cambios) : t));
  repintarTodo();
}

function parchearGasto(id, gasto) {
  if (!gasto) {
    GASTOS = GASTOS.filter((g) => g.id !== id);
  } else {
    const entero = Object.assign({ id: id }, gasto);
    const i = GASTOS.map((g) => g.id).indexOf(id);
    if (i >= 0) GASTOS[i] = entero; else GASTOS.push(entero);
    GASTOS.sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));
  }
  pintarCuentas();
}

async function cargarAjustes() {
  try {
    const a = await llamar("ajustes");
    VENDEDORES = a.vendedores || { felipe: null, nicolas: null };
    const c = await llamar("compradores");
    COMPRADORES = {};
    (c.compradores || []).forEach((x) => { COMPRADORES[x.negocio] = x; });
    const r = await llamar("comprobantes");
    COMPROBANTES = {};
    (r.comprobantes || []).forEach((x) => { COMPROBANTES[x.negocio] = x; });
    // repinta todo, no solo cuentas: las tablas ya se dibujaron antes de que
    // llegaran los comprobantes, así que los cerrojos no se veían hasta tocar algo
    repintarTodo();
  } catch (e) {
    avisar("avisoPanel", e.message, false);
  }
}

async function cargarServicios() {
  try {
    SERVICIOS = (await llamar("servicios")).servicios;
    pintarVentas();
    pintarCuentas();
  } catch (e) {
    avisar("avisoPanel", e.message, false);
  }
}

function parchearServicio(id, servicio) {
  if (!servicio) {
    SERVICIOS = SERVICIOS.filter((x) => x.id !== id);
  } else {
    const entero = Object.assign({ id: id }, servicio);
    const i = SERVICIOS.map((x) => x.id).indexOf(id);
    if (i >= 0) SERVICIOS[i] = entero; else SERVICIOS.push(entero);
  }
  pintarVentas();
  pintarCuentas();
}

async function cargarGastos() {
  try {
    GASTOS = (await llamar("gastos")).gastos;
    pintarCuentas();
  } catch (e) {
    avisar("avisoPanel", e.message, false);
  }
}

// El negocio es de dos, así que lo que importa no es solo cuánto se gastó sino
// quién lo puso: de ahí sale el saldo entre ellos.
function cuentas() {
  const puesto = { felipe: 0, nicolas: 0 };
  let gastos = 0;
  GASTOS.forEach((g) => {
    const m = Number(g.monto) || 0;
    gastos += m;
    if (g.paga === "felipe") puesto.felipe += m;
    else if (g.paga === "nicolas") puesto.nicolas += m;
    else { puesto.felipe += m / 2; puesto.nicolas += m / 2; }
  });
  const ingresos = TARJETAS.reduce((a, t) => a + (t.vendida ? Number(t.precio) || 0 : 0), 0) +
    ingresoFichas();
  const justo = gastos / 2;
  return {
    gastos: gastos,
    ingresos: ingresos,
    utilidad: ingresos - gastos,
    puesto: puesto,
    justo: justo,
    // positivo = Felipe puso de más y Nicolás le debe
    saldo: puesto.felipe - justo,
  };
}

function dineroPorDia(dias) {
  const serie = [];
  const indice = {};
  const base = new Date(hoyISO() + "T00:00:00");
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    const clave = d.toISOString().slice(0, 10);
    indice[clave] = serie.length;
    serie.push({ fecha: clave, dia: d.getDate(), gastos: 0, ingresos: 0 });
  }
  GASTOS.forEach((g) => {
    const i = indice[g.fecha];
    if (i !== undefined) serie[i].gastos += Number(g.monto) || 0;
  });
  TARJETAS.forEach((t) => {
    const i = indice[t.vendida];
    if (i !== undefined) serie[i].ingresos += Number(t.precio) || 0;
  });
  SERVICIOS.forEach((s) => {
    const i = indice[s.fecha];
    if (i !== undefined) serie[i].ingresos += Number(s.precio) || 0;
  });
  return serie;
}

// El inventario no se lleva aparte: sale de sumar lo que trajo cada compra. Lo
// recibido y lo que viene en camino van separados porque media compra sigue fuera.
function vendidasPorTipo() {
  const suma = { acrilico: 0, sticker: 0, total: 0 };
  TARJETAS.forEach((t) => {
    if (!t.vendida) return;
    suma[tipoDe(t)]++;
    suma.total++;
  });
  return suma;
}

// A qué pieza del inventario le pega cada venta. Se mira por el nombre porque
// los gastos se escriben a mano y no hay lista cerrada de cosas: un acrílico
// vendido gasta un acrílico y su vinilo, un vinilo de mesa gasta el suyo, y
// los dos llevan chip.
function gastadoPorVentas(que, vendidas) {
  const n = sinTildes(String(que || "")).toLowerCase();
  if (n.indexOf("acril") >= 0) return vendidas.acrilico;
  if (n.indexOf("mesa") >= 0) return vendidas.sticker;
  if (n.indexOf("nfc") >= 0 || n.indexOf("chip") >= 0) return vendidas.total;
  return 0;
}

function inventario() {
  const mapa = {};
  GASTOS.forEach((g) => {
    (g.items || []).forEach((it) => {
      const clave = it.que.toLowerCase();
      if (!mapa[clave]) mapa[clave] = { que: it.que, recibido: 0, malos: 0, pedido: 0 };
      if (g.estado === "entregado") {
        mapa[clave].recibido += it.cuantos;
        mapa[clave].malos += it.malos || 0;
      } else {
        mapa[clave].pedido += it.cuantos;
      }
    });
  });
  const vendidas = vendidasPorTipo();
  return Object.keys(mapa).map((k) => {
    const i = mapa[k];
    i.util = i.recibido - i.malos;
    i.vendido = gastadoPorVentas(i.que, vendidas);
    i.queda = i.util - i.vendido;
    return i;
  }).sort((a, b) => (b.recibido + b.pedido) - (a.recibido + a.pedido));
}

// La declaración de renta la presenta cada uno por su lado, con sus propios
// ingresos, así que esto va separado por vendedor. El UVT cambia cada enero:
// hay que actualizarlo a mano. Los 1.400 UVT son el tope de ingresos brutos.
const UVT = { anio: 2026, pesos: 52374 };
const RENTA_UVT = 1400;

function topeRenta() {
  return UVT.pesos * RENTA_UVT;
}

// Lo de antes de separar por vendedor no tiene dueño: se muestra aparte en vez
// de repartirlo a ojo.
function vendidoPorSocio(anio) {
  const desde = String(anio) + "-";
  const suma = { felipe: 0, nicolas: 0, sin: 0 };
  const meter = (quien, cuanto) => {
    if (quien === "felipe" || quien === "nicolas") suma[quien] += cuanto;
    else suma.sin += cuanto;
  };
  TARJETAS.forEach((t) => {
    if (String(t.vendida || "").indexOf(desde) === 0) meter(t.vendedor, Number(t.precio) || 0);
  });
  SERVICIOS.forEach((x) => {
    if (String(x.fecha || "").indexOf(desde) === 0) meter(x.vendedor, Number(x.precio) || 0);
  });
  return suma;
}

function pintarTope() {
  const suma = vendidoPorSocio(UVT.anio);
  const tope = topeRenta();
  const caja = $("tope");
  const mayor = Math.max(suma.felipe, suma.nicolas) / tope;
  caja.className = "tope" + (mayor >= 1 ? " pasado" : (mayor >= 0.8 ? " cerca" : ""));

  const barra = (socio) => {
    const cuanto = suma[socio];
    const parte = cuanto / tope;
    return "<div class='tope-socio'><div class='tope-alto'><span>" + SOCIO_NOMBRE[socio] +
      " <b>" + dinero(cuanto) + "</b></span><span>" +
      (parte >= 1 ? "pasa el tope" : "quedan " + dinero(tope - cuanto)) + "</span></div>" +
      "<div class='tope-barra'><i style='width:" + Math.min(100, parte * 100).toFixed(1) +
      "%'></i></div></div>";
  };

  caja.innerHTML = "<div class='cejilla'>Declaración de renta · " + UVT.anio + "</div>" +
    barra("felipe") + barra("nicolas") +
    (suma.sin ? "<div class='tope-nota'>Sin vendedor apuntado: <b>" + dinero(suma.sin) +
      "</b> — son ventas de antes de separar por quién la hizo.</div>" : "") +
    "<div class='tope-nota'>Declara quien pase " + RENTA_UVT.toLocaleString("es-CO") +
    " UVT de ingresos brutos en el " +
    "año, que en " + UVT.anio + " son " + dinero(tope) + " (UVT " + dinero(UVT.pesos) + ").</div>";
}

function pintarCuentas() {
  const c = cuentas();
  const serie = dineroPorDia(DIAS_DINERO);
  const entra = serie.reduce((a, punto) => a + punto.ingresos, 0);
  const sale = serie.reduce((a, punto) => a + punto.gastos, 0);
  const neto = entra - sale;

  $("dineroMetrica").innerHTML = dinero(Math.abs(neto)) +
    "<span class='unidad'>" + (neto >= 0 ? "de más" : "de menos") +
    " en " + DIAS_DINERO + " días</span>";
  $("pozoDinero").innerHTML = svgFlujo(serie);
  $("dineroLeyenda").innerHTML =
    "<span class='marca-entra'>Entra " + dinero(entra) + "</span>" +
    "<span class='marca-sale'>Sale " + dinero(sale) + "</span>";
  $("dineroPie").innerHTML = "<span>Ingresos <b>" + dinero(c.ingresos) +
    "</b> · Gastos <b>" + dinero(c.gastos) + "</b></span><span>" +
    (c.utilidad >= 0 ? "Utilidad " : "Va perdiendo ") + "<b>" +
    dinero(Math.abs(c.utilidad)) + "</b></span>";

  $("socios").innerHTML = ["felipe", "nicolas"].map((k) =>
    "<div class='socio'><h3>" + SOCIO_NOMBRE[k] + "</h3>" +
    "<div class='socio-linea'><span>Ha puesto</span><b>" + dinero(c.puesto[k]) + "</b></div>" +
    "<div class='socio-linea'><span>Le toca poner</span><b>" + dinero(c.justo) + "</b></div>" +
    "<div class='socio-linea'><span>" + (c.utilidad >= 0 ? "Gana" : "Pierde") +
    "</span><b>" + dinero(Math.abs(c.utilidad) / 2) + "</b></div></div>").join("");

  const saldo = Math.round(c.saldo);
  const caja = $("saldo");
  if (!saldo) {
    caja.className = "saldo";
    caja.textContent = c.gastos
      ? "Entre ustedes están en paz: cada uno ha puesto lo mismo."
      : "Todavía no hay gastos registrados.";
  } else {
    caja.className = "saldo debe";
    const deudor = saldo > 0 ? "Nicolás" : "Felipe";
    const acreedor = saldo > 0 ? "Felipe" : "Nicolás";
    caja.textContent = deudor + " le debe " + dinero(Math.abs(saldo)) + " a " + acreedor +
      " para quedar a la mitad.";
  }

  if (!GASTOS.length) {
    $("tablaGastos").innerHTML = "<div class='vacio'><h2>Sin gastos</h2>" +
      "<p>Apunta lo que se ha comprado y aquí sale el reparto entre los dos.</p>" +
      "<button type='button' data-gasto-nuevo>Anotar el primero</button></div>";
    $("tablaInventario").innerHTML = "";
    return;
  }

  const paginasG = Math.max(1, Math.ceil(GASTOS.length / POR_PAGINA));
  if (PAGINA_GASTOS > paginasG) PAGINA_GASTOS = paginasG;
  const desdeG = (PAGINA_GASTOS - 1) * POR_PAGINA;

  let filas = "";
  GASTOS.slice(desdeG, desdeG + POR_PAGINA).forEach((g) => {
    const llego = g.estado === "entregado";
    filas += "<tr><td class='piezas'>" + escHtml(g.fecha) +
      (llego && g.entrega ? "<div class='fila-num'>llegó " + escHtml(g.entrega) + "</div>" : "") +
      "</td><td class='negocio'>" + escHtml(g.proveedor) +
      "<div class='fila-num'>" + escHtml(g.descripcion || "—") + "</div>" +
      (g.notas ? "<div class='fila-num'>" + escHtml(g.notas) + "</div>" : "") +
      "</td><td><span class='tipo tipo-" + (g.paga === "ambos" ? "sticker" : "acrilico") + "'>" +
      SOCIO_NOMBRE[g.paga] + "</span></td>" +
      "<td><span class='estado " + (llego ? "estado-vendido'>Entregado" : "estado-pendiente'>En camino") +
      "</span></td><td class='importe'>" + dinero(g.monto) + "</td>" +
      "<td><div class='acciones acciones-orden'>" +
      "<button type='button' class='accion-editar' data-gasto='" + escHtml(g.id) + "'>Editar</button>" +
      "<button type='button' class='accion-apagar' data-gasto-borrar='" + escHtml(g.id) + "'>Borrar</button>" +
      "</div></td></tr>";
  });
  $("tablaGastos").innerHTML =
    "<table><thead><tr><th>Fecha</th><th>De dónde</th><th>Quién puso</th>" +
    "<th>Estado</th><th>Monto</th><th></th></tr></thead><tbody>" + filas + "</tbody></table>" +
    paginacion(PAGINA_GASTOS, paginasG, "gastos");

  const inv = inventario();
  if (!inv.length) {
    $("tablaInventario").innerHTML = "<div class='vacio'><h2>Nada en inventario</h2>" +
      "<p>El inventario sale de las piezas que traen los gastos. Apunta cuántas " +
      "llegaron en cada compra y aparecen aquí.</p></div>";
    return;
  }
  let invFilas = "";
  inv.forEach((i) => {
    invFilas += "<tr><td class='negocio'>" + escHtml(i.que) + "</td>" +
      "<td class='inv'>" + i.util +
      (i.malos ? " <span class='inv-malos'>(" + i.malos + " malos)</span>" : "") + "</td>" +
      "<td class='inv'>" + (i.vendido ? "−" + i.vendido : "—") + "</td>" +
      "<td class='inv" + (i.queda < 0 ? " inv-malos" : "") + "'><b>" + i.queda + "</b></td>" +
      "<td class='inv'>" + (i.pedido ? i.pedido : "—") + "</td></tr>";
  });
  $("tablaInventario").innerHTML =
    "<table><thead><tr><th>Cosa</th><th>Útiles</th><th>Vendidos</th><th>Quedan</th>" +
    "<th>En camino</th></tr></thead><tbody>" + invFilas + "</tbody></table>";
}

function pintarVista(valor) {
  const conocidas = { locales: 1, cuentas: 1, inventario: 1 };
  VISTA = conocidas[valor] ? valor : "tarjetas";
  marcarSegmento("vistaPanel", VISTA);
  $("vistaTarjetas").hidden = VISTA !== "tarjetas";
  $("vistaLocales").hidden = VISTA !== "locales";
  $("vistaCuentas").hidden = VISTA !== "cuentas";
  $("vistaInventario").hidden = VISTA !== "inventario";
  // activar tarjetas es reponer plástico: va con el inventario, no con la lista
  $("abrirActivar").hidden = VISTA !== "inventario";
  $("togglePruebas").hidden = VISTA !== "inventario";
  $("abrirRango").hidden = VISTA !== "tarjetas" && VISTA !== "locales";
  $("abrirAjustes").hidden = VISTA !== "cuentas";
  if (VISTA === "locales") pintarVentas();
  if (VISTA === "cuentas" || VISTA === "inventario") pintarCuentas();
}

$("vistaPanel").addEventListener("click", (e) => {
  const b = e.target.closest("[data-valor]");
  if (b) pintarVista(b.dataset.valor);
});

$("metricaVentas").addEventListener("click", (e) => {
  const b = e.target.closest("[data-valor]");
  if (!b) return;
  METRICA = b.dataset.valor;
  marcarSegmento("metricaVentas", METRICA);
  pintarVentas();
});

/* ---------- registrar la venta de un local ---------- */

$("tablaLocales").addEventListener("click", async (e) => {
  if (e.target.closest("[data-local]")) { $("abrirLocal").click(); return; }

  const pg = e.target.closest("[data-pagina]");
  if (pg && !pg.disabled) {
    PAGINA_ORDENES = parseInt(pg.dataset.pagina, 10) || 1;
    pintarVentas();
    return;
  }

  const pz = e.target.closest("[data-piezas]");
  if (pz) { abrirOrden(pz.dataset.piezas); return; }

  const v = e.target.closest("[data-vender]");
  if (v) { abrirVenta(v.dataset.vender); return; }

  const c = e.target.closest("[data-cancelar]");
  if (!c) return;
  const negocio = c.dataset.cancelar;
  if (CONFIRMANDO !== negocio) { pedirConfirmacion(c, negocio); return; }

  olvidarConfirmacion();
  const l = locales().filter((x) => x.negocio === negocio)[0];
  if (!l) return;
  c.disabled = true;
  try {
    const total = l.acrilico + l.sticker;
    let hechas = 0;
    for (const tipo of ["acrilico", "sticker"]) {
      const codigos = l.codigos[tipo];
      for (let i = 0; i < codigos.length; i += TANDA) {
        const tanda = codigos.slice(i, i + TANDA);
        hechas += tanda.length;
        c.textContent = "Liberando " + hechas + " de " + total + "…";
        await llamar("desactivar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codigos: tanda, tipo: tipo, desde: negocio }),
        });
      }
    }
    // La ficha era parte de la orden: si el local no paga, se va con ella. Si no,
    // la fila seguía viva y cobrada, y con Cancelar apagado no había cómo
    // limpiarla.
    if (l.ficha) {
      c.textContent = "Quitando la ficha…";
      await llamar("servicio-borrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: l.ficha.id }),
      });
    }

    parchearTarjetas(l.codigos.acrilico.concat(l.codigos.sticker),
      { negocio: "", destino: "", vendida: "", precio: 0, vendedor: "" });
    if (l.ficha) parchearServicio(l.ficha.id, null);

    const suelto = [];
    if (total) suelto.push(plural(total, "tarjeta libre", "tarjetas libres") + " otra vez");
    if (l.ficha) suelto.push("ficha quitada");
    avisar("avisoPanel", "Orden de " + negocio + " cancelada · " + suelto.join(" y "), true);
  } catch (err) {
    avisar("avisoPanel", err.message, false);
    pintarVentas();
  }
});

/* ---------- comprobante de venta ---------- */

// A propósito NO es una factura: no lleva numeración consecutiva, ni CUFE, ni
// QR, y lo dice en el pie. La referencia es la hora en base 36, que sirve para
// nombrarlo pero no forma serie. Somos no responsables de IVA, así que el
// comprador que lo necesite arma su documento soporte por su lado.
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
  "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function fechaLarga(iso) {
  const p = String(iso || "").split("-");
  if (p.length !== 3) return String(iso || "");
  return Number(p[2]) + " de " + MESES[Number(p[1]) - 1] + " de " + p[0];
}

function itemsDelLocal(l, precios) {
  const items = [];
  if (l.acrilico && precios.acrilico) {
    items.push({ que: "Acrílico personalizado con chip NFC",
      cuantos: l.acrilico, unitario: precios.acrilico, antes: LISTA.acrilico });
  }
  const gratis = Math.min(l.sticker, precios.gratis || 0);
  const cobrados = l.sticker - gratis;
  if (cobrados && precios.sticker) {
    items.push({ que: "Sticker de mesa con chip NFC",
      cuantos: cobrados, unitario: precios.sticker, antes: LISTA.sticker });
  }
  if (gratis) {
    items.push({ que: "Sticker de mesa con chip NFC — regalo de la ruleta",
      cuantos: gratis, unitario: 0,
      antes: precios.sticker || precioSticker(l.sticker) });
  }
  const ficha = precios.ficha !== undefined
    ? precios.ficha
    : (l.ficha ? Number(l.ficha.precio) || 0 : 0);
  if (ficha) {
    items.push({ que: "Montaje de la ficha del negocio en Google",
      cuantos: 1, unitario: ficha, antes: LISTA.ficha });
  }
  return items;
}

function comprobantePDF(datos) {
  if (!window.jspdf) throw new Error("No cargó la librería del PDF. Recarga la página.");
  const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
  const izq = 20, der = 190;
  let y = 24;

  doc.setFont("helvetica", "bold").setFontSize(17).setTextColor(20, 30, 45);
  doc.text("Comprobante de venta", izq, y);

  y += 6;
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(120, 130, 145);
  doc.text("Referencia " + datos.referencia + "   ·   " + fechaLarga(datos.fecha), izq, y);

  y += 10;
  doc.setDrawColor(226, 231, 240).setLineWidth(0.3).line(izq, y, der, y);

  y += 8;
  doc.setFontSize(10).setTextColor(90, 100, 120);
  doc.text("De", izq, y);
  doc.text("Para", 110, y);

  y += 5.5;
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(20, 30, 45);
  doc.text(datos.vendedor.nombre, izq, y);
  doc.text(datos.negocio || "—", 110, y);

  // cada columna crece por su lado y la tabla arranca debajo de la más larga
  doc.setFont("helvetica", "normal").setFontSize(9.5).setTextColor(90, 100, 120);
  let mias = ["C.C. " + datos.vendedor.cedula];
  if (datos.vendedor.telefono) mias.push("Tel. " + datos.vendedor.telefono);
  if (datos.vendedor.nota) mias = mias.concat(doc.splitTextToSize(datos.vendedor.nota, 78));

  let suyas = [];
  if (datos.nit) suyas.push("NIT/C.C. " + datos.nit);
  if (datos.correo) suyas = suyas.concat(doc.splitTextToSize(datos.correo, 78));
  if (datos.telefono) suyas.push("Tel. " + datos.telefono);

  let yi = y, yd = y;
  mias.forEach((t) => { yi += 4.6; doc.text(t, izq, yi); });
  suyas.forEach((t) => { yd += 4.6; doc.text(t, 110, yd); });
  y = Math.max(yi, yd);

  y += 12;
  doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(120, 130, 145);
  doc.text("DESCRIPCIÓN", izq, y);
  doc.text("CANT.", 118, y, { align: "right" });
  doc.text("V. UNITARIO", 152, y, { align: "right" });
  doc.text("TOTAL", der, y, { align: "right" });

  y += 2.5;
  doc.setDrawColor(226, 231, 240).line(izq, y, der, y);

  let total = 0;
  let ahorro = 0;
  datos.items.forEach((it) => {
    const parcial = it.cuantos * it.unitario;
    total += parcial;
    const rebaja = it.antes && it.antes > it.unitario
      ? (it.antes - it.unitario) * it.cuantos : 0;
    ahorro += rebaja;

    y += 8;
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(20, 30, 45);
    const lineas = doc.splitTextToSize(it.que, 72);
    doc.text(lineas, izq, y);
    doc.text(String(it.cuantos), 118, y, { align: "right" });
    doc.text(dinero(it.unitario), 152, y, { align: "right" });
    doc.text(dinero(parcial), der, y, { align: "right" });
    y += (lineas.length - 1) * 4.6;

    // el precio de antes, tachado a mano: jsPDF no trae subrayado ni tachado
    if (rebaja) {
      y += 4.4;
      doc.setFontSize(8).setTextColor(150, 158, 172);
      const viejo = dinero(it.antes);
      doc.text(viejo, 152, y, { align: "right" });
      const ancho = doc.getTextWidth(viejo);
      doc.setDrawColor(150, 158, 172).setLineWidth(0.25);
      doc.line(152 - ancho, y - 0.9, 152, y - 0.9);
    }
  });

  y += 6;
  doc.setDrawColor(226, 231, 240).setLineWidth(0.3).line(izq, y, der, y);

  if (ahorro) {
    y += 7;
    doc.setFont("helvetica", "normal").setFontSize(9.5).setTextColor(30, 142, 62);
    doc.text("Te ahorras", 152, y, { align: "right" });
    doc.text("-" + dinero(ahorro), der, y, { align: "right" });
  }

  y += 8;
  doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(20, 30, 45);
  doc.text("Total", 152, y, { align: "right" });
  doc.text(dinero(total), der, y, { align: "right" });

  doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(140, 150, 165);
  doc.text("Este documento no es una factura de venta ni una factura electrónica. " +
    "Es un comprobante comercial de la operación.", izq, 282, { maxWidth: der - izq });

  return { doc: doc, total: total, ahorro: ahorro };
}

function nombreArchivo(negocio, fecha) {
  const limpio = String(negocio || "venta").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase().slice(0, 40);
  return "comprobante-" + (limpio || "venta") + "-" + fecha + ".pdf";
}
// Los tres botones del comprobante trabajan con lo que hay en el formulario,
// no con lo guardado: así se puede revisar el PDF antes de aceptar la orden.
function datosDelComprobante() {
  if (!LOCAL_VENTA) return null;
  // sin los datos del vendedor no hay comprobante, así que en vez de mandarlo a
  // buscar el botón a otra pestaña, se le abre el formulario aquí mismo
  const quien = VENDEDORES[QUIEN_VENDE];
  if (!quien || !quien.nombre) {
    cerrarVenta();
    abrirAjustes(QUIEN_VENDE);
    avisar("avisoPanel", "Faltan el nombre y la cédula de " + SOCIO_NOMBRE[QUIEN_VENDE] +
      ". Se ponen una vez y ya salen en sus comprobantes.", false);
    return null;
  }
  const l = LOCAL_VENTA;
  const items = itemsDelLocal(l, preciosDeLaVenta());
  if (!items.length) {
    avisar("avisoVenta", "Pon los precios antes de sacar el comprobante.", false);
    return null;
  }
  return {
    referencia: Date.now().toString(36),
    fecha: $("ventaFecha").value || hoyISO(),
    vendedor: quien,
    negocio: l.negocio,
    nit: $("ventaNit").value.trim(),
    correo: $("ventaCorreo").value.trim(),
    telefono: $("ventaTelefono").value.trim(),
    items: items,
  };
}

async function recordarComprador(negocio, correo, nit, telefono) {
  if (!correo && !nit && !telefono) return;
  const guardado = COMPRADORES[negocio] || {};
  if (guardado.correo === correo && guardado.nit === nit &&
      guardado.telefono === telefono) return;
  try {
    await llamar("comprador", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ negocio: negocio, correo: correo, nit: nit, telefono: telefono }),
    });
    COMPRADORES[negocio] = { negocio: negocio, correo: correo, nit: nit, telefono: telefono };
  } catch (e) {
    // que no se caiga la venta por no poder recordar el correo
  }
}

$("mandarComprobante").onclick = () => enviarComprobante($("mandarComprobante"));

$("siEnviar").onclick = async () => {
  const fue = await enviarComprobante($("siEnviar"));
  if (fue) cerrarVenta();
};

$("ahoraNo").onclick = cerrarVenta;

// El cliente pagó pero no quiso papel: se cierra igual, sin correo
$("cerrarSinEnviar").onclick = async () => {
  if (!LOCAL_VENTA) return;
  const negocio = LOCAL_VENTA.negocio;
  const boton = $("cerrarSinEnviar");
  if (CONFIRMANDO !== "sinEnviar") { pedirConfirmacion(boton, "sinEnviar"); return; }

  olvidarConfirmacion();
  boton.disabled = true;
  try {
    const p = preciosDeLaVenta();
    const l = LOCAL_VENTA;
    const importe = p.acrilico * l.acrilico + p.sticker * (l.sticker - p.gratis) + p.ficha;
    const r = await llamar("comprobante-cerrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        negocio: negocio,
        total: dinero(importe),
        fecha: fechaLarga($("ventaFecha").value || hoyISO()),
        vendedor: (VENDEDORES[QUIEN_VENDE] || {}).nombre || "",
      }),
    });
    COMPROBANTES[negocio] = Object.assign({ negocio: negocio }, r.comprobante);
    $("preguntaComprobante").hidden = true;
    pintarBloqueoVenta(negocio);
    repintarTodo();
    avisar("avisoPanel", "Orden de " + negocio + " cerrada sin comprobante", true);
  } catch (err) {
    avisar("avisoVenta", err.message, false);
  } finally {
    boton.disabled = false;
  }
};

$("bajarComprobante").onclick = () => {
  try {
    const d = datosDelComprobante();
    if (!d) return;
    comprobantePDF(d).doc.save(nombreArchivo(d.negocio, d.fecha));
  } catch (err) {
    avisar("avisoVenta", err.message, false);
  }
};

// En el teléfono el menú nativo de compartir sí puede meter el PDF en WhatsApp;
// wa.me solo lleva texto, así que ese es el plan de repuesto.
$("compartirComprobante").onclick = async () => {
  try {
    const d = datosDelComprobante();
    if (!d) return;
    const hecho = comprobantePDF(d);
    const archivo = new File([hecho.doc.output("blob")], nombreArchivo(d.negocio, d.fecha),
      { type: "application/pdf" });
    const texto = "Comprobante de venta · " + d.negocio + " · " + dinero(hecho.total);
    if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
      await navigator.share({ files: [archivo], title: "Comprobante de venta", text: texto });
      return;
    }
    hecho.doc.save(nombreArchivo(d.negocio, d.fecha));
    window.open("https://wa.me/?text=" + encodeURIComponent(texto +
      " — te lo adjunto en este chat."), "_blank", "noopener");
  } catch (err) {
    if (err && err.name === "AbortError") return;
    avisar("avisoVenta", err.message, false);
  }
};

async function enviarComprobante(boton) {
  const correo = $("ventaCorreo").value.trim();
  if (!correo) {
    avisar("avisoVenta", "Escribe el correo del cliente.", false);
    $("ventaCorreo").focus();
    return false;
  }
  const etiqueta = boton.textContent;
  boton.disabled = true;
  boton.textContent = "Enviando…";
  try {
    const d = datosDelComprobante();
    if (!d) return false;
    const hecho = comprobantePDF(d);
    const base64 = hecho.doc.output("datauristring").split(",")[1];
    const r = await llamar("comprobante", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        correo: correo,
        negocio: d.negocio,
        archivo: nombreArchivo(d.negocio, d.fecha),
        total: dinero(hecho.total),
        ahorro: hecho.ahorro ? dinero(hecho.ahorro) : "",
        fecha: fechaLarga(d.fecha),
        referencia: d.referencia,
        vendedor: d.vendedor.nombre,
        telefonoVendedor: d.vendedor.telefono || "",
        pdf: base64,
      }),
    });
    await recordarComprador(d.negocio, correo, d.nit, d.telefono);
    if (r && r.comprobante) {
      COMPROBANTES[d.negocio] = Object.assign({ negocio: d.negocio }, r.comprobante);
      pintarBloqueoVenta(d.negocio);
      repintarTodo();
    }
    avisar("avisoPanel", "Comprobante enviado a " + correo +
      " · la orden queda cerrada", true);
    return true;
  } catch (err) {
    avisar("avisoVenta", err.message, false);
    return false;
  } finally {
    boton.disabled = false;
    boton.textContent = etiqueta;
  }
};

/* ---------- mis datos, los del que vende ---------- */

let focoAjustes = null;
let SOCIO_AJUSTES = "felipe";
// se edita sobre una copia: así cambiar de pestaña no pierde lo que ibas
// escribiendo del otro, y al guardar suben los dos
let BORRADOR_VENDEDORES = {};
const NOTA_POR_DEFECTO = "Persona natural no responsable de IVA.";

function leerFormAjustes() {
  return {
    nombre: $("ajustesNombre").value.trim(),
    cedula: $("ajustesCedula").value.trim(),
    telefono: $("ajustesTelefono").value.trim(),
    nota: $("ajustesNota").value.trim(),
  };
}

function pintarFormAjustes(socio) {
  const v = BORRADOR_VENDEDORES[socio] || {};
  $("ajustesNombre").value = v.nombre || "";
  $("ajustesCedula").value = v.cedula || "";
  $("ajustesTelefono").value = v.telefono || "";
  $("ajustesNota").value = v.nota !== undefined ? v.nota : NOTA_POR_DEFECTO;
}

$("socioAjustes").addEventListener("click", (e) => {
  const b = e.target.closest("[data-valor]");
  if (!b || b.dataset.valor === SOCIO_AJUSTES) return;
  BORRADOR_VENDEDORES[SOCIO_AJUSTES] = leerFormAjustes();
  SOCIO_AJUSTES = b.dataset.valor;
  marcarSegmento("socioAjustes", SOCIO_AJUSTES);
  pintarFormAjustes(SOCIO_AJUSTES);
});

function abrirAjustes(socio) {
  BORRADOR_VENDEDORES = {
    felipe: Object.assign({}, VENDEDORES.felipe),
    nicolas: Object.assign({}, VENDEDORES.nicolas),
  };
  SOCIO_AJUSTES = socio === "nicolas" ? "nicolas" : "felipe";
  marcarSegmento("socioAjustes", SOCIO_AJUSTES);
  pintarFormAjustes(SOCIO_AJUSTES);
  pintarTope();
  limpiarAviso();
  focoAjustes = document.activeElement;
  $("modalAjustes").hidden = false;
  document.body.style.overflow = "hidden";
  $("ajustesNombre").focus();
}

function cerrarAjustes() {
  if ($("modalAjustes").hidden) return;
  $("modalAjustes").hidden = true;
  document.body.style.overflow = "";
  if (focoAjustes && focoAjustes.focus) focoAjustes.focus();
  focoAjustes = null;
}

$("abrirAjustes").onclick = () => abrirAjustes(QUIEN_VENDE);
$("cerrarAjustes").onclick = cerrarAjustes;
$("cancelarAjustes").onclick = cerrarAjustes;
$("modalAjustes").addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-cerrar-ajustes")) cerrarAjustes();
});

$("formAjustes").onsubmit = async (e) => {
  e.preventDefault();
  BORRADOR_VENDEDORES[SOCIO_AJUSTES] = leerFormAjustes();
  const pendientes = ["felipe", "nicolas"].filter((k) => {
    const v = BORRADOR_VENDEDORES[k] || {};
    return v.nombre || v.cedula;
  });
  if (!pendientes.length) {
    avisar("avisoAjustes", "Pon al menos el nombre y la cédula de uno.", false);
    return;
  }

  const boton = $("guardarAjustes");
  boton.disabled = true;
  try {
    let ultimo = null;
    for (const socio of pendientes) {
      ultimo = await llamar("ajustes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.assign({ socio: socio }, BORRADOR_VENDEDORES[socio])),
      });
    }
    VENDEDORES = ultimo.vendedores;
    cerrarAjustes();
    avisar("avisoPanel", pendientes.length === 2
      ? "Datos de los dos guardados"
      : "Datos de " + SOCIO_NOMBRE[pendientes[0]] + " guardados", true);
  } catch (err) {
    avisar("avisoAjustes", err.message, false);
  } finally {
    boton.disabled = false;
  }
};

function abrirVenta(negocio) {
  const l = locales().filter((x) => x.negocio === negocio)[0];
  if (!l) return;
  LOCAL_VENTA = l;
  $("ventaTitulo").textContent = l.vendidas ? "Editar el cobro" : "Aceptar la orden";
  $("ventaSubtitulo").textContent = l.negocio + " · " + (l.piezas
    ? plural(l.acrilico, "acrílico", "acrílicos") + " y " + plural(l.sticker, "sticker", "stickers")
    : "sin tarjetas") + (l.ficha ? " · ficha de Google" : "");
  $("ventaFecha").value = l.fecha || hoyISO();
  const unitario = (tipo) => {
    const t = TARJETAS.filter((x) => x.negocio === l.negocio && tipoDe(x) === tipo && x.precio)[0];
    return t ? t.precio : "";
  };
  // si la orden ya se cobró se respeta lo que se cobró; si no, la lista de precios
  $("precioAcrilico").value = unitario("acrilico") || (l.acrilico ? PRECIOS.acrilico : "");
  $("precioSticker").value = unitario("sticker") || (l.sticker ? precioSticker(l.sticker) : "");
  pintarChips();
  // un local puede no tener plástico y llevar solo la ficha
  $("bloquePiezas").hidden = !l.piezas;
  // los regalados son los vinilos cobrados a cero; si no se ha cobrado, ninguno
  const regalados = TARJETAS.filter((x) => x.negocio === l.negocio && tipoDe(x) === "sticker" &&
    x.vendida && !Number(x.precio)).length;
  $("ventaGratis").value = regalados;
  $("ventaGratis").max = l.sticker;
  $("rotuloGratis").hidden = !l.sticker;
  $("ventaGratis").hidden = !l.sticker;
  $("precioFicha").value = l.ficha && l.ficha.precio ? l.ficha.precio
    : (l.ficha ? PRECIOS.ficha : "");
  $("guardarVenta").textContent = l.vendidas ? "Guardar el cobro" : "Aceptar la orden";
  const comp = COMPRADORES[l.negocio] || {};
  $("ventaCorreo").value = comp.correo || "";
  $("ventaNit").value = comp.nit || "";
  $("ventaTelefono").value = comp.telefono || "";
  $("preguntaComprobante").hidden = true;
  pintarBloqueoVenta(l.negocio);
  limpiarAviso("avisoVenta");
  pintarResumenVenta();
  focoVenta = document.activeElement;
  $("modalVenta").hidden = false;
  document.body.style.overflow = "hidden";
  $("precioAcrilico").focus();
}

// La lista de precios de la publicidad. El vinilo baja por cantidad, así que el
// tramo lo elige la propia orden: para eso ya sabe cuántos lleva.
// Lo que vale sin la promoción. Va tachado en el comprobante, para que el
// cliente vea lo que se ahorró.
const LISTA = { acrilico: 70000, sticker: 35000, ficha: 60000 };

const PRECIOS = {
  acrilico: 49900,
  ficha: 39900,
  sticker: [
    { desde: 100, rotulo: "100+", precio: 11900 },
    { desde: 50, rotulo: "50-99", precio: 12900 },
    { desde: 20, rotulo: "20-49", precio: 14900 },
    { desde: 10, rotulo: "10-19", precio: 16900 },
    { desde: 5, rotulo: "5-9", precio: 19900 },
    { desde: 2, rotulo: "2-4", precio: 22900 },
    { desde: 1, rotulo: "1", precio: 24900 },
  ],
};

function precioSticker(cuantos) {
  const tramo = PRECIOS.sticker.filter((x) => cuantos >= x.desde)[0];
  return tramo ? tramo.precio : PRECIOS.sticker[PRECIOS.sticker.length - 1].precio;
}

function chipPrecio(campo, precio, rotulo, sugerido) {
  return "<button type='button' data-campo='" + campo + "' data-precio='" + precio + "'" +
    (sugerido ? " class='sugerido'" : "") + ">" + dinero(precio) +
    (rotulo ? "<span class='tramo'>" + rotulo + "</span>" : "") + "</button>";
}

function pintarChips() {
  const l = LOCAL_VENTA;
  if (!l) return;
  const otro = (campo) => "<button type='button' class='otro' data-otro='" + campo + "'>Otro</button>";
  $("chipsAcrilico").innerHTML =
    chipPrecio("precioAcrilico", PRECIOS.acrilico, "", true) + otro("precioAcrilico");
  const sugerido = precioSticker(l.sticker);
  $("chipsSticker").innerHTML = PRECIOS.sticker.slice().reverse()
    .map((t) => chipPrecio("precioSticker", t.precio, t.rotulo, t.precio === sugerido)).join("") +
    otro("precioSticker");
  $("chipsFicha").innerHTML =
    chipPrecio("precioFicha", PRECIOS.ficha, "", true) + otro("precioFicha");
}

$("modalVenta").addEventListener("click", (e) => {
  const chip = e.target.closest("[data-precio]");
  if (chip && !chip.disabled) {
    $(chip.dataset.campo).value = chip.dataset.precio;
    pintarResumenVenta();
    return;
  }
  const libre = e.target.closest("[data-otro]");
  if (libre && !libre.disabled) {
    const campo = $(libre.dataset.otro);
    campo.value = "";
    campo.focus();
    pintarResumenVenta();
  }
});

function preciosDeLaVenta() {
  const l = LOCAL_VENTA;
  const tope = l ? l.sticker : 0;
  return {
    acrilico: Math.max(0, Number($("precioAcrilico").value) || 0),
    sticker: Math.max(0, Number($("precioSticker").value) || 0),
    ficha: Math.max(0, Number($("precioFicha").value) || 0),
    // por cada acrílico el local gira la ruleta y puede sacar uno o dos vinilos;
    // esos van en la orden como cualquier otro, pero a cero
    gratis: Math.min(tope, Math.max(0, Math.round(Number($("ventaGratis").value) || 0))),
  };
}

// Con comprobante enviado la venta se mira, no se toca: los precios y la fecha
// quedan como salieron en el papel hasta que se borre.
function pintarBloqueoVenta(negocio) {
  const acta = COMPROBANTES[negocio];
  $("bloqueoVenta").hidden = !acta;
  if (acta) {
    $("bloqueoTexto").innerHTML = (acta.sinEnviar
      ? "<b>Cerrada sin comprobante</b>" + (acta.fecha ? " · " + escHtml(acta.fecha) : "")
      : "<b>Comprobante enviado</b> a " + escHtml(acta.correo || "") +
        (acta.fecha ? " · " + escHtml(acta.fecha) : "")) +
      ". La orden queda cerrada; bórralo para poder cambiarla.";
  }
  ["ventaFecha", "precioAcrilico", "precioSticker", "precioFicha", "guardarVenta"]
    .forEach((id) => { $(id).disabled = Boolean(acta); });
  $("modalVenta").querySelectorAll(".chips button")
    .forEach((b) => { b.disabled = Boolean(acta); });
}

$("borrarComprobante").onclick = async () => {
  if (!LOCAL_VENTA) return;
  const negocio = LOCAL_VENTA.negocio;
  const boton = $("borrarComprobante");
  if (CONFIRMANDO !== "comprobante") { pedirConfirmacion(boton, "comprobante"); return; }

  olvidarConfirmacion();
  boton.disabled = true;
  try {
    await llamar("comprobante-borrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ negocio: negocio }),
    });
    delete COMPROBANTES[negocio];
    pintarBloqueoVenta(negocio);
    repintarTodo();
    avisar("avisoPanel", "Comprobante de " + negocio + " borrado · la orden vuelve a abrirse", true);
  } catch (err) {
    avisar("avisoVenta", err.message, false);
  } finally {
    boton.disabled = false;
  }
};

function pintarResumenVenta() {
  if (!LOCAL_VENTA) return;
  const l = LOCAL_VENTA;
  const p = preciosDeLaVenta();
  const partes = [];
  if (l.piezas) {
    partes.push(l.acrilico + " × " + dinero(p.acrilico));
    partes.push((l.sticker - p.gratis) + " × " + dinero(p.sticker));
    if (p.gratis) partes.push(p.gratis + " de regalo");
  }
  if (p.ficha) partes.push("ficha " + dinero(p.ficha));
  const total = p.acrilico * l.acrilico + p.sticker * (l.sticker - p.gratis) + p.ficha;
  $("ventaResumen").textContent = (partes.join("   +   ") || "sin nada que cobrar") +
    "   =   " + dinero(total);
}

// cada uno usa su propio teléfono, así que el panel recuerda quién es
$("quienVende").addEventListener("click", (e) => {
  const b = e.target.closest("[data-valor]");
  if (!b) return;
  QUIEN_VENDE = b.dataset.valor;
  marcarSegmento("quienVende", QUIEN_VENDE);
  try { localStorage.setItem("quienVende", QUIEN_VENDE); } catch (err) {}
});

try {
  const guardado = localStorage.getItem("quienVende");
  if (guardado === "felipe" || guardado === "nicolas") QUIEN_VENDE = guardado;
} catch (e) {}
marcarSegmento("quienVende", QUIEN_VENDE);

$("precioAcrilico").addEventListener("input", pintarResumenVenta);
$("precioSticker").addEventListener("input", pintarResumenVenta);
$("precioFicha").addEventListener("input", pintarResumenVenta);
$("ventaGratis").addEventListener("input", pintarResumenVenta);

function cerrarVenta() {
  if ($("modalVenta").hidden) return;
  $("modalVenta").hidden = true;
  document.body.style.overflow = "";
  if (focoVenta && focoVenta.focus) focoVenta.focus();
  focoVenta = null;
  LOCAL_VENTA = null;
}

$("cerrarVenta").onclick = cerrarVenta;
$("cancelarVenta").onclick = cerrarVenta;
$("modalVenta").addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-cerrar-venta")) cerrarVenta();
});

$("formVenta").onsubmit = async (e) => {
  e.preventDefault();
  if (!LOCAL_VENTA) return;
  const fecha = $("ventaFecha").value;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    avisar("avisoVenta", "Falta la fecha de la venta.", false);
    return;
  }
  const l = LOCAL_VENTA;
  const precios = preciosDeLaVenta();
  const boton = $("guardarVenta");
  const etiqueta = boton.textContent;
  boton.disabled = true;
  try {
    const total = l.acrilico + l.sticker;
    // los de regalo son vinilos como los demás, solo que a cero: van en su tanda
    const grupos = [
      { tipo: "acrilico", codigos: l.codigos.acrilico, precio: precios.acrilico },
      { tipo: "sticker", codigos: l.codigos.sticker.slice(0, precios.gratis), precio: 0 },
      { tipo: "sticker", codigos: l.codigos.sticker.slice(precios.gratis), precio: precios.sticker },
    ];
    let hechas = 0;
    for (const g of grupos) {
      for (let i = 0; i < g.codigos.length; i += TANDA) {
        const tanda = g.codigos.slice(i, i + TANDA);
        hechas += tanda.length;
        boton.textContent = "Cobrando " + hechas + " de " + total + "…";
        await llamar("rango", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            codigos: tanda,
            negocio: l.negocio,
            destino: l.destino,
            tipo: g.tipo,
            vendida: fecha,
            precio: g.precio,
            vendedor: QUIEN_VENDE,
          }),
        });
      }
    }
    // La ficha se cobra en la misma pasada: es la misma venta. Vaciar el campo no
    // la borra —para eso está Quitar en su ventana—, solo la deja como estaba.
    let fichaNueva = null;
    if (precios.ficha) {
      boton.textContent = "Cobrando la ficha…";
      const previa = l.ficha || {};
      fichaNueva = await llamar("servicio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: previa.id,
          negocio: l.negocio,
          precio: precios.ficha,
          fecha: fecha,
          vendedor: QUIEN_VENDE,
          hecha: Boolean(previa.hecha),
          notas: previa.notas || "",
        }),
      });
    }

    const importe = precios.acrilico * l.acrilico +
      precios.sticker * (l.sticker - precios.gratis) + precios.ficha;
    const correoCliente = $("ventaCorreo").value.trim();
    await recordarComprador(l.negocio, correoCliente,
      $("ventaNit").value.trim(), $("ventaTelefono").value.trim());
    for (const g of grupos) {
      if (g.codigos.length) {
        parchearTarjetas(g.codigos, { vendida: fecha, precio: g.precio, vendedor: QUIEN_VENDE });
      }
    }
    if (fichaNueva) parchearServicio(fichaNueva.id, fichaNueva);
    avisar("avisoPanel", "Orden de " + l.negocio + " aceptada · " + dinero(importe), true);
    // si hay correo, el paso siguiente casi siempre es mandarlo: se pregunta aquí
    // en vez de obligar a volver a entrar al cobro
    if (correoCliente && !cerrada(l.negocio)) {
      $("preguntaCorreo").textContent = correoCliente;
      $("preguntaComprobante").hidden = false;
      $("preguntaComprobante").scrollIntoView({ block: "nearest" });
    } else {
      cerrarVenta();
    }
  } catch (err) {
    avisar("avisoVenta", err.message, false);
  } finally {
    boton.disabled = false;
    boton.textContent = etiqueta;
  }
};

/* ---------- alta y edición de un gasto ---------- */

let PAGA = "ambos";
let ESTADO_GASTO = "entregado";
let focoGasto = null;

function pintarPaga(valor) {
  PAGA = SOCIO_NOMBRE[valor] ? valor : "ambos";
  marcarSegmento("pagaGasto", PAGA);
}

function pintarEstadoGasto(valor) {
  ESTADO_GASTO = valor === "pendiente" ? "pendiente" : "entregado";
  marcarSegmento("estadoGasto", ESTADO_GASTO);
  $("bloqueEntrega").hidden = ESTADO_GASTO !== "entregado";
}

$("pagaGasto").addEventListener("click", (e) => {
  const b = e.target.closest("[data-valor]");
  if (b) pintarPaga(b.dataset.valor);
});

$("estadoGasto").addEventListener("click", (e) => {
  const b = e.target.closest("[data-valor]");
  if (b) pintarEstadoGasto(b.dataset.valor);
});

// Las opciones salen de los gastos que ya existen, así la lista se mantiene sola
// y no hay un catálogo que actualizar cada vez que aparece un proveedor nuevo.
const OTRO = "__otro";

function llenarListasGasto() {
  const proveedores = [];
  const cosas = [];
  GASTOS.forEach((g) => {
    if (g.proveedor && proveedores.indexOf(g.proveedor) < 0) proveedores.push(g.proveedor);
    (g.items || []).forEach((it) => {
      if (it.que && cosas.indexOf(it.que) < 0) cosas.push(it.que);
    });
  });
  proveedores.sort();
  cosas.sort();

  $("gastoProveedor").innerHTML =
    proveedores.map((x) => "<option value='" + escHtml(x) + "'>" + escHtml(x) + "</option>").join("") +
    "<option value='" + OTRO + "'>Otro sitio…</option>";
  $("listaCosas").innerHTML =
    cosas.map((x) => "<option value='" + escHtml(x) + "'></option>").join("");
}

function pintarProveedor(valor) {
  const sel = $("gastoProveedor");
  const conocido = [].some.call(sel.options, (o) => o.value === valor);
  if (valor && !conocido) {
    sel.value = OTRO;
    $("proveedorOtro").value = valor;
  } else {
    sel.value = valor || (sel.options.length ? sel.options[0].value : OTRO);
    $("proveedorOtro").value = "";
  }
  $("bloqueProveedorOtro").hidden = sel.value !== OTRO;
}

function proveedorElegido() {
  const sel = $("gastoProveedor");
  return sel.value === OTRO ? $("proveedorOtro").value : sel.value;
}

$("gastoProveedor").addEventListener("change", () => {
  $("bloqueProveedorOtro").hidden = $("gastoProveedor").value !== OTRO;
  if (!$("bloqueProveedorOtro").hidden) $("proveedorOtro").focus();
});

function itemsDelFormulario() {
  const lista = [];
  for (let i = 0; i < 3; i++) {
    lista.push({
      que: $("item" + i).value,
      cuantos: $("cuantos" + i).value,
      malos: $("malos" + i).value,
    });
  }
  return lista;
}

function abrirGasto(id) {
  const g = GASTOS.filter((x) => x.id === id)[0] || null;
  GASTO_EDITADO = g ? g.id : "";

  $("gastoKicker").textContent = g ? "Gasto del " + g.fecha : "Nuevo gasto";
  $("gastoTitulo").textContent = g ? "Editar el gasto" : "Anotar un gasto";
  $("guardarGasto").textContent = g ? "Guardar cambios" : "Anotar el gasto";

  $("gastoFecha").value = g ? g.fecha : hoyISO();
  llenarListasGasto();
  pintarProveedor(g ? g.proveedor : "");
  $("gastoDescripcion").value = g ? g.descripcion || "" : "";
  $("gastoMonto").value = g ? g.monto : "";
  $("gastoEntrega").value = g && g.entrega ? g.entrega : hoyISO();
  $("gastoNotas").value = g ? g.notas || "" : "";
  pintarPaga(g ? g.paga : "ambos");
  pintarEstadoGasto(g ? g.estado : "entregado");

  const items = (g && g.items) || [];
  for (let i = 0; i < 3; i++) {
    $("item" + i).value = items[i] ? items[i].que : "";
    $("cuantos" + i).value = items[i] ? items[i].cuantos : "";
    $("malos" + i).value = items[i] && items[i].malos ? items[i].malos : "";
  }

  limpiarAviso("avisoGasto");
  focoGasto = document.activeElement;
  $("modalGasto").hidden = false;
  document.body.style.overflow = "hidden";
  $("gastoMonto").focus();
}

function cerrarGasto() {
  if ($("modalGasto").hidden) return;
  $("modalGasto").hidden = true;
  document.body.style.overflow = "";
  if (focoGasto && focoGasto.focus) focoGasto.focus();
  focoGasto = null;
  GASTO_EDITADO = "";
}

$("abrirGasto").onclick = () => abrirGasto("");
$("cerrarGasto").onclick = cerrarGasto;
$("cancelarGasto").onclick = cerrarGasto;
$("modalGasto").addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-cerrar-gasto")) cerrarGasto();
});

$("formGasto").onsubmit = async (e) => {
  e.preventDefault();
  const boton = $("guardarGasto");
  const etiqueta = boton.textContent;
  boton.disabled = true;
  boton.textContent = "Guardando…";
  try {
    const guardado = await llamar("gasto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: GASTO_EDITADO,
        fecha: $("gastoFecha").value,
        proveedor: proveedorElegido(),
        descripcion: $("gastoDescripcion").value,
        monto: $("gastoMonto").value,
        paga: PAGA,
        estado: ESTADO_GASTO,
        entrega: $("gastoEntrega").value,
        notas: $("gastoNotas").value,
        items: itemsDelFormulario(),
      }),
    });
    const editaba = Boolean(GASTO_EDITADO);
    cerrarGasto();
    parchearGasto(guardado.id, guardado);
    avisar("avisoPanel", editaba ? "Gasto actualizado" : "Gasto anotado", true);
  } catch (err) {
    avisar("avisoGasto", err.message, false);
  } finally {
    boton.disabled = false;
    boton.textContent = etiqueta;
  }
};

$("tablaGastos").addEventListener("click", async (e) => {
  const pg = e.target.closest("[data-pagina]");
  if (pg && !pg.disabled) {
    PAGINA_GASTOS = parseInt(pg.dataset.pagina, 10) || 1;
    pintarCuentas();
    return;
  }

  if (e.target.closest("[data-gasto-nuevo]")) { abrirGasto(""); return; }

  const ed = e.target.closest("[data-gasto]");
  if (ed) { abrirGasto(ed.dataset.gasto); return; }

  const b = e.target.closest("[data-gasto-borrar]");
  if (!b) return;
  const id = b.dataset.gastoBorrar;
  if (CONFIRMANDO !== id) { pedirConfirmacion(b, id); return; }

  olvidarConfirmacion();
  b.disabled = true;
  try {
    await llamar("gasto-borrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });
    parchearGasto(id, null);
    avisar("avisoPanel", "Gasto borrado", true);
  } catch (err) {
    avisar("avisoPanel", err.message, false);
    pintarCuentas();
  }
});

/* ---------- alta de tarjetas en blanco ---------- */

// Crear una tarjeta vacía es escribir exactamente el mismo registro que deja
// "desactivar": sin destino y sin negocio. Así que reusa ese endpoint en vez de
// añadir uno que haría lo mismo.
const MAX_NUEVAS = 500;
let focoActivar = null;

function codigosNuevos(cuantas) {
  const sig = siguienteCodigo();
  if (!sig.codigo || !(cuantas > 0)) return [];
  const inicio = indiceDeCodigo(sig.codigo);
  const lista = [];
  for (let i = 0; i < cuantas && inicio + i < TOPE; i++) {
    lista.push(codigoDeIndice(inicio + i));
  }
  return lista;
}

function pintarResumenActivar() {
  const cuantas = Math.min(MAX_NUEVAS, parseInt($("cuantasNuevas").value, 10) || 0);
  const lista = codigosNuevos(cuantas);
  const caja = $("activarResumen");
  if (!lista.length) {
    caja.textContent = "Escribe cuántas tarjetas vas a imprimir.";
    return;
  }
  const sig = siguienteCodigo();
  const tipos = {};
  lista.forEach((c) => { tipos[tipoPorDefecto(c)] = (tipos[tipoPorDefecto(c)] || 0) + 1; });
  const detalle = Object.keys(tipos)
    .map((t) => nombreTipo(t, tipos[t]))
    .join(" y ");
  caja.textContent = plural(lista.length, "tarjeta", "tarjetas") + " · " + tramo(lista) +
    " · de la nº " + sig.numero + " a la nº " + (sig.numero + lista.length - 1) +
    "   ·   " + detalle;
}

function abrirActivar() {
  $("cuantasNuevas").value = "";
  pintarResumenActivar();
  focoActivar = document.activeElement;
  $("modalActivar").hidden = false;
  document.body.style.overflow = "hidden";
  $("cuantasNuevas").focus();
}

function cerrarActivar() {
  if ($("modalActivar").hidden) return;
  $("modalActivar").hidden = true;
  document.body.style.overflow = "";
  if (focoActivar && focoActivar.focus) focoActivar.focus();
  focoActivar = null;
}

$("abrirActivar").onclick = abrirActivar;
$("cerrarActivar").onclick = cerrarActivar;
$("cancelarActivar").onclick = cerrarActivar;
$("cuantasNuevas").addEventListener("input", pintarResumenActivar);
$("modalActivar").addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-cerrar-activar")) cerrarActivar();
});

$("formActivar").onsubmit = async (e) => {
  e.preventDefault();
  const cuantas = Math.min(MAX_NUEVAS, parseInt($("cuantasNuevas").value, 10) || 0);
  const lista = codigosNuevos(cuantas);
  if (!lista.length) {
    avisar("avisoPanel", "Escribe cuántas tarjetas vas a imprimir.", false);
    return;
  }

  const grupos = { acrilico: [], sticker: [] };
  lista.forEach((c) => grupos[tipoPorDefecto(c)].push(c));

  const boton = $("guardarActivar");
  const etiqueta = boton.textContent;
  boton.disabled = true;
  try {
    let hechas = 0;
    for (const tipo of ["acrilico", "sticker"]) {
      const codigos = grupos[tipo];
      for (let i = 0; i < codigos.length; i += TANDA) {
        const tanda = codigos.slice(i, i + TANDA);
        hechas += tanda.length;
        boton.textContent = "Creando " + hechas + " de " + lista.length + "…";
        await llamar("desactivar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codigos: tanda, tipo: tipo }),
        });
      }
    }
    cerrarActivar();
    lista.forEach((c) => TARJETAS.push({
      codigo: c, negocio: "", destino: "", tipo: tipoPorDefecto(c), vendida: "", precio: 0,
    }));
    TARJETAS.sort((a, b) => a.codigo.localeCompare(b.codigo));
    repintarTodo();
    avisar("avisoPanel", plural(lista.length, "tarjeta creada", "tarjetas creadas") +
      " · " + tramo(lista), true);
  } catch (err) {
    avisar("avisoPanel", err.message, false);
  } finally {
    boton.disabled = false;
    boton.textContent = etiqueta;
  }
};

/* ---------- el chip NFC de cada tarjeta ---------- */

// Grabar el chip es trabajo manual, tarjeta por tarjeta, y no se ve en ningún
// sitio: este botón es la única forma de saber cuáles faltan.
async function marcarNFC(boton, codigo) {
  const listo = !NFC[codigo];
  boton.disabled = true;
  try {
    await llamar("nfc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo: codigo, listo: listo }),
    });
    if (listo) NFC[codigo] = 1; else delete NFC[codigo];
    boton.classList.toggle("puesto", listo);
    boton.setAttribute("aria-pressed", listo ? "true" : "false");
  } catch (err) {
    avisar("avisoPanel", err.message, false);
  } finally {
    boton.disabled = false;
  }
}

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
  if (!$("modalActivar").hidden) cerrarActivar();
  else if (!$("modalGasto").hidden) cerrarGasto();
  else if (!$("modalAjustes").hidden) cerrarAjustes();
  else if (!$("modalVenta").hidden) cerrarVenta();
  else if (!$("modalTarjeta").hidden) cerrarTarjeta();
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
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/4.2.1/jspdf.umd.min.js"></script>

<div class="grano"></div>
<div class="tostadas" id="tostadas" role="status" aria-live="polite"></div>

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
        <button type="button" id="abrirLocal" title="Nueva orden">
          <svg class="icono-barra" viewBox="0 0 24 24" width="14" height="14" fill="none"
               stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14"/>
          </svg><span class="etiqueta">Nueva orden</span></button>
        <a class="boton fantasma" href="https://www.google.com/maps" target="_blank" rel="noopener"
           title="Google Maps">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
               stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>
          </svg><span class="etiqueta">Google Maps</span></a>
        <button type="button" class="fantasma" id="salir" title="Cerrar sesión">
          <svg class="icono-barra" viewBox="0 0 24 24" width="14" height="14" fill="none"
               stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"
               aria-hidden="true">
            <path d="M15 17l5-5-5-5"/><path d="M20 12H9"/><path d="M12 3H5v18h7"/>
          </svg><span class="etiqueta">Cerrar sesión</span></button>
      </nav>
    </div>
  </header>

  <main id="principal" class="envoltorio contenido">
    <div class="banner" id="bannerPruebas" hidden role="status">
      <span><b>Modo pruebas activo.</b> Las que ya están vendidas siguen llevando a
      Google; las demás enseñan su código y su número.</span>
      <button type="button" class="fantasma" id="apagarPruebas">Apagar</button>
    </div>

    <section class="lamina panel">
      <div class="panel-barra">
        <div class="segmento" id="vistaPanel" role="group" aria-label="Qué se lista">
          <button type="button" class="activa" data-valor="tarjetas">Tarjetas</button>
          <button type="button" data-valor="locales">Órdenes</button>
          <button type="button" data-valor="cuentas">Cuentas</button>
          <button type="button" data-valor="inventario">Inventario</button>
        </div>
        <div class="cabecera-acciones">
          <button type="button" id="abrirActivar">Activar tarjetas</button>
          <button type="button" class="fantasma" id="togglePruebas">Modo pruebas</button>
          <button type="button" class="fantasma" id="abrirRango">Editar un rango</button>
          <button type="button" class="fantasma" id="abrirAjustes" hidden>Mis datos</button>
          <button type="button" class="fantasma" id="recargar">Refrescar</button>
        </div>
      </div>

      <div id="vistaTarjetas">
      <div class="busca">
        <div class="busca-campo">
          <svg class="busca-lupa" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>
          </svg>
          <input id="buscar" type="search" placeholder="Buscar por código o negocio"
                 aria-label="Buscar por código o negocio" autocomplete="off">
        </div>
        <button type="button" class="fantasma" id="limpiarBusca" hidden>Limpiar</button>
        <div class="segmento filtros" id="filtroTipo" role="group" aria-label="Filtrar por tipo">
          <button type="button" class="activa" data-valor="">Todas</button>
          <button type="button" data-valor="acrilico">Acrílico</button>
          <button type="button" data-valor="sticker">Sticker</button>
        </div>
      </div>

      <div id="tabla"></div>
      <div class="contador" id="contador"></div>
      </div>

      <div id="vistaCuentas" hidden>
        <div class="grafica" aria-label="Dinero por día">
          <div class="grafica-alto">
            <div>
              <p class="cejilla">Dinero por día</p>
              <div class="metrica" id="dineroMetrica">—</div>
            </div>
            <div class="leyenda" id="dineroLeyenda"></div>
          </div>
          <div class="pozo" id="pozoDinero"></div>
          <div class="grafica-pie" id="dineroPie"></div>
        </div>

        <div class="socios" id="socios"></div>
        <div class="saldo" id="saldo"></div>

        <div class="bloque-titulo">
          <h2>Gastos</h2>
          <button type="button" id="abrirGasto">Nuevo gasto</button>
        </div>
        <div id="tablaGastos"></div>

      </div>

      <div id="vistaInventario" hidden>
        <div id="tablaInventario"></div>
      </div>

      <div id="vistaLocales" hidden>
      <div class="grafica" aria-label="Ventas por día">
        <div class="grafica-alto">
          <div>
            <p class="cejilla">Ventas por día</p>
            <div class="metrica" id="graficaMetrica">—</div>
          </div>
          <div class="segmento" id="metricaVentas" role="group" aria-label="Qué se mide">
            <button type="button" class="activa" data-valor="unidades">Unidades</button>
            <button type="button" data-valor="ingresos">Ingresos</button>
          </div>
        </div>
        <div class="pozo" id="pozoGrafica"></div>
        <div class="grafica-pie" id="graficaPie"></div>
      </div>
        <div id="tablaLocales"></div>
      </div>
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
      <div class="segmento" id="modoTarjeta" role="group" aria-label="Qué se va a editar">
        <button type="button" class="activa" data-valor="una">Una tarjeta</button>
        <button type="button" data-valor="local">Una orden</button>
        <button type="button" data-valor="rango">Un rango</button>
      </div>

      <div id="campoLocal" hidden>
        <label class="paso"><span class="n n1">1</span>Qué lleva la orden</label>
        <div class="rango-fila">
          <div>
            <div class="mini">Acrílicos de mesa</div>
            <div class="par">
              <div><div class="mini2">desde el nº</div>
                <input class="c1" id="desdeAcrilico" type="number" min="1" placeholder="1"
                       aria-label="Acrílicos, desde qué número" autocomplete="off"></div>
              <div><div class="mini2">cuántos</div>
                <input class="c1" id="nAcrilicos" type="number" min="0" placeholder="2"
                       aria-label="Cuántos acrílicos" autocomplete="off"></div>
            </div>
          </div>
          <div>
            <div class="mini">Stickers de mesa</div>
            <div class="par">
              <div><div class="mini2">desde el nº</div>
                <input class="c1" id="desdeSticker" type="number" min="1" placeholder="101"
                       aria-label="Stickers, desde qué número" autocomplete="off"></div>
              <div><div class="mini2">cuántos</div>
                <input class="c1" id="nStickers" type="number" min="0" placeholder="10"
                       aria-label="Cuántos stickers" autocomplete="off"></div>
            </div>
          </div>
        </div>
        <div class="modal-acciones acciones-izq sin-aire">
          <button type="button" class="leer" id="escanear">Escanear una pieza</button>
          <button type="button" class="fantasma" id="vaciarPiezas" hidden>Vaciar la lista</button>
          <span class="mini2 escaneo" id="escaneoDicho"></span>
        </div>
        <div class="chips" id="piezasSueltas"></div>
        <div class="camara" id="camara" hidden>
          <video id="video" playsinline muted></video>
          <div class="camara-mira"></div>
          <button type="button" class="fantasma" id="cerrarCamara">Cerrar</button>
        </div>

        <div class="rango-resumen" id="localResumen">Escribe cuántos acrílicos y cuántos stickers lleva la orden.</div>

        <label class="casilla" id="filaLlevaFicha">
          <input type="checkbox" id="ordenLlevaFicha"> Lleva ficha de Google</label>
        <div id="detalleFicha" hidden>
          <p class="mini2 sin-aire">Su precio va con el de las piezas, al aceptar la orden.</p>
          <label class="casilla"><input type="checkbox" id="ordenFichaHecha">
            Ya está publicada</label>
          <label class="mini sobre-buscador" for="ordenFichaNotas">Notas de la ficha</label>
          <input id="ordenFichaNotas" type="text" maxlength="200"
                 placeholder="Faltan las fotos del local" autocomplete="off">
        </div>
      </div>

      <div id="campoUna">
        <label class="paso" for="codigo"><span class="n n1">1</span>Código de la tarjeta
          <span class="num" id="numeroTarjeta"></span></label>
        <input class="c1" id="codigo" placeholder="AADW" autocomplete="off">
      </div>

      <div id="campoRango" hidden>
        <label class="paso"><span class="n n1">1</span>Qué tarjetas se editan</label>
        <div class="segmento" id="origenRango" role="group" aria-label="Cómo se eligen las tarjetas">
          <button type="button" class="activa" data-valor="numero">Por número</button>
          <button type="button" data-valor="orden">De una orden</button>
        </div>

        <div id="rangoOrden" hidden>
          <select id="ordenRango" aria-label="Orden que se va a editar"></select>
        </div>

        <div id="rangoNumeros">
        <div class="rango-fila">
          <div><div class="mini">Desde el nº</div>
            <input class="c1" id="desde" type="number" min="1" placeholder="101" autocomplete="off"></div>
          <div><div class="mini">Hasta el nº</div>
            <input class="c1" id="hasta" type="number" min="1" placeholder="110" autocomplete="off"></div>
        </div>
        </div>
        <div class="rango-resumen" id="rangoResumen">Escribe un rango válido: del menor al mayor.</div>
      </div>

      <label class="paso" for="buscarLocal"><span class="n n2">2</span>A qué local apunta</label>
      <input id="buscarLocal" type="search" placeholder="Buscar local" autocomplete="off"
             aria-label="Buscar entre los locales registrados">
      <div class="sugerencias" id="sugerenciasLocal" hidden role="listbox"
           aria-label="Locales que coinciden"></div>
      <select id="localExistente" class="sobre-buscador" size="1" aria-label="Local ya registrado"></select>
      <input class="c2" id="maps" placeholder="https://www.google.com/maps/place/…" autocomplete="off" required>

      <div class="modal-acciones acciones-izq">
        <button type="button" class="leer" id="analizar">Leer la URL</button>
        <a class="enlace-mini" id="enlaceMaps" target="_blank" rel="noopener"
           href="https://www.google.com/maps">Google Maps</a>
        <a class="enlace-mini" target="_blank" rel="noopener"
           href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder">Buscador de Place ID</a>
      </div>

      <div class="ficha" id="ficha" hidden>
        <b id="fichaNombre"></b>
        <div class="meta" id="fichaMeta"></div>
        <input id="fichaReview" type="hidden">
      </div>

      <label class="paso" for="negocio"><span class="n n3">3</span>Nombre del negocio</label>
      <input class="c3" id="negocio" placeholder="Mercacentro Av. Guabinal" autocomplete="off" required>

      <div id="bloqueTipo">
        <label class="paso"><span class="n n4">4</span>Tipo de tarjeta</label>
        <div class="segmento" id="tipoTarjeta" role="group" aria-label="Tipo de tarjeta">
          <button type="button" class="activa" data-valor="acrilico">Acrílico</button>
          <button type="button" data-valor="sticker">Sticker</button>
        </div>
      </div>

      <div class="modal-acciones">
        <button type="button" class="fantasma" id="cancelarTarjeta">Cancelar</button>
        <button type="submit" id="guardar">Activar tarjeta</button>
      </div>

    </form>
  </div>
</div>

<div class="modal" id="modalActivar" hidden>
  <div class="modal-fondo" data-cerrar-activar></div>
  <div class="modal-caja franja" role="dialog" aria-modal="true" aria-labelledby="activarTitulo">
    <button type="button" class="modal-cerrar" id="cerrarActivar" aria-label="Cerrar">✕</button>
    <div class="modal-kicker">Tarjetas</div>
    <h1 id="activarTitulo">Activar tarjetas</h1>
    <p class="modal-subtitulo">Crea los registros vacíos que siguen en la numeración.</p>

    <form id="formActivar">
      <label class="mini" for="cuantasNuevas">Cuántas vas a imprimir</label>
      <input id="cuantasNuevas" type="number" min="1" max="500" placeholder="50" autocomplete="off">
      <div class="rango-resumen" id="activarResumen"></div>

      <div class="modal-acciones">
        <button type="button" class="fantasma" id="cancelarActivar">Cancelar</button>
        <button type="submit" id="guardarActivar">Activar</button>
      </div>
    </form>
  </div>
</div>

<div class="modal" id="modalAjustes" hidden>
  <div class="modal-fondo" data-cerrar-ajustes></div>
  <div class="modal-caja franja" role="dialog" aria-modal="true" aria-labelledby="ajustesTitulo">
    <button type="button" class="modal-cerrar" id="cerrarAjustes" aria-label="Cerrar">✕</button>
    <div class="modal-kicker">Comprobantes</div>
    <h1 id="ajustesTitulo">Quién vende</h1>
    <p class="modal-subtitulo">Los datos de cada uno, para firmar el comprobante de sus ventas.</p>

    <form id="formAjustes">
      <div class="segmento" id="socioAjustes" role="group" aria-label="De quién son los datos">
        <button type="button" class="activa" data-valor="felipe">Felipe</button>
        <button type="button" data-valor="nicolas">Nicolás</button>
      </div>

      <label class="mini sobre-buscador" for="ajustesNombre">Nombre completo</label>
      <input id="ajustesNombre" type="text" maxlength="80" placeholder="Juan Felipe Pérez"
             autocomplete="off">

      <div class="rango-fila">
        <div><label class="mini" for="ajustesCedula">Cédula</label>
          <input id="ajustesCedula" type="text" maxlength="30" placeholder="1.020.304.050"
                 autocomplete="off"></div>
        <div><label class="mini" for="ajustesTelefono">Teléfono <span class="suave">(opcional)</span></label>
          <input id="ajustesTelefono" type="text" maxlength="30" placeholder="300 123 4567"
                 autocomplete="off"></div>
      </div>

      <label class="mini" for="ajustesNota">Nota bajo el nombre</label>
      <input id="ajustesNota" type="text" maxlength="160" autocomplete="off">

      <div class="tope" id="tope"></div>

      <div class="modal-acciones">
        <button type="button" class="fantasma" id="cancelarAjustes">Cancelar</button>
        <button type="submit" id="guardarAjustes">Guardar</button>
      </div>
    </form>
  </div>
</div>
<div class="modal" id="modalGasto" hidden>
  <div class="modal-fondo" data-cerrar-gasto></div>
  <div class="modal-caja modal-tarjeta franja" role="dialog" aria-modal="true" aria-labelledby="gastoTitulo">
    <button type="button" class="modal-cerrar" id="cerrarGasto" aria-label="Cerrar">✕</button>
    <div class="modal-kicker" id="gastoKicker">Nuevo gasto</div>
    <h1 id="gastoTitulo">Anotar un gasto</h1>
    <p class="modal-subtitulo">Lo que se compró, cuánto costó y quién puso la plata.</p>

    <form id="formGasto">
      <div class="rango-fila sin-aire">
        <div><label class="mini" for="gastoFecha">Fecha de la compra</label>
          <input id="gastoFecha" type="date" required></div>
        <div><label class="mini" for="gastoMonto">Monto en pesos</label>
          <input id="gastoMonto" type="number" min="0" step="1" placeholder="23687" required></div>
      </div>

      <label class="mini" for="gastoProveedor">De dónde</label>
      <select id="gastoProveedor"></select>
      <div id="bloqueProveedorOtro" hidden>
        <label class="mini" for="proveedorOtro">Nombre del sitio nuevo</label>
        <input id="proveedorOtro" placeholder="Ferretería del barrio" autocomplete="off">
      </div>

      <label class="mini" for="gastoDescripcion">Qué se compró</label>
      <input id="gastoDescripcion" placeholder="70 chips NFC" autocomplete="off">

      <label class="mini">Quién puso la plata</label>
      <div class="segmento" id="pagaGasto" role="group" aria-label="Quién puso la plata">
        <button type="button" data-valor="felipe">Felipe</button>
        <button type="button" data-valor="nicolas">Nicolás</button>
        <button type="button" class="activa" data-valor="ambos">Compartido</button>
      </div>

      <label class="mini">Estado del pedido</label>
      <div class="segmento" id="estadoGasto" role="group" aria-label="Estado del pedido">
        <button type="button" data-valor="pendiente">En camino</button>
        <button type="button" class="activa" data-valor="entregado">Entregado</button>
      </div>

      <div id="bloqueEntrega">
        <label class="mini" for="gastoEntrega">Cuándo llegó</label>
        <input id="gastoEntrega" type="date">
      </div>

      <label class="mini">Qué trajo, para el inventario</label>
      <div class="items-fila">
        <input id="item0" list="listaCosas" placeholder="Chips NFC" autocomplete="off" aria-label="Cosa 1">
        <input id="cuantos0" type="number" min="0" placeholder="cuántos" aria-label="Cuántos de la cosa 1">
        <input id="malos0" type="number" min="0" placeholder="malos" aria-label="Cuántos malos de la cosa 1">
      </div>
      <div class="items-fila">
        <input id="item1" list="listaCosas" placeholder="Acrílicos" autocomplete="off" aria-label="Cosa 2">
        <input id="cuantos1" type="number" min="0" placeholder="cuántos" aria-label="Cuántos de la cosa 2">
        <input id="malos1" type="number" min="0" placeholder="malos" aria-label="Cuántos malos de la cosa 2">
      </div>
      <div class="items-fila">
        <input id="item2" list="listaCosas" placeholder="Vinilos de mesa" autocomplete="off" aria-label="Cosa 3">
        <input id="cuantos2" type="number" min="0" placeholder="cuántos" aria-label="Cuántos de la cosa 3">
        <input id="malos2" type="number" min="0" placeholder="malos" aria-label="Cuántos malos de la cosa 3">
      </div>

      <datalist id="listaCosas"></datalist>

      <label class="mini" for="gastoNotas">Notas</label>
      <input id="gastoNotas" placeholder="26 acrílicos llegaron dañados" autocomplete="off">

      <div class="modal-acciones">
        <button type="button" class="fantasma" id="cancelarGasto">Cancelar</button>
        <button type="submit" id="guardarGasto">Anotar el gasto</button>
      </div>
    </form>
  </div>
</div>

<div class="modal" id="modalVenta" hidden>
  <div class="modal-fondo" data-cerrar-venta></div>
  <div class="modal-caja franja" role="dialog" aria-modal="true" aria-labelledby="ventaTitulo">
    <button type="button" class="modal-cerrar" id="cerrarVenta" aria-label="Cerrar">✕</button>
    <div class="modal-kicker">Venta</div>
    <h1 id="ventaTitulo">Aceptar la orden</h1>
    <p class="modal-subtitulo" id="ventaSubtitulo"></p>

    <div class="banner hecho" id="preguntaComprobante" hidden role="status">
      <span>Orden aceptada. <b>¿Le mando el comprobante a
        <span id="preguntaCorreo"></span>?</b></span>
      <button type="button" class="fantasma" id="ahoraNo">Ahora no</button>
      <button type="button" class="leer" id="siEnviar">Enviar</button>
    </div>

    <div class="banner" id="bloqueoVenta" hidden role="status">
      <span id="bloqueoTexto"></span>
      <button type="button" class="fantasma" id="borrarComprobante">Borrar comprobante</button>
    </div>

    <form id="formVenta">
      <label class="mini" for="ventaFecha">Fecha de la venta</label>
      <input id="ventaFecha" type="date">

      <div class="rango-fila" id="bloquePiezas">
        <div><label class="mini" for="precioAcrilico">Precio por acrílico</label>
          <input id="precioAcrilico" type="number" min="0" step="1" placeholder="0" autocomplete="off">
          <div class="chips" id="chipsAcrilico"></div></div>
        <div><label class="mini" for="precioSticker">Precio por sticker</label>
          <input id="precioSticker" type="number" min="0" step="1" placeholder="0" autocomplete="off">
          <div class="chips" id="chipsSticker"></div></div>
      </div>

      <label class="mini" for="ventaGratis" id="rotuloGratis">Vinilos de regalo
        <span class="suave">(los que sacó en la ruleta)</span></label>
      <input id="ventaGratis" type="number" min="0" step="1" value="0" autocomplete="off">

      <label class="mini" for="precioFicha">Ficha de Google
        <span class="suave">(vacío si no lleva)</span></label>
      <input id="precioFicha" type="number" min="0" step="1" placeholder="0" autocomplete="off">
      <div class="chips" id="chipsFicha"></div>
      <div class="rango-resumen" id="ventaResumen"></div>

      <label class="mini" for="ventaCorreo">Correo del cliente</label>
      <input id="ventaCorreo" type="email" placeholder="local@correo.com" autocomplete="off">

      <div class="rango-fila">
        <div><label class="mini" for="ventaNit">NIT o cédula <span class="suave">(opcional)</span></label>
          <input id="ventaNit" type="text" maxlength="30" placeholder="900123456-7" autocomplete="off"></div>
        <div><label class="mini" for="ventaTelefono">Teléfono <span class="suave">(opcional)</span></label>
          <input id="ventaTelefono" type="text" maxlength="30" placeholder="300 123 4567" autocomplete="off"></div>
      </div>

      <div class="modal-acciones">
        <button type="button" class="fantasma" id="cancelarVenta">Cancelar</button>
        <button type="submit" id="guardarVenta">Aceptar la orden</button>
      </div>
    </form>

    <div class="comprobante">
      <div class="cejilla">Comprobante de venta</div>
      <p class="mini2 sin-aire">Quién hizo la venta</p>
      <div class="segmento" id="quienVende" role="group" aria-label="Quién hizo la venta">
        <button type="button" class="activa" data-valor="felipe">Felipe</button>
        <button type="button" data-valor="nicolas">Nicolás</button>
      </div>
      <div class="modal-acciones acciones-izq">
        <button type="button" class="fantasma" id="bajarComprobante">Descargar PDF</button>
        <button type="button" class="fantasma" id="compartirComprobante">Compartir</button>
        <button type="button" class="leer" id="mandarComprobante">Enviar al correo</button>
        <button type="button" class="fantasma" id="cerrarSinEnviar">Cerrar sin enviar</button>
      </div>
    </div>
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
  </div>
</div>

<script>
const ORIGEN = ${JSON.stringify(origen)};
</script>
<script>${SCRIPT_PANEL}</script>`;
}
