/**
 * El mismo QR que saca el panel, pero servido como PNG desde el Worker.
 *
 * Existe porque Canva —y cualquier otra herramienta de maquetación— necesita una
 * URL por imagen para rellenar plantillas en lote. Sin esto habría que exportar
 * las cuatrocientas a mano desde el navegador y arrastrarlas una por una.
 *
 * Es la variante "negro con hueco": módulos negros, fondo transparente y un
 * círculo vaciado en el centro. Corrección H, que es lo que aguanta perder ese
 * trozo del código.
 */

import qrcode from "qrcode-generator";

const ALFANUM = /^[0-9A-Z $%*+\-./:]+$/;
const HUECO = 0.34;
const CELDA = 10;
const QUIETO = 4;

/* ---------- PNG a mano ---------- */

// Un PNG son cuatro trozos con su CRC y los píxeles comprimidos en zlib. El
// Worker no tiene canvas, pero sí CompressionStream, que es la única parte
// difícil de escribir a mano.
const TABLA_CRC = (() => {
  const tabla = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    tabla[n] = c >>> 0;
  }
  return tabla;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = TABLA_CRC[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function trozo(tipo, datos) {
  const salida = new Uint8Array(12 + datos.length);
  const vista = new DataView(salida.buffer);
  vista.setUint32(0, datos.length);
  for (let i = 0; i < 4; i++) salida[4 + i] = tipo.charCodeAt(i);
  salida.set(datos, 8);
  vista.setUint32(8 + datos.length, crc32(salida.subarray(4, 8 + datos.length)));
  return salida;
}

async function comprimir(bytes) {
  const flujo = new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate"));
  return new Uint8Array(await new Response(flujo).arrayBuffer());
}

async function armarPNG(lado, rgba) {
  // cada fila lleva delante su byte de filtro, aquí siempre 0 (sin filtrar)
  const ancho = lado * 4 + 1;
  const crudo = new Uint8Array(ancho * lado);
  for (let y = 0; y < lado; y++) {
    crudo.set(rgba.subarray(y * lado * 4, (y + 1) * lado * 4), y * ancho + 1);
  }

  const cabecera = new Uint8Array(13);
  const vista = new DataView(cabecera.buffer);
  vista.setUint32(0, lado);
  vista.setUint32(4, lado);
  cabecera[8] = 8;   // 8 bits por canal
  cabecera[9] = 6;   // RGBA, que es lo que da la transparencia

  const partes = [
    new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
    trozo("IHDR", cabecera),
    trozo("IDAT", await comprimir(crudo)),
    trozo("IEND", new Uint8Array(0)),
  ];

  const total = partes.reduce((a, p) => a + p.length, 0);
  const png = new Uint8Array(total);
  let i = 0;
  for (const p of partes) { png.set(p, i); i += p.length; }
  return png;
}

/* ---------- el QR ---------- */

export async function qrNegroConHueco(texto) {
  const codigo = qrcode(0, "H");
  codigo.addData(texto, ALFANUM.test(texto) ? "Alphanumeric" : "Byte");
  codigo.make();

  const n = codigo.getModuleCount();
  const lado = (n + QUIETO * 2) * CELDA;
  const rgba = new Uint8Array(lado * lado * 4);   // nace entero transparente

  // solo se pintan los módulos oscuros; el resto se queda en alfa cero
  for (let fila = 0; fila < n; fila++) {
    for (let col = 0; col < n; col++) {
      if (!codigo.isDark(fila, col)) continue;
      const x0 = (col + QUIETO) * CELDA;
      const y0 = (fila + QUIETO) * CELDA;
      for (let y = y0; y < y0 + CELDA; y++) {
        for (let x = x0; x < x0 + CELDA; x++) {
          rgba[(y * lado + x) * 4 + 3] = 255;   // negro: el RGB ya está en cero
        }
      }
    }
  }

  // el hueco se borra al final, igual que el destination-out del panel: así el
  // borde del círculo corta los módulos en limpio
  const centro = lado / 2;
  const radio = (n * CELDA * HUECO) / 2;
  const radio2 = radio * radio;
  const desde = Math.max(0, Math.floor(centro - radio));
  const hasta = Math.min(lado, Math.ceil(centro + radio));
  for (let y = desde; y < hasta; y++) {
    for (let x = desde; x < hasta; x++) {
      const dx = x + 0.5 - centro;
      const dy = y + 0.5 - centro;
      if (dx * dx + dy * dy <= radio2) rgba[(y * lado + x) * 4 + 3] = 0;
    }
  }

  return { png: await armarPNG(lado, rgba), lado: lado, modulos: n };
}
