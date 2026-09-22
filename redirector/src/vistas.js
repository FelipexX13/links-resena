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
  .marca-quien{font-family:inherit;font-weight:600;color:var(--azul-fuerte)}
  .marca-quien:not(:empty)::before{content:" · "}
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
  /* junto a "Leer la URL" son ayudas, no la acción: mismo botón, un punto menos */
  .boton.mini{padding:8px 14px;font-size:12.5px}
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
  .modal-tarjeta{max-width:620px;padding-top:0}

  /* La orden se rellena de arriba abajo y el botón de crear tiene que seguir
     ahí al final: la cabecera no se va con el scroll. Los márgenes negativos
     son para que la banda blanca llegue a los dos bordes de la ventana. */
  .orden-alto{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:10px;
    margin:0 -30px 6px;padding:22px 30px 13px;background:var(--papel);
    box-shadow:0 1px 0 var(--linea)}
  .orden-alto::before{content:"";position:absolute;top:0;left:0;right:0;height:4px;
    background:linear-gradient(90deg,var(--logo-azul) 0 25%,var(--logo-rojo) 25% 50%,
      var(--logo-amarillo) 50% 75%,var(--logo-verde) 75% 100%)}
  .orden-alto h1{margin:0;min-width:0;font-size:19px;letter-spacing:-.02em;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .orden-alto #guardar{margin-left:auto;flex:0 0 auto;padding:9px 16px;font-size:13px}
  .orden-alto .modal-cerrar{position:static;flex:0 0 auto;width:30px;height:30px}

  /* De todo el formulario, este es el campo que decide la orden: se ve de lejos
     y no se confunde con el buscador de locales que tiene encima. */
  #maps{background:var(--azul-piel);border-color:var(--azul);font-weight:500}
  #maps::placeholder{color:var(--tinta-2);font-weight:400}
  #maps:focus{background:var(--papel);border-color:var(--azul);
    box-shadow:0 0 0 3px var(--azul-piel)}

  /* menos aire entre pasos: el formulario cabe de una en el teléfono */
  .modal-tarjeta label.paso{margin:15px 0 5px;font-size:13px}
  .modal-tarjeta label.paso .n{width:19px;height:19px;font-size:11px}
  .modal-subtitulo{margin-bottom:20px;font-size:13.5px}
  .modal-kicker{display:inline-block;font-size:11.5px;font-weight:600;color:var(--azul-fuerte);
    background:var(--azul-piel);border-radius:999px;padding:4px 12px;margin-bottom:12px}
  .modal-acciones{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:24px}

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
  .pieza-codigo{width:auto;flex:0 1 150px;text-transform:uppercase;
    font-family:"Geist Mono",ui-monospace,monospace;letter-spacing:.06em}
  /* los cuatro pasos de grabar un chip, cada uno con su botón y su respuesta */
  .pasos-nfc{list-style:none;margin:18px 0 0;padding:0}
  .paso-nfc{padding:13px 0;border-top:1px solid var(--linea-suave)}
  .paso-nfc:first-child{border-top:0}
  .paso-nfc-alto{display:flex;align-items:center;gap:10px}
  /* la bolita es hija de un flex: sin esto se estruja hasta ser una raya */
  .paso-nfc-alto .n{flex:0 0 auto}
  .paso-nfc-alto b{font-size:14px;font-weight:600}
  .paso-nfc-alto button{margin-left:auto}
  .paso-nfc-dice{margin:7px 0 0 31px;font-size:12.5px;color:var(--tinta-3);line-height:1.45}
  .paso-nfc-dice.bien{color:var(--verde-fuerte)}
  .paso-nfc-dice.mal{color:var(--rojo-fuerte)}
  .paso-nfc .camara{margin-left:31px}
  .paso-nfc.apagado{opacity:.45}
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
  /* con un solo tipo de pieza, el campo ocupa el ancho entero en vez de dejar
     media fila vacía al lado */
  #bloquePiezas.solo-uno{grid-template-columns:1fr}
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
  .filtro-dia{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:18px 0 4px}
  .filtro-dia input[type=date]{width:auto;padding:7px 11px;font-size:12.5px}
  .quien{font-size:12.5px;color:var(--tinta-2);white-space:nowrap}
  /* Un local puede llamarse de veinte palabras. Que se corte con puntos suspensivos
     antes que empujar la tabla y sacarle barra horizontal a toda la página. */
  #tablaLocales .negocio,#tabla .negocio,#tablaMio .negocio{max-width:34ch;
    overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #tablaLocales .negocio .fila-num{white-space:normal}
  /* lo que el filtro deja fuera se dice, no se esconde: ahí puede haber plata
     sin cobrar de la semana pasada */
  .fuera-filtro{display:flex;align-items:center;gap:10px;flex-wrap:wrap;
    padding:12px 2px 0;font-size:12.5px;color:var(--tinta-2)}
  .fuera-filtro button{padding:6px 12px;font-size:12px}
  /* Se puede mirar para dictársela, pero el campo nace tapado: en texto plano el
     navegador se la guarda en el historial de formularios. */
  .ver-clave{background:none;border:0;padding:0 0 0 7px;font-size:11.5px;font-weight:500;
    color:var(--azul-fuerte);text-decoration:underline}
  .ver-clave:hover{background:none;color:var(--azul)}
  .pct-fila{display:flex;align-items:center;gap:9px;flex-wrap:wrap}
  .pct-fila input{width:92px}
  .pct-signo{font-size:17px;font-weight:600;color:var(--tinta-2)}
  /* Una fila por persona y nada más: con veinte vendedores, unas fichas sueltas
     encima de un formulario abierto son un rollo sin final. */
  .busca-gente{width:auto;flex:1 1 130px;padding:9px 13px;font-size:13px}
  .gente{margin:14px 0 0}
  .gente button{display:flex;align-items:center;gap:10px;width:100%;text-align:left;
    background:none;border:0;border-top:1px solid var(--linea-suave);border-radius:0;
    padding:12px 2px;color:var(--tinta);font-size:13.5px;font-weight:500;line-height:1.35}
  .gente button:first-child{border-top:0}
  .gente button:hover{background:var(--papel-2);color:var(--tinta)}
  .gente .quien-es{min-width:0;flex:1 1 auto}
  .gente b{display:block;font-weight:600}
  .gente span{display:block;font-family:"Geist Mono",ui-monospace,monospace;
    font-size:11px;color:var(--tinta-3);overflow:hidden;text-overflow:ellipsis;
    white-space:nowrap}
  .gente .pct-ficha{font-style:normal;font-weight:600;font-size:12.5px;
    color:var(--azul-fuerte);background:var(--azul-piel);border-radius:999px;
    padding:2px 9px;flex:0 0 auto}
  .gente .flecha{color:var(--tinta-3);flex:0 0 auto;font-size:15px}
  .gente button.apagado b,.gente button.apagado span{opacity:.5}
  .gente button.apagado .pct-ficha{background:var(--papel-2);color:var(--tinta-3)}
  .gente .nadie{padding:18px 2px;color:var(--tinta-2);font-size:13px}

  .volver{background:none;border:0;padding:0;margin-bottom:14px;color:var(--azul-fuerte);
    font-size:12.5px;font-weight:500}
  .volver:hover{background:none;color:var(--azul);text-decoration:underline}
  /* tres salidas, cada una con lo que implica escrito debajo: cancelar es de las
     pocas cosas de aquí que no se deshacen */
  .salidas{display:flex;flex-direction:column;gap:9px;margin-top:6px}
  .salidas button{display:block;width:100%;text-align:left;background:var(--papel-2);
    color:var(--tinta);border:1px solid var(--linea);padding:13px 15px;
    border-radius:var(--r-l);font-size:13.5px;line-height:1.4}
  .salidas button:hover{background:var(--papel);border-color:var(--tinta-3);color:var(--tinta)}
  .salidas b{display:block;font-weight:600;margin-bottom:3px}
  .salidas span{display:block;font-size:12px;color:var(--tinta-2);font-weight:400}
  .salidas button:hover span{color:var(--tinta-2)}
  .mapa-barra{display:flex;align-items:center;gap:11px;flex-wrap:wrap;margin:18px 0 10px}
  #mapa{height:62vh;min-height:340px;border-radius:var(--r-l);border:1px solid var(--linea);
    overflow:hidden;background:var(--papel-2);z-index:0}
  .mapa-clave{display:flex;gap:16px;flex-wrap:wrap;padding:12px 2px 0;font-size:12.5px;
    color:var(--tinta-2)}
  .mapa-clave span{display:flex;align-items:center;gap:6px}
  .bolita{width:11px;height:11px;border-radius:50%;display:block;flex:0 0 auto;
    border:2px solid #fff;box-shadow:0 0 0 1px rgba(22,32,46,.25)}
  .bolita.verde{background:var(--verde)}
  .bolita.amarillo{background:#f9ab00}
  .bolita.gris{background:var(--tinta-3)}
  /* el segmentado de estado, con el color de cada uno */
  #estadoPunto .activa[data-valor=verde]{background:var(--verde);color:#fff}
  #estadoPunto .activa[data-valor=amarillo]{background:#f9ab00;color:#4a3400}
  #estadoPunto .activa[data-valor=gris]{background:var(--tinta-3);color:#fff}
  .sobre-tabla{margin:26px 0 2px}
  .importe.debe,b.debe{color:var(--rojo-fuerte)}
  .inv{font-family:"Geist Mono",ui-monospace,monospace;font-size:13px}
  .inv-malos{color:var(--rojo-fuerte)}
  .rot{display:none}
  .corte{display:none}
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

  .ficha{margin-top:12px;padding:11px 13px;border-radius:var(--r-l);background:var(--verde-piel);
    border:1px solid var(--verde-borde);font-size:13px}
  .ficha b{display:block;font-size:15px;font-weight:600;margin-bottom:2px;color:var(--verde-fuerte);
    letter-spacing:-.015em}
  .ficha label{margin-top:12px;color:var(--verde-fuerte)}
  .ficha input{background:var(--papel);border-color:var(--verde-borde)}
  /* los identificadores son la prueba de que el link se leyó, no algo que se lea:
     una línea cortada basta y ahorra tres en el teléfono */
  .ficha .meta{font-family:"Geist Mono",ui-monospace,monospace;font-size:11px;
    color:var(--tinta-2);margin-top:5px;white-space:nowrap;overflow:hidden;
    text-overflow:ellipsis}

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
  .qr-art{display:inline-block;line-height:0;cursor:pointer;border:1px solid var(--linea);
    border-radius:var(--r-l);
    padding:11px;background-color:#fff;
    background-image:linear-gradient(45deg,#eaeef6 25%,transparent 25%,transparent 75%,#eaeef6 75%),
                     linear-gradient(45deg,#eaeef6 25%,transparent 25%,transparent 75%,#eaeef6 75%);
    background-size:16px 16px;background-position:0 0,8px 8px}
  .qr-tile.inv .qr-art{border-color:#2b3140;background-color:#151922;
    background-image:linear-gradient(45deg,#222834 25%,transparent 25%,transparent 75%,#222834 75%),
                     linear-gradient(45deg,#222834 25%,transparent 25%,transparent 75%,#222834 75%)}
  .qr-art:hover{border-color:var(--azul);box-shadow:0 0 0 3px var(--azul-piel)}
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
    tr{padding:13px 0;border-bottom:1px solid var(--linea-suave)}
    tr:hover{background:transparent}
    td{border:0;padding:0}
    td:last-child{width:auto;white-space:normal;padding-top:14px}
    /* Las medidas fijas de la tabla llevan #tabla delante y una media query no
       suma especificidad: sin repetir el selector, la celda de los botones se
       quedaba en 338px y "Desactivar" se salía de la pantalla. */
    #tabla th:first-child,#tabla td:first-child,
    #tabla th:last-child,#tabla td:last-child{width:auto}
    .negocio{font-size:15px;margin-top:2px}

    /* el código y su número son el mismo dato dicho de dos formas: van juntos */
    #tabla td:first-child{display:flex;align-items:baseline;gap:8px}
    #tabla .fila-num{margin-top:0}
    #tabla td:nth-child(2){margin-top:3px}
    #tabla td:last-child{padding-top:10px}

    /* Tres renglones por fila y ni uno más: qué es, de quién, y el estado con
       los botones al lado. Apilado de arriba abajo, un gasto se comía media
       pantalla y en un listado eso significa no ver nunca dos seguidos. */
    #tablaGastos tr,#tablaLocales tr{display:flex;flex-wrap:wrap;align-items:center;
      gap:5px 9px}
    #tablaGastos td,#tablaLocales td{padding:0;width:auto}
    #tablaGastos td:last-child,#tablaLocales td:last-child{padding-top:0}

    #tablaGastos td:nth-child(1){order:1}
    #tablaGastos td:nth-child(5){order:2;margin-left:auto;font-size:15px}
    #tablaGastos td:nth-child(2){order:3;flex:1 0 100%}
    #tablaGastos td:nth-child(3){order:4}
    #tablaGastos td:nth-child(4){order:5}
    #tablaGastos td:nth-child(6){order:6;margin-left:auto}

    /* 1 local · 2 piezas · 3 vendió · 4 estado · 5 importe · 6 botones.
       Quién vendió va en el primer renglón, junto al nombre: ahí sobraba sitio
       y así la fila sigue siendo de tres líneas. */
    #tablaLocales td:nth-child(1){order:1;min-width:0;overflow:hidden;
      text-overflow:ellipsis;white-space:nowrap}
    #tablaLocales td:nth-child(3){order:2}
    #tablaLocales td:nth-child(5){order:3;margin-left:auto;font-size:15px}
    #tablaLocales td:nth-child(2){order:4;flex:1 0 100%}
    #tablaLocales td:nth-child(4){order:5}
    /* los botones a la derecha del estado, no en su propio renglón */
    #tablaLocales td:nth-child(6){order:6;margin-left:auto}

    /* dos o tres botones sueltos no necesitan la rejilla de la tabla ancha */
    #tablaGastos .acciones,#tablaLocales .acciones{display:flex;gap:5px;min-width:0}
    #tablaGastos .acciones button,#tablaLocales .acciones button{width:auto;
      padding:7px 11px;font-size:12px}

    /* Nombre a la izquierda, lo que se lleva grande a la derecha, y el desglose
       debajo con su palabra pegada. Mismo patrón que el inventario. */
    #tablaComisiones tr,#tablaMio tr{display:flex;flex-wrap:wrap;align-items:baseline;
      gap:2px 13px;padding:11px 0}
    #tablaComisiones td,#tablaMio td{padding:0;width:auto;white-space:nowrap}
    /* 1 vendedor · 2 facturado · 3 se lleva · 4 para la casa · 5 debe · 6 botón.
       Arriba el nombre y lo que debe, que es lo que se viene a mirar. */
    #tablaComisiones td:nth-child(1){order:1;min-width:0;white-space:normal}
    #tablaComisiones td:nth-child(5){order:2;margin-left:auto;font-size:17px}
    #tablaComisiones td:nth-child(2),#tablaComisiones td:nth-child(3),
    #tablaComisiones td:nth-child(4){order:3;font-size:12px;color:var(--tinta-2)}
    #tablaComisiones td:nth-child(6){order:4;flex:1 0 100%}
    #tablaComisiones td:nth-child(6) .acciones{display:flex}
    #tablaComisiones td:nth-child(6) button{width:auto;padding:7px 13px;font-size:12px}
    #tablaComisiones td:nth-child(2)::before{content:"facturó "}
    #tablaComisiones td:nth-child(3)::before{content:"· se lleva "}
    #tablaComisiones td:nth-child(4)::before{content:"· casa "}

    #tablaMio td:nth-child(2){order:1;min-width:0;overflow:hidden;
      text-overflow:ellipsis;font-size:15px}
    #tablaMio td:nth-child(5){order:2;margin-left:auto;font-size:17px;color:var(--tinta)}
    #tablaMio td:nth-child(1){order:3;flex:1 0 100%;font-size:12px;color:var(--tinta-3)}
    #tablaMio td:nth-child(3),#tablaMio td:nth-child(4){order:4;font-size:12px;
      color:var(--tinta-2)}

    /* El inventario contesta una sola pregunta: cuánto queda. Ese número va
       grande a la derecha del nombre y el desglose debajo, en pequeño. Antes
       cada fila repetía los cuatro rótulos de la tabla, con el mismo peso que
       los números, que es lo único que se viene a mirar aquí. */
    #tablaInventario tr{display:flex;flex-wrap:wrap;align-items:baseline;
      gap:2px 13px;padding:11px 0}
    /* cada dato entero o al renglón siguiente: partir "(26 malos)" por la mitad
       dejaba huecos y desalineaba lo que venía detrás */
    #tablaInventario td{padding:0;width:auto;white-space:nowrap}
    #tablaInventario td:nth-child(1){order:1;min-width:0;overflow:hidden;
      text-overflow:ellipsis}
    #tablaInventario td:nth-child(4){order:2;margin-left:auto}
    /* .corte nace en display:none para la tabla ancha: aqui hay que revivirlo */
    #tablaInventario td:nth-child(6){display:block;order:3;flex:1 0 100%;height:0}
    #tablaInventario td:nth-child(2){order:4}
    #tablaInventario td:nth-child(3){order:5}
    #tablaInventario td:nth-child(5){order:6}
    #tablaInventario .inv{font-size:12px;color:var(--tinta-2)}
    #tablaInventario .queda{font-size:19px;color:var(--tinta)}
    #tablaInventario .inv-cero{display:none}
    .rot{display:inline;margin-left:4px;font-size:11px;color:var(--tinta-3);
      font-family:"Geist","Inter",system-ui,-apple-system,"Segoe UI",sans-serif}
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
    .modal-caja{padding:22px 16px;max-height:92vh}
    /* la media query no añade especificidad: hay que repetir el selector */
    .modal-tarjeta{padding-top:0}
    .orden-alto{margin:0 -16px 6px;padding:18px 16px 11px;gap:8px}
    .orden-alto h1{font-size:17px}
    .orden-alto #guardar{padding:9px 13px;font-size:12.5px}
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
let VENTA_EDITADA = { vendida: "", precio: 0, vendedor: "", pct: 0, pago: "efectivo",
  jefe: "" };
