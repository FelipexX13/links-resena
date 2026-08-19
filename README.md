# Generador de links de reseña · Google Maps

Herramienta de un solo archivo. Pegas la URL de Google Maps de un negocio y devuelve el link que abre directo el cuadro de calificación, más un QR para imprimir.

## Uso

Abre `index.html` en cualquier navegador, o publícalo con GitHub Pages.

## Cómo funciona

Extrae el identificador del lugar (`!1s0xAAAA:0xBBBB`) desde la URL de Maps y arma:

- **Link de reseña:** `https://www.google.com/maps/place//data=!4m3!3m2!1s{ID}!12e1`
- **Ficha del negocio:** `https://maps.google.com/?cid={CID}` (el CID es la segunda mitad del ID convertida a decimal)

También acepta Place IDs tipo `ChIJ...` y genera el link oficial `search.google.com/local/writereview?placeid=`.

## Nota

Google ya no permite precargar las 5 estrellas en el enlace. El link deja al cliente en el cuadro de calificación con las estrellas vacías: toca la quinta y publica.

Los links cortos (`maps.app.goo.gl`) no traen el identificador — hay que abrirlos primero y copiar la URL larga.
