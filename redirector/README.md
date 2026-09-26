# Redireccionador de tarjetas de reseña

Worker de Cloudflare que convierte un código impreso en la tarjeta
(`https://r.grve.workers.dev/A7K2`) en el link de reseña de Google del negocio que la tiene.

El plástico se imprime una sola vez. El destino vive en Cloudflare KV y se cambia
cuando quieras, sin reimprimir nada.

| Ruta | Qué hace | Acceso |
|---|---|---|
| `/` | Página informativa | público |
| `/A7K2` | 307 al formulario de reseñas del negocio | público |
| `/admin` | Login y panel de tarjetas | público, pero sin datos hasta iniciar sesión |
| `/api/login`, `/api/salir`, `/api/sesion` | Manejo de la sesión | público |
| `/api/lista`, `/api/guardar`, `/api/rango`, `/api/desactivar` | Leer y modificar tarjetas | **requiere sesión** |

Los códigos son insensibles a mayúsculas: `/a7k2` y `/A7K2` llevan al mismo sitio.

---

## Desplegar con Wrangler

```bash
npx wrangler kv namespace create TARJETAS
```

Pega el `id` que devuelve en `wrangler.toml`, y luego:

```bash
npx wrangler secret put ADMIN_PASSWORD
```

```bash
npx wrangler deploy
```

Queda publicado en `https://r.grve.workers.dev`, sin dominio propio ni costo.

### Que la URL salga lo más corta posible

El Worker se llama `r` porque **su nombre es el subdominio**, y cada carácter de
más engorda el QR impreso. La otra mitad es el subdominio de la cuenta, ya fijado
en `grve`. Los dos se eligieron cortos a propósito, y no es cosmético:

Medido con la librería que usa el panel, corrección de errores M:

| URL de la tarjeta | Versión del QR | Módulo a 25 mm |
|---|---|---|
| `HTTPS://R.GRVE.WORKERS.DEV/A7K2` ← el nuestro | 25×25 | **0,76 mm** |
| el mismo en minúsculas (fuerza modo byte) | 29×29 | 0,68 mm |
| `HTTPS://R.MINEGOCIODEQR.WORKERS.DEV/A7K2` | 29×29 | 0,68 mm |

El subdominio de la cuenta **se elige una sola vez**: cambiarlo rompe todas las
tarjetas ya impresas, así que se queda como está.

De esas tres filas salen las dos reglas que el panel ya aplica solo:

- **La URL va en MAYÚSCULAS.** Eso permite usar el modo alfanumérico del estándar
  QR en vez del modo byte, y se ahorra una versión entera — la segunda fila de la
  tabla es exactamente ese costo. Al servidor le da igual: el host es insensible a
  mayúsculas y los códigos se normalizan.
- **Tiene que ser `https://`.** El TLD `.dev` está en la lista HSTS precargada de
  los navegadores, así que `http://` no es una opción para ahorrar un carácter.

Si algún día quieres pasarte a un dominio propio, agrégalo en
**Settings → Domains & Routes**. Ojo: las tarjetas ya impresas seguirán apuntando
a `workers.dev`, así que ese Worker no se puede apagar nunca.

### Probarlo en local

Crea un archivo `.dev.vars` (ya está en `.gitignore`, nunca se sube) con:

```
ADMIN_PASSWORD=lo-que-quieras-para-probar
```

```bash
npx wrangler dev
```

Queda en `http://localhost:8787` con un KV simulado, sin tocar el de producción.

### Alternativa sin instalar nada

En **Workers & Pages → Create → Worker**, pega el contenido de
[`src/index.js`](src/index.js) en **Edit code**. Después, en el mismo panel:
crea el namespace KV en **Storage & Databases → KV**, enlázalo en
**Settings → Bindings** con el nombre de variable `TARJETAS`, y agrega
`ADMIN_PASSWORD` en **Settings → Variables and Secrets** como tipo **Secret**.

---

## Las cuatro pestañas del panel

**Órdenes** lista lo vendido; **Cuentas**, el dinero entre los dos; **Tarjetas**,
el plástico; **Inventario**, lo que hay para imprimir.

En ese orden y no en otro: el panel abre en Órdenes, que es donde está el trabajo
del día. Tarjetas se mira cuando hace falta buscar una pieza, no todas las
mañanas.

Cada una trae su botón en la barra de mandos y solo el suyo: *Editar un rango* en
las dos primeras, *Mis datos* en Cuentas y *Activar tarjetas* en Inventario,
porque crear registros vacíos es reponer plástico, no gestionar una lista.

## Cuentas: gastos, reparto e inventario

Tercera vista del panel, junto a Tarjetas y Órdenes. Sale de dos fuentes que ya
existían más una nueva:

- **Ingresos** — de las tarjetas vendidas, como la gráfica de Órdenes.
- **Gastos** — registros nuevos con clave `g:<id>` en KV.
- **Inventario** — no se lleva aparte: es la suma de lo que trajo cada compra.
  Lo recibido y lo que viene en camino van separados, y las piezas dañadas se
  descuentan de lo útil.

### El reparto entre socios

El negocio es de dos, así que cada gasto lleva **quién puso la plata**: Felipe,
Nicolás o compartido a medias. De ahí salen tres números por socio — lo que ha
puesto, lo que le tocaría poner (la mitad del total) y lo que gana o pierde — y
una línea de saldo que dice quién le debe a quién para quedar iguales.

Un gasto compartido cuenta mitad para cada uno, así que con todo compartido el
saldo queda en cero y la línea dice que están en paz.

### Lo que queda, no lo que se compró

La tabla descuenta lo vendido: **útiles − vendidos = quedan**. Como los gastos se
escriben a mano y no hay lista cerrada de cosas, a qué pieza le pega cada venta se
decide por el nombre — lo que diga «acríl» gasta acrílicos vendidos, lo que diga
«mesa» gasta vinilos de mesa, y lo que diga «nfc» o «chip» gasta las dos, que
todas llevan chip. Lo demás no se toca.

Si «quedan» sale en rojo es que se vendió más de lo comprado: falta apuntar una
compra.

### Por qué el inventario no tiene su propia tabla

Igual que con las ventas: un inventario aparte habría que mantenerlo
sincronizado con las compras, y cualquier corrección en un gasto lo dejaría
mintiendo. Sumando lo que trajo cada compra eso no puede pasar. Cada gasto
admite hasta ocho cosas, y el gasto entero cabe en la metadata de KV, así que el
listado es una sola llamada.

### El inventario en el teléfono

La tabla tiene cinco columnas y en el teléfono no se ve la cabecera, así que
cada fila repetía los cuatro rótulos —Útiles, Vendidos, Quedan, En camino— con
el mismo peso visual que los números. Cuatro palabras y cuatro cifras por cosa,
cuando lo que se viene a mirar es una sola: **cuánto queda**.

Ahora ese número va grande a la derecha del nombre y el desglose debajo, en
pequeño, con cada cifra llevando su palabra pegada (`140 útiles`, `2 vendidos`).
Lo que no tiene nada que contar no aparece: si no se ha vendido nada, «útiles» y
«quedan» serían el mismo número dicho dos veces, y la fila se queda solo con el
grande.

Dos detalles de maquetación que costaron un intento cada uno:

- El renglón se parte con una celda vacía (`.corte`) que en el teléfono vale
  `flex:1 0 100%`. En la tabla ancha va en `display:none`, así que no descuadra
  las cabeceras —pero justo por eso hay que devolverle el `display` dentro de la
  media query, o el salto de línea no ocurre.
- Cada dato lleva `white-space:nowrap`. Sin eso, `(26 malos)` se partía por la
  mitad y dejaba un hueco que desalineaba todo lo que venía detrás.

### Editar no puede borrar la venta

El endpoint `rango` reescribe el registro entero de cada tarjeta, así que **lo
que no se manda se borra**. Reapuntar una orden ya cobrada a otro sitio le
vaciaba la fecha, el precio y el vendedor; y como el panel solo parcheaba
`negocio`, `destino` y `tipo`, la plata seguía en pantalla y solo desaparecía al
refrescar.

El arreglo va en el panel, no en el Worker: `porVenta()` agrupa los códigos por
la venta que ya tienen y manda cada grupo con su fecha, su precio y su vendedor.
En la práctica es una sola llamada, porque las tarjetas de una orden se cobraron
todas igual. Hacerlo en el Worker habría costado una lectura de KV por tarjeta
—veinticinco por tanda— y el plan gratis da cincuenta subpeticiones por petición.

## Por qué el panel no vuelve a preguntar tras guardar

KV es de **consistencia eventual**: lo que se acaba de escribir puede tardar
hasta un minuto en salir por `list()`. Volver a pedir la lista justo después de
guardar no solo no ayuda — devuelve el dato viejo y **pisa** el bueno, así que
parece que el cambio no se guardó aunque sí esté escrito.

Por eso, tras cada escritura el panel aplica el cambio sobre la lista que ya
tiene en memoria, con lo que acaba de mandar. Sale instantáneo y no depende de
la propagación. **Refrescar** sí vuelve a preguntar, y ahí sí puede tardar hasta
un minuto en reflejar algo recién escrito.

## El chip NFC de cada tarjeta

Grabar el chip es trabajo manual, plástico por plástico, y no se ve en ningún
sitio. El botón **NFC** de cada fila lo marca: amarillo relleno si ya está
grabado, apagado si falta.

Vive en su propia clave, `n:<codigo>`, y no dentro del registro de la tarjeta.
Es un hecho **físico del plástico**: el chip lleva grabada la URL de su propio
código, que no cambia nunca. Sigue siendo verdad aunque la tarjeta se reasigne a
otro negocio o se desactive — y dentro del registro, cualquiera de esas
escrituras lo habría borrado.

## Grabar los chips

Antes eran dos teléfonos: uno con NFC Tools escribiendo el link y cambiando la
letra a mano, otro bloqueando. **Grabar chips**, en Inventario, lo hace desde el
propio panel con la Web NFC de Chrome de Android.

**Manda el QR.** Primero se escanea el cartel, y lo que se graba es el link de esa
pieza — no hay forma de escribir uno que no le corresponda. Cuatro pasos, cada uno
con su botón, y cada uno se abre cuando el anterior salió bien:

1. **Escanea el QR** — dice qué pieza es y qué link va a grabar
2. **Graba el chip** — `NDEFReader.write()` con ese link
3. **Revisa que quedó** — lo lee y compara con el QR; si no coincide, no deja sellar
4. **Séllalo** — `makeReadOnly()`, con confirmación de dos toques

Al sellar, la tarjeta queda marcada como grabada en KV, igual que si hubieras
tocado el botón amarillo. Hay un *Sin sellar, siguiente* para dejarlo abierto.

El segmentado de arriba se queda en acrílicos o en stickers y avisa si escaneas
una pieza del otro tipo, que es el error fácil cuando llevas cincuenta seguidas.

**Solo Chrome de Android.** Web NFC no existe en Safari ni en escritorio; donde no
está, la ventana lo dice y no hace nada. Y sellar no tiene vuelta atrás: por eso
es un paso aparte y va después de comprobar.

## El QR como imagen: `/qr/CODIGO.png`

Una ruta pública que devuelve el QR de esa tarjeta en PNG: negro, sin fondo y con
el hueco del centro, el mismo dibujo que saca el panel.

```
https://r.grve.workers.dev/qr/AAFZ.png
```

Existe porque las herramientas de maquetación rellenan plantillas en lote a
partir de **una URL por imagen**. Con 401 marcos que llenar en Canva, la
alternativa era exportarlas del navegador y arrastrarlas una a una.

Es pública a propósito: no dice nada que no esté ya impreso en el plástico.

El Worker no tiene canvas, así que el PNG se arma a mano —CRC32, trozos y los
píxeles por `CompressionStream("deflate")`, que es la única parte que no compensa
escribir—. La única dependencia nueva es `qrcode-generator`, la misma librería
que usa el panel.

> Canva no deja editar por API un diseño de 401 páginas («Editing a Canva Design
> with a size of 401 pages is not currently supported»), así que colocar las
> imágenes una por una no era opción. El camino es su **Bulk Create** con un CSV
> de estas URLs.

## Modo pruebas

Para revisar un lote impreso hace falta lo contrario de lo normal: que el QR **no**
se vaya a Google, y diga en cambio qué tarjeta es. El botón **Modo pruebas**, en
Inventario junto a *Activar tarjetas*, lo enciende.

**Las vendidas quedan fuera.** Ya están pegadas en la mesa de un local y sus
clientes las escanean de verdad: probar un lote nuevo no puede apagarles el QR.
Con las pruebas puestas, una tarjeta con `vendida` sigue redirigiendo como
siempre y solo las demás enseñan su código.

Con las pruebas puestas, cualquier código enseña una página con su **código**, su
**número**, el negocio y el tipo, más un botón para ir a la reseña de verdad si
está vinculada. Funciona también con tarjetas libres, así que se revisa una
impresión sin tener que asignarla a nadie.

Es un interruptor global y no puede ser otra cosa: el QR impreso no lleva
parámetros que distingan una prueba de un cliente. Por eso el panel enseña una
franja ámbar mientras está puesto — con un cliente real en la calle, ese cliente
vería la página de prueba.

La bandera vive en KV bajo `modo:prueba` y se lee por la misma caché del borde que
las tarjetas, así que un escaneo no gasta una lectura de más. Apagarlo desde el
panel borra esa caché al instante; cambiarlo a mano con `wrangler` tarda hasta 60
segundos en notarse.

## Acrílico y sticker

Cada tarjeta es de un tipo, y el panel filtra por él:

- **Acrílico** — pieza de mesa para un solo local. Son las tarjetas **nº 1 a 100**.
- **Sticker** — se pega en las mesas, y el mismo lote se reparte entre locales.
  Son las **nº 101 a 210**.

El tipo se guarda en el registro. Las tarjetas viejas no lo traen, así que se
deduce del número: de la 101 en adelante, sticker. El formulario lo cambia cuando
haga falta, el número solo decide el valor por defecto.

## Órdenes

El panel tiene dos vistas: **Tarjetas** y **Órdenes**.

Una orden nace antes de saber si el local paga. Se crea, se visita al local, y
entonces se acepta o se cancela:

| Estado | Qué significa | Las tarjetas |
|---|---|---|
| **Pendiente** | creada, sin respuesta del local | ocupadas y apuntando a su sitio |
| **Aceptada** | pagó: lleva fecha e importe | ocupadas |
| *(cancelada)* | no pagó | **libres otra vez**, listas para la siguiente orden |

**Nueva orden** se abre con la cámara puesta. En la puerta de un local lo primero
es escanear la pieza que vas a dejar y pegar el link de su sitio; el nombre sale
solo de la URL. Ese es el formulario, en ese orden:

1. **Qué piezas lleva** — la cámara ya está abierta, escaneas una tras otra
2. **A qué local apunta** — pegas el link y se lee solo, sin darle a ningún botón
3. **Nombre del negocio** — puesto por el link
4. **O añádela por código** — se escribe `AAFZ` cuando el QR no se deja leer

Abrirse con el teclado sobre «cuántos acrílicos» pedía el dato que menos importa.

**El título y «Crear la orden» van fijos arriba.** La ventana se rellena de
arriba abajo y el botón de crear tiene que seguir a mano al llegar al final, así
que la cabecera no se va con el scroll. Ahí está también la ✕: cerrar y crear son
las dos únicas salidas, y un «Cancelar» al pie era una tercera que decía lo mismo
que la ✕.

**El campo del link va en azul.** De todo el formulario es el que decide a qué
sitio apuntan las tarjetas, y tenía el mismo gris que los demás. Ahora se ve de
lejos y no se confunde con el buscador de locales que lleva encima.

Lo que se quitó por el camino, todo por la misma razón —decía dos veces lo
mismo—:

| Se fue | Dónde seguía estando |
|---|---|
| el chip «Orden» sobre el título | en el propio título: «Orden de Panadería El Trigal» |
| el párrafo de explicación | en los rótulos de cada paso |
| el desplegable de locales | en el buscador de arriba, que enseña las coincidencias al escribir |
| el resumen de piezas escaneadas | en los chips de arriba, que ya listan los códigos |
| el enlace al buscador de Place ID | en ningún sitio: era una herramienta de desarrollo |
| «Cancelar» al pie | en la ✕ de la cabecera |

Con eso una orden entera —dos piezas escaneadas, el link leído y el nombre
puesto— cabe en una pantalla de teléfono sin desplazarse.

### Una orden es su lista de códigos

Hubo un segundo camino —*desde el nº tal, tantas*— que armaba bloques seguidos y
exigía que el tramo estuviera libre entero. Con el escaneo y el código escrito
dejó de usarse, y mantener dos formas de decir lo mismo solo daba maneras de que
no coincidieran. **Se fue**, con `bloqueDesde()`, `pedidasDelLocal()` y
`primeraLibre()` detrás.

Ahora la orden es exactamente los códigos que tenga, y hay tres puertas para
ponerlos: la cámara, el campo de código y la ✕ de cada ficha.

**Al abrir una orden que ya existe, sus códigos llegan puestos** como fichas. Eso
contesta la primera pregunta que uno se hace —*¿qué tiene esta orden?*— y deja
quitar de a una con un toque, venga la pieza de un escaneo o de donde sea.

El campo de código sugiere las libres mientras se escribe (`<datalist>`), acepta
minúsculas y entra con Intro.

Dos cosas no se dejan tocar, y lo dicen:

| | |
|---|---|
| Añadir una pieza ya cobrada a otra orden | *«ya está cobrada en Capoluz»* |
| Sacar una pieza cobrada de la suya | *«ya está cobrada: no se puede sacar de la orden»* |

La segunda es la importante: quitarla de la lista la liberaría al guardar, y eso
le borraría la venta. *Vaciar la lista* respeta la misma regla —deja dentro las
cobradas—.

El resumen enseña el movimiento antes de guardar:

```
Haunch Burguer: de 2+10 a 3+15   ·   +1 acrílico · AAAC   +5 stickers · AAEG → AAEK
Haunch Burguer: de 2+10 a 1+4    ·   −1 acrílico · AAAB quedan libres   −6 stickers · AAEA → AAEF quedan libres
```

Si al subir el link del formulario no es el que ya tenía la orden, solo lo llevan
las tarjetas nuevas — y el resumen lo avisa. Para repuntar las que ya están en la
calle, **Un rango → De una orden**.

Cancelar libera esas tarjetas y **la orden desaparece**. No queda historial de
canceladas, así que tampoco hay tasa de conversión. Si algún día hace falta, la
vía es guardar la orden en su propia clave en vez de deducirla.

Cancelar una orden ya aceptada también funciona, y es la única forma de deshacer
un cobro mal puesto. Ojo: se lleva por delante su importe, así que desaparece de
la gráfica.

### Por qué no hay tabla de ventas

La tarjeta **es** la unidad vendida: cada acrílico y cada sticker es un registro.
Así que la venta vive en la propia tarjeta (`vendida` y `precio`), y la lista de
locales sale de agrupar las tarjetas por negocio.

Una entidad "venta" aparte habría que mantenerla sincronizada: reasignar una
tarjeta, desactivarla o cambiarle el negocio dejaría la venta apuntando a algo que
ya no existe. Agrupando, eso no puede pasar. La gráfica diaria es un `GROUP BY`
sobre la fecha, y sale gratis.

El estado de la orden tampoco se guarda, se deduce: **con destino y sin `vendida`
es pendiente; con `vendida` es aceptada; sin destino la tarjeta está libre.**

### El sitio en Google Maps, la venta que no es una tarjeta

Hay locales que además piden que les **montemos su sitio en Google**: fotos,
horarios, datos. Eso se cobra aparte y no cuelga de ningún plástico, así que es
la única excepción a lo de arriba: vive en su propia clave, `s:<id>`, con el
nombre del local, el precio, la fecha del cobro y si ya está publicado.

En el panel se llama **Crear sitio en Google Maps**. Por dentro sigue siendo un
`servicio` y su clave `s:<id>`: renombrar el código no le arregla nada a nadie.

Se une a la orden por el **nombre del negocio**, el mismo con el que se agrupan
las tarjetas. Consecuencia a tener presente: si le cambias el nombre al local en
las tarjetas, el sitio se queda con el viejo y aparece como una fila aparte.