// dónde está el local del link que se acaba de leer
let DONDE_QUEDA = { lat: null, lng: null };
let COMO_PAGO = "efectivo";
let LIQUIDACIONES = [];
let VISTA = "locales";
let PRUEBAS = false;
let GASTOS = [];
let SERVICIOS = [];
// Quién entró. Hasta que el Worker conteste, lo más prudente es suponer que no
// es el dueño: así nada de la casa se pinta por error mientras carga.
let SESION = { usuario: "", dueno: false, nombre: "", pct: 100 };
let USUARIOS = [];

let VENDEDORES = { felipe: null, nicolas: null, alexander: null };
let QUIEN_VENDE = "felipe";
let COMPRADORES = {};
let COMPROBANTES = {};
let NFC = {};
let GASTO_EDITADO = "";
const DIAS_DINERO = 30;
// Alexander vende, pero no es socio: no pone plata ni se reparte utilidad. Sale
// en el comprobante y en el tope de renta —que son cosas de quien vende— y no en
// el reparto de cuentas ni en quién paga un gasto.
const SOCIO_NOMBRE = { felipe: "Felipe", nicolas: "Nicolás", alexander: "Alexander",
  ambos: "Compartido" };
// Los dos que firman desde la cuenta del superadmin. Los demás son usuarios y
// firman con su propio nombre, sin elegir.
const QUIENES_VENDEN = ["felipe", "nicolas"];

// Un vendedor no firma sus comprobantes: los firma su jefe, uno de los dos
// socios. Él vende, pero el papel sale a nombre de quien responde por el negocio
// —y ese ingreso es de quien firma, no de quien vendió—.
function quienFirma() {
  return SESION.dueno ? QUIEN_VENDE : (SESION.jefe || "felipe");
}

// El nombre de pila de quien vendió, sea socio o usuario.
function nombreDeVendedor(quien) {
  if (SOCIO_NOMBRE[quien]) return SOCIO_NOMBRE[quien];
  const u = USUARIOS.filter((x) => x.usuario === quien)[0];
  if (u) return u.nombre;
  if (quien === SESION.usuario) return SESION.nombre;
  return quien;
}
let METRICA = "unidades";
let PAGINA_ORDENES = 1;
let PAGINA_GASTOS = 1;
let LOCAL_VENTA = null;
const DIAS_GRAFICA = 14;
const POR_PAGINA = 10;
// "hoy", "7", "todas" o un día suelto en AAAA-MM-DD
let DIA_ORDENES = "hoy";
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
  const datos = await r.json().catch(() => ({
    error: "El servidor contestó algo que no entiendo (" + r.status + " en " + ruta + ")",
  }));
  if (r.status === 401 && ruta !== "login") { mostrar(false); throw new Error("Tu sesión expiró"); }
  if (!r.ok) throw new Error(datos.error || "Error " + r.status);
  return datos;
}

function mostrar(dentro, quien) {
  if (quien) SESION = quien;
  $("pantallaPanel").hidden = !dentro;
  $("pantallaLogin").hidden = dentro;
  if (dentro) {
    pintarRol();
    // los botones de la barra los reparte pintarVista, y hasta ahora solo corría
    // al cambiar de pestaña: al entrar salían todos, en todas
    pintarVista(VISTA);
    CARGANDO = true;
    pintarTabla();
    listar();
    llamar("modo").then((r) => pintarPruebas(r.prueba)).catch(() => {});
    cargarServicios();
    cargarAjustes();
    // un vendedor no tiene gastos ni gente que administrar: pedirlos sería
    // llenarle la consola de 403 para nada
    cargarLiquidaciones().then(repintarTodo);
    cargarPuntos();
    if (SESION.dueno) { cargarGastos(); cargarUsuarios(); }
  }
  else { cerrarQR(); cerrarTarjeta(); $("clave").focus(); }
}

$("formLogin").onsubmit = async (e) => {
  e.preventDefault();
  try {
    await llamar("login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario: $("usuario").value, clave: $("clave").value }),
    });
    $("clave").value = "";
    limpiarAviso("avisoLogin");
    const s = await llamar("sesion");
    mostrar(s.activa, s.quien);
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

// Google mete "Nombre, Dirección" en la URL del sitio, y la dirección empieza
// por un tipo de vía. Ahí se corta: "Alitas Master 2, Manzana 2 Casa 16, Av.
// Jordan #1A etapa, Ibagué, Tolima" es un local que se llama "Alitas Master 2".
//
// El nombre puede llevar comas suyas —"Mas Bonita Studio | Micropigmentación,
// Uñas y Pestañas en Ibagué"— y por eso no vale cortar en la primera: lo que
// marca el final es la vía, no la coma.
// Literal y no cadena: dentro de un string de JS, "\s" es una "s" y "\b" es un
// retroceso. La primera versión de esto buscaba una tecla de borrar.
const VIA = /,\s*(?=(?:calle|cl|cll|carrera|cra|cr|kr|avenida|av|autopista|diagonal|diag|transversal|trans|tv|manzana|mz|circunvalar|anillo|vereda|km)\b|#)/i;

function soloElNombre(texto) {
  const t = String(texto || "").trim();
  const corte = t.search(VIA);
  const nombre = (corte > 0 ? t.slice(0, corte) : t).trim().replace(/[,;\s-]+$/, "");
  return nombre || t;
}

function analizarMaps(crudo) {
  const url = String(crudo || "").trim();
  if (!url) return { error: "Pega la URL de Google Maps del negocio, o su Place ID." };

  // El link largo de Maps lleva el punto del mapa en el "@lat,lng" de la mitad.
  // Estaba ahí desde siempre y lo tirábamos.
  let lat = null, lng = null;
  const en = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (en) { lat = Number(en[1]); lng = Number(en[2]); }

  let negocio = "";
  const nm = url.match(/\/maps\/place\/([^/@?]+)/);
  if (nm && nm[1]) {
    try { negocio = soloElNombre(decodeURIComponent(nm[1].replace(/\+/g, " "))); } catch (e) {}
  }

  // 1 · el Place ID ya viene dado: un link de reseña hecho antes, una URL que lo
  //     lleva como parámetro, o el identificador pegado tal cual del buscador
  const dado = url.match(/[?&#](?:placeid|place_id)=([A-Za-z0-9_-]{15,})/i) ||
               url.match(/place_id[:=]([A-Za-z0-9_-]{15,})/i) ||
               url.match(/!1s(Ch[A-Za-z0-9_-]{15,})/) ||
               url.match(/^([A-Za-z0-9_-]{15,})$/);
  if (dado) {
    return { negocio: negocio, placeId: dado[1], review: linkResena(dado[1]),
      lat: lat, lng: lng };
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
    return { negocio: negocio, ftid: ftid, placeId: placeId, review: linkResena(placeId),
      lat: lat, lng: lng };
  }

  const cd = url.match(/(?:[?&](?:lu)?cid=)(\d{5,})/i);
  if (cd) {
    return { error: "Esa URL solo trae el CID, no el identificador completo. Abre el sitio del negocio en Google Maps y copia la URL larga, o pega su Place ID." };
  }

  return { error: "No se encontró el identificador del negocio en esa URL. Abre su sitio en Google Maps (clic en el nombre del lugar) y copia la URL completa, o pega el Place ID del buscador." };
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
    avisar("aviso", "Ese link corto no llevó a un sitio con identificador.", false);
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
  DONDE_QUEDA = { lat: r.lat, lng: r.lng };
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





// Si el negocio ya tiene una orden, esto no es un alta sino un cambio de tamaño:
// se toman las libres que falten, o se sueltan las que sobren. Las que ya tiene y
// siguen dentro no se tocan, así no se pisa su venta.
// Una orden pendiente no es dueña de nada todavía: nadie ha pagado. Si el
// montón se revolvió y una pieza termina en otro local, se mueve y ya. Lo que no
// se toca es lo que ya se cobró o lo que tiene comprobante.
//
// El Worker no puede comprobarlo por su cuenta: "rango" escribe hasta
// veinticinco tarjetas de un golpe y leer cada una antes se saldría de las
// cincuenta subpeticiones del plan gratis. Así que el guardia es este.
function ordenesTrabadas() {
  const trabadas = {};
  locales().forEach((l) => {
    if (l.cobrado || cerrada(l.negocio)) trabadas[l.negocio] = 1;
  });
  return trabadas;
}

// "" si se puede mover; si no, por qué no
function porQueNoSeMueve(t, trabadas) {
  if (!t || !t.negocio) return "";
  if (t.vendida) return "ya está cobrada en " + t.negocio;
  if (cerrada(t.negocio)) return "la orden de " + t.negocio + " tiene comprobante";
  if (trabadas[t.negocio]) return "la orden de " + t.negocio + " ya se cobró";
  return "";
}

// Una orden es exactamente la lista de códigos que tenga. Antes había un segundo
// camino —desde el nº tal, tantas— que armaba bloques seguidos; con el escaneo y
// el código escrito dejó de usarse, y mantener dos formas de decir lo mismo solo
// daba maneras de que no coincidieran.
function planDelLocal() {
  const nombre = $("negocio").value.trim();
  const todas = locales();
  const base = todas.filter((x) => x.negocio === nombre)[0] || null;
  const plan = { base: base, tomar: {}, soltar: {}, falta: [],
    pedidas: { acrilicos: 0, stickers: 0 }, sueltas: PIEZAS_SUELTAS.length > 0 };

  {
    const porTipo = { acrilico: [], sticker: [] };
    PIEZAS_SUELTAS.forEach((c) => {
      const t = TARJETAS.filter((x) => x.codigo === c)[0];
      if (t) porTipo[tipoDe(t)].push(c);
    });
    ["acrilico", "sticker"].forEach((tipo) => {
      const tiene = base ? base.codigos[tipo] : [];
      plan.tomar[tipo] = porTipo[tipo].filter((c) => tiene.indexOf(c) < 0);
      plan.soltar[tipo] = tiene.filter((c) => porTipo[tipo].indexOf(c) < 0);
      const trabadas = {};
      todas.forEach((l) => { if (l.cobrado || cerrada(l.negocio)) trabadas[l.negocio] = 1; });
      plan.tomar[tipo].forEach((c) => {
        const t = TARJETAS.filter((x) => x.codigo === c)[0];
        if (!t || t.negocio === nombre) return;
        const pega = porQueNoSeMueve(t, trabadas);
        if (pega) plan.falta.push(c + " " + pega);
      });
    });
    plan.pedidas = { acrilicos: porTipo.acrilico.length, stickers: porTipo.sticker.length };
  }
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
  caja.hidden = false;

  if (plan.falta.length) { caja.textContent = "No alcanza — " + plan.falta.join(" · "); return; }

  // Las fichas de arriba ya dicen cuáles son. Repetir los mismos códigos en un
  // recuadro de color es decir dos veces lo mismo, así que en una orden nueva
  // el resumen calla; en una que ya existía sí cuenta algo: qué entra y qué sale.
  if (plan.sueltas && !plan.base) { caja.hidden = true; return; }

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
    // en una orden recién abierta el botón ya dice qué hacer: repetirlo aquí
    // sería un recuadro de color para no decir nada
    caja.hidden = !plan.base && !plan.sueltas;
    caja.textContent = plan.base
      ? plan.base.negocio + " ya tiene esas piezas: " +
        nombreTipo("acrilico", plan.base.acrilico) + " y " + nombreTipo("sticker", plan.base.sticker)
      : "Sigue escaneando piezas para la orden.";
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

// El Worker reescribe el registro completo, así que lo que no se manda se borra.
// Reapuntar una orden ya cobrada le vaciaba la fecha, el precio y el vendedor —y
// como el panel no lo repintaba, la plata solo desaparecía al refrescar—. Se
// agrupan por esos tres y cada grupo va en su propia llamada, que en la práctica
// es una sola: las tarjetas de una orden se cobraron todas igual.
function porVenta(codigos) {
  const grupos = {};
  codigos.forEach((c) => {
    const t = TARJETAS.filter((x) => x.codigo === c)[0] || {};
    const venta = { vendida: t.vendida || "", precio: Number(t.precio) || 0,
      vendedor: t.vendedor || "", pct: Number(t.pct) || 0, pago: t.pago || "efectivo",
      jefe: t.jefe || "" };
    const llave = venta.vendida + "|" + venta.precio + "|" + venta.vendedor + "|" +
      venta.pct + "|" + venta.pago + "|" + venta.jefe;
    if (!grupos[llave]) grupos[llave] = { venta: venta, codigos: [] };
    grupos[llave].codigos.push(c);
  });
  return Object.keys(grupos).map((k) => grupos[k]);
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
  // cerrarTarjeta() vacía el formulario, así que el nombre hay que tenerlo antes:
  // lo que se lea después del cierre viene en blanco
  const elNegocio = $("negocio").value.trim();
  // del link que se acaba de leer; si se eligió un local ya registrado, de lo que
  // ya sabían sus tarjetas
  const yaEstaba = locales().filter((x) => x.negocio === elNegocio)[0];
  const elSitio = DONDE_QUEDA.lat ? DONDE_QUEDA
    : { lat: (yaEstaba || {}).lat, lng: (yaEstaba || {}).lng };
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
      // de dónde salen las piezas que nos estamos llevando: si esas órdenes se
      // quedan en cero, desaparecen, y con ellas el rastro del local
      const deDonde = {};
      ["acrilico", "sticker"].forEach((tipo) => {
        plan.tomar[tipo].forEach((c) => {
          const t = TARJETAS.filter((x) => x.codigo === c)[0];
          if (!t || !t.negocio || t.negocio === $("negocio").value.trim()) return;
          if (!deDonde[t.negocio]) {
            deDonde[t.negocio] = { negocio: t.negocio, lat: t.lat, lng: t.lng };
          }
        });
      });

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
          : "Escribe cuántas piezas lleva la orden, o márcale el sitio.", false);
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
              // quién la levantó, para que la fila lo diga desde que nace y no
              // solo cuando se cobre
              vendedor: QUIEN_VENDE,
              lat: elSitio.lat,
              lng: elSitio.lng,
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
        boton.textContent = "Guardando el sitio…";
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
            negocio: elNegocio, destino: destino, tipo: tipo,
            vendida: "", precio: 0, vendedor: QUIEN_VENDE,
            lat: elSitio.lat, lng: elSitio.lng,
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
      if (fichaNueva) cola.push("sitio en Google Maps");
      if (fichaFuera) cola.push("sitio quitado");
      avisar("avisoPanel", "Orden de " + elNegocio +
        (plan.base ? " actualizada · " : " creada · ") + cola.join(" y "), true);

      // ¿alguna se quedó vacía? Se pregunta ahora, con el local fresco, que es lo
      // único que queda de él
      const vivas = {};
      locales().forEach((x) => { vivas[x.negocio] = 1; });
      COLA_VACIADAS = Object.keys(deDonde)
        .filter((n) => !vivas[n] && deDonde[n].lat && deDonde[n].lng)
        .map((n) => deDonde[n]);
      if (COLA_VACIADAS.length) siguienteVaciada();
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
        for (const parte of porVenta(codigos)) {
          for (let i = 0; i < parte.codigos.length; i += TANDA) {
            const tanda = parte.codigos.slice(i, i + TANDA);
            hechas += tanda.length;
            boton.textContent = "Guardando " + hechas + " de " + total + "…";
            await llamar("rango", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(Object.assign({
                codigos: tanda,
                negocio: $("negocio").value,
                destino: destino,
                tipo: tipo,
              }, parte.venta)),
            });
          }
        }
      }
      cerrarTarjeta();
      for (const [tipo, codigos] of grupos) {
        parchearTarjetas(codigos, { negocio: elNegocio, destino: destino, tipo: tipo });
      }
      avisar("avisoPanel", plural(total, "tarjeta apuntando", "tarjetas apuntando") +
        " a " + elNegocio, true);
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
        vendedor: VENTA_EDITADA.vendedor,
        pct: VENTA_EDITADA.pct,
        pago: VENTA_EDITADA.pago,
        jefe: VENTA_EDITADA.jefe,
      }),
    });
    const editaba = Boolean(EDITANDO_CODIGO);
    cerrarTarjeta();
    parchearTarjetas([datos.codigo], {
      negocio: datos.negocio, destino: datos.destino, tipo: datos.tipo,
      vendida: datos.vendida, precio: datos.precio,
      vendedor: datos.vendedor !== undefined ? datos.vendedor : VENTA_EDITADA.vendedor,
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
  VENTA_EDITADA = { vendida: t.vendida || "", precio: t.precio || 0,
    vendedor: t.vendedor || "", pct: Number(t.pct) || 0, pago: t.pago || "efectivo",
    jefe: t.jefe || "" };
  llenarLocales();
  $("localExistente").value = t.negocio || "";
  pintarModo("una");
  $("fichaNombre").textContent = t.negocio || t.codigo;
  $("fichaMeta").textContent = placeIdDeDestino(t.destino)
    ? "Place ID: " + placeIdDeDestino(t.destino) : "";
  $("fichaReview").value = t.destino;
  $("ficha").hidden = false;

  $("tarjetaModalTitulo").textContent = "Editar " + t.codigo;
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

// La misma cámara sirve a la ventana de la orden y a la de grabar chips, así que
// quién la pidió y qué hacer con lo leído van en esta configuración.
let CAMARA = { caja: "camara", video: "video", alLeer: null };

function cerrarCamara() {
  leyendoQR = false;
  if (flujoCamara) {
    flujoCamara.getTracks().forEach((t) => t.stop());
    flujoCamara = null;
  }
  $(CAMARA.video).srcObject = null;
  $(CAMARA.caja).hidden = true;
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
  const codigo = b.dataset.quitarPieza;
  // quitarla de la lista la libera al guardar, y eso le borraría la venta
  const t = TARJETAS.filter((x) => x.codigo === codigo)[0];
  if (t && t.vendida) {
    decirEscaneo(codigo + " ya está cobrada: no se puede sacar de la orden.", true);
    return;
  }
  PIEZAS_SUELTAS = PIEZAS_SUELTAS.filter((c) => c !== codigo);
  pintarPiezasSueltas();
  pintarResumenLocal();
});

$("vaciarPiezas").onclick = () => {
  // las cobradas no se sueltan: se quedan aunque se vacíe el resto
  PIEZAS_SUELTAS = PIEZAS_SUELTAS.filter((c) => {
    const t = TARJETAS.filter((x) => x.codigo === c)[0];
    return t && t.vendida;
  });
  pintarPiezasSueltas();
  decirEscaneo("");
  pintarResumenLocal();
};

function usarQR(texto) {
  const codigo = codigoDeQR(texto);
  if (MODO !== "local") cerrarCamara();
  if (!codigo) { decirEscaneo("Ese QR no trae ningún código.", true); return; }

  const t = TARJETAS.filter((x) => x.codigo === codigo)[0];
  if (!t) { decirEscaneo(codigo + " no está en la lista de tarjetas.", true); return; }

  const numero = indiceDeCodigo(codigo) + 1;
  const tipo = tipoDe(t);
  const comoSeLlama = (tipo === "acrilico" ? "Acrílico" : "Vinilo") + " nº " + numero;

  // en una orden se van juntando; fuera de ella solo dice cuál es
  if (MODO === "local") { meterPieza(codigo, decirEscaneo); return; }

  decirEscaneo(comoSeLlama + " · " + codigo +
    (t.negocio ? " · ocupado por " + t.negocio : " · libre"), Boolean(t.negocio));
}

// El QR y el código escrito acaban en el mismo sitio, así que las dos puertas
// comprueban lo mismo y dicen lo mismo. El "decir" cambia porque cada una tiene su
// renglón de respuesta.
function meterPieza(codigo, decir) {
  const t = TARJETAS.filter((x) => x.codigo === codigo)[0];
  if (!t) { decir(codigo + " no está en la lista de tarjetas.", true); return false; }

  const numero = indiceDeCodigo(codigo) + 1;
  const comoSeLlama = (tipoDe(t) === "acrilico" ? "Acrílico" : "Vinilo") + " nº " + numero;

  if (PIEZAS_SUELTAS.indexOf(codigo) >= 0) {
    decir(comoSeLlama + " ya estaba en la lista.", true);
    return false;
  }
  // mejor decirlo con el cartel todavía en la mano que dejarlo entrar y que el
  // resumen lo rechace tres piezas después
  const pega = porQueNoSeMueve(t, ordenesTrabadas());
  if (pega) { decir(comoSeLlama + " · " + codigo + " · " + pega, true); return false; }

  const mudanza = t.negocio && t.negocio !== $("negocio").value.trim()
    ? " · se lo quitas a " + t.negocio : "";
  PIEZAS_SUELTAS.push(codigo);
  pintarPiezasSueltas();
  pintarResumenLocal();
  decir(comoSeLlama + " · " + codigo + mudanza +
    "   ·   " + plural(PIEZAS_SUELTAS.length, "pieza", "piezas") + " en la lista", false);
  return true;
}

function decirCodigo(texto, malo) {
  $("codigoDicho").textContent = texto;
  $("codigoDicho").classList.toggle("malo", Boolean(malo));
}

function agregarPorCodigo() {
  const codigo = normalizarCodigo($("codigoPieza").value);
  if (!codigo) { decirCodigo("Escribe el código de la pieza.", true); return; }
  if (meterPieza(codigo, decirCodigo)) $("codigoPieza").value = "";
}

$("agregarPieza").onclick = agregarPorCodigo;
// en el teléfono el Intro del teclado es lo natural, y sin esto enviaría la orden
$("codigoPieza").addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); agregarPorCodigo(); }
});

