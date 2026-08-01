111 PADEL GROWTH — LANDING PAGE
================================

QUÉ HAY EN ESTA CARPETA
------------------------
index.html                              -> la landing completa (HTML/CSS/JS en un solo archivo)
assets/111-Padel-Business-Report.pdf    -> el informe real, se descarga desde acá mismo

IMPORTANTE: no cambies los nombres de archivo ni la estructura de carpetas.
El botón de descarga depende de que el PDF esté exactamente en assets/.


CÓMO SUBIRLO A GITHUB PAGES (paso a paso)
------------------------------------------
1. Entrá a github.com y creá un repositorio nuevo.
   - Nombre sugerido: 111-padel-growth
   - Público (GitHub Pages gratis requiere que sea público, salvo que tengas plan pago)

2. Subí los archivos de esta carpeta al repositorio:
   - Opción fácil: en la página del repo, botón "Add file" -> "Upload files"
   - Arrastrá index.html y la carpeta assets/ completa (con el PDF adentro)
   - Hacé commit

3. Activá GitHub Pages:
   - Andá a Settings -> Pages (menú izquierdo)
   - En "Source" elegí la rama "main" y la carpeta "/ (root)"
   - Guardá

4. Esperá 1-2 minutos. GitHub te va a dar una URL tipo:
   https://TU-USUARIO.github.io/111-padel-growth/

5. Entrá a esa URL y probá TODO en un navegador real:
   - Los 3 botones de "Descargar el informe" (header, hero, sección 2) -> deben
     scrollear al formulario
   - Completá el formulario y enviá -> debería:
       a) mostrar la pantalla de agradecimiento
       b) descargar el PDF automáticamente
       c) aparecer una fila nueva en tu Google Sheet
   - Botón "Descargar el PDF" (pantalla de agradecimiento) -> descarga directa
   - Botones de WhatsApp, Email y LinkedIn -> deben abrir cada uno correctamente


SI QUERÉS UN DOMINIO PROPIO MÁS ADELANTE
------------------------------------------
GitHub Pages permite conectar un dominio personalizado (ej: 111padelgrowth.com)
gratis, desde Settings -> Pages -> Custom domain. Cuando lo tengas, avisame y
te ayudo con esa parte.


PENDIENTES QUE TODAVÍA TENÉS QUE RESOLVER VOS
------------------------------------------------
1. Probar el formulario ya publicado y confirmar que la fila llegue completa
   a tu Google Sheet (6 columnas: nombre, club, cargo, país, email, mensaje).
2. El botón "Agendar 20 minutos" (pantalla de agradecimiento) todavía usa un
   link de Calendly de ejemplo que no existe. Buscá en index.html la variable
   CALENDLY_URL (cerca del final del archivo, dentro del <script>) y
   reemplazala por tu link real, o avisame y lo conecto a WhatsApp/Email.
