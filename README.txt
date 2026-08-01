111 PADEL GROWTH — LANDING PAGE (v2, corregida)
==================================================

QUÉ CAMBIÓ EN ESTA VERSIÓN
---------------------------
- El PDF ya NO va dentro de una subcarpeta "assets/". Ahora está SUELTO,
  en la raíz, junto al index.html. Esto es a propósito: la carpeta assets/
  nunca llegó a subirse a tu repo la vez pasada (probablemente el navegador
  no subió la subcarpeta al arrastrarla), así que sacamos ese problema
  de raíz. Ahora solo hay 2 archivos, sin carpetas.
- El botón "Agendar 20 minutos" ya no rompe con un error de Calendly. Como
  todavía no tenés un link real, ese botón ahora te manda a WhatsApp
  automáticamente ("Coordinar por WhatsApp"). Cuando tengas Calendly, avisame
  y lo reconecto.


PASO 1 — BORRAR LO VIEJO DEL REPOSITORIO
-------------------------------------------
1. Andá a https://github.com/cientooncemarketingdigital/Landing111
2. Borrá el archivo index.html viejo (click en el archivo → ícono de tacho
   de basura → Commit changes)
   (Dejá el README.txt viejo, se va a pisar solo en el paso 2)


PASO 2 — SUBIR LOS ARCHIVOS NUEVOS
-------------------------------------
1. En la página principal del repositorio, click en "Add file" → "Upload files"
2. Arrastrá estos DOS archivos sueltos (no carpetas, no el zip comprimido):
   - index.html
   - 111-Padel-Business-Report.pdf
3. Abajo, en "Commit changes", escribí algo como "fix: PDF en la raíz" y
   confirmá con "Commit changes"
4. Esperá 1-2 minutos y volvé a probar en:
   https://cientooncemarketingdigital.github.io/Landing111/
   (puede que necesites hacer Ctrl+Shift+R / Cmd+Shift+R para forzar que
   el navegador no te muestre una versión vieja guardada en caché)


PROBLEMA 2 — TU PROPIA API CON GOOGLE APPS SCRIPT (sin Formspree/Zapier/Make)
------------------------------------------------------------------------------
Ahora el formulario manda los datos directo a un Apps Script propio tuyo
(archivo Code.gs incluido acá), que los guarda en la hoja "Leads" de tu
Google Sheet. Cero servicios externos de por medio.

CÓMO DESPLEGARLO (una sola vez):

1. Creá (o abrí) el Google Sheet donde querés que se guarden los leads.
2. Copiá su ID desde la URL:
   https://docs.google.com/spreadsheets/d/ESTE-ES-EL-ID/edit
3. En ese Sheet, andá a Extensiones → Apps Script.
4. Borrá el código de ejemplo que aparece por default y pegá TODO el
   contenido del archivo Code.gs que te entrego en este paquete.
5. En la línea que dice:
     const SPREADSHEET_ID = 'PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET';
   reemplazá el texto por el ID que copiaste en el paso 2.
6. Guardá el proyecto (ícono de disquete o Ctrl+S).
7. Arriba a la derecha, click en "Implementar" (Deploy) → "Nueva
   implementación" (New deployment).
8. En "Seleccionar tipo" (ícono de engranaje) elegí "Aplicación web"
   (Web app).
9. Configurá:
   - Ejecutar como (Execute as): Yo (tu cuenta)
   - Quién tiene acceso (Who has access): Cualquier usuario (Anyone)
10. Click en "Implementar" (Deploy).
11. Google te va a pedir autorizar permisos (es tu propio script, así
    que es normal que aparezca un aviso de "app no verificada" — click
    en "Avanzado" → "Ir a [nombre del proyecto] (no seguro)" → Permitir).
12. Te va a aparecer una URL que termina en /exec — ESA es tu API. Copiala
    completa.
13. En el index.html, buscá la variable GOOGLE_SCRIPT_URL (dentro del
    <script>, cerca del final del archivo) y pegá ahí esa URL, reemplazando
    la que ya está.

MUY IMPORTANTE — SI EDITÁS EL CÓDIGO DESPUÉS:
Si en el futuro modificás el Code.gs, la URL /exec NO se actualiza sola.
Tenés que ir de nuevo a "Implementar" → "Gestionar implementaciones" →
ícono de lápiz (editar) → cambiar "Versión" a "Nueva versión" → Implementar.
Si no hacés esto, tus cambios en el código nunca se van a reflejar en la
URL que ya está conectada a la landing.

CÓMO PROBAR QUE FUNCIONA:
1. Entrá a Extensiones → Apps Script → menú "Ejecuciones" (Executions),
   ahí ves cada vez que la landing le mandó datos, con éxito o error.
2. O simplemente completá el formulario en tu web publicada y fijate si
   aparece la fila nueva en la hoja "Leads" de tu Sheet.


PROBLEMA 3 — CALENDLY (antiguo)
----------------------------------
El error que viste era porque el link de Calendly que había puesto era de
prueba/inventado, no existía de verdad. Ya lo saqué: ahora ese botón manda
a WhatsApp mientras tanto, así no rompe nada.

Cuando quieras un calendario real:
1. Andá a https://calendly.com y create una cuenta gratis.
2. Creá un "Event type" de 20 minutos (tipo "Llamada de diagnóstico").
3. Copiá el link que te da (algo como
   https://calendly.com/tu-usuario/20min)
4. Pasámelo y lo conecto en el botón "Agendar 20 minutos".