// Chrome de Android trae BarcodeDetector, que lee el QR sin descargar nada.
// Safari del iPhone no lo tiene ni lo va a tener pronto, así que allí se baja un
// lector suelto —una sola vez, y solo en esos teléfonos— y se le pasan los
// fotogramas por un lienzo. De fuera las dos formas son la misma función:
// recibe el vídeo, devuelve lo que ponga el QR o cadena vacía.
let LECTOR_QR = null;
let BAJANDO_LECTOR = null;

function bajarLectorSuelto() {
  if (window.jsQR) return Promise.resolve(window.jsQR);
  if (!BAJANDO_LECTOR) {
    BAJANDO_LECTOR = new Promise((listo, falla) => {
      const guion = document.createElement("script");
      guion.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";
      guion.onload = () => listo(window.jsQR);
      guion.onerror = () => falla(new Error("sin conexión para bajarlo"));
      document.head.appendChild(guion);
    });
  }
  return BAJANDO_LECTOR;
}

async function lectorDeQR() {
  if (LECTOR_QR) return LECTOR_QR;

  if ("BarcodeDetector" in window) {
    const formatos = await window.BarcodeDetector.getSupportedFormats();
    if (formatos.indexOf("qr_code") >= 0) {
      const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
      LECTOR_QR = async (v) => {
        const vistos = await detector.detect(v);
        return vistos.length ? vistos[0].rawValue : "";
      };
      return LECTOR_QR;
    }
  }

  const jsQR = await bajarLectorSuelto();
  const lienzo = document.createElement("canvas");
  const pincel = lienzo.getContext("2d", { willReadFrequently: true });
  LECTOR_QR = async (v) => {
    const ancho = v.videoWidth, alto = v.videoHeight;
    if (!ancho || !alto) return "";
    // a media resolución: el cartel impreso es grande y cada vuelta cuesta la
    // mitad, que en un teléfono se nota
    lienzo.width = Math.round(ancho / 2);
    lienzo.height = Math.round(alto / 2);
    pincel.drawImage(v, 0, 0, lienzo.width, lienzo.height);
    const px = pincel.getImageData(0, 0, lienzo.width, lienzo.height);
    // los nuestros son negros sobre claro: buscar también el negativo sería el
    // doble de trabajo para nada
    const visto = jsQR(px.data, px.width, px.height, { inversionAttempts: "dontInvert" });
    return visto ? visto.data : "";
  };
  return LECTOR_QR;
}

async function abrirCamara(conf) {
  cerrarCamara();
  CAMARA = conf || { caja: "camara", video: "video", alLeer: null };
  const decir = CAMARA.decir || decirEscaneo;
  if (!puedeLeerQR()) {
    decir("Este navegador no da acceso a la cámara.", true);
    return;
  }

  // La cámara, lo primero. En el iPhone el permiso cuelga del toque que abrió
  // esto, y ponerse a esperar una descarga antes se lo llevaría por delante.
  try {
    flujoCamara = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
    });
  } catch (e) {
    decir("No se pudo abrir la cámara: " + e.message, true);
    cerrarCamara();
    return;
  }

  let leerFotograma;
  try {
    leerFotograma = await lectorDeQR();
  } catch (e) {
    decir("No se pudo cargar el lector de QR: " + e.message, true);
    cerrarCamara();
    return;
  }

  const v = $(CAMARA.video);
  v.srcObject = flujoCamara;
  $(CAMARA.caja).hidden = false;
  decir("Apunta al QR del cartel.");
  try { await v.play(); } catch (e) {}

  leyendoQR = true;
  let anterior = "";
  while (leyendoQR) {
    let crudo = "";
    try {
      crudo = await leerFotograma(v);
    } catch (e) {
      // un fotograma ilegible no es motivo para cerrar la cámara
    }
    // el mismo cartel sigue delante hasta que apuntas al siguiente: leerlo una
    // vez basta, y quien lo atiende decide si cierra la cámara o sigue
    if (crudo && crudo !== anterior) {
      anterior = crudo;
      (CAMARA.alLeer || usarQR)(crudo);
    }
    await new Promise((r) => setTimeout(r, 200));
  }
}