Sigue la misma regla que una tarjeta para contar como ingreso: **sin fecha es un
trato hablado, no plata**.

**No tiene ventana propia.** El sitio es una cosa más de las que lleva la orden,
así que se marca en **Orden** —junto a cuántos acrílicos y cuántos stickers—, con
su casilla de «ya está publicada» y sus notas. Y se cobra en **Aceptar**, en la
misma fila que el resto y con la misma fecha, saliendo en el mismo comprobante.
Dejar el precio vacío al cobrar no la borra: la deja como estaba. Para quitarla,
se desmarca la casilla en Orden.

Un local puede pedir el sitio sin comprar una sola tarjeta: su fila sale con «sin
tarjetas» y los tres botones sirven igual, porque la orden existe aunque no haya
plástico.

**Cancelar se lo lleva.** El sitio es parte de la orden, así que si el local no
paga, se va con el resto. Antes solo liberaba tarjetas y dejaba el sitio cobrado:
la fila seguía viva, en verde, y con Cancelar apagado no había cómo limpiarla.

## Comprobante de venta

Al cerrar el cobro, el modal de la venta saca un **comprobante de venta** en PDF
con los ítems de esa orden —acrílicos, stickers y el sitio en Google Maps— y lo manda
al correo del cliente.

**A propósito no es una factura.** No lleva numeración consecutiva, ni CUFE, ni
QR de facturación electrónica, y el pie lo dice con todas las letras. La
«referencia» que aparece arriba es la hora en base 36: sirve para nombrar el
archivo, no forma serie. Como somos no responsables de IVA (RUT responsabilidad
49), el cliente que necesite soportar la compra ante la DIAN arma su propio
*documento soporte en adquisiciones a no obligados a facturar*; eso no sale de
aquí.

**El correo decide, y no hay que pulsar nada más.** Cobrar y mandar el
comprobante son el mismo gesto:

**Aceptar es cobrar**, así que de ahí en adelante la orden no se toca. Las dos
salidas cierran:

| El campo de correo | Al aceptar la orden |
|---|---|
| Tiene correo | se guarda la venta, sale el comprobante y queda `r:<negocio>` con a quién se mandó |
| Está vacío | se guarda la venta y queda el mismo cerrojo sin correo: «cerrada sin comprobante» |

Que el cliente no quiera papel no cambia que pagó. Para volver a tocarla hay que
entrar al **Cobro** y borrar el cerrojo, que es la única puerta que sigue abierta
en esa fila.

El botón avisa de la parte que no es obvia —*Aceptar y enviar* en vez de *Aceptar
la orden*—, porque el correo sale de verdad y eso no se deshace.

Si el envío falla —sin señal, Brevo caído— **la venta ya quedó guardada** y la
ventana se queda abierta con el error: el mismo botón vuelve a intentarlo.

Por el camino se fueron cuatro botones: *Descargar PDF* y *Compartir* —el menú
nativo del teléfono, para meterlo en WhatsApp—, *Enviar al correo* y *Cerrar sin
enviar*, más la pregunta de después con su *Enviar* / *Ahora no*. Todos
contestaban lo que el campo de correo ya contesta.

El correo y el NIT del local quedan guardados en `b:<negocio>`, así que la
siguiente vez salen puestos.

### El cobro solo pregunta por lo que la orden lleva

Los campos de acrílico, vinilo y sitio aparecen según lo que tenga la orden. Un
campo de sitio en una orden que no lo lleva es una invitación a cobrarlo por error, y
el rotulito de *«vacío si no lleva»* era la señal de que sobraba.

Con un solo tipo de pieza el campo ocupa el ancho entero en vez de dejar media
fila vacía al lado, el foco entra en el primero que exista, y el resumen y el
subtítulo tampoco cuentan lo que hay cero: *«0 acrílicos y 2 stickers»* gastaba
tres palabras en decir nada.

### La fecha no se pregunta

Una venta es del día en que se hizo, así que el cobro ya no trae selector de
fecha: la pone solo. Si se reabre un cobro viejo se respeta la que ya tenía, que
es su día. El campo sigue existiendo como `hidden` —el comprobante y el registro
la necesitan—, pero nadie la escribe ni la puede dejar vacía.

### La lista de precios

La ventana del cobro trae los precios de la publicidad en pastillas, bajo cada
campo. **El vinilo baja por cantidad**, así que el tramo lo elige la propia orden
con lo que lleva —12 stickers marcan el de 10-19— y los demás quedan a un toque
por si hay que cambiarlo. **Otro** vacía el campo para escribir a mano cuando se
hizo un descuento.

| | Antes | Ahora |
|---|---|---|
| Acrílico NFC + QR | $70.000 | **$49.900** |
| Vinilo de mesa NFC + QR | $35.000 | **$18.900** y baja por cantidad |
| Crear sitio en Google Maps | $60.000 | **$39.900** |

Escala del vinilo: 1 → $18.900 · 2-4 → $17.900 · 5-9 → $16.900 · 10-19 → $15.900
· 20+ → $14.900. Los tramos van de mayor a menor en `PRECIOS.sticker` porque
`precioSticker` se queda con el primero que alcanza; el último tramo no tiene
techo, así que una orden de doscientos también paga $14.900.

Al abrir una orden sin cobrar, los tres campos vienen puestos con esos precios.
Si ya se cobró, manda lo que se cobró.

Todo eso está en `PRECIOS` y `LISTA`, encima de `preciosDeLaVenta`.

### La oferta sale en el comprobante

Bajo cada precio unitario va **el de antes, tachado**, y antes del total una línea
verde con lo que se ahorró el cliente. El correo lleva la misma línea en su caja
de resumen. Sale solo cuando lo cobrado está por debajo del precio de lista, así
que un descuento propio también se ve.

El tachado se dibuja a mano con `doc.line` sobre el texto: jsPDF no trae tachado.

### Los vinilos de la ruleta

Por cada acrílico que compran, el local gira una ruleta en físico y puede sacar
uno o dos vinilos de mesa **gratis**. En el cobro hay un campo con cuántos
salieron.

No son una entidad nueva: son vinilos de la misma orden **cobrados a cero**. Van
en su propia tanda al guardar, y al reabrir el cobro se recuentan solos —son los
vendidos con precio cero—. En el comprobante salen en su línea, a $0, y suman al
«te ahorras» por lo que habrían costado.

### Escanear la pieza con la cámara

En la calle el camino era: escanear el cartel con la cámara del teléfono, leer el
código de cuatro letras, buscarlo en la lista y de ahí sacar el número. **Escanear
una pieza**, dentro de Nueva orden, lo hace de una: apunta al QR y deja puesto el
número de esa pieza en su casilla —acrílico o vinilo, según lo que sea— y dice si
está libre o de quién es.

#### Los dos lectores

Chrome de Android trae `BarcodeDetector` y lee el QR sin descargar nada. Safari
del iPhone no lo tiene, y ahí no había escaneo: el botón decía «este navegador no
lee QR» y se acabó.