function puedeLeerQR() {
  return Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// En el escritorio no hay cartel que apuntar: la cámara se abre sola donde se
// trabaja de pie, con el teléfono en la mano. En el computador el botón sigue.
function enLaMano() {
  return window.matchMedia && window.matchMedia("(pointer:coarse)").matches;
}

$("escanear").onclick = () => {
  if ($("camara").hidden) abrirCamara({ caja: "camara", video: "video", alLeer: usarQR });
  else cerrarCamara();
};
$("cerrarCamara").onclick = cerrarCamara;

function pintarEnlaceMaps() {
  const nombre = $("negocio").value.trim() || $("buscarLocal").value.trim();
  $("enlaceMaps").href = nombre
    ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(nombre)
    : "https://www.google.com/maps";
}

// Pegar es inequívoco: nadie pega media URL. Un botón menos en la calle.
$("maps").addEventListener("paste", () => {
  setTimeout(() => { if ($("maps").value.trim()) $("analizar").click(); }, 0);
});

$("negocio").addEventListener("input", pintarEnlaceMaps);
$("buscarLocal").addEventListener("input", pintarEnlaceMaps);

// Las libres, para que el campo del código sugiera mientras se escribe.
function pintarPiezasLibres() {
  $("piezasLibres").innerHTML = TARJETAS
    .filter((t) => !t.negocio)
    .map((t) => "<option value='" + t.codigo + "'>nº " + (indiceDeCodigo(t.codigo) + 1) +
      " · " + (tipoDe(t) === "acrilico" ? "acrílico" : "vinilo") + "</option>")
    .join("");
}

function pintarModo(valor) {
  MODO = valor === "rango" || valor === "local" ? valor : "una";
  marcarSegmento("modoTarjeta", MODO);
  $("campoUna").hidden = MODO !== "una";
  $("campoRango").hidden = MODO !== "rango";
  $("campoPiezas").hidden = MODO !== "local";
  $("campoCuantas").hidden = MODO !== "local";
  $("guardar").textContent = MODO === "rango" ? "Aplicar al rango"
    : MODO === "local" ? "Crear la orden"
    : (EDITANDO_CODIGO ? "Guardar cambios" : "Activar tarjeta");
  if (MODO === "local") pintarPiezasLibres();
  if (MODO === "rango") pintarOrigenRango(ORIGEN_RANGO);
  else $("bloqueTipo").hidden = MODO === "local";   // en un local van los dos tipos
  if (MODO === "local") pintarResumenLocal();
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
$("negocio").addEventListener("input", () => {
  if (MODO === "local") pintarResumenLocal();
});

function salirDeEdicion() {
  EDITANDO_CODIGO = "";
  $("codigo").value = $("negocio").value = $("maps").value = "";
  DONDE_QUEDA = { lat: null, lng: null };
  $("ficha").hidden = true;
  $("fichaReview").value = "";
  NOMBRE_AUTO = "";
  URL_LEIDA = "";
  $("numeroTarjeta").textContent = "";
  $("desde").value = $("hasta").value = "";
  $("buscarLocal").value = "";
  $("codigoPieza").value = "";
  decirCodigo("");
  if ($("localExistente").options.length) $("localExistente").value = "";
  if ($("ordenRango").options.length) $("ordenRango").value = "";
  VENTA_EDITADA = { vendida: "", precio: 0, vendedor: "", pct: 0, pago: "efectivo",
    jefe: "" };
}

function prepararNuevaTarjeta() {
  salirDeEdicion();
  const sig = siguienteCodigo();
  $("codigo").value = sig.codigo;
  $("numeroTarjeta").textContent = sig.numero ? "nº " + sig.numero : "";
  pintarTipo(tipoPorDefecto(sig.codigo));
  pintarModo("una");
  $("tarjetaModalTitulo").textContent = "Activar una tarjeta";
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
  $("tarjetaModalTitulo").textContent = l ? "Orden de " + l.negocio : "Nueva orden";
  if (l) {
    $("localExistente").value = l.negocio;
    $("localExistente").dispatchEvent(new Event("change"));
    // lo que ya tiene entra como fichas, para verlo y poder quitarlo de a una
    PIEZAS_SUELTAS = l.codigos.acrilico.concat(l.codigos.sticker).slice().sort();
    pintarPiezasSueltas();
  }
  ponerFichaEnOrden(l ? l.ficha : null);
  pintarModo("local");
  // pintarModo deja el botón en "Crear la orden"; si ya existe, se está editando
  if (l) $("guardar").textContent = "Guardar la orden";
  limpiarAviso("aviso");
  focoTarjeta = document.activeElement;
  $("modalTarjeta").hidden = false;
  document.body.style.overflow = "hidden";
  $("escanear").focus();
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
  $("tarjetaModalTitulo").textContent = "Nueva orden";
  pintarModo("local");
  limpiarAviso("aviso");
  llenarLocales();
  focoTarjeta = document.activeElement;
  $("modalTarjeta").hidden = false;
  document.body.style.overflow = "hidden";
  $("escanear").focus();
  // el clic en "+" es el gesto que le hace falta a la cámara, así que se abre
  // aquí mismo; en el computador se queda esperando al botón
  if (puedeLeerQR() && enLaMano()) $("escanear").click();
};

$("cerrarTarjeta").onclick = cerrarTarjeta;
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
// "actualizado" viene en UTC y aquí se vende de noche: a las 8 p.m. de Ibagué
// ya es el día siguiente en Londres. Sin pasarlo a la fecha local, media jornada
// se iría al día equivocado.
function diaLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function locales() {
  const mapa = {};
  TARJETAS.forEach((t) => {
    const nombre = String(t.negocio || "").trim();
    if (!nombre || !t.destino) return;
    if (!mapa[nombre]) {
      mapa[nombre] = { negocio: nombre, destino: t.destino, acrilico: 0, sticker: 0,
        vendidas: 0, importe: 0, fecha: "", tocada: "", quienes: {},
        codigos: { acrilico: [], sticker: [] } };
    }
    const g = mapa[nombre];
    const tipo = tipoDe(t);
    g[tipo]++;
    g.codigos[tipo].push(t.codigo);
    if (t.vendedor) g.quienes[t.vendedor] = 1;
    if (t.lat && t.lng && !g.lat) { g.lat = t.lat; g.lng = t.lng; }
    const tocada = diaLocal(t.actualizado);
    if (tocada > g.tocada) g.tocada = tocada;
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
        vendidas: 0, importe: 0, fecha: "", tocada: "", quienes: {},
        codigos: { acrilico: [], sticker: [] } };
    }
    const g = mapa[nombre];
    g.ficha = s;
    if (s.vendedor) g.quienes[s.vendedor] = 1;
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
    // Una orden cobrada se queda anclada al día en que se cobró. Una pendiente
    // vale por el día en que se trabajó, que es lo que uno busca al final de la
    // jornada. Si no tiene ninguna de las dos, no se puede fechar y no se
    // esconde nunca.
    l.dia = l.fecha || l.tocada;
    l.vendedores = Object.keys(l.quienes);
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
// Lo que se lleva quien vendió. El porcentaje sale de la venta, no del usuario:
// así subirle la comisión a alguien no le reescribe lo de ayer.
function comisionDe(precio, pct) {
  return Math.round((Number(precio) || 0) * (Number(pct) || 0) / 100);
}

const NOMBRE_PAGO = { efectivo: "efectivo", transferencia: "transferencia", otro: "otro" };

// Todo lo vendido, agrupado por quién lo vendió, con sus líneas por local y día.
function ventasPorVendedor() {
  const mapa = {};
  const meter = (quien, precio, pct, fecha, negocio, cuantas, pago) => {
    if (!quien || !fecha) return;
    if (!mapa[quien]) {
      mapa[quien] = { quien: quien, piezas: 0, facturado: 0, comision: 0,
        porPago: {}, lineas: {} };
    }
    const m = mapa[quien];
    const com = comisionDe(precio, pct);
    m.piezas += cuantas;
    m.facturado += precio;
    m.comision += com;
    m.porPago[pago] = (m.porPago[pago] || 0) + precio;
    const llave = fecha + "|" + negocio;
    if (!m.lineas[llave]) {
      m.lineas[llave] = { fecha: fecha, negocio: negocio, piezas: 0, cobrado: 0, comision: 0 };
    }
    const l = m.lineas[llave];
    l.piezas += cuantas;
    l.cobrado += precio;
    l.comision += com;
  };

  TARJETAS.forEach((t) => {
    if (!t.vendida) return;
    meter(t.vendedor, Number(t.precio) || 0, t.pct, t.vendida, t.negocio || "", 1,
      t.pago || "efectivo");
  });
  SERVICIOS.forEach((x) => {
    if (!x.fecha) return;
    meter(x.vendedor, Number(x.precio) || 0, x.pct, x.fecha, x.negocio || "", 0,
      x.pago || "efectivo");
  });
  return mapa;
}

// Lo que un vendedor le debe a la casa: cobró la venta entera y se queda su
// parte, así que debe el resto, menos lo que ya haya entregado.
function deudaDe(quien, resumen) {
  const m = resumen || ventasPorVendedor()[quien];
  if (!m) return { dela: 0, entregado: 0, debe: 0 };
  const dela = m.facturado - m.comision;
  const entregado = LIQUIDACIONES
    .filter((x) => x.vendedor === quien)
    .reduce((a, x) => a + (Number(x.monto) || 0), 0);
  return { dela: dela, entregado: entregado, debe: dela - entregado };
}

async function cargarLiquidaciones() {
  try {
    const r = await llamar("liquidaciones");
    LIQUIDACIONES = r.liquidaciones || [];
  } catch (e) {
    LIQUIDACIONES = [];
  }
}

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

function haceDias(n) {
  const d = new Date();
  d.setDate(d.getDate() - (n - 1));
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// las que no se pueden fechar pasan siempre: esconder trabajo pendiente porque
// no supimos ponerle día sería la peor forma de perder una cobranza
function ordenesDelFiltro(lista) {
  if (DIA_ORDENES === "todas") return lista;
  if (DIA_ORDENES === "7") {
    const desde = haceDias(7);
    return lista.filter((l) => !l.dia || l.dia >= desde);
  }
  const dia = DIA_ORDENES === "hoy" ? hoyISO() : DIA_ORDENES;
  return lista.filter((l) => !l.dia || l.dia === dia);
}

$("diaOrdenes").addEventListener("click", (e) => {
  const b = e.target.closest("[data-valor]");
  if (!b) return;
  DIA_ORDENES = b.dataset.valor;
  $("fechaOrdenes").value = "";
  PAGINA_ORDENES = 1;
  pintarVentas();
});

$("fechaOrdenes").addEventListener("change", () => {
  DIA_ORDENES = $("fechaOrdenes").value || "hoy";
  PAGINA_ORDENES = 1;
  pintarVentas();
});

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

  const todas = locales();
  const lista = ordenesDelFiltro(todas);
  marcarSegmento("diaOrdenes", DIA_ORDENES);
  const vendidos = todas.filter((l) => l.cobrado).length;
  const total = TARJETAS.reduce((a, t) => a + (t.vendida ? Number(t.precio) || 0 : 0), 0) +
    ingresoFichas();
  const pendientes = todas.length - vendidos;
  $("graficaPie").innerHTML = "<span>" + vendidos + " aceptadas · " + pendientes +
    " pendientes</span><span>Acumulado <b>" + dinero(total) + "</b></span>";

  if (!lista.length) {
    $("tablaLocales").innerHTML = todas.length
      ? "<div class='vacio'><h2>Nada de ese día</h2>" +
        "<p>Hay " + plural(todas.length, "orden", "órdenes") + " en otras fechas.</p>" +
        "<button type='button' data-ver-todas>Ver todas</button></div>"
      : "<div class='vacio'><h2>Todavía no hay órdenes</h2>" +
        "<p>Crea una orden para un local: sus tarjetas quedan ocupadas y apuntando a su " +
        "sitio en Google Maps, listas para la visita.</p>" +
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
    filas += "<tr><td class='negocio' title='" + escHtml(l.negocio) + "'>" +
      escHtml(l.negocio) + "</td>" +
      "<td class='piezas'>" + (piezas
        ? [l.acrilico ? plural(l.acrilico, "acrílico", "acrílicos") : "",
           l.sticker ? plural(l.sticker, "sticker", "stickers") : ""]
          .filter(Boolean).join(" · ")
        : "<span class='sin-dato'>sin tarjetas</span>") +
      (f ? "<div class='fila-num'>sitio en Google Maps" +
        (f.precio ? " · " + dinero(f.precio) : "") + "</div>" : "") +
      "</td>" +
      "<td class='quien'>" + (l.vendedores.length
        ? escHtml(l.vendedores.map(nombreDeVendedor).join(" · "))
        : "<span class='sin-dato'>—</span>") + "</td>" +
      "<td><span class='estado " + (l.cobrado
        ? "estado-vendido'>Aceptada " + l.fecha
        : "estado-pendiente'>Pendiente") +
      "</span>" + (l.cobrado && piezas && l.vendidas < piezas
        ? "<div class='fila-num'>" + l.vendidas + " de " + piezas + " piezas</div>" : "") +
      (f && !f.hecha ? "<div class='fila-num'>sitio sin publicar</div>" : "") +
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
  const fuera = todas.length - lista.length;
  $("tablaLocales").innerHTML =
    "<table><thead><tr><th>Local</th><th>Piezas</th><th>Vendió</th><th>Estado</th>" +
    "<th>Importe</th><th></th></tr></thead><tbody>" + filas + "</tbody></table>" +
    paginacion(PAGINA_ORDENES, paginas, "órdenes") +
    (fuera ? "<div class='fuera-filtro'>" + plural(fuera, "orden", "órdenes") +
      " en otras fechas <button type='button' class='fantasma' data-ver-todas>" +
      "Ver todas</button></div>" : "");
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
    VENDEDORES = a.vendedores || { felipe: null, nicolas: null, alexander: null };
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

  // La comisión sale de arriba, antes que el costo: de un acrílico de $49.900 al
  // 50%, la casa se queda $24.950 y de ahí todavía tiene que pagar el plástico y
  // el chip. Por eso resta en la utilidad y no solo en el reparto de la venta.
  const porQuien = ventasPorVendedor();
  const comisiones = Object.keys(porQuien).reduce((a, k) => a + porQuien[k].comision, 0);

  const justo = gastos / 2;
  return {
    gastos: gastos,
    ingresos: ingresos,
    comisiones: comisiones,
    utilidad: ingresos - gastos - comisiones,
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
  const suma = { sin: 0 };
  QUIENES_VENDEN.forEach((k) => { suma[k] = 0; });
  const meter = (quien, cuanto) => {
    if (suma[quien] !== undefined && quien !== "sin") suma[quien] += cuanto;
    else suma.sin += cuanto;
  };
  // Por quien firma, no por quien vendió: el comprobante salió con su cédula, así
  // que ese ingreso es suyo ante la DIAN aunque la venta la hiciera otro.
  TARJETAS.forEach((t) => {
    if (String(t.vendida || "").indexOf(desde) === 0) {
      meter(t.jefe || t.vendedor, Number(t.precio) || 0);
    }
  });
  SERVICIOS.forEach((x) => {
    if (String(x.fecha || "").indexOf(desde) === 0) {
      meter(x.jefe || x.vendedor, Number(x.precio) || 0);
    }
  });
  return suma;
}

function pintarTope() {
  const suma = vendidoPorSocio(UVT.anio);
  const tope = topeRenta();
  const caja = $("tope");
  const todos = QUIENES_VENDEN;
  const mayor = Math.max.apply(null, todos.map((k) => suma[k] || 0)) / tope;
  caja.className = "tope" + (mayor >= 1 ? " pasado" : (mayor >= 0.8 ? " cerca" : ""));

  const barra = (socio) => {
    const cuanto = suma[socio];
    const parte = cuanto / tope;
    return "<div class='tope-socio'><div class='tope-alto'><span>" + nombreDeVendedor(socio) +
      " <b>" + dinero(cuanto) + "</b></span><span>" +
      (parte >= 1 ? "pasa el tope" : "quedan " + dinero(tope - cuanto)) + "</span></div>" +
      "<div class='tope-barra'><i style='width:" + Math.min(100, parte * 100).toFixed(1) +
      "%'></i></div></div>";
  };

  // una barra en cero es ruido: el tercero aparece cuando ya vendió o ya tiene
  // sus datos puestos
  const conBarra = todos;
  caja.innerHTML = "<div class='cejilla'>Declaración de renta · " + UVT.anio + "</div>" +
    (conBarra.length ? conBarra : ["felipe", "nicolas"]).map(barra).join("") +
    (suma.sin ? "<div class='tope-nota'>Sin jefe apuntado: <b>" + dinero(suma.sin) +
      "</b> — ventas de antes de que el comprobante tuviera firma.</div>" : "") +
    (USUARIOS.length ? "<div class='tope-nota'>Lo que venden los demás cuenta para el " +
      "jefe que firma su comprobante, no para ellos.</div>" : "") +
    "<div class='tope-nota'>Declara quien pase " + RENTA_UVT.toLocaleString("es-CO") +
    " UVT de ingresos brutos en el " +
    "año, que en " + UVT.anio + " son " + dinero(tope) + " (UVT " + dinero(UVT.pesos) + ").</div>";
}

// Lo que cada vendedor ha hecho y lo que se lleva. Solo sale si hay alguien:
// mientras vendan los dos socios, esta tabla no tiene nada que contar.
function pintarComisiones() {
  const porQuien = ventasPorVendedor();
  const gente = Object.keys(porQuien)
    .filter((k) => porQuien[k].comision > 0)
    .sort((a, b) => porQuien[b].comision - porQuien[a].comision);

  $("bloqueComisiones").hidden = !gente.length;
  if (!gente.length) return;

  $("tablaComisiones").innerHTML =
    "<table><thead><tr><th>Vendedor</th><th>Facturado</th><th>Se lleva</th>" +
    "<th>Para la casa</th><th>Debe</th><th></th></tr></thead><tbody>" +
    gente.map((k) => {
      const m = porQuien[k];
      const d = deudaDe(k, m);
      const pagos = Object.keys(m.porPago)
        .map((p) => dinero(m.porPago[p]) + " en " + (NOMBRE_PAGO[p] || p)).join(" · ");
      return "<tr><td class='negocio'>" + escHtml(nombreDeVendedor(k)) +
        "<div class='fila-num'>" + plural(m.piezas, "pieza", "piezas") +
        (pagos ? " · " + escHtml(pagos) : "") + "</div></td>" +
        "<td class='importe'>" + dinero(m.facturado) + "</td>" +
        "<td class='importe'>" + dinero(m.comision) + "</td>" +
        "<td class='importe'>" + dinero(d.dela) + "</td>" +
        "<td class='importe" + (d.debe > 0 ? " debe" : "") + "'><b>" +
        (d.debe > 0 ? dinero(d.debe) : "al día") + "</b>" +
        (d.entregado ? "<div class='fila-num'>entregó " + dinero(d.entregado) + "</div>" : "") +
        "</td>" +
        "<td><div class='acciones'><button type='button' class='accion-editar' " +
        "data-recibi='" + escHtml(k) + "'>Recibí</button></div></td></tr>";
    }).join("") + "</tbody></table>";
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
    "</b> · Gastos <b>" + dinero(c.gastos) + "</b>" +
    (c.comisiones ? " · Comisiones <b>" + dinero(c.comisiones) + "</b>" : "") +
    "</span><span>" +
    (c.utilidad >= 0 ? "Utilidad " : "Va perdiendo ") + "<b>" +
    dinero(Math.abs(c.utilidad)) + "</b></span>";

  $("socios").innerHTML = ["felipe", "nicolas"].map((k) =>
    "<div class='socio'><h3>" + SOCIO_NOMBRE[k] + "</h3>" +
    "<div class='socio-linea'><span>Ha puesto</span><b>" + dinero(c.puesto[k]) + "</b></div>" +
    "<div class='socio-linea'><span>Le toca poner</span><b>" + dinero(c.justo) + "</b></div>" +
    "<div class='socio-linea'><span>" + (c.utilidad >= 0 ? "Gana" : "Pierde") +
    "</span><b>" + dinero(Math.abs(c.utilidad) / 2) + "</b></div></div>").join("");

  pintarComisiones();

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
  // En el teléfono no se ve la cabecera de la tabla, así que cada número lleva
  // su palabra pegada. Va en un span y no en un ::before para poder ponerla
  // detrás del número y dejar los "(26 malos)" al final, donde se leen.
  const rot = (t) => "<span class='rot'>" + t + "</span>";
  inv.forEach((i) => {
    // si nada se ha vendido, "útiles" y "quedan" son el mismo número dicho dos
    // veces: la fila se queda solo con el grande
    const utilMudo = i.util === i.queda && !i.malos;
    invFilas += "<tr><td class='negocio'>" + escHtml(i.que) + "</td>" +
      "<td class='inv" + (utilMudo ? " inv-cero" : "") + "'>" + i.util +
      rot(i.util === 1 ? "útil" : "útiles") +
      (i.malos ? " <span class='inv-malos'>(" + i.malos + " malos)</span>" : "") + "</td>" +
      "<td class='inv" + (i.vendido ? "" : " inv-cero") + "'>" + (i.vendido || "—") +
      rot(i.vendido === 1 ? "vendido" : "vendidos") + "</td>" +
      "<td class='inv queda" + (i.queda < 0 ? " inv-malos" : "") +
      "'><b>" + i.queda + "</b></td>" +
      "<td class='inv" + (i.pedido ? "" : " inv-cero") + "'>" + (i.pedido || "—") +
      rot("en camino") + "</td>" +
      (utilMudo && !i.vendido && !i.pedido ? "" : "<td class='corte'></td>") + "</tr>";
  });
  $("tablaInventario").innerHTML =
    "<table><thead><tr><th>Cosa</th><th>Útiles</th><th>Vendidos</th><th>Quedan</th>" +
    "<th>En camino</th></tr></thead><tbody>" + invFilas + "</tbody></table>";
}

// Un vendedor entra a vender: ve sus órdenes y nada más. La plata de la casa, el
// plástico y la gente son del superadmin. Esto es el reparto de la pantalla; el
// que de verdad manda es el Worker, que contesta 403 aunque el botón aparezca.
function pintarRol() {
  const dueno = SESION.dueno;
  document.querySelectorAll("[data-dueno]").forEach((e) => { e.hidden = !dueno; });
  // "Lo mío" es de quien cobra comisión; el resto, de la casa
  // el mapa es de todos: es lo único que se comparte de lado a lado
  const deTodos = { locales: 1, mapa: 1 };
  document.querySelectorAll("#vistaPanel [data-valor]").forEach((b) => {
    b.hidden = b.dataset.valor === "mio" ? dueno : !dueno && !deTodos[b.dataset.valor];
  });
  $("marcaQuien").textContent = dueno ? "" : SESION.nombre;
  if (!dueno) {
    VISTA = "locales";
    // firma con su nombre, sin elegir: el Worker le ignora cualquier otro
    QUIEN_VENDE = SESION.usuario;
    VENDEDORES[SESION.usuario] = { nombre: SESION.nombre, cedula: SESION.cedula,
      telefono: SESION.telefono, nota: SESION.nota };
  }
  $("filaQuienVende").hidden = !dueno;
}

function pintarMio() {
  const m = ventasPorVendedor()[SESION.usuario] ||
    { piezas: 0, facturado: 0, comision: 0, lineas: {} };

  $("mioMetrica").innerHTML = dinero(m.comision) +
    "<span class='unidad'>tuyo, de " + dinero(m.facturado) + " vendidos</span>";
  const d = deudaDe(SESION.usuario, m);
  $("mioPie").innerHTML = "<span>" + plural(m.piezas, "pieza", "piezas") +
    " · tu parte <b>" + (Number(SESION.pct) || 0) + "%</b></span><span>" +
    (d.debe > 0
      ? "Debes entregar <b class='debe'>" + dinero(d.debe) + "</b>"
      : "<b>Al día</b> con la casa") + "</span>";

  const lineas = Object.keys(m.lineas).map((k) => m.lineas[k])
    .sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));

  if (!lineas.length) {
    $("tablaMio").innerHTML = "<div class='vacio'><h2>Todavía nada</h2>" +
      "<p>Cuando aceptes tu primera orden, aquí sale lo que te toca de cada venta.</p></div>";
    return;
  }

  $("tablaMio").innerHTML =
    "<table><thead><tr><th>Día</th><th>Local</th><th>Piezas</th><th>Cobrado</th>" +
    "<th>Tuyo</th></tr></thead><tbody>" +
    lineas.map((l) => "<tr><td class='piezas'>" + escHtml(l.fecha) + "</td>" +
      "<td class='negocio'>" + escHtml(l.negocio || "—") + "</td>" +
      "<td class='inv'>" + (l.piezas || "—") + "</td>" +
      "<td class='importe'>" + dinero(l.cobrado) + "</td>" +
      "<td class='importe'><b>" + dinero(l.comision) + "</b></td></tr>").join("") +
    "</tbody></table>";
}

function pintarVista(valor) {
  const conocidas = { locales: 1, cuentas: 1, inventario: 1, mio: 1, mapa: 1 };
  VISTA = conocidas[valor] ? valor : "tarjetas";
  marcarSegmento("vistaPanel", VISTA);
  $("vistaTarjetas").hidden = VISTA !== "tarjetas";
  $("vistaLocales").hidden = VISTA !== "locales";
  $("vistaCuentas").hidden = VISTA !== "cuentas";
  $("vistaInventario").hidden = VISTA !== "inventario";
  $("vistaMio").hidden = VISTA !== "mio";
  $("vistaMapa").hidden = VISTA !== "mapa";
  // activar tarjetas es reponer plástico: va con el inventario, no con la lista
  $("abrirActivar").hidden = !SESION.dueno || VISTA !== "inventario";
  $("togglePruebas").hidden = !SESION.dueno || VISTA !== "inventario";
  $("abrirNFC").hidden = !SESION.dueno || VISTA !== "inventario";
  $("abrirAjustes").hidden = !SESION.dueno || VISTA !== "cuentas";
  $("abrirUsuarios").hidden = !SESION.dueno || VISTA !== "cuentas";
  if (VISTA === "locales") pintarVentas();
  if (VISTA === "cuentas" || VISTA === "inventario") pintarCuentas();
  if (VISTA === "mio") pintarMio();
  if (VISTA === "mapa") {
    // ya está a la vista: ahora sí tiene tamaño que medir
    armarMapa();
    if (MAPA) { MAPA.invalidateSize(); pintarPuntos(); }
  }
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
  if (e.target.closest("[data-ver-todas]")) {
    DIA_ORDENES = "todas";
    $("fechaOrdenes").value = "";
    PAGINA_ORDENES = 1;
    pintarVentas();
    return;
  }
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
  if (c) { abrirCancelar(c.dataset.cancelar); return; }
});

// Cancelar liberaba las piezas y borraba el rastro. Pero un local que queda en
// stand by no es lo mismo que uno que dijo que no, y las dos cosas hay que
// saberlas: la pieza se necesita para otro cliente hoy, y el local puede llamar
// en un mes. La orden se va, la visita se queda en el mapa.
// La misma ventana para las dos puertas por las que se muere una orden: darle a
// Cancelar, o quedarse sin piezas porque te las llevaste a otra. La segunda es
// la que pasa de verdad en la calle.
let CANCELANDO = null;
let COLA_VACIADAS = [];
let focoCancelar = null;

function abrirCancelar(negocio) {
  const l = locales().filter((x) => x.negocio === negocio)[0];
  if (!l) return;
  CANCELANDO = { negocio: negocio, lat: l.lat, lng: l.lng, yaSeFue: false, orden: l };
  $("cancelarTitulo").textContent = "Cancelar la orden de " + negocio;
  const suelta = [];
  if (l.piezas) suelta.push(plural(l.piezas, "pieza", "piezas") + " que vuelven a estar libres");
  if (l.ficha) suelta.push("el sitio en Google Maps");
  $("cancelarSubtitulo").textContent = suelta.length
    ? "Se va con " + suelta.join(" y ") + "."
    : "No tiene piezas: solo se quita la fila.";
  $("errorSalida").textContent = "Se borra la orden y no queda nada en el mapa.";
  abrirVentanaCancelar();
}

// Te llevaste sus piezas a otra orden, así que esa ya no existe. Es el momento
// exacto en que se sabe qué pasó con el local, y el único en que se va a apuntar.
function preguntarPorVaciada(v) {
  CANCELANDO = { negocio: v.negocio, lat: v.lat, lng: v.lng, yaSeFue: true };
  $("cancelarTitulo").textContent = v.negocio + " se quedó sin piezas";
  $("cancelarSubtitulo").textContent =
    "Le quitaste las que tenía, así que esa orden ya no existe. ¿Qué pasó con el local?";
  $("errorSalida").textContent = "No queda nada en el mapa.";
  abrirVentanaCancelar();
}

function abrirVentanaCancelar() {
  limpiarAviso();
  if ($("modalCancelar").hidden) focoCancelar = document.activeElement;
  $("modalCancelar").hidden = false;
  document.body.style.overflow = "hidden";
}

function siguienteVaciada() {
  const v = COLA_VACIADAS.shift();
  if (v) preguntarPorVaciada(v); else cerrarCancelar();
}

function cerrarCancelar() {
  if ($("modalCancelar").hidden) return;
  $("modalCancelar").hidden = true;
  document.body.style.overflow = "";
  if (focoCancelar && focoCancelar.focus) focoCancelar.focus();
  focoCancelar = null;
  CANCELANDO = null;
  COLA_VACIADAS = [];
}

$("cerrarCancelar").onclick = cerrarCancelar;
$("modalCancelar").addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-cerrar-cancelar")) cerrarCancelar();
});