Ahora, cuando falta, se baja [jsQR](https://github.com/cozmo/jsQR) —una vez, y
solo en esos teléfonos— y se le pasan los fotogramas por un lienzo. De fuera las
dos formas son la misma función: recibe el vídeo y devuelve lo que ponga el QR.
Android no descarga nada de más.

Tres detalles que hacen que funcione en el iPhone:

- **La cámara se pide primero, antes de bajar el lector.** El permiso cuelga del
  toque que abrió la ventana, y ponerse a esperar una descarga en medio se lo
  lleva por delante.
- **El fotograma se lee a media resolución.** El cartel impreso es grande, se
  decodifica igual, y cada vuelta cuesta la mitad —que en un teléfono se nota—.
- **`inversionAttempts: "dontInvert"`.** Los nuestros son negros sobre claro;
  buscar también el negativo sería el doble de trabajo para nada.

### Bloquear el teléfono mataba el escaneo

Se bloqueaba el móvil un momento, se volvía, y la cámara seguía ahí: se veía la
imagen, pero **no leía nunca**. Apuntabas y apuntabas. Recargar la página lo
arreglaba de una, y con ello se perdía lo que llevara escrito el formulario.

Lo que pasa: al bloquear —o al cambiar de app— el sistema le quita la cámara a la
página. Las pistas del flujo se mueren y el `<video>` se queda **con el último
fotograma congelado**. El bucle de lectura sigue vivo y sigue trabajando, solo que
lee la misma foto fija cinco veces por segundo.

Y no podía darse cuenta solo: para él, un fotograma sin QR y un fotograma
congelado sin QR son exactamente lo mismo. **Un fallo que desde dentro no se
distingue del funcionamiento normal necesita que alguien de fuera lo avise**, y
aquí ese alguien es el navegador:

- `visibilitychange` al volver a primer plano → se reabre la cámara.
- El evento `ended` de la pista → por si otra app se la lleva sin que esta
  página llegue a esconderse.

Es lo mismo que hacía el refresco a mano, pero sin tirar el formulario.

Reabrir trae su propio riesgo: **dos bucles leyendo el mismo vídeo**, que se
pisarían el «este ya lo leí». Así que cada apertura pide turno (`TURNO_CAMARA`) y
el bucle se retira en cuanto deja de ser el suyo. Medido: cinco lecturas por
segundo antes y después de tres bloqueos seguidos, o sea un solo bucle.

Mientras la página está oculta no se reabre nada —pedir la cámara en segundo plano
no tiene sentido—, y si la cámara estaba cerrada no resucita sola.

**La cámara se abre sola solo donde se trabaja de pie.** Antes el gatillo era
«¿hay `BarcodeDetector`?», que de paso dejaba fuera el escritorio. Ahora que
cualquier navegador lee QR, el gatillo es `(pointer:coarse)`: en el computador no
hay cartel que apuntar, así que el botón se queda esperando.

**La cámara no se cierra entre pieza y pieza.** Una orden son varias del mismo
montón, y un toque por pieza sobraba. El guardián es el código anterior: mientras
el QR a la vista sea el mismo no se vuelve a leer, así que apuntar a la siguiente
es todo lo que hay que hacer. Quien atiende la lectura decide si sigue o cierra
—grabar chips cierra, porque ahí se trabaja de una en una—.

**Dentro de una orden se van juntando.** El montón casi nunca está en orden, así
que escanear pieza por pieza arma la orden con **esas** exactamente, sin rangos:
cada una entra en la lista, se quita con un toque y los campos de «desde el nº»
se apagan mientras haya lista. El resumen las enumera en vez de fingir un tramo.

Con lista, `planDelLocal` no calcula bloques: toma las escaneadas que no tenía y
suelta las que tenía y ya no están.

#### Una pieza se le puede quitar a una orden pendiente

El montón se revuelve y una pieza acaba puesta en el local equivocado. Escanearla
dentro de otra orden **la mueve**: cambia de dueño, de link y de nombre, y la
orden vieja la pierde —si se queda sin ninguna, desaparece sola, porque las
órdenes se derivan de las tarjetas y no se guardan aparte—.

Una orden pendiente no es dueña de nada todavía: nadie ha pagado. Lo que no se
toca es lo que ya tiene plata encima, y el escaneo lo dice con el cartel todavía
en la mano en vez de dejarlo entrar y rechazarlo tres piezas después:

| Estado de la pieza | Al escanearla |
|---|---|
| Libre | entra |
| En una orden **pendiente** | entra · *«se lo quitas a Chingones»* |
| Ella misma ya cobrada | **no** · *«ya está cobrada en Capoluz»* |
| Su orden ya se cobró | **no** · *«la orden de Capoluz ya se cobró»* |
| Su orden tiene comprobante | **no** · *«la orden de Licorera tiene comprobante»* |

El guardia vive en el panel y no en el Worker a propósito: `rango` escribe hasta
veinticinco tarjetas de un golpe, y leer cada una antes para comprobar de dónde
sale se saldría de las cincuenta subpeticiones que da el plan gratis. El panel ya
tiene todas las tarjetas en memoria, así que le sale gratis.

**Pegar el link ya es la orden de leerlo.** Nadie pega media URL, así que el
campo de Maps se analiza solo al pegar; «Leer la URL» sigue ahí para cuando se
escribe a mano.

### El link corto de la app de Maps

El botón de compartir del teléfono da `maps.app.goo.gl/xxxx`, que por dentro no
trae ningún identificador. Antes había que abrirlo en Chrome y copiar la URL
larga; ahora **Leer la URL** lo sigue por el Worker y se queda con la larga.

La lista de sitios a los que el Worker sigue un enlace va cerrada —los acortadores
de Google y nada más—: si no, esto sería un proxy para pedir lo que sea desde
nuestra IP.

#### Y la URL larga tampoco trae coordenadas

El link que sale del botón de compartir llega con `?g_st=ac`, y ese resuelve a
algo así:

```
https://www.google.com/maps/place/Autoservicio+limonar,+Taller+58+%236a-31,+Ibagué,+Tolima/data=!4m2!3m1!1s0x8e38c5001baa4345:0xf30dd69073298a1e!18m1!1e1?…
```

**Ni `@lat,lng` ni `!3d/!4d`.** El local va solo en el ftid. O sea que el link
que de verdad se usa en la calle —el único, en la práctica— es justo el que no
dice dónde queda nada. Probado con cuatro User-Agents y quitando el `?g_st=ac`:
ninguno devuelve coordenadas en la URL.

##### El HTML de esa página **no** sirve para sacarlas

Parece que sí. El cuerpo trae, cerca del principio:

```
APP_INITIALIZATION_STATE=[[[<alcance>,<lng>,<lat>], …
```

Se llegó a escribir el extractor y a desplegarlo. **Está mal.** Ese par no es el
local: es **la ubicación por IP de quien pide la página**. La prueba que lo
destapa es de una línea —pedir tres sitios de tres continentes:

| Se pidió | Devolvió |
|---|---|
| Torre Colpatria, Bogotá | `4.440064, -75.1992832` |
| Sagrada Familia, Barcelona | `4.440064, -75.1992832` |
| place_id de Sydney | `4.440064, -75.1992832` |

Siempre lo mismo, y lo mismo es Ibagué, que es desde donde salía la petición. El
local de verdad estaba a unos 400 metros de ahí.

Lo que engañó: el primer local probado **sí** cuadraba —un reverse-geocode decía
«Jordán, Ibagué» y la dirección del local también—. Pero eso no confirmaba el
local, confirmaba la ciudad desde la que se estaba probando. **Una comprobación
que no puede fallar no comprueba nada**: para validar «esto devuelve el sitio
pedido» hay que pedir un sitio que esté lejos de uno.

En producción habría sido peor: el Worker corre en un datacenter de Cloudflare, o
sea que **todas las órdenes habrían caído en el mismo punto falso**.

Las coordenadas reales las pone Maps con JavaScript, pidiéndolas a
`/maps/preview/place`. Sin ejecutar JS, de un link corto **no se sacan**.

#### Lo que se probó y no sirvió

Todo medido contra los puntos que ya estaban puestos a mano, que hacen de
respuesta correcta:

| Vía | Resultado |
|---|---|
| El link corto, en sus dos formatos | no trae coordenadas, con ningún User-Agent |
| `APP_INITIALIZATION_STATE` del HTML | la IP de quien pide, no el local |
| Geocodificar la dirección (Nominatim) | 4 de 6 sin resultado; los otros a 186 m y 806 m |
| El `ftid` de la URL | una celda de ~2 km: `0x8e38c5…` cubre locales a 1,9 km unos de otros |
| El GPS del teléfono | la orden no siempre se crea en el local |

#### El placeId sí lo consigue

De cada local guardamos su **Place ID** desde el primer día —va dentro del link
de reseña—. Preguntándoselo a Google, da la coordenada exacta:

```
GET https://places.googleapis.com/v1/places/<placeId>
    X-Goog-Api-Key: <clave>
    X-Goog-FieldMask: location
```

Pedir **solo** `location` cae en *Place Details Essentials*: **10.000 llamadas
gratis al mes**, y $5 por cada 1.000 después. Aquí se hacen unas cien.

Lo bueno de que el dato ya estuviera guardado es que esto sirve **hacia atrás**:
el botón *Buscar los que faltan*, en el mapa, recorre los locales sin punto y los
coloca de golpe —verde si está cobrado, amarillo si sigue pendiente—.

La clave va como secreto del Worker, nunca en el repo:

```
npx wrangler secret put GOOGLE_MAPS_KEY
```

**Sin clave no es un error.** El endpoint contesta 501, el panel lo dice
—«sin ubicación — lo marcas en el mapa»— y todo lo demás sigue igual que antes.
El mensaje de Google no se reenvía tal cual al panel: puede llevar la clave
dentro.

### Enviado el comprobante, la orden se cierra

El papel ya está en manos del cliente, así que a partir de ahí **no se toca
nada**: ni el link, ni el chip NFC, ni los precios, ni las piezas. Se guarda un
`r:<negocio>` con a quién se mandó y cuándo, y eso hace de cerrojo.

Hay clientes que pagan pero no quieren papel. Esos cierran igual, por
`comprobante-cerrar`: el mismo registro sin correo, y la fila lo dice «cerrada
sin comprobante». No hace falta pulsar nada —ya no existe *Cerrar sin enviar*—:
lo dispara el propio aceptar cuando el campo de correo está vacío.

En la tabla de tarjetas, las de ese local se quedan con **NFC**, **Editar** y
**Desactivar** apagados; el **QR** sigue, que mirarlo no cambia nada. En órdenes
se apagan **Orden** y **Cancelar**, y queda **Cobro**, que es por donde se abre
otra vez: dentro hay un aviso con el correo y la fecha, y un **Borrar
comprobante** con la confirmación de dos clics.

El Worker lo rechaza aparte del panel, con un 409, en `guardar`, `rango`,
`desactivar`, `nfc`, `servicio` y `servicio-borrar`. Donde puede lee el registro
de la tarjeta para saber de quién es; en las operaciones por tandas se fía del
`desde` que manda el panel, porque leer las veinticinco para comprobarlo se
saldría de las 50 subpeticiones que da el plan gratis. Es un seguro contra
equivocaciones entre dos personas, no una frontera de seguridad.

### Quién vende

Venden tres: **Felipe, Nicolás y Alexander**. **Cuentas › Mis datos** guarda los
datos de cada uno —nombre, cédula, teléfono y la nota que va bajo el nombre—. Se
cambia de uno a otro con el segmentado de arriba, y lo escrito no se pierde al
saltar entre ellos: sube todo de una al guardar.

En la ventana del cobro, **quién hizo la venta** es lo primero que se pregunta,
antes de los precios. Estuvo abajo, dentro del bloque del comprobante, y ahí
parecía cosa del PDF: lo que se elija queda escrito en cada tarjeta al guardar, y
de ahí salen la columna *Vendió* de las órdenes y el tope de renta de cada uno.
El panel recuerda el último elegido en ese teléfono, que es de quien suele ser.

**Alexander vende pero no es socio.** Sale donde importa quién hizo la venta —el
comprobante, el tope de renta, la columna *Vendió* de las órdenes— y no sale en
el reparto de utilidad ni en quién paga un gasto, que son cosas de los dos que
pusieron la plata. Por eso hay dos listas: `QUIENES_VENDEN` y los socios del
reparto, que siguen siendo dos.

Su barra en el tope de renta solo aparece cuando ya vendió o ya tiene sus datos
puestos: una barra en cero es ruido.

Los tres viven en `cfg:vendedor` como `{felipe:{...},nicolas:{...},alexander:{...}}`.
Lo que había guardado cuando era un solo vendedor se lee como de Felipe.

### Las órdenes del día

La tabla de órdenes abre en **Hoy**. Al lado están *7 días*, *Todas* y un campo
de fecha para mirar un día suelto.

Qué día es una orden:

- **Cobrada** → el día en que se cobró, y ahí se queda para siempre.
- **Pendiente** → el último día en que se tocó, que es lo que uno busca al
  terminar la jornada.
- **Sin ninguna de las dos** → no se puede fechar, así que **no se esconde
  nunca**. Esconder trabajo pendiente porque no supimos ponerle día sería la
  peor forma de perder una cobranza.

Por lo mismo, debajo de la tabla siempre se dice cuántas quedaron fuera del
filtro, con un botón para verlas. El filtro recorta la vista, no la información.

**La hora importa.** `actualizado` se guarda en UTC y aquí se vende de noche: a
las 8 p.m. de Ibagué ya es el día siguiente en Londres. `diaLocal()` lo pasa a la
fecha del teléfono antes de comparar; sin eso, media jornada se iría al día
siguiente.

La columna **Vendió** sale de las tarjetas de la orden. Se apunta dos veces: al
crear la orden queda quien la levantó, y al cobrarla queda quien la cobró —que es
el que firma el comprobante y el que declara ese ingreso—.

### El envío del correo

Sale por Brevo, que es de los pocos que dejan verificar un Gmail como remitente
—los que exigen dominio propio no sirven aquí, porque `gmail.com` no es nuestro—.
Hace falta una vez:

1. Crear cuenta en [brevo.com](https://www.brevo.com) (el plan gratis da 300
   correos al día).
2. **Senders** → añadir `greview641@gmail.com` y confirmar desde ese buzón.
3. Crear una API key en **SMTP & API**.
4. Guardarla como secreto, y la escribes tú, que no tiene por qué pasar por el
   chat:

```bash
npx wrangler secret put BREVO_API_KEY
```

Sin ese secreto todo lo demás funciona: solo el botón de enviar responde que
falta configurarlo. Cambiar de proveedor son quince líneas en `api()`, en el
bloque `comprobante`.

### El tope de la declaración de renta

Vive dentro de **Mis datos**, junto a los datos de cada uno, que es de lo que
habla. Hay una barra por cada uno con lo que lleva vendido en el año
contra los **1.400 UVT de ingresos brutos** que obligan a declarar renta — en
2026, **$73.323.600** con el UVT en $52.374.

Va separado porque **cada uno declara por su lado**: la barra de Felipe no cuenta
lo que vendió Nicolás. De ahí que cada venta guarde un campo `vendedor`, que sale
del segmentado «quién hizo la venta» del cobro. Lo vendido antes de que existiera
ese campo aparece como «sin vendedor apuntado», aparte, en vez de repartirlo a
ojo.

El UVT cambia cada enero. Está en la constante `UVT`, encima de `pintarCuentas`,
y se cambia a mano.

> Los números de arriba salen de lo que nos pasó Felipe (3.500 UVT = $183.309.000
> en 2026, de donde sale el UVT). Conviene confirmarlos y mirar a qué año
> gravable corresponde la declaración antes de fiarse de la barra.

## Editar un rango

**Editar un rango** escribe el mismo link en varias tarjetas de una vez. Las
tarjetas se eligen de dos maneras:

- **Por número** — del nº inicial al final. Para lotes recién impresos.
- **De una orden** — todas las tarjetas de un local ya vinculado. Para cuando
  cambia su sitio en Google Maps y hay que repuntar lo que ya está en la calle.

Al editar una orden el tipo no se elige: una orden mezcla acrílicos y stickers, y
cada tanda del endpoint escribe un solo tipo. Se manda un grupo por tipo, porque
mandarlos juntos le cambiaría el tipo a la mitad de las tarjetas.

El panel parte el rango en tandas de 25. No es capricho: el plan gratuito corta a
**50 subpeticiones por petición** y cada escritura en KV cuenta como una.

## Activar tarjetas

**Activar tarjetas** pide solo un número: crea esos registros vacíos, seguidos, a
partir del último código que exista. Es lo que se hace al mandar a imprimir un
lote — los plásticos ya traen su código y aquí quedan reservados, sin negocio,
listos para entrar en una orden.

Crear una tarjeta vacía escribe exactamente el mismo registro que deja
**Desactivar**, así que reutiliza ese endpoint en vez de añadir uno igual. El tipo
sale del número: hasta la 100, acrílico; de la 101 en adelante, sticker.

Tope de 500 por vez, en tandas de 25.

## Activar una tarjeta

El panel lleva incorporado el generador de links de reseña, así que no hay que
saltar a otra herramienta:

1. Entra a `https://r.grve.workers.dev/admin` e inicia sesión.
2. El **código** viene propuesto: el siguiente de la secuencia, con su número al
   lado. Se puede cambiar si vas a activar una tarjeta ya impresa.
3. Pega la **URL de Google Maps** del negocio y dale a **Leer la URL**. De ahí sale
   el **Place ID** del local y el link que abre el formulario de reseñas. El campo
   también acepta el Place ID pegado tal cual, o un link de reseña ya hecho.
4. **Guardar tarjeta**. Queda activa de inmediato y aparece el **QR para imprimir**.

Los tres campos son obligatorios, y el link solo se guarda si le diste a **Leer la
URL** después del último cambio: así no se queda el destino viejo por olvido.

Ese QR codifica `HTTPS://R.GRVE.WORKERS.DEV/CODIGO`, **no** el link de Google: es
lo que hace que la tarjeta se pueda reasignar después. Salen **cuatro PNG con
fondo transparente**, y el botón **QR** de cada fila los vuelve a mostrar:

| Versión | Corrección | Módulos | Para qué |
|---|---|---|---|
| Negro / Blanco | M | 25×25 | el QR normal, el más denso al imprimir |
| Negro / Blanco con hueco | H | 29×29 | círculo transparente en el centro, para meter un logo |

El hueco se abre borrando, no pintando encima: el centro queda **transparente de
verdad**, no blanco. Ocupa el 9% del área y la corrección H tolera el 30%, así que
el QR sigue leyéndose. Esa corrección cuesta pasar de 25×25 a 29×29 módulos, y por
eso las versiones sólidas se quedan en M: cada módulo imprime más grande.

En el tag NFC va **ese mismo link**. Los tags grabados antes con `?n=1` al final
siguen sirviendo: ese parámetro ya no se mira.

**Desactivar** no borra nada: le quita el destino y el negocio, y la tarjeta
vuelve a la lista como libre. Quien la escanee ve la página de "todavía no está
activada". El registro se queda porque el plástico también: su código está
impreso y va a existir igual, así que tiene que seguir apareciendo en el panel
para poder reasignarlo.

---

## Cómo funciona el acceso

`/admin` es una página pública, pero **no trae ningún dato**: lo único que se
puede hacer sin sesión es ver el formulario de login. Todo lo que lee o modifica
tarjetas vive en `/api/*` y responde **401** sin una sesión válida.

- La contraseña es el secreto `ADMIN_PASSWORD`, guardado cifrado en Cloudflare.
  No está en el código ni en este repositorio.
- Al iniciar sesión, el servidor entrega una **cookie firmada con HMAC-SHA256**
  (`HttpOnly`, `Secure` en https, `SameSite=Strict`, 8 horas). Al ser `HttpOnly`,
  el JavaScript de la página no puede leerla; y `SameSite=Strict` impide que otro
  sitio la use para hacer peticiones en tu nombre.
- La cookie lleva su propia fecha de vencimiento **dentro de la firma**, así que
  no sirve de nada editarla: cambiar la fecha invalida la firma.
- Las comparaciones de contraseña y de firma son en **tiempo constante**.
- **Tres intentos fallidos por IP** bloquean el login **24 horas**, contadas desde
  el último intento. El bloqueo no afecta la redirección de las tarjetas: aunque
  alguien esté martillando el login, los QR impresos siguen funcionando.

  El contador vive en KV como `intentos:<ip>`. Si te bloqueas tú mismo y no
  quieres esperar el día, se quita a mano:

  ```bash
  npx wrangler kv key put --binding TARJETAS "intentos:TU.IP" "0" --remote
  ```

  KV tarda hasta **60 segundos** en propagar ese cambio. Poner el contador a cero
  funciona mejor que borrar la clave, porque el borrado falla en Windows.

Si alguna vez sospechas que la contraseña se filtró, cámbiala con
`wrangler secret put ADMIN_PASSWORD`: como la firma de las sesiones se deriva de
ella, **todas las sesiones abiertas quedan invalidadas al instante**.

---

## Aguante y abuso

El DDoS volumétrico lo filtra Cloudflare en el borde para todas las cuentas, plan
gratuito incluido: no hay nada que programar contra eso.

Lo que sí está expuesto son las **cuotas diarias del plan gratuito**, porque
agotarlas deja las tarjetas sin servicio hasta el día siguiente:

| Recurso | Límite diario | Consumo por visita |
|---|---|---|
| Peticiones a Workers | 100.000 | 1 |
| Lecturas de KV | 100.000 | 1, **0 si la tarjeta está en caché** |
| Escrituras de KV | 1.000 | solo al activar o borrar tarjetas |
| **`list` de KV** | **1.000** | **0 — una visita no lista nada** |

Por eso las tarjetas se leen a través de la caché del borde: un aluvión sobre el
mismo código se resuelve sin tocar KV. Las peticiones al Worker no se pueden
evitar — esas se cuentan igual.

Un cliente escaneando un QR cuesta **1 petición y 1 lectura**, y nada más: son
100.000 escaneos al día. Con las tarjetas que hay colocadas eso da unos 180
escaneos por tarjeta, que no los alcanza ni de lejos un vinilo de mesa.

### El bote pequeño es `list`, y lo gastaba el panel

Mil al día contra cien mil de lecturas. Y el panel abría así:

| | Superadmin | Vendedor |
|---|---|---|
| `lista` (tarjetas + NFC) | 2 | 2 |
| `servicios` · `mapa` | 2 | 2 |
| `comprobantes` · `compradores` | 2 | **6** |
| `gastos` · `usuarios` · `liquidaciones` | 3 | — |
| **Total** | **9** | **10** |

El vendedor pagaba el triple en dos de ellos porque `negociosDe()` recorre `c:` y
`s:` para saber cuáles son *sus* locales antes de enseñarle nada. Con tres
personas eso daban **unas cien aperturas de panel al día**, y *Refrescar* se
llevaba otras cuatro cada vez.

**Un `list()` sin prefijo trae las claves de todos los espacios de una sola vez**,
con su metadata. Así que ahora hay un endpoint `todo` que lo pide una vez y
reparte en el Worker: de nueve o diez a **uno**, y los locales del vendedor salen
gratis porque las claves ya están en memoria.

Esto solo cabe porque **la metadata lleva el registro entero**. Si hubiera que
leer cada clave serían 751 lecturas en vez de un `list`, y la decisión de meter el
dato en la metadata —que se tomó para los gastos— es la que lo hace posible.

`list()` devuelve hasta mil claves por página y sigue por el cursor; cada página
cuenta como otro `list`. O sea que el coste crece de uno en uno por cada mil
claves, no de diez en diez. La respuesta entera pesa **91 KB** con las 751 claves
de hoy, así que armarla no se acerca a los 10 ms de CPU.

Si `todo` fallara, el panel avisa y tira del camino de antes —más `list`, pero
funciona—. Esa red se puede quitar cuando lleve meses sin saltar.

Lo que **no** se puede montar aquí son las reglas de rate limiting y el WAF de
Cloudflare: necesitan una zona, y `workers.dev` no lo es. Si algún día el
proyecto justifica un dominio propio, eso es lo primero que se desbloquea.

El login ya tiene su propio freno, aparte de todo esto: ocho intentos fallidos
por IP y quince minutos de bloqueo.

## Decisiones que conviene no cambiar

- **Todo el mundo recibe un 307, sin pantalla de por medio.** QR o NFC, Android o
  iPhone: el mismo salto directo. Se puede porque el destino es una **página web**
  (el formulario de reseñas de Google) y no una app: no hay entrega a una app
  nativa, que era lo único que exigía un toque de la persona.

  Hubo una época en que sí hacía falta una pantalla intermedia con un botón,
  porque el destino era `google.com/maps/place//data=…!12e1` y ese link solo
  servía si la **app** de Maps lo agarraba. Ni iOS ni Android le entregan un link
  a una app cuando se llega por un salto de servidor: en iOS el Universal Link
  exige un toque real, y en Android el navegador sigue la redirección él mismo y
  termina renderizando la web de Maps. Comprobado en los dos, con QR y con NFC.

  **Tres formas de quitar ese toque, todas fallidas y comprobadas en teléfono**, por
  si a alguien se le ocurre reintentarlas:

  - **AAR** (Android Application Record) en el tag NFC. Abre Maps, pero en su
    pantalla principal: Maps no registra ninguna actividad para eventos NFC, así
    que Android se limita a lanzar la app.
  - **Redirección a un URI `intent://`**, el mecanismo de los servicios de deep
    link. Chrome bloquea el salto a un esquema externo cuando viene de una
    redirección sin gesto del usuario, y cae al `browser_fallback_url`.
  - **Grabar el link de Google directo en el tag.** Además de romper la
    reasignación, choca con lo mismo: el lanzamiento desde NFC no cuenta como toque.

  La prueba de que era un techo de la plataforma y no de este código: la web de
  Google Maps, en el dominio de Google, tampoco abre su propia app sola — muestra
  un diálogo pidiendo que toques "Continuar". La salida no fue vencer ese techo,
  sino **cambiar a un destino que no lo necesita**.

  Si algún día el destino vuelve a ser un link de app, la pantalla con el botón
  está en el historial de git, en `src/puente.js`.
- **El destino es `search.google.com/local/writereview?placeid=…`.** Ese link cae
  directo en el formulario de reseñas de Google, con la sesión que la persona ya
  tiene abierta. Reemplazó a `google.com/maps/place//data=…!12e1`, que dependía de
  que la app de Maps agarrara el link y muchas veces terminaba en la web de Maps
  sin el cuadro de estrellas.

  **El Place ID lo calcula el panel**, no hay que ir al buscador de Google por cada
  negocio. La URL de Maps trae el identificador hexadecimal del lugar
  (`!1s0xCELDA:0xLUGAR`), y el Place ID es ese mismo par de números metido en un
  protobuf mínimo y codificado en base64url:

  | Byte | Qué es |
  |---|---|
  | `0x0A` | campo 1, tipo bytes |
  | `0x12` | longitud 18 |
  | `0x09` | campo 1, entero fijo de 64 bits → celda, little-endian |
  | `0x11` | campo 2, entero fijo de 64 bits → lugar, little-endian |

  Por eso todos los Place ID empiezan por `ChIJ`: es la base64 de esos tres
  primeros bytes, que no cambian nunca. La conversión está comprobada contra el
  buscador oficial de Place ID. Si algún lugar raro no convierte, el campo del
  panel acepta el `ChIJ…` pegado a mano.

- **En el NFC va la URL corta de la tarjeta, no el link de Google**, igual que en
  el QR. Es lo que mantiene el tag reasignable después de grabado.

- **El destino se valida**: solo se aceptan URLs `http:` o `https:`, para que el
  panel no pueda convertirse en un trampolín hacia `javascript:` u otros esquemas.
- **Los códigos son un contador en base 26**, cuatro letras, en orden alfabético:
  `AAAA` es la tarjeta nº 1, `AAAB` la nº 2, `AABA` la nº 27, `AADV` la nº 100. El
  panel propone siempre la siguiente libre, mirando el mayor código de cuatro
  letras que ya exista. Caben 456.976 tarjetas antes de necesitar una quinta letra.

  Se saltan los códigos que no sean cuatro letras: si algún día se activa uno a
  mano con números, la secuencia sigue contando por su lado sin romperse.

- **Los códigos se normalizan** a mayúsculas y solo admiten `A-Z0-9`, de 3 a 12
  caracteres. Al generarlos para imprimir, evita los ambiguos: usa el alfabeto
  `23456789ABCDEFGHJKMNPQRSTUVWXYZ` (sin `0`/`O` ni `1`/`I`/`L`), porque alguien
  va a tener que teclear ese código a mano alguna vez.
- **Rutas reservadas**: `admin`, `api`, `favicon.ico` y `robots.txt` no pueden
  usarse como códigos de tarjeta.

## Contar escaneos

KV no sirve para llevar contadores: es de consistencia eventual y admite ~1
escritura por segundo por clave. Cuando lo quieras, la vía es Durable Objects,
Workers Analytics Engine, o un Redis de Upstash con `INCR`. No está incluido aquí.

## Usuarios: una identidad, no un desplegable

Hasta aquí había **una sola contraseña** y «quién hizo la venta» era un
desplegable de honor: cualquiera con la clave era cualquiera. Con gente fuera de
los dos socios eso deja de servir, así que la sesión pasa a saber quién eres.

**El superadmin sigue siendo lo de siempre**: una cuenta, la contraseña de
`ADMIN_PASSWORD`, sin usuario. Es la de Felipe y Nicolás, y dentro siguen
eligiendo con cuál de los dos se firma cada comprobante.

**Los vendedores son usuarios en KV**, `u:<usuario>`, creados desde el
superadmin. Entran con usuario y contraseña.

### Cómo se guarda una contraseña

**Aquí hubo PBKDF2 a 120.000 vueltas y fue un error.** El plan gratis da **10ms de
CPU por petición** y eso se los come, así que el Worker moría con 500 —al crear un
usuario y también al dejarlo entrar, que usa la misma función—. En local no se ve,
porque ahí no hay límite de CPU: el mismo cuerpo que daba 500 en producción daba
200 en `wrangler dev`.

En su lugar, un **HMAC-SHA256 con `ADMIN_PASSWORD` de pimienta** y una sal de 16
bytes por usuario. Cuesta lo mismo que firmar la sesión, que ya se hace en cada
petición sin despeinarse.

El cambio es de dónde viene la seguridad: ya no del coste de probar claves, sino
de que **la pimienta no está en KV** —es un secreto de Cloudflare—. Quien se lleve
el listado de usuarios no puede probar ni una sola clave sin ella.

Contrapartida: si algún día cambia `ADMIN_PASSWORD`, hay que volver a ponerle
contraseña a cada vendedor. Ese día también se caen todas las sesiones, así que va
junto.

**La sal y el hash viven solo en el valor, no en la metadata.** `list()` devuelve
la metadata entera a quien pida el listado de usuarios, así que meterlos ahí
sería repartir las credenciales con cada pantalla de administración.

### La sesión

La cookie pasa de `expira.firma` a `usuario.expira.firma`, firmada igual con
HMAC-SHA256 sobre `ADMIN_PASSWORD`. `sesionValida()` ya no devuelve un sí/no sino
quién es, y de ahí cuelga todo lo demás.

Cada petición de un vendedor lee su `u:` para comprobar que sigue activo, así que
**apagar un usuario le corta la sesión en la siguiente petición**, sin esperar a
que caduque la cookie.

Al desplegar esto, las cookies viejas dejan de valer: hay que entrar otra vez.

### Qué garantiza el Worker, y qué no

Lo que se cumple del lado del servidor, no del panel:

| | |
|---|---|
| Un vendedor no ve gastos, cuentas ni la lista de usuarios | `403` |
| Un vendedor no puede crear ni editar usuarios, ni tocar el modo pruebas | `403` |
| Un vendedor no puede apuntarle una venta a otro | el `vendedor` que manda se ignora y se pone el suyo |
| Un vendedor no ve las tarjetas de los demás | le llegan como `{codigo, tipo, ajena}`: sabe que están ocupadas y nada más |
| Un vendedor no ve correos ni comprobantes de clientes ajenos | filtrados por sus propios locales |
| Un vendedor no puede destrabar una orden cerrada que no es suya | `403` |

Como las tarjetas ajenas le llegan sin `negocio`, tampoco le forman órdenes:
su pestaña de Órdenes sale filtrada sin filtrar nada en el panel.

**Lo que no se comprueba**, a propósito: que un vendedor escriba sobre un local
ajeno adivinando el nombre. `rango` escribe hasta veinticinco tarjetas de un
golpe y comprobar el dueño de cada una serían veinticinco lecturas más, contra
las cincuenta subpeticiones del plan gratis. No gana nada con ello —estaría
regalándole un comprobante a otro— y el panel no le ofrece la puerta.

### El panel según quién entra

El login pide **usuario y contraseña**; el usuario vacío es el superadmin, que es
como han entrado siempre.

| | Superadmin | Vendedor |
|---|---|---|
| Pestañas | Órdenes · Cuentas · Tarjetas · Inventario | solo Órdenes, y la barra de pestañas ni aparece |
| Barra de mandos | todo | Nueva orden y Refrescar |
| Quién firma la venta | elige entre Felipe y Nicolás | él, sin elegir |
| Sus datos del comprobante | *Mis datos* | los pone el superadmin al crearlo |

El nombre del vendedor sale junto al dominio, arriba a la izquierda, para que se
sepa de quién es la sesión sin ir a buscarlo.

**Esto es el reparto de la pantalla, no la seguridad.** El que manda es el
Worker: aunque un botón se pinte, la petición vuelve con `403`. Esconderlos es
para que nadie tenga que descubrir a golpes qué le toca.

### Vendedores

En **Cuentas › Vendedores**. La ventana tiene dos caras y se turnan, porque con
veinte personas una lista encima de un formulario abierto no acaba nunca:

- **La lista** —con la que abre—: una fila por persona con su nombre, su usuario,
  quién le firma y su porcentaje. Los apagados salen en gris. El buscador aparece
  a partir de siete; con tres, estorba.
- **La ficha**: al tocar a alguien, o al darle a *Nuevo vendedor*. Vuelve con
  «← Todos los vendedores», y al guardar vuelve sola.

Se crea con nombre, cédula, usuario, contraseña y el
porcentaje que se queda de lo que venda. El porcentaje se ve en plata mientras se
escribe —«de un acrílico de $49.900: él $24.950, la casa $24.950»—, que es como
se entiende un 50%.

Al editar, el **usuario no se puede cambiar**: es la llave con la que están
firmadas sus ventas. La contraseña en blanco deja la que tenía.

**No hay botón de borrar, hay uno de apagar.** Borrar a alguien dejaría sus
ventas firmadas por un fantasma; apagarlo le corta la sesión en la siguiente
petición y deja su historial en pie.

## Comisiones

Un vendedor se queda un porcentaje de lo que venda. Lo que sobra es de la casa y
se reparte entre los dos socios como siempre.

De un acrílico de $49.900 al 50%: **Alexander $24.950, la casa $24.950** —
$12.475 para cada uno—.

### El porcentaje se congela en la venta

Va escrito en cada tarjeta, no se lee del usuario al hacer cuentas. Subirle
mañana la comisión a alguien **no le reescribe lo de ayer**: una venta que se
hizo al 40% sigue repartida al 40% para siempre.

Quién lo pone:

| Quién cobra | Qué porcentaje queda |
|---|---|
| Un vendedor | el suyo, el que le puso el superadmin. No lo elige ni lo manda |
| Un socio | cero: lo suyo es la utilidad de lo que quede |
| El superadmin reabriendo un cobro ajeno | el que ya tenía, que es el pacto de aquel día |

Como `rango` reescribe el registro entero, el porcentaje viaja con la fecha, el
precio y el vendedor en `porVenta()`. Si no, reeditar una orden lo pondría en
cero y la comisión se evaporaría.

### La comisión sale antes que el costo

En Cuentas se resta de la utilidad, no solo del reparto de la venta:

```
Ingresos $208.500 · Gastos $100.000 · Comisiones $74.310    Utilidad $34.190
```

Vale la pena tenerlo presente al fijar un porcentaje: de ese acrílico la casa se
queda $24.950 y de ahí **todavía tiene que pagar el plástico, el chip y el
vinilo**. El 50% no es la mitad de la ganancia, es la mitad de la venta.

### Lo que ve cada uno

**El superadmin**, en Cuentas, una tabla por vendedor: piezas, facturado, lo que
se lleva y lo que queda para la casa.

**El vendedor: solo Órdenes.** Ni Cuentas, ni Inventario, ni el mapa, ni sus
propios ingresos, ni la gráfica de unidades e ingresos que va encima de la tabla.
Lo que se le debe se lo dice quien le paga.

La gráfica se esconde con `data-dueno` en el div, que `pintarRol()` ya recorría:
no hizo falta una línea de JavaScript nueva. Nace con `hidden` puesto para que a
un vendedor no le parpadee antes de que el rol se conozca.

### El formulario de una orden, visto por un vendedor

| | Superadmin | Vendedor |
|---|---|---|
| *Una tarjeta · Una orden · Un rango* | los tres | **solo órdenes**, y el selector ni sale |
| *O añádela por código* | sí | no: en la calle se escanea |
| *Crear sitio en Google Maps* | casilla + «ya está publicada» + notas | **solo la casilla** |
| Nombre del negocio | editable | **fijo si lo trajo el link** |
| Los enunciados *1 · 2 · 3* | sí | **no: solo los campos** |

Los enunciados se van con `data-dueno`, lo mismo que la gráfica. Los campos se
quedan con su `aria-label`, que un rótulo que no se dibuja sigue haciendo falta
para quien no lo ve. Y al vendedor el campo del nombre le dice *«Nombre del
negocio»* en vez del ejemplo: sin el enunciado encima, un nombre de ejemplo en
gris parece un valor ya puesto y no una pista. El superadmin conserva el
enunciado, así que a él el ejemplo le sirve más.

*Crear sitio en Google Maps* bajó a debajo del nombre del negocio, para los dos.
Vivía dentro de `#campoPiezas`, que solo se enciende en modo orden, así que al
sacarlo hubo que envolverlo en `#bloqueFicha` y apagarlo igual: si no, asomaría
en *una tarjeta* y en *un rango*, donde no pinta nada.

Activar una tarjeta suelta o tocar un rango entero es reponer plástico, y eso es
de la casa. Si está publicada y qué le falta al sitio es seguimiento, no algo que
se decida en la puerta del local.

El nombre se bloquea porque **es la llave**: con él se empareja la orden con su
punto del mapa y con su comprobante. Cambiarlo a mano los separa sin que se note
—ya hay locales en la base con el nombre a medio descodificar por haberse tocado
por caminos distintos—. El superadmin sí puede editarlo, justamente para arreglar
esos.

### El campo del link

Se quitó el buscador *«busca un local ya registrado»*, para los dos roles: el link
de Maps ya identifica el local, y escribir el nombre a mano era la manera de
apuntarle a otro sin darse cuenta. El `<select>` oculto se queda, que es por donde
`abrirOrden()` carga una orden que ya existe.

Queda un solo camino, y se dispara solo por tres vías:

1. **Tocar el campo pega lo copiado.** En la calle el link viene siempre del
   portapapeles, recién copiado de Maps. Solo si el campo está vacío y solo si lo
   copiado parece un link de Maps o un Place ID: el portapapeles puede traer
   cualquier cosa. El navegador manda —puede negar el permiso o enseñar su propio
   botón de pegar, en iOS siempre—, y si no deja, no pasa nada.
2. **Pegar a mano** lo lee igual, como siempre.
3. **Salir del campo** también: hay teclados de móvil y menús de compartir que
   meten el texto sin lanzar un `paste`, y entonces parecía que el campo no hacía
   nada.

*Leer la URL* se queda para cuando ninguna de las tres salte. Las tres pasan por
`leerElLink()`, que no vuelve a leer lo que ya se leyó.

No basta con esconder el botón —`pintarVista()` devuelve cualquier otra vista a
Órdenes, y `liquidaciones` responde 403 a quien no sea el superadmin—. Esconder
la pestaña y seguir sirviendo el dato no esconde nada.

Sus ventas **sí siguen saliendo en el mapa de la casa**, aunque él no lo vea: el
mapa existe para no mandar a dos personas al mismo sitio, y con los locales de un
vendedor en blanco dejaría de servir para eso. Por eso el panel de un vendedor
carga los puntos aunque no los pinte: sin ellos, aceptar una orden de un local que
ya tenía punto crearía uno repetido en vez de actualizarlo.

## Cómo pagó, y quién le debe a quién

Al aceptar una orden se marca **Efectivo · Transferencia · Otro**. Va escrito en
cada tarjeta, igual que la fecha y el precio, así que viaja con ellas en
`porVenta()` y reeditar una orden no lo borra.

### La deuda es una resta, no una lista de marcas

Un vendedor **cobra la venta entera** y se queda su porcentaje, así que le queda
debiendo el resto a la casa. Lo que no se hace es marcar orden por orden: él
entrega plata cuando puede, no venta por venta.

En vez de eso se apunta cada entrega en `l:<id>` y la deuda es la resta:

```
debe = (facturado − su comisión) − lo que ya haya entregado
```

Así un abono parcial no necesita nada especial. De $64.340 que debía, entrega
$40.000 y quedan $24.340; la próxima vez el campo ya viene con esa cifra.

**Solo el superadmin apunta entregas**, porque es quien recibe. Se guarda con
quién la recibió —Felipe o Nicolás— y la nota, y se puede borrar si se apuntó
mal.

### Lo que ve cada uno

En **Cuentas**, por vendedor: facturado, lo que se lleva, lo que va para la casa
y lo que **debe**, en rojo hasta que quede en «al día». Debajo del nombre, en qué
pagaron sus clientes: *«3 piezas · $68.800 en efectivo · $49.900 en
transferencia»*.

El vendedor no ve nada de esto: su pestaña **Lo mío** se retiró y las
liquidaciones son del superadmin también en el servidor.

### El método de pago no cambia quién debe

Se apunta y se enseña, pero la deuda se calcula igual con efectivo que con
transferencia: el trato es que **el vendedor cobra y entrega la parte de la
casa**. Si algún día una transferencia entra directo a la cuenta de la casa, ese
caso habría que modelarlo aparte —la deuda iría al revés—.

### Un vendedor no firma sus comprobantes: los firma su jefe

Cada usuario se crea con un **jefe**, Felipe o Nicolás. El comprobante que recibe
el cliente sale con el nombre y la cédula del jefe, no con los del vendedor.

Y de ahí sale lo importante: **ese ingreso es de quien firma**. El tope de renta
cuenta las ventas de Alexander en la barra de su jefe, no en una suya. Es lo
correcto: el papel salió con la cédula del jefe, así que ante la DIAN el ingreso
es suyo. Lo de Alexander son sus comisiones, que declara por su lado.

Dos atribuciones distintas para la misma venta, y las dos hacen falta:

| | Quién |
|---|---|
| Columna *Vendió*, comisiones, *Lo mío* | quien vendió |
| Comprobante y tope de renta | quien firma |

**El jefe se congela en la venta**, igual que el porcentaje. Si mañana Alexander
pasa de Felipe a Nicolás, los comprobantes que ya firmó Felipe siguen contando
para Felipe: ese papel ya está en manos de un cliente.

Para que el vendedor pueda armar el PDF, `ajustes` le devuelve los datos de su
jefe. No es una fuga: ese nombre y esa cédula salen impresos en cada comprobante
que entrega.

## El mapa de visitas

Una pestaña con un mapa de Ibagué y un punto por cada local que se visitó. Existe
para una sola cosa: **que no vayan dos personas al mismo sitio.**

| Color | Qué quiere decir |
|---|---|
| 🟢 Verde | compraron |
| 🟡 Amarillo | hay conversación abierta |
| ⚪ Gris | se pasó por ahí y no salió nada |

**Cualquiera aporta y cualquiera lo ve**, sea superadmin o vendedor. Es lo único
que se comparte de lado a lado.

### Las dos cosas que no son de todos

**Quién puso cada punto.** Solo el superadmin lo ve. Para los demás el mapa es
anónimo, que es lo que lo vuelve útil sin volverlo un marcador de quién trabaja
más.

**Los amarillos ajenos.** Un amarillo es una conversación abierta y es de quien la
abrió. Cualquier otro lo ve **gris** —«por ahí ya pasaron»— y con eso le basta
para no volver, sin enterarse de que hay algo cocinándose ni con quién.

**Eso vale también para el superadmin.** Si Alexander está hablando con alguien,
que Felipe tampoco se aparezca por ahí: el mapa sirve para lo mismo mire quien
mire. El superadmin ve el nombre de quién puso el punto, pero no el color ni la
nota de una conversación que no es suya.

La nota se va con el color, que si no el gris sería mentira.

Las dos reglas viven en el Worker, no en el panel: los puntos llegan ya
recortados. No hay nada que mirar en la respuesta.

Un punto es de quien lo puso: editarlo o borrarlo siendo otro devuelve `403`, y
**el mapa solo abre los propios, también para el superadmin**. No es cortesía: un
punto ajeno le llega degradado a gris, y guardarlo así le borraría el amarillo a
su dueño. Si dos personas visitan el mismo local, cada una tiene el suyo.

### Cómo se marca

**Marcar dónde estoy** usa el GPS del teléfono: sales del local, tocas el botón y
el punto queda donde estás, sin buscar la calle ni saber en qué dirección
estabas. Tocar el mapa sirve para marcarlos después, desde la casa.

### El verde nace solo

Cobrar una orden es la definición de un punto verde, así que no se pide aparte:
al aceptar, el punto se marca o se actualiza sin tocar nada.

Las coordenadas salen del `@lat,lng` que el link largo de Maps lleva en la
mitad —estaba ahí desde siempre y lo tirábamos—. Se guardan en la tarjeta al
crear la orden, porque entre crear y cobrar pueden pasar días.

El sitio viaja por tres sitios y hay que ponerlo en los tres: en la llamada al
servidor, **en el parche local de la tarjeta** y de ahí a la orden. Faltaba el del
medio, así que la orden no sabía dónde estaba hasta darle a Refrescar y el verde
solo nacía si cobrabas después de refrescar. Mismo error que el del nombre del
negocio: lo que el servidor guarda y lo que el panel parchea tenían que coincidir.

Sin coordenadas —órdenes de antes de esto, o un Place ID pegado a mano— no se
marca nada: inventarle un sitio al local sería peor que no tenerlo. Y si ya
había un amarillo tuyo en ese local, pasa a verde **conservando la nota**.

Pero no marcar nada **no puede hacerse en silencio**. Dos ventas de un mismo día
no aparecieron en el mapa y desde el panel eran indistinguibles de dos ventas
bien marcadas: el aviso decía "aceptada" y nada más. Ahora el aviso solo dice
"· en verde en el mapa" cuando de verdad quedó, y cuando no, sale un segundo
aviso diciendo que esa orden no guardó dónde queda y que el local está
esperando en **Sin marcar**.

Es el mismo error que el de *Cancelar*: una función que se sale temprano, quien
la llama ignorando lo que devuelve, y el aviso afirmando lo que no comprobó.
Una salida temprana que el que llama no puede distinguir del éxito es un bug
esperándose, aunque el `return` sea correcto.

Si el mapa falla, el cobro no se cae: ya quedó guardado antes.

Los mapas son de **Leaflet con teselas de OpenStreetMap**: sin llave de API y sin
costo, a diferencia de Google Maps. La caja del mapa se crea al entrar a la
pestaña y no antes: Leaflet mide su contenedor al nacer, y con la pestaña oculta
nacería de cero píxeles y se quedaría gris.

### Cuando una orden se queda sin piezas

En la calle nadie le da a *Cancelar*. Lo que pasa es esto: un local queda en
stand by, el acrílico hace falta para el cliente de mañana, y se reutiliza
escaneándolo dentro de otra orden. La orden vieja se queda sin piezas y —como se
deduce de ellas— **desaparece sin dejar rastro**. Con ella se iba lo único que
importaba: que ese local puede llamar.

Así que la pregunta salta ahí, **al guardar la orden nueva**:

```
Chingones se quedó sin piezas
Le quitaste las que tenía, así que esa orden ya no existe. ¿Qué pasó con el local?

  Quedó en stand by  → amarillo en tu mapa
  No les interesó    → gris, para que nadie del equipo vuelva
  Fue un error       → nada
```

No en el escaneo: se escanean cinco seguidas y una ventana en medio estorba. Al
guardar ya se sabe qué órdenes murieron, y se pregunta por todas en fila.

La misma ventana sale al darle a *Cancelar*, que además libera las piezas. Es la
otra puerta por la que muere una orden, y las dos acaban en el mismo sitio: la
orden se va, la visita se queda en el mapa.

Si la orden no tiene coordenadas, **primero se le pregunta a Google por el
placeId** y normalmente con eso basta: ni se entera nadie. Pedirle el link al
vendedor era pedirle dos veces lo mismo —ese link ya lo pegó al crear la orden,
de ahí salió el placeId—.

Solo si Google tampoco lo conoce se abre la ventana del punto, con el nombre y el
color ya puestos, pidiendo el link o un toque en el mapa. Y ese es justo el
último momento en que el dato existe: en cuanto se cierre, del local no queda
nada.

Las cuatro puertas por las que se marca un local —aceptar, cancelar, quedarse sin
piezas, y tocarlo en *Sin marcar*— pasan todas por `sitioDe()`, que mira las
coordenadas de la orden y si no, el placeId. Una sola puerta, un solo sitio donde
equivocarse.

**La pregunta se hace siempre, tenga coordenadas o no.** La cola de vaciadas
filtraba por `lat && lng`, y eso se comía justo el caso común: las órdenes viejas
no las tienen y desaparecían calladas, que es el agujero que la ventana venía a
tapar. La pregunta no es «dónde queda», es «qué pasó con el local». Y no depende
de quién haya entrado: le sale igual al superadmin y a un vendedor.

**El aviso dice solo lo que de verdad pasó.** Antes daba por hecho que el punto
quedaba y lo anunciaba igual, así que las órdenes sin coordenadas se cancelaban
diciendo «queda en tu mapa» sin que quedara nada. `dejarEnElMapa()` devuelve si
pudo, y el texto se arma con eso.

**De paso, un error viejo.** `cerrarTarjeta()` vacía el formulario, y el código
leía el nombre del negocio *después* de cerrar: llegaba en blanco. La orden recién
creada no aparecía hasta darle a Refrescar, y el aviso decía «Orden de creada».
Ahora el nombre se guarda antes de cerrar.

### Los que faltan por marcar

Un mapa vacío no dice qué hacer con él. Encima de él va la lista de locales que
ya son órdenes y todavía no tienen punto:

```
Sin marcar:  [Capoluz]  [Chingones]  [Panadería del Jordán]
```

El problema nunca fue marcarlos —eso es un toque— sino acordarse de cuáles
faltan. Tocando uno:

- **Si la orden ya sabe dónde queda** —se creó pegando el link de Maps— se pone
  ahí mismo, de un toque. Verde si está cobrada, amarillo si sigue pendiente.
- **Si no** —las órdenes de antes de que guardáramos coordenadas— se abre la
  ventana con el nombre y el color ya puestos, y dos caminos: **pegar su link de
  Maps**, que deja el punto exacto, o cerrar y tocar el mapa a ojo.

El botón desaparece de la lista en cuanto el local tiene su punto.

### Las coordenadas del local, no las del encuadre

Un link de Maps lleva **dos** juegos de coordenadas y no son el mismo:

| | Qué es |
|---|---|
| `@lat,lng` | dónde estaba **centrado el mapa** al copiar el link |
| `!3dlat!4dlng` | dónde está **el local** |

Los links cortos compartidos desde la app no traen ninguno de los dos. Arriba
está por qué, y por qué el HTML tampoco vale.

Usábamos el primero, y por eso los puntos caían corridos media cuadra: el centro
del encuadre no es el negocio, sobre todo porque Google desplaza la vista para
hacerle sitio al panel de la ficha. En un caso real la diferencia eran 79 metros.

Ahora se prefiere `!3d/!4d` y se cae al `@` solo si no está. Google y OSM usan las
mismas coordenadas —WGS84—, así que no había nada que convertir: solo estábamos
leyendo el número equivocado.

El campo del link se queda siempre en la ventana del punto, también en los que ya
existen: pegándolo otra vez, un punto torcido se recoloca solo.

Tres formas en que un link llegaba y no se entendía, todas arregladas:

| | |
|---|---|
| `maps.app.goo.gl/…` —el del botón de compartir, el que sale del teléfono— | lo abre el Worker y devuelve la URL larga, igual que en el formulario de la orden |
| Con los `!` escapados como `%21` —pasa al viajar por WhatsApp— | se mira también la versión descodificada |
| Sin identificador de negocio, solo `/maps/@lat,lng` | a un punto le basta con saber dónde queda; quién es no hace falta |

Y el mensaje dice de dónde salieron las coordenadas: *«las del local»* o *«ojo, ese
link solo trae el centro del mapa»*. Un punto puesto desde el encuadre puede
quedar corrido, y conviene saberlo antes de fiarse de él.

**Por qué no se buscan solas.** Sería fácil mandar el nombre del local a un
geocodificador gratis y quedarse con lo que conteste. Pero con negocios pequeños
de Ibagué acierta poco, y su forma de fallar es la mala: no dice «no sé», deja un
punto plausible en el barrio de al lado. En un mapa que existe para armar rutas,
eso manda a alguien a manejar para nada. Un punto que no está se nota; uno que
miente, no.