$("modalCancelar").addEventListener("click", async (e) => {
  const b = e.target.closest("[data-salida]");
  if (!b || !CANCELANDO) return;
  const caso = CANCELANDO;
  const negocio = caso.negocio;
  const salida = b.dataset.salida;

  // si la orden ya se fue sola, aquí solo queda apuntar qué pasó
  if (caso.yaSeFue) {
    b.disabled = true;
    try {
      if (salida !== "nada") await dejarEnElMapa(caso, salida);
    } finally {
      b.disabled = false;
    }
    siguienteVaciada();
    return;
  }

  const l = caso.orden;
  if (!l) return;

  [].slice.call($("modalCancelar").querySelectorAll("button"))
    .forEach((x) => { x.disabled = true; });
  const etiqueta = b.querySelector("b").textContent;
  b.querySelector("b").textContent = "Cancelando…";
  // el código de abajo va contando "Liberando 3 de 12…": que se vea en el botón
  // que se acaba de tocar
  const rotulo = b.querySelector("b");
  const c = { set textContent(t) { rotulo.textContent = t; }, disabled: false };
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
      c.textContent = "Quitando el sitio…";
      await llamar("servicio-borrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: l.ficha.id }),
      });
    }

    parchearTarjetas(l.codigos.acrilico.concat(l.codigos.sticker),
      { negocio: "", destino: "", vendida: "", precio: 0, vendedor: "" });
    if (l.ficha) parchearServicio(l.ficha.id, null);

    // la visita se queda aunque la orden se vaya
    if (salida !== "nada") await dejarEnElMapa(l, salida);

    cerrarCancelar();
    const suelto = [];
    if (total) suelto.push(plural(total, "tarjeta libre", "tarjetas libres") + " otra vez");
    if (l.ficha) suelto.push("sitio quitado");
    if (salida === "amarillo") suelto.push("queda en tu mapa como \"hablando\"");
    if (salida === "gris") suelto.push("queda gris en el mapa");
    avisar("avisoPanel", "Orden de " + negocio + " cancelada · " + suelto.join(" y "), true);
  } catch (err) {
    avisar("avisoPanel", err.message, false);
    pintarVentas();
  } finally {
    [].slice.call($("modalCancelar").querySelectorAll("button"))
      .forEach((x) => { x.disabled = false; });
    b.querySelector("b").textContent = etiqueta;
  }
});

// Las coordenadas vienen de la tarjeta, que las guardó del link de Maps al crear
// la orden. Sin ellas no se marca nada: inventarle un sitio sería peor.
async function dejarEnElMapa(l, estado) {
  if (!l.lat || !l.lng) return;
  const suyo = PUNTOS.filter((x) => x.nombre === l.negocio && x.mio)[0];
  try {
    const r = await llamar("punto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: suyo ? suyo.id : undefined,
        lat: l.lat, lng: l.lng, nombre: l.negocio, estado: estado,
        nota: suyo ? suyo.nota : "",
      }),
    });
    PUNTOS = PUNTOS.filter((x) => x.id !== r.id);
    PUNTOS.push(Object.assign({ mio: true }, r));
    pintarPuntos();
  } catch (e) {
    // la orden ya se cancel\u00f3: que el mapa falle no puede tumbar eso
  }
}

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
    items.push({ que: "Creación del sitio del negocio en Google Maps",
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
  let mias = [];
  if (datos.vendedor.cedula) mias.push("C.C. " + datos.vendedor.cedula);
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
  const firma = quienFirma();
  const quien = VENDEDORES[firma];
  if (!quien || !quien.nombre) {
    if (SESION.dueno) {
      cerrarVenta();
      abrirAjustes(firma);
      avisar("avisoPanel", "Falta el nombre de " + nombreDeVendedor(firma) +
        ". Se pone una vez y ya sale en sus comprobantes.", false);
    } else {
      // su jefe es quien firma, y esos datos los pone el superadmin
      avisar("avisoVenta", "Faltan los datos de " + nombreDeVendedor(firma) +
        ", que es quien firma tus comprobantes. Pídeselo.", false);
    }
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

// El cliente pagó pero no quiso papel. Se guarda el mismo cerrojo, sin correo, y
// la fila lo dice: «cerrada sin comprobante».
async function cerrarSinComprobante() {
  if (!LOCAL_VENTA) return false;
  const negocio = LOCAL_VENTA.negocio;
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
    pintarBloqueoVenta(negocio);
    repintarTodo();
    return true;
  } catch (err) {
    avisar("avisoVenta", err.message, false);
    return false;
  }
}

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

/* ---------- grabar los chips NFC ---------- */

// Antes: dos teléfonos, uno con NFC Tools escribiendo y cambiando la letra a
// mano, otro bloqueando. Aquí el QR manda: lo que diga el cartel es lo que se
// graba, así no hay forma de escribir un link que no sea el suyo.
//
// Web NFC solo existe en Chrome de Android. Y sellar no tiene vuelta atrás, por
// eso va en su propio paso, después de comprobar que el chip quedó bien.
let NFC_PIEZA = null;
let TIPO_NFC = "acrilico";
let focoNFC = null;
let cortarNFC = null;

function hayWebNFC() {
  return typeof window.NDEFReader === "function";
}

function decirPaso(id, texto, estado) {
  const caja = $(id);
  caja.textContent = texto;
  caja.classList.toggle("bien", estado === "bien");
  caja.classList.toggle("mal", estado === "mal");
}

function pintarPasosNFC() {
  const hay = Boolean(NFC_PIEZA);
  $("grabarNFC").disabled = !hay;
  $("leerNFC").disabled = !hay || !NFC_PIEZA.grabada;
  $("sellarNFC").disabled = !hay || !NFC_PIEZA.revisada;
  $("siguienteNFC").disabled = !hay;
  $("saltarSello").hidden = !hay || !NFC_PIEZA.revisada;
  $("pasoGrabar").classList.toggle("apagado", !hay);
  $("pasoLeer").classList.toggle("apagado", !hay || !NFC_PIEZA.grabada);
  $("pasoSellar").classList.toggle("apagado", !hay || !NFC_PIEZA.revisada);
}

function nuevaPiezaNFC() {
  pararNFC();
  NFC_PIEZA = null;
  decirQR("La pieza que vas a grabar.");
  decirPaso("diceGrabar", "Acerca el chip por detrás del teléfono.");
  decirPaso("diceLeer", "Vuelve a acercarlo y comprueba el link.");
  decirPaso("diceSellar", "No tiene vuelta atrás: nadie podrá reescribirlo.");
  pintarPasosNFC();
}

function decirQR(texto, estado) {
  decirPaso("diceQR", texto, estado);
}

// el QR trae el link entero, pero se rearma desde el código para no grabar
// nunca una variante rara de lo que venga impreso
function tomarPiezaDelQR(crudo) {
  cerrarCamara();
  const codigo = codigoDeQR(crudo);
  if (!codigo) { decirQR("Ese QR no trae ningún código.", "mal"); return; }

  const t = TARJETAS.filter((x) => x.codigo === codigo)[0];
  if (!t) { decirQR(codigo + " no está en la lista de tarjetas.", "mal"); return; }

  const tipo = tipoDe(t);
  const numero = indiceDeCodigo(codigo) + 1;
  // el QR va en mayúsculas porque así entra en modo alfanumérico y sale más
  // limpio de imprimir; el chip no tiene esa limitación y lleva la forma normal
  const url = ORIGEN + "/" + codigo;

  if (tipo !== TIPO_NFC) {
    decirQR(codigo + " es " + (tipo === "acrilico" ? "un acrílico" : "un sticker") +
      " y estás en " + (TIPO_NFC === "acrilico" ? "acrílicos" : "stickers") +
      ". Cambia arriba si es a propósito.", "mal");
    return;
  }

  NFC_PIEZA = { codigo: codigo, tipo: tipo, numero: numero, url: url,
    grabada: false, revisada: false };
  decirQR(codigo + " · nº " + numero + " · " + url +
    (NFC[codigo] ? "  ·  ojo, ya estaba marcada como grabada" : ""), "bien");
  pintarPasosNFC();
}

function pararNFC() {
  if (cortarNFC) { cortarNFC.abort(); cortarNFC = null; }
}

function sinWebNFC(id) {
  decirPaso(id, "Este navegador no graba chips. Hace falta Chrome de Android.", "mal");
}

$("grabarNFC").onclick = async () => {
  if (!NFC_PIEZA) return;
  if (!hayWebNFC()) { sinWebNFC("diceGrabar"); return; }

  pararNFC();
  cortarNFC = new AbortController();
  decirPaso("diceGrabar", "Acerca el chip…");
  try {
    const nfc = new window.NDEFReader();
    await nfc.write({ records: [{ recordType: "url", data: NFC_PIEZA.url }] },
      { signal: cortarNFC.signal });
    NFC_PIEZA.grabada = true;
    NFC_PIEZA.revisada = false;
    decirPaso("diceGrabar", "Grabado con " + NFC_PIEZA.url, "bien");
  } catch (e) {
    decirPaso("diceGrabar", "No se grabó: " + e.message, "mal");
  } finally {
    cortarNFC = null;
    pintarPasosNFC();
  }
};

$("leerNFC").onclick = async () => {
  if (!NFC_PIEZA) return;
  if (!hayWebNFC()) { sinWebNFC("diceLeer"); return; }

  pararNFC();
  cortarNFC = new AbortController();
  decirPaso("diceLeer", "Acerca el chip para leerlo…");
  try {
    const nfc = new window.NDEFReader();
    const leido = await new Promise(async (listo, falla) => {
      nfc.onreading = (e) => {
        for (const r of e.message.records) {
          if (r.recordType === "url" || r.recordType === "absolute-url") {
            listo(new TextDecoder().decode(r.data));
            return;
          }
        }
        listo("");
      };
      nfc.onreadingerror = () => falla(new Error("el chip no se dejó leer"));
      try { await nfc.scan({ signal: cortarNFC.signal }); } catch (err) { falla(err); }
    });

    if (leido.toUpperCase() === NFC_PIEZA.url.toUpperCase()) {
      NFC_PIEZA.revisada = true;
      decirPaso("diceLeer", "Dice " + leido + " — coincide con el QR.", "bien");
    } else {
      NFC_PIEZA.revisada = false;
      decirPaso("diceLeer", "Dice " + (leido || "nada") + ", que no es lo del QR. " +
        "Vuelve a grabarlo.", "mal");
    }
  } catch (e) {
    decirPaso("diceLeer", "No se pudo leer: " + e.message, "mal");
  } finally {
    pararNFC();
    pintarPasosNFC();
  }
};

$("sellarNFC").onclick = async () => {
  if (!NFC_PIEZA || !NFC_PIEZA.revisada) return;
  if (!hayWebNFC()) { sinWebNFC("diceSellar"); return; }
  if (CONFIRMANDO !== "sellar") {
    pedirConfirmacion($("sellarNFC"), "sellar");
    decirPaso("diceSellar", "Es para siempre. Toca otra vez para sellarlo.", "mal");
    return;
  }

  olvidarConfirmacion();
  pararNFC();
  cortarNFC = new AbortController();
  decirPaso("diceSellar", "Acerca el chip para sellarlo…");
  try {
    const nfc = new window.NDEFReader();
    await nfc.makeReadOnly({ signal: cortarNFC.signal });
    decirPaso("diceSellar", "Sellado. Ya nadie puede reescribirlo.", "bien");
    await apuntarNFCPuesto();
  } catch (e) {
    decirPaso("diceSellar", "No se selló: " + e.message, "mal");
  } finally {
    cortarNFC = null;
    pintarPasosNFC();
  }
};

async function apuntarNFCPuesto() {
  if (!NFC_PIEZA || NFC[NFC_PIEZA.codigo]) return;
  try {
    await llamar("nfc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo: NFC_PIEZA.codigo, listo: true }),
    });
    NFC[NFC_PIEZA.codigo] = 1;
    pintarTabla();
  } catch (e) {
    avisar("avisoPanel", "El chip quedó, pero no se pudo marcar: " + e.message, false);
  }
}

$("saltarSello").onclick = async () => { await apuntarNFCPuesto(); nuevaPiezaNFC(); };
$("siguienteNFC").onclick = nuevaPiezaNFC;

$("escanearNFC").onclick = () => {
  if ($("camaraNFC").hidden) {
    abrirCamara({ caja: "camaraNFC", video: "videoNFC", alLeer: tomarPiezaDelQR,
      decir: decirQR });
  } else {
    cerrarCamara();
  }
};
$("cerrarCamaraNFC").onclick = cerrarCamara;

$("tipoNFC").addEventListener("click", (e) => {
  const b = e.target.closest("[data-valor]");
  if (!b) return;
  TIPO_NFC = b.dataset.valor;
  marcarSegmento("tipoNFC", TIPO_NFC);
});

function abrirNFC() {
  marcarSegmento("tipoNFC", TIPO_NFC);
  nuevaPiezaNFC();
  if (!hayWebNFC()) {
    decirQR("Este navegador no graba chips: hace falta Chrome de Android.", "mal");
  }
  limpiarAviso();
  focoNFC = document.activeElement;
  $("modalNFC").hidden = false;
  document.body.style.overflow = "hidden";
}

function cerrarNFC() {
  if ($("modalNFC").hidden) return;
  pararNFC();
  cerrarCamara();
  olvidarConfirmacion();
  $("modalNFC").hidden = true;
  document.body.style.overflow = "";
  if (focoNFC && focoNFC.focus) focoNFC.focus();
  focoNFC = null;
}

$("abrirNFC").onclick = abrirNFC;
$("cerrarNFCModal").onclick = cerrarNFC;
$("modalNFC").addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-cerrar-nfc")) cerrarNFC();
});

/* ---------- el mapa de visitas ---------- */

// Cobrar una orden es la definición de un punto verde, así que no hay por qué
// pedirlo aparte. Las coordenadas vienen del link de Maps que se pegó al crear
// la orden; sin ellas —órdenes viejas, o un Place ID pegado a mano— no se marca
// nada y ya, que inventarle un sitio al local sería peor.
async function marcarVerde(l) {
  if (!l || !l.lat || !l.lng) return;
  const suyo = PUNTOS.filter((p) => p.nombre === l.negocio && p.mio)[0];
  if (suyo && suyo.estado === "verde") return;
  try {
    const r = await llamar("punto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: suyo ? suyo.id : undefined,
        lat: l.lat, lng: l.lng, nombre: l.negocio, estado: "verde",
        nota: suyo ? suyo.nota : "",
      }),
    });
    PUNTOS = PUNTOS.filter((x) => x.id !== r.id);
    PUNTOS.push(Object.assign({ mio: true }, r));
    pintarPuntos();
  } catch (e) {
    // el cobro ya quedó: que el mapa falle no puede tumbarlo
  }
}

// El mapa existe para no mandar a dos personas al mismo sitio. Por eso lo ve
// todo el mundo y por eso es anónimo salvo para el superadmin: quién fue no
// cambia la ruta de nadie.
const COLOR_PUNTO = { verde: "#1e8e3e", amarillo: "#f9ab00", gris: "#667287" };
const DICE_ESTADO = {
  gris: "Se pasó por ahí y no salió nada. Los demás lo ven igual.",
  amarillo: "Hay conversación abierta. Solo tú lo ves amarillo; para los demás es gris, " +
    "que ya con eso no vuelven a pasar.",
  verde: "Compraron. Lo ven todos en verde.",
};
const IBAGUE = [4.4389, -75.2322];

let PUNTOS = [];
let MAPA = null;
let CAPA_PUNTOS = null;
let PUNTO_EDITADO = null;
let ESTADO_PUNTO = "gris";
let focoPunto = null;

async function cargarPuntos() {
  try {
    const r = await llamar("mapa");
    PUNTOS = r.puntos || [];
    pintarPuntos();
    decirMapa(PUNTOS.length
      ? plural(PUNTOS.length, "punto", "puntos") + " en el mapa"
      : "Todavía no hay ninguno. Toca el mapa, o el botón de arriba.");
  } catch (e) {
    // si la carga falla, mejor el mapa de antes que un mapa en blanco. Pero que
    // se diga: un mapa vacío y un mapa roto se veían igual, y eso no vale.
    decirMapa("No se pudieron traer los puntos: " + e.message, true);
  }
}

function decirMapa(texto, malo) {
  $("mapaDicho").textContent = texto;
  $("mapaDicho").classList.toggle("malo", Boolean(malo));
}

// Leaflet necesita que su caja ya esté en pantalla y con tamaño: si se crea con
// la pestaña oculta, el mapa nace de cero píxeles y se queda gris.
function armarMapa() {
  if (MAPA || typeof L === "undefined") return;
  MAPA = L.map("mapa", { zoomControl: true }).setView(IBAGUE, 14);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
  }).addTo(MAPA);
  CAPA_PUNTOS = L.layerGroup().addTo(MAPA);
  MAPA.on("click", (e) => abrirPunto(null, e.latlng.lat, e.latlng.lng));
  pintarPuntos();
}

function pintarPuntos() {
  if (!CAPA_PUNTOS) return;
  CAPA_PUNTOS.clearLayers();
  PUNTOS.forEach((p) => {
    const color = COLOR_PUNTO[p.estado] || COLOR_PUNTO.gris;
    const bola = L.circleMarker([p.lat, p.lng], {
      radius: p.estado === "gris" ? 7 : 9,
      color: "#fff", weight: 2, fillColor: color, fillOpacity: 1,
    });
    // Solo los propios se abren, también para el superadmin: un punto ajeno le
    // llega degradado a gris, y guardarlo así le borraría el amarillo a su dueño.
    const suyo = p.mio;
    bola.bindTooltip(escHtml(p.nombre) + (p.nota ? "<br><i>" + escHtml(p.nota) + "</i>" : "") +
      (SESION.dueno && p.vendedor ? "<br>" + escHtml(nombreDeVendedor(p.vendedor)) : ""));
    if (suyo) bola.on("click", (e) => { L.DomEvent.stop(e); abrirPunto(p); });
    CAPA_PUNTOS.addLayer(bola);
  });

  if (PUNTOS.length && MAPA) {
    MAPA.fitBounds(L.latLngBounds(PUNTOS.map((p) => [p.lat, p.lng])).pad(0.2),
      { maxZoom: 16 });
  }
}

function pintarEstadoPunto(valor) {
  ESTADO_PUNTO = COLOR_PUNTO[valor] ? valor : "gris";
  marcarSegmento("estadoPunto", ESTADO_PUNTO);
  $("ayudaEstado").textContent = DICE_ESTADO[ESTADO_PUNTO];
}

$("estadoPunto").addEventListener("click", (e) => {
  const b = e.target.closest("[data-valor]");
  if (b) pintarEstadoPunto(b.dataset.valor);
});

function abrirPunto(punto, lat, lng) {
  PUNTO_EDITADO = punto
    ? Object.assign({}, punto)
    : { lat: lat, lng: lng, nombre: "", estado: "gris", nota: "" };
  $("puntoKicker").textContent = punto ? "Visita" : "Nueva";
  $("puntoTitulo").textContent = punto ? punto.nombre : "Marcar un local";
  $("puntoSubtitulo").textContent = punto && punto.fecha
    ? "Marcado el " + punto.fecha
    : "Queda donde tocaste el mapa.";
  $("puntoNombre").value = PUNTO_EDITADO.nombre;
  $("puntoNota").value = PUNTO_EDITADO.nota || "";
  pintarEstadoPunto(PUNTO_EDITADO.estado);
  $("borrarPunto").hidden = !punto;
  olvidarConfirmacion();
  limpiarAviso();
  focoPunto = document.activeElement;
  $("modalPunto").hidden = false;
  document.body.style.overflow = "hidden";
  $("puntoNombre").focus();
}

function cerrarPunto() {
  if ($("modalPunto").hidden) return;
  $("modalPunto").hidden = true;
  document.body.style.overflow = "";
  if (focoPunto && focoPunto.focus) focoPunto.focus();
  focoPunto = null;
  PUNTO_EDITADO = null;
}

$("cerrarPunto").onclick = cerrarPunto;
$("cancelarPunto").onclick = cerrarPunto;
$("modalPunto").addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-cerrar-punto")) cerrarPunto();
});

// El caso de verdad: sales del local y lo marcas ahí mismo, sin buscarlo en el
// mapa ni saber en qué calle estás.
$("marcarAqui").onclick = () => {
  if (!navigator.geolocation) {
    $("mapaDicho").textContent = "Este navegador no sabe dónde estás. Toca el mapa.";
    return;
  }
  const boton = $("marcarAqui");
  const etiqueta = boton.textContent;
  boton.disabled = true;
  boton.textContent = "Buscándote…";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      boton.disabled = false;
      boton.textContent = etiqueta;
      $("mapaDicho").textContent = "";
      if (MAPA) MAPA.setView([pos.coords.latitude, pos.coords.longitude], 17);
      abrirPunto(null, pos.coords.latitude, pos.coords.longitude);
    },
    (err) => {
      boton.disabled = false;
      boton.textContent = etiqueta;
      $("mapaDicho").textContent = "No se pudo ubicar: " + err.message +
        ". Toca el mapa donde estás.";
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
  );
};

$("formPunto").onsubmit = async (e) => {
  e.preventDefault();
  if (!PUNTO_EDITADO) return;
  const boton = $("guardarPunto");
  boton.disabled = true;
  try {
    const r = await llamar("punto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: PUNTO_EDITADO.id,
        lat: PUNTO_EDITADO.lat,
        lng: PUNTO_EDITADO.lng,
        nombre: $("puntoNombre").value,
        estado: ESTADO_PUNTO,
        nota: $("puntoNota").value,
      }),
    });
    PUNTOS = PUNTOS.filter((x) => x.id !== r.id);
    PUNTOS.push(Object.assign({ mio: true }, r));
    cerrarPunto();
    pintarPuntos();
    decirMapa(plural(PUNTOS.length, "punto", "puntos") + " en el mapa");
    avisar("avisoPanel", r.nombre + " marcado en el mapa", true);
  } catch (err) {
    avisar("avisoPunto", err.message, false);
  } finally {
    boton.disabled = false;
  }
};

$("borrarPunto").onclick = async () => {
  if (!PUNTO_EDITADO || !PUNTO_EDITADO.id) return;
  const boton = $("borrarPunto");
  if (CONFIRMANDO !== "punto") { pedirConfirmacion(boton, "punto"); return; }
  olvidarConfirmacion();
  boton.disabled = true;
  try {
    await llamar("punto-borrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: PUNTO_EDITADO.id }),
    });
    PUNTOS = PUNTOS.filter((x) => x.id !== PUNTO_EDITADO.id);
    cerrarPunto();
    pintarPuntos();
    avisar("avisoPanel", "Punto borrado del mapa", true);
  } catch (err) {
    avisar("avisoPunto", err.message, false);
  } finally {
    boton.disabled = false;
  }
};

/* ---------- lo que entregan los vendedores ---------- */

let RECIBI_DE = "";
let focoRecibi = null;

$("tablaComisiones").addEventListener("click", (e) => {
  const b = e.target.closest("[data-recibi]");
  if (b) abrirRecibi(b.dataset.recibi);
});

function abrirRecibi(quien) {
  RECIBI_DE = quien;
  const d = deudaDe(quien);
  $("recibiTitulo").textContent = "Recibí de " + nombreDeVendedor(quien);
  $("recibiSubtitulo").textContent = d.debe > 0
    ? "Te debe " + dinero(d.debe) + " de " + dinero(d.dela) + " que le toca entregar."
    : "Está al día: ya entregó los " + dinero(d.dela) + " que le tocaban.";
  $("recibiMonto").value = d.debe > 0 ? d.debe : "";
  $("recibiFecha").value = hoyISO();
  $("recibiQuien").value = QUIEN_VENDE === "nicolas" ? "nicolas" : "felipe";
  $("recibiNota").value = "";
  pintarEntregas();
  limpiarAviso();
  focoRecibi = document.activeElement;
  $("modalRecibi").hidden = false;
  document.body.style.overflow = "hidden";
  $("recibiMonto").focus();
}

function pintarEntregas() {
  const suyas = LIQUIDACIONES.filter((x) => x.vendedor === RECIBI_DE)
    .sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));
  if (!suyas.length) { $("listaEntregas").innerHTML = ""; return; }
  $("listaEntregas").innerHTML = "<p class='cejilla sobre-tabla'>Lo que ya entregó</p>" +
    "<table><tbody>" + suyas.map((x) =>
      "<tr><td class='piezas'>" + escHtml(x.fecha || "") + "</td>" +
      "<td class='negocio'>" + dinero(x.monto) +
      (x.nota ? "<div class='fila-num'>" + escHtml(x.nota) + "</div>" : "") + "</td>" +
      "<td class='piezas'>" + escHtml(SOCIO_NOMBRE[x.recibio] || x.recibio || "") + "</td>" +
      "<td><div class='acciones'><button type='button' class='accion-apagar' " +
      "data-borrar-entrega='" + escHtml(x.id) + "'>Borrar</button></div></td></tr>").join("") +
    "</tbody></table>";
}

$("listaEntregas").addEventListener("click", async (e) => {
  const b = e.target.closest("[data-borrar-entrega]");
  if (!b) return;
  const id = b.dataset.borrarEntrega;
  if (CONFIRMANDO !== "entrega" + id) { pedirConfirmacion(b, "entrega" + id); return; }
  olvidarConfirmacion();
  b.disabled = true;
  try {
    await llamar("liquidacion-borrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });
    LIQUIDACIONES = LIQUIDACIONES.filter((x) => x.id !== id);
    pintarEntregas();
    abrirRecibi(RECIBI_DE);
    repintarTodo();
  } catch (err) {
    avisar("avisoRecibi", err.message, false);
    b.disabled = false;
  }
});

function cerrarRecibi() {
  if ($("modalRecibi").hidden) return;
  $("modalRecibi").hidden = true;
  document.body.style.overflow = "";
  if (focoRecibi && focoRecibi.focus) focoRecibi.focus();
  focoRecibi = null;
}

$("cerrarRecibi").onclick = cerrarRecibi;
$("cancelarRecibi").onclick = cerrarRecibi;
$("modalRecibi").addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-cerrar-recibi")) cerrarRecibi();
});

$("formRecibi").onsubmit = async (e) => {
  e.preventDefault();
  const boton = $("guardarRecibi");
  boton.disabled = true;
  try {
    const r = await llamar("liquidacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendedor: RECIBI_DE,
        monto: Number($("recibiMonto").value),
        fecha: $("recibiFecha").value,
        recibio: $("recibiQuien").value,
        nota: $("recibiNota").value,
      }),
    });
    LIQUIDACIONES.push(r);
    cerrarRecibi();
    repintarTodo();
    avisar("avisoPanel", "Entrega de " + nombreDeVendedor(RECIBI_DE) + " apuntada · " +
      dinero(r.monto), true);
  } catch (err) {
    avisar("avisoRecibi", err.message, false);
  } finally {
    boton.disabled = false;
  }
};

/* ---------- los vendedores ---------- */

let EDITANDO_USUARIO = "";
let JEFE_USUARIO = "felipe";

$("usuarioJefe").addEventListener("click", (e) => {
  const b = e.target.closest("[data-valor]");
  if (!b) return;
  JEFE_USUARIO = b.dataset.valor;
  marcarSegmento("usuarioJefe", JEFE_USUARIO);
});
let focoUsuarios = null;

async function cargarUsuarios() {
  try {
    const r = await llamar("usuarios");
    USUARIOS = r.usuarios || [];
    pintarListaUsuarios();
    repintarTodo();
  } catch (e) {
    // sin gente todavía no es un error que valga la pena gritar
  }
}

function pintarListaUsuarios() {
  const busca = sinTildes($("buscarUsuario").value);
  const gente = USUARIOS.filter((u) => !busca ||
    sinTildes(u.nombre).includes(busca) || sinTildes(u.usuario).includes(busca));

  // el buscador solo aparece cuando hay bastantes: con tres, estorba
  $("buscarUsuario").hidden = USUARIOS.length < 7;

  const caja = $("listaUsuarios");
  if (!gente.length) {
    caja.innerHTML = "<div class='gente'><div class='nadie'>" +
      (USUARIOS.length ? "Nadie con ese nombre." :
        "Todavía no hay nadie. Empieza por el botón de arriba.") + "</div></div>";
    return;
  }

  caja.innerHTML = "<div class='gente'>" + gente.map((u) =>
    "<button type='button' data-usuario='" + escHtml(u.usuario) + "'" +
    (u.activo ? "" : " class='apagado'") + ">" +
    "<span class='quien-es'><b>" + escHtml(u.nombre) + "</b>" +
    "<span>@" + escHtml(u.usuario) + " · firma " +
    escHtml(SOCIO_NOMBRE[u.jefe] || "Felipe") +
    (u.activo ? "" : " · apagado") + "</span></span>" +
    "<i class='pct-ficha'>" + u.pct + "%</i><i class='flecha'>›</i>" +
    "</button>").join("") + "</div>";
}

$("buscarUsuario").addEventListener("input", pintarListaUsuarios);

// La lista y la ficha no caben juntas, así que se turnan.
function verLista() {
  EDITANDO_USUARIO = "";
  $("panelLista").hidden = false;
  $("formUsuario").hidden = true;
  $("usuariosKicker").textContent = "Equipo";
  $("usuariosTitulo").textContent = "Vendedores";
  $("usuariosSubtitulo").textContent =
    "Cada uno entra con su usuario y solo ve sus propias órdenes.";
  pintarListaUsuarios();
}

function verFicha(u) {
  $("panelLista").hidden = true;
  $("formUsuario").hidden = false;
  $("usuariosKicker").textContent = u ? "Vendedor" : "Nuevo";
  $("usuariosTitulo").textContent = u ? u.nombre : "Nuevo vendedor";
  $("usuariosSubtitulo").textContent = u
    ? "@" + u.usuario + " · entró el " + String(u.creado || "").slice(0, 10)
    : "Entra con su usuario y solo ve sus propias órdenes.";
  ponerUsuarioEnForm(u);
}

$("volverALista").onclick = verLista;
$("cancelarUsuario").onclick = verLista;

$("listaUsuarios").addEventListener("click", (e) => {
  const b = e.target.closest("[data-usuario]");
  if (!b) return;
  const u = USUARIOS.filter((x) => x.usuario === b.dataset.usuario)[0];
  if (u) verFicha(u);
});

function ponerUsuarioEnForm(u) {
  EDITANDO_USUARIO = u ? u.usuario : "";
  $("usuarioNombre").value = u ? u.nombre : "";
  $("usuarioCedula").value = u ? u.cedula || "" : "";
  $("usuarioTelefono").value = u ? u.telefono || "" : "";
  $("usuarioNombreCuenta").value = u ? u.usuario : "";
  $("usuarioNombreCuenta").disabled = Boolean(u);
  $("usuarioClave").value = "";
  $("usuarioClave").type = "password";
  $("verClave").textContent = "ver";
  JEFE_USUARIO = u && u.jefe === "nicolas" ? "nicolas" : "felipe";
  marcarSegmento("usuarioJefe", JEFE_USUARIO);
  $("usuarioPct").value = u ? u.pct : 50;
  $("usuarioActivo").checked = u ? Boolean(u.activo) : true;
  $("ayudaClave").textContent = u
    ? "Déjala vacía para no cambiarla. Si la escribes, la de antes deja de servir."
    : "Se la dictas a él. Mínimo 8 caracteres.";
  $("guardarUsuario").textContent = u ? "Guardar cambios" : "Crear vendedor";
  pintarEjemploPct();
}

// El porcentaje en plata, que es como se entiende: un acrílico de la lista.
function pintarEjemploPct() {
  const pct = Math.max(0, Math.min(100, Number($("usuarioPct").value) || 0));
  const suyo = Math.round(PRECIOS.acrilico * pct / 100);
  const casa = PRECIOS.acrilico - suyo;
  $("pctEjemplo").textContent = "de un acrílico de " + dinero(PRECIOS.acrilico) +
    ": él " + dinero(suyo) + ", la casa " + dinero(casa);
}

$("verClave").onclick = () => {
  const c = $("usuarioClave");
  const tapada = c.type === "password";
  c.type = tapada ? "text" : "password";
  $("verClave").textContent = tapada ? "tapar" : "ver";
};

$("usuarioPct").addEventListener("input", pintarEjemploPct);
$("usuarioNuevo").onclick = () => { verFicha(null); $("usuarioNombre").focus(); };

function abrirUsuarios() {
  $("buscarUsuario").value = "";
  // se abre en la lista: lo normal es venir a mirar o a tocar a alguien que ya
  // está, no a crear uno nuevo
  verLista();
  limpiarAviso();
  focoUsuarios = document.activeElement;
  $("modalUsuarios").hidden = false;
  document.body.style.overflow = "hidden";
  $(USUARIOS.length ? "buscarUsuario" : "usuarioNuevo").focus();
}

function cerrarUsuarios() {
  if ($("modalUsuarios").hidden) return;
  $("modalUsuarios").hidden = true;
  document.body.style.overflow = "";
  if (focoUsuarios && focoUsuarios.focus) focoUsuarios.focus();
  focoUsuarios = null;
}

$("abrirUsuarios").onclick = abrirUsuarios;
$("cerrarUsuarios").onclick = cerrarUsuarios;
$("modalUsuarios").addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-cerrar-usuarios")) cerrarUsuarios();
});

$("formUsuario").onsubmit = async (e) => {
  e.preventDefault();
  const boton = $("guardarUsuario");
  const etiqueta = boton.textContent;
  boton.disabled = true;
  try {
    const r = await llamar("usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: EDITANDO_USUARIO || $("usuarioNombreCuenta").value,
        nombre: $("usuarioNombre").value,
        cedula: $("usuarioCedula").value,
        telefono: $("usuarioTelefono").value,
        pct: Number($("usuarioPct").value),
        jefe: JEFE_USUARIO,
        activo: $("usuarioActivo").checked,
        clave: $("usuarioClave").value,
      }),
    });
    const nuevo = !EDITANDO_USUARIO;
    await cargarUsuarios();
    verLista();
    avisar("avisoPanel", (nuevo ? "Vendedor " : "Datos de ") + r.usuario.nombre +
      (nuevo ? " creado" : " guardados"), true);
  } catch (err) {
    avisar("avisoUsuarios", err.message, false);
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
  BORRADOR_VENDEDORES = {};
  QUIENES_VENDEN.forEach((k) => {
    BORRADOR_VENDEDORES[k] = Object.assign({}, VENDEDORES[k]);
  });
  SOCIO_AJUSTES = QUIENES_VENDEN.indexOf(socio) >= 0 ? socio : "felipe";
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
  const pendientes = QUIENES_VENDEN.filter((k) => {
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
    avisar("avisoPanel", pendientes.length > 1
      ? "Datos de " + pendientes.map((k) => SOCIO_NOMBRE[k]).join(" y ") + " guardados"
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
    ? [l.acrilico ? plural(l.acrilico, "acrílico", "acrílicos") : "",
       l.sticker ? plural(l.sticker, "sticker", "stickers") : ""].filter(Boolean).join(" y ")
    : "sin tarjetas") + (l.ficha ? " · sitio en Google Maps" : "");
  $("ventaFecha").value = l.fecha || hoyISO();
  const unitario = (tipo) => {
    const t = TARJETAS.filter((x) => x.negocio === l.negocio && tipoDe(x) === tipo && x.precio)[0];
    return t ? t.precio : "";
  };
  // si la orden ya se cobró se respeta lo que se cobró; si no, la lista de precios
  $("precioAcrilico").value = unitario("acrilico") || (l.acrilico ? PRECIOS.acrilico : "");
  $("precioSticker").value = unitario("sticker") || (l.sticker ? precioSticker(l.sticker) : "");
  pintarChips();
  // El cobro pregunta por lo que la orden lleva y por nada más: un campo de
  // ficha en una orden sin ficha es una invitación a cobrarla por error.
  $("bloqueAcrilico").hidden = !l.acrilico;
  $("bloqueSticker").hidden = !l.sticker;
  $("bloquePiezas").hidden = !l.piezas;
  $("bloquePiezas").classList.toggle("solo-uno",
    Boolean(l.acrilico) !== Boolean(l.sticker));
  // los regalados son los vinilos cobrados a cero; si no se ha cobrado, ninguno
  const regalados = TARJETAS.filter((x) => x.negocio === l.negocio && tipoDe(x) === "sticker" &&
    x.vendida && !Number(x.precio)).length;
  $("ventaGratis").value = regalados;
  $("ventaGratis").max = l.sticker;
  $("rotuloGratis").hidden = !l.sticker;
  $("ventaGratis").hidden = !l.sticker;
  $("precioFicha").value = l.ficha && l.ficha.precio ? l.ficha.precio
    : (l.ficha ? PRECIOS.ficha : "");
  $("bloqueFicha").hidden = !l.ficha;
  const comp = COMPRADORES[l.negocio] || {};
  $("ventaCorreo").value = comp.correo || "";
  $("ventaNit").value = comp.nit || "";
  $("ventaTelefono").value = comp.telefono || "";
  const conPago = TARJETAS.filter((x) => x.negocio === l.negocio && x.vendida && x.pago)[0];
  COMO_PAGO = conPago ? conPago.pago : "efectivo";
  marcarSegmento("comoPago", COMO_PAGO);
  pintarBotonVenta();
  pintarBloqueoVenta(l.negocio);
  limpiarAviso("avisoVenta");
  pintarResumenVenta();
  focoVenta = document.activeElement;
  $("modalVenta").hidden = false;
  document.body.style.overflow = "hidden";
  $(l.acrilico ? "precioAcrilico" : (l.sticker ? "precioSticker" : "precioFicha")).focus();
}

// La lista de precios de la publicidad. El vinilo baja por cantidad, así que el
// tramo lo elige la propia orden: para eso ya sabe cuántos lleva.
// Lo que vale sin la promoción. Va tachado en el comprobante, para que el
// cliente vea lo que se ahorró.
const LISTA = { acrilico: 70000, sticker: 35000, ficha: 60000 };

const PRECIOS = {
  acrilico: 49900,
  ficha: 39900,
  // de mayor a menor: precioSticker se queda con el primer tramo que alcanza
  sticker: [
    { desde: 20, rotulo: "20+", precio: 14900 },
    { desde: 10, rotulo: "10-19", precio: 15900 },
    { desde: 5, rotulo: "5-9", precio: 16900 },
    { desde: 2, rotulo: "2-4", precio: 17900 },
    { desde: 1, rotulo: "1", precio: 18900 },
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
  ["precioAcrilico", "precioSticker", "precioFicha", "guardarVenta"]
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

// Un solo botón para todo, así que tiene que decir qué va a hacer antes de
// hacerlo: mandar el comprobante deja la orden cerrada y eso no se deshace sin
// borrarlo.
// Un socio no cobra comisión: lo suyo es la utilidad de lo que quede. Al reabrir
// un cobro ajeno se respeta el que ya tenía, que es el pacto de aquel día.
function pctDeLaVenta() {
  if (!SESION.dueno) return Number(SESION.pct) || 0;
  const l = LOCAL_VENTA;
  if (!l) return 0;
  const previa = TARJETAS.filter((t) => t.negocio === l.negocio && t.pct)[0];
  return previa && previa.vendedor === QUIEN_VENDE ? Number(previa.pct) || 0 : 0;
}

function pintarBotonVenta() {
  const l = LOCAL_VENTA;
  if (!l) return;
  const manda = Boolean($("ventaCorreo").value.trim()) && !cerrada(l.negocio);
  $("guardarVenta").textContent = l.vendidas
    ? (manda ? "Guardar y enviar" : "Guardar el cobro")
    : (manda ? "Aceptar y enviar" : "Aceptar la orden");
}

$("ventaCorreo").addEventListener("input", pintarBotonVenta);

function pintarResumenVenta() {
  if (!LOCAL_VENTA) return;
  const l = LOCAL_VENTA;
  const p = preciosDeLaVenta();
  const partes = [];
  if (l.acrilico) partes.push(l.acrilico + " × " + dinero(p.acrilico));
  if (l.sticker - p.gratis > 0) partes.push((l.sticker - p.gratis) + " × " + dinero(p.sticker));
  if (p.gratis) partes.push(p.gratis + " de regalo");
  if (p.ficha) partes.push("sitio " + dinero(p.ficha));
  const total = p.acrilico * l.acrilico + p.sticker * (l.sticker - p.gratis) + p.ficha;
  $("ventaResumen").textContent = (partes.join("   +   ") || "sin nada que cobrar") +
    "   =   " + dinero(total);
}

// cada uno usa su propio teléfono, así que el panel recuerda quién es
$("comoPago").addEventListener("click", (e) => {
  const b = e.target.closest("[data-valor]");
  if (!b) return;
  COMO_PAGO = b.dataset.valor;
  marcarSegmento("comoPago", COMO_PAGO);
});

$("quienVende").addEventListener("click", (e) => {
  const b = e.target.closest("[data-valor]");
  if (!b) return;
  QUIEN_VENDE = b.dataset.valor;
  marcarSegmento("quienVende", QUIEN_VENDE);
  try { localStorage.setItem("quienVende", QUIEN_VENDE); } catch (err) {}
});

try {
  const guardado = localStorage.getItem("quienVende");
  if (QUIENES_VENDEN.indexOf(guardado) >= 0) QUIEN_VENDE = guardado;
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
  // la pone abrirVenta: hoy si es nueva, la suya si se está reabriendo un cobro
  const fecha = $("ventaFecha").value || hoyISO();
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
            pct: pctDeLaVenta(),
            pago: COMO_PAGO,
            jefe: quienFirma(),
            lat: l.lat,
            lng: l.lng,
          }),
        });
      }
    }
    // La ficha se cobra en la misma pasada: es la misma venta. Vaciar el campo no
    // la borra —para eso está Quitar en su ventana—, solo la deja como estaba.
    let fichaNueva = null;
    if (precios.ficha) {
      boton.textContent = "Cobrando el sitio…";
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
        parchearTarjetas(g.codigos, { vendida: fecha, precio: g.precio,
          vendedor: QUIEN_VENDE, pct: pctDeLaVenta(), pago: COMO_PAGO,
          jefe: quienFirma() });
      }
    }
    if (fichaNueva) parchearServicio(fichaNueva.id, fichaNueva);
    await marcarVerde(l);
    avisar("avisoPanel", "Orden de " + l.negocio + " aceptada · " + dinero(importe), true);
    // Aceptar es cobrar: de aquí en adelante la orden no se toca. Con correo sale
    // el comprobante y eso mismo la cierra; sin correo se cierra igual, porque el
    // cliente pagó aunque no quisiera papel.
    //
    // Si falla —sin señal, Brevo caído— la venta ya está guardada y el error queda
    // a la vista: el mismo botón vuelve a intentarlo.
    if (!cerrada(l.negocio)) {
      const fue = correoCliente
        ? await enviarComprobante(boton)
        : await cerrarSinComprobante();
      if (!fue) return;
    }
    cerrarVenta();
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
    "<div class='qr-art' title='Toca para copiar la imagen'>" +
    "<img src='" + src + "' alt='QR de la tarjeta, " + etiqueta + "'></div>" +
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
  if (e.target.hasAttribute("data-cerrar")) { cerrarQR(); return; }

  // Un toque encima copia la imagen, que es lo que se hacía con clic derecho y
  // "copiar imagen". El ClipboardItem lleva la promesa dentro a propósito: si se
  // espera al blob antes de llamar, Safari ya no lo cuenta como gesto del dedo.
  const arte = e.target.closest(".qr-art");
  if (!arte) return;
  const img = arte.querySelector("img");
  if (!img) return;

  if (!navigator.clipboard || !window.ClipboardItem) {
    avisar("avisoPanel", "Este navegador no deja copiar imágenes. Usa Descargar.", false);
    return;
  }
  navigator.clipboard.write([
    new window.ClipboardItem({ "image/png": fetch(img.src).then((r) => r.blob()) }),
  ]).then(() => {
    avisar("avisoPanel", "QR copiado. Ya lo puedes pegar.", true);
  }).catch((err) => {
    // los mensajes del navegador vienen en inglés y de poca ayuda
    const dice = String(err && err.message || "");
    const claro = dice.indexOf("not focused") >= 0
      ? "Toca la ventana y vuelve a intentarlo."
      : (err && err.name === "NotAllowedError"
        ? "El navegador no dejó copiar. Usa Descargar."
        : dice);
    avisar("avisoPanel", "No se pudo copiar. " + claro, false);
  });
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!$("modalNFC").hidden) cerrarNFC();
  else if (!$("modalActivar").hidden) cerrarActivar();
  else if (!$("modalGasto").hidden) cerrarGasto();
  else if (!$("modalAjustes").hidden) cerrarAjustes();
  else if (!$("modalVenta").hidden) cerrarVenta();
  else if (!$("modalTarjeta").hidden) cerrarTarjeta();
  else cerrarQR();
});

llamar("sesion").then((s) => mostrar(s.activa, s.quien)).catch(() => mostrar(false));
`;

export function vistaAdmin(origen) {
  const host = origen.replace(/^https?:\/\//, "");
  return `<!doctype html>${CABEZA}
<meta name="robots" content="noindex,nofollow">
<meta name="description" content="Panel interno para activar y reasignar las tarjetas de reseña.">
<title>Panel de tarjetas</title><style>${ESTILOS}</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/4.2.1/jspdf.umd.min.js"></script>

<div class="grano"></div>
<div class="tostadas" id="tostadas" role="status" aria-live="polite"></div>

<div id="pantallaLogin" hidden>
  <main class="entrada">
    <div class="lamina franja entrada-caja">
      ${LOGO_G}
      <h1>Google Reviews</h1>
      <form id="formLogin">
        <label for="usuario">Usuario</label>
        <input id="usuario" type="text" autocomplete="username" autocapitalize="off"
               spellcheck="false">
        <label for="clave" class="sobre-buscador">Contraseña</label>
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
          <span class="marca-host">${esc(host)}<b id="marcaQuien" class="marca-quien"></b></span>
        </span>
      </div>
      <nav class="cabecera-acciones" aria-label="Acciones de la sesión">
        <button type="button" id="abrirLocal" title="Nueva orden">
          <svg class="icono-barra" viewBox="0 0 24 24" width="14" height="14" fill="none"
               stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14"/>
          </svg><span class="etiqueta">Nueva orden</span></button>
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
          <button type="button" class="activa" data-valor="locales">Órdenes</button>
          <button type="button" data-valor="cuentas">Cuentas</button>
          <button type="button" data-valor="tarjetas">Tarjetas</button>
          <button type="button" data-valor="inventario">Inventario</button>
          <button type="button" data-valor="mapa">Mapa</button>
          <button type="button" data-valor="mio">Lo mío</button>
        </div>
        <div class="cabecera-acciones">
          <button type="button" id="abrirActivar">Activar tarjetas</button>
          <button type="button" class="fantasma" id="abrirNFC">Grabar chips</button>
          <button type="button" class="fantasma" id="togglePruebas">Modo pruebas</button>
          <button type="button" class="fantasma" id="abrirAjustes" hidden>Mis datos</button>
          <button type="button" class="fantasma" id="abrirUsuarios" hidden>Vendedores</button>
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

        <div id="bloqueComisiones" hidden>
          <p class="cejilla sobre-tabla">Lo que vendieron los demás</p>
          <div id="tablaComisiones"></div>
        </div>
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
        <div class="filtro-dia">
          <div class="segmento" id="diaOrdenes" role="group" aria-label="De qué día">
            <button type="button" class="activa" data-valor="hoy">Hoy</button>
            <button type="button" data-valor="7">7 días</button>
            <button type="button" data-valor="todas">Todas</button>
          </div>
          <input type="date" id="fechaOrdenes" aria-label="Ver otro día">
        </div>
        <div id="tablaLocales"></div>
      </div>

      <div id="vistaMapa" hidden>
        <div class="mapa-barra">
          <button type="button" class="leer" id="marcarAqui">Marcar dónde estoy</button>
          <span class="mini2" id="mapaDicho">O toca el mapa donde quieras poner uno.</span>
        </div>
        <div id="mapa"></div>
        <div class="mapa-clave">
          <span><i class="bolita verde"></i>Compraron</span>
          <span><i class="bolita amarillo"></i>Hablando</span>
          <span><i class="bolita gris"></i>Ya se pasó por ahí</span>
        </div>
      </div>

      <div id="vistaMio" hidden>
        <div class="grafica" aria-label="Lo que llevas ganado">
          <p class="cejilla">Lo que llevas ganado</p>
          <div class="metrica" id="mioMetrica">—</div>
          <div class="grafica-pie" id="mioPie"></div>
        </div>
        <div id="tablaMio"></div>
      </div>
    </section>
  </main>
</div>

<div class="modal" id="modalTarjeta" hidden>
  <div class="modal-fondo" data-cerrar-tarjeta></div>
  <div class="modal-caja modal-tarjeta" role="dialog" aria-modal="true" aria-labelledby="tarjetaModalTitulo">
    <form id="formTarjeta">
      <div class="orden-alto">
        <h1 id="tarjetaModalTitulo">Activar una tarjeta</h1>
        <button type="submit" id="guardar">Activar tarjeta</button>
        <button type="button" class="modal-cerrar" id="cerrarTarjeta" aria-label="Cerrar">✕</button>
      </div>

      <div class="segmento" id="modoTarjeta" role="group" aria-label="Qué se va a editar">
        <button type="button" class="activa" data-valor="una">Una tarjeta</button>
        <button type="button" data-valor="local">Una orden</button>
        <button type="button" data-valor="rango">Un rango</button>
      </div>

      <div id="campoPiezas" hidden>
        <label class="paso"><span class="n n1">1</span>Qué piezas lleva</label>
        <div class="modal-acciones acciones-izq sin-aire">
          <button type="button" class="leer" id="escanear">Escanear una pieza</button>
          <button type="button" class="fantasma" id="vaciarPiezas" hidden>Vaciar la lista</button>
          <span class="mini2 escaneo" id="escaneoDicho"></span>
        </div>
        <div class="camara" id="camara" hidden>
          <video id="video" playsinline muted></video>
          <div class="camara-mira"></div>
          <button type="button" class="fantasma" id="cerrarCamara">Cerrar</button>
        </div>
        <div class="chips" id="piezasSueltas"></div>

        <div class="rango-resumen" id="localResumen">Escanea las piezas del montón, una tras otra.</div>

        <label class="casilla" id="filaLlevaFicha">
          <input type="checkbox" id="ordenLlevaFicha"> Crear sitio en Google Maps</label>
        <div id="detalleFicha" hidden>
          <p class="mini2 sin-aire">Su precio va con el de las piezas, al aceptar la orden.</p>
          <label class="casilla"><input type="checkbox" id="ordenFichaHecha">
            Ya está publicada</label>
          <label class="mini sobre-buscador" for="ordenFichaNotas">Notas del sitio</label>
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
      <input id="buscarLocal" type="search" placeholder="Busca un local ya registrado"
             autocomplete="off" aria-label="Buscar entre los locales registrados">
      <div class="sugerencias" id="sugerenciasLocal" hidden role="listbox"
           aria-label="Locales que coinciden"></div>
      <select id="localExistente" aria-label="Local ya registrado" hidden></select>
      <input id="maps" placeholder="Pega aquí el link de Google Maps" autocomplete="off" required>

      <div class="modal-acciones acciones-izq sin-aire">
        <button type="button" class="leer mini" id="analizar">Leer la URL</button>
        <a class="boton fantasma mini" id="enlaceMaps" target="_blank" rel="noopener"
           href="https://www.google.com/maps">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"
               stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>
          </svg>Buscar en Maps</a>
      </div>

      <div class="ficha" id="ficha" hidden>
        <b id="fichaNombre"></b>
        <div class="meta" id="fichaMeta"></div>
        <input id="fichaReview" type="hidden">
      </div>

      <label class="paso" for="negocio"><span class="n n3">3</span>Nombre del negocio</label>
      <input class="c3" id="negocio" placeholder="Mercacentro Av. Guabinal" autocomplete="off" required>

      <div id="campoCuantas" hidden>
        <label class="paso" for="codigoPieza"><span class="n n4">4</span>O añádela por código</label>
        <div class="modal-acciones acciones-izq sin-aire">
          <input class="c1 pieza-codigo" id="codigoPieza" list="piezasLibres" maxlength="12"
                 placeholder="AAFZ" autocomplete="off" aria-label="Código de la pieza">
          <button type="button" class="leer" id="agregarPieza">Añadir</button>
          <span class="mini2 escaneo" id="codigoDicho"></span>
        </div>
        <datalist id="piezasLibres"></datalist>
      </div>

      <div id="bloqueTipo">
        <label class="paso"><span class="n n4">4</span>Tipo de tarjeta</label>
        <div class="segmento" id="tipoTarjeta" role="group" aria-label="Tipo de tarjeta">
          <button type="button" class="activa" data-valor="acrilico">Acrílico</button>
          <button type="button" data-valor="sticker">Sticker</button>
        </div>
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

<div class="modal" id="modalNFC" hidden>
  <div class="modal-fondo" data-cerrar-nfc></div>
  <div class="modal-caja franja" role="dialog" aria-modal="true" aria-labelledby="nfcTitulo">
    <button type="button" class="modal-cerrar" id="cerrarNFCModal" aria-label="Cerrar">✕</button>
    <div class="modal-kicker">Chips</div>
    <h1 id="nfcTitulo">Grabar chips</h1>
    <p class="modal-subtitulo">Escanea el QR de la pieza y el chip se graba con ese mismo link.</p>

    <div class="segmento" id="tipoNFC" role="group" aria-label="Con qué estás trabajando">
      <button type="button" class="activa" data-valor="acrilico">Acrílicos</button>
      <button type="button" data-valor="sticker">Stickers</button>
    </div>

    <ol class="pasos-nfc">
      <li class="paso-nfc" id="pasoQR">
        <div class="paso-nfc-alto">
          <span class="n n1">1</span><b>Escanea el QR</b>
          <button type="button" class="leer" id="escanearNFC">Escanear</button>
        </div>
        <div class="paso-nfc-dice" id="diceQR">La pieza que vas a grabar.</div>
        <div class="camara" id="camaraNFC" hidden>
          <video id="videoNFC" playsinline muted></video>
          <div class="camara-mira"></div>
          <button type="button" class="fantasma" id="cerrarCamaraNFC">Cerrar</button>
        </div>
      </li>

      <li class="paso-nfc" id="pasoGrabar">
        <div class="paso-nfc-alto">
          <span class="n n2">2</span><b>Graba el chip</b>
          <button type="button" class="leer" id="grabarNFC" disabled>Grabar</button>
        </div>
        <div class="paso-nfc-dice" id="diceGrabar">Acerca el chip por detrás del teléfono.</div>
      </li>

      <li class="paso-nfc" id="pasoLeer">
        <div class="paso-nfc-alto">
          <span class="n n3">3</span><b>Revisa que quedó</b>
          <button type="button" class="leer" id="leerNFC" disabled>Leer</button>
        </div>
        <div class="paso-nfc-dice" id="diceLeer">Vuelve a acercarlo y comprueba el link.</div>
      </li>

      <li class="paso-nfc" id="pasoSellar">
        <div class="paso-nfc-alto">
          <span class="n n4">4</span><b>Séllalo</b>
          <button type="button" class="alerta" id="sellarNFC" disabled>Bloquear</button>
        </div>
        <div class="paso-nfc-dice" id="diceSellar">No tiene vuelta atrás: nadie podrá reescribirlo.</div>
      </li>
    </ol>

    <div class="modal-acciones">
      <button type="button" class="fantasma" id="saltarSello" hidden>Sin sellar, siguiente</button>
      <button type="button" id="siguienteNFC" disabled>Siguiente pieza</button>
    </div>
  </div>
</div>

<div class="modal" id="modalCancelar" hidden>
  <div class="modal-fondo" data-cerrar-cancelar></div>
  <div class="modal-caja franja" role="dialog" aria-modal="true" aria-labelledby="cancelarTitulo">
    <button type="button" class="modal-cerrar" id="cerrarCancelar" aria-label="Cerrar">✕</button>
    <div class="modal-kicker">Orden</div>
    <h1 id="cancelarTitulo">Cancelar la orden</h1>
    <p class="modal-subtitulo" id="cancelarSubtitulo"></p>

    <p class="mini2 sin-aire">¿Qué pasó con el local?</p>
    <div class="salidas">
      <button type="button" data-salida="amarillo">
        <b>Quedó en stand by</b>
        <span>Puede que llamen. Queda amarillo en tu mapa y las piezas vuelven a estar
          libres para otro.</span>
      </button>
      <button type="button" data-salida="gris">
        <b>No les interesó</b>
        <span>Queda gris en el mapa, para que nadie del equipo vuelva a pasar por ahí.</span>
      </button>
      <button type="button" data-salida="nada">
        <b>Fue un error</b>
        <span id="errorSalida">Se borra la orden y no queda nada en el mapa.</span>
      </button>
    </div>
  </div>
</div>

<div class="modal" id="modalPunto" hidden>
  <div class="modal-fondo" data-cerrar-punto></div>
  <div class="modal-caja franja" role="dialog" aria-modal="true" aria-labelledby="puntoTitulo">
    <button type="button" class="modal-cerrar" id="cerrarPunto" aria-label="Cerrar">✕</button>
    <div class="modal-kicker" id="puntoKicker">Visita</div>
    <h1 id="puntoTitulo">Marcar un local</h1>
    <p class="modal-subtitulo" id="puntoSubtitulo"></p>

    <form id="formPunto">
      <label class="mini" for="puntoNombre">Qué local es</label>
      <input id="puntoNombre" type="text" maxlength="80" autocomplete="off" required>

      <p class="mini2 sobre-buscador">Cómo quedó</p>
      <div class="segmento" id="estadoPunto" role="group" aria-label="Cómo quedó la visita">
        <button type="button" data-valor="gris">Nada</button>
        <button type="button" data-valor="amarillo">Hablando</button>
        <button type="button" data-valor="verde">Compraron</button>
      </div>
      <p class="ayuda" id="ayudaEstado"></p>

      <label class="mini" for="puntoNota">Qué pasó <span class="suave">(opcional)</span></label>
      <input id="puntoNota" type="text" maxlength="200" autocomplete="off"
             placeholder="pidió que volviera el jueves">

      <div class="modal-acciones">
        <button type="button" class="alerta" id="borrarPunto" hidden>Borrar</button>
        <button type="button" class="fantasma" id="cancelarPunto">Cancelar</button>
        <button type="submit" id="guardarPunto">Guardar</button>
      </div>
    </form>
  </div>
</div>

<div class="modal" id="modalRecibi" hidden>
  <div class="modal-fondo" data-cerrar-recibi></div>
  <div class="modal-caja franja" role="dialog" aria-modal="true" aria-labelledby="recibiTitulo">
    <button type="button" class="modal-cerrar" id="cerrarRecibi" aria-label="Cerrar">✕</button>
    <div class="modal-kicker">Entrega</div>
    <h1 id="recibiTitulo">Recibí de…</h1>
    <p class="modal-subtitulo" id="recibiSubtitulo"></p>

    <form id="formRecibi">
      <label class="mini" for="recibiMonto">Cuánto entregó</label>
      <input class="c3" id="recibiMonto" type="number" min="1" step="1" required>

      <div class="rango-fila">
        <div><label class="mini" for="recibiFecha">Cuándo</label>
          <input id="recibiFecha" type="date"></div>
        <div><label class="mini" for="recibiQuien">Quién recibió</label>
          <select id="recibiQuien">
            <option value="felipe">Felipe</option>
            <option value="nicolas">Nicolás</option>
          </select></div>
      </div>

      <label class="mini sobre-buscador" for="recibiNota">Nota <span class="suave">(opcional)</span></label>
      <input id="recibiNota" type="text" maxlength="120" placeholder="en la reunión del lunes"
             autocomplete="off">

      <div id="listaEntregas"></div>

      <div class="modal-acciones">
        <button type="button" class="fantasma" id="cancelarRecibi">Cancelar</button>
        <button type="submit" id="guardarRecibi">Apuntar la entrega</button>
      </div>
    </form>
  </div>
</div>

<div class="modal" id="modalUsuarios" hidden>
  <div class="modal-fondo" data-cerrar-usuarios></div>
  <div class="modal-caja franja" role="dialog" aria-modal="true" aria-labelledby="usuariosTitulo">
    <button type="button" class="modal-cerrar" id="cerrarUsuarios" aria-label="Cerrar">✕</button>
    <div class="modal-kicker" id="usuariosKicker">Equipo</div>
    <h1 id="usuariosTitulo">Vendedores</h1>
    <p class="modal-subtitulo" id="usuariosSubtitulo">Cada uno entra con su usuario y
      solo ve sus propias órdenes.</p>

    <div id="panelLista">
      <div class="modal-acciones acciones-izq sin-aire">
        <input id="buscarUsuario" type="search" class="busca-gente"
               placeholder="Buscar" autocomplete="off" aria-label="Buscar un vendedor">
        <button type="button" class="leer" id="usuarioNuevo">Nuevo vendedor</button>
      </div>
      <div id="listaUsuarios"></div>
    </div>

    <form id="formUsuario" hidden>
      <button type="button" class="volver" id="volverALista">← Todos los vendedores</button>
      <label class="paso" for="usuarioNombre"><span class="n n1">1</span>Quién es</label>
      <input id="usuarioNombre" type="text" maxlength="80"
             autocomplete="off" required>

      <div class="rango-fila">
        <div><label class="mini" for="usuarioCedula">Cédula
          <span class="suave">(opcional)</span></label>
          <input id="usuarioCedula" type="text" maxlength="30" placeholder="1110445566"
                 autocomplete="off"></div>
        <div><label class="mini" for="usuarioTelefono">Teléfono
          <span class="suave">(opcional)</span></label>
          <input id="usuarioTelefono" type="text" maxlength="30" placeholder="300 123 4567"
                 autocomplete="off"></div>
      </div>

      <label class="paso" for="usuarioNombreCuenta"><span class="n n2">2</span>Con qué entra</label>
      <div class="rango-fila">
        <div><label class="mini" for="usuarioNombreCuenta">Usuario</label>
          <input id="usuarioNombreCuenta" type="text" maxlength="20"
                 autocapitalize="off" spellcheck="false" autocomplete="off" required></div>
        <div><label class="mini" for="usuarioClave">Contraseña
            <button type="button" class="ver-clave" id="verClave">ver</button></label>
          <input id="usuarioClave" type="password" maxlength="60" placeholder="mínimo 8"
                 autocomplete="new-password" spellcheck="false"></div>
      </div>
      <p class="ayuda" id="ayudaClave">Se la dictas a él. Al editar, déjala vacía para
        no cambiarla.</p>

      <label class="paso"><span class="n n3">3</span>Quién firma sus comprobantes</label>
      <div class="segmento" id="usuarioJefe" role="group" aria-label="Su jefe">
        <button type="button" class="activa" data-valor="felipe">Felipe</button>
        <button type="button" data-valor="nicolas">Nicolás</button>
      </div>
      <p class="ayuda">El papel sale con su nombre y su cédula, y ese ingreso cuenta
        para él en el tope de renta.</p>

      <label class="paso" for="usuarioPct"><span class="n n4">4</span>Cuánto se queda</label>
      <div class="pct-fila">
        <input class="c3" id="usuarioPct" type="number" min="0" max="100" step="1" value="50"
               required>
        <span class="pct-signo">%</span>
        <span class="mini2" id="pctEjemplo"></span>
      </div>

      <label class="casilla"><input type="checkbox" id="usuarioActivo" checked>
        Puede entrar</label>

      <div class="modal-acciones">
        <button type="button" class="fantasma" id="cancelarUsuario">Cancelar</button>
        <button type="submit" id="guardarUsuario">Guardar</button>
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
        <button type="button" data-valor="alexander">Alexander</button>
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

    <div class="banner" id="bloqueoVenta" hidden role="status">
      <span id="bloqueoTexto"></span>
      <button type="button" class="fantasma" id="borrarComprobante">Borrar comprobante</button>
    </div>

    <form id="formVenta">
      <p class="mini2 sin-aire">Cómo pagó</p>
      <div class="segmento" id="comoPago" role="group" aria-label="Cómo pagó el cliente">
        <button type="button" class="activa" data-valor="efectivo">Efectivo</button>
        <button type="button" data-valor="transferencia">Transferencia</button>
        <button type="button" data-valor="otro">Otro</button>
      </div>

      <div id="filaQuienVende">
        <p class="mini2 sin-aire">Quién hizo la venta</p>
        <div class="segmento" id="quienVende" role="group" aria-label="Quién hizo la venta">
          <button type="button" class="activa" data-valor="felipe">Felipe</button>
          <button type="button" data-valor="nicolas">Nicolás</button>
        </div>
      </div>

      <input id="ventaFecha" type="hidden">

      <div class="rango-fila" id="bloquePiezas">
        <div id="bloqueAcrilico"><label class="mini" for="precioAcrilico">Precio por acrílico</label>
          <input id="precioAcrilico" type="number" min="0" step="1" placeholder="0" autocomplete="off">
          <div class="chips" id="chipsAcrilico"></div></div>
        <div id="bloqueSticker"><label class="mini" for="precioSticker">Precio por sticker</label>
          <input id="precioSticker" type="number" min="0" step="1" placeholder="0" autocomplete="off">
          <div class="chips" id="chipsSticker"></div></div>
      </div>

      <label class="mini" for="ventaGratis" id="rotuloGratis">Vinilos de regalo
        <span class="suave">(los que sacó en la ruleta)</span></label>
      <input id="ventaGratis" type="number" min="0" step="1" value="0" autocomplete="off">

      <div id="bloqueFicha">
        <label class="mini" for="precioFicha">Crear sitio en Google Maps</label>
        <input id="precioFicha" type="number" min="0" step="1" placeholder="0" autocomplete="off">
        <div class="chips" id="chipsFicha"></div>
      </div>
      <div class="rango-resumen" id="ventaResumen"></div>

      <label class="mini" for="ventaCorreo">Correo del cliente
        <span class="suave">(si lo pones, le llega el comprobante)</span></label>
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
