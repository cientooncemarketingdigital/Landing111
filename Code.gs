/**
 * ============================================================
 * 111 PADEL GROWTH — API de captura de leads (Google Apps Script)
 * ============================================================
 * Recibe los datos del formulario de la landing (JSON) y los guarda
 * como fila nueva en la hoja "Leads" de tu Google Sheet. No usa
 * Formspree, Zapier, Make ni ningún servicio externo — esto ES la
 * API propia, corriendo sobre la infraestructura de Google.
 *
 * ------------------------------------------------------------
 * UNA ACLARACIÓN TÉCNICA IMPORTANTE (léela, evita que se rompa):
 * ------------------------------------------------------------
 * Los Web Apps de Apps Script NO permiten configurar headers de CORS
 * personalizados en la respuesta al preflight (la petición OPTIONS
 * que el navegador dispara automáticamente cuando un fetch() manda
 * el header "Content-Type: application/json"). Si tu frontend manda
 * el JSON con ese header, el navegador va a bloquear la respuesta
 * por CORS y el dato nunca va a llegar al Sheet, aunque el código de
 * acá esté perfecto.
 *
 * La solución real (no teórica, es el approach que efectivamente
 * funciona en producción con Apps Script) es que el frontend mande
 * el body con "Content-Type: text/plain" en lugar de
 * "application/json". text/plain es un tipo de contenido "simple"
 * para CORS, así que el navegador NO dispara preflight — pero el
 * contenido del body sigue siendo JSON real, texto plano con forma
 * de JSON, y acá lo parseamos con JSON.parse() como cualquier JSON.
 * Fijate el código del frontend que te paso más abajo: usa
 * exactamente ese approach.
 * ============================================================
 */

// --------------------------------------------------------------
// CONFIGURACIÓN — completá esto antes de desplegar
// --------------------------------------------------------------

// ID de tu Google Sheet (NO el nombre del archivo, el ID de la URL).
// Ejemplo: si tu Sheet está en
//   https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit
// el ID es:
//   1AbCdEfGhIjKlMnOpQrStUvWxYz
// Usamos openById() (no getActiveSpreadsheet()) para que esto siga
// funcionando aunque cambies el nombre del archivo o de dónde se
// dispare la ejecución — tal como pediste.
const SPREADSHEET_ID = 'PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET';

// Nombre exacto de la hoja (pestaña) donde se guardan los leads.
// Si no existe, el script la crea sola la primera vez que corre.
const SHEET_NAME = 'Leads';

// Campos que esperamos recibir desde la landing, en el orden en que
// se van a escribir en la hoja. Si alguno no llega en el request,
// se guarda como string vacío — punto 5 de tu pedido.
const FIELDS = ['nombre', 'club', 'cargo', 'pais', 'email', 'mensaje'];

// Longitud máxima permitida por campo, como protección básica contra
// abuso (alguien mandando textos gigantes para romper la planilla).
const MAX_FIELD_LENGTH = 1000;

// --------------------------------------------------------------
// PUNTO DE ENTRADA
// --------------------------------------------------------------

/**
 * Se ejecuta automáticamente cada vez que la landing hace un POST
 * a la URL de este Web App. Este es el único requisito real que
 * pide Apps Script: una función llamada exactamente doPost(e).
 */
function doPost(e) {
  try {
    // 1) Parsear y validar el body.
    const payload = parseRequestBody_(e);
    validatePayload_(payload);

    // 2) Filtro anti-spam básico: si viene un campo "honeypot" lleno
    //    (un input invisible para humanos, ver nota en el frontend),
    //    respondemos éxito falso sin guardar nada. Esto es opcional:
    //    si tu formulario no manda ese campo, esta línea no hace nada.
    if (payload._hp) {
      return jsonResponse_({ success: true });
    }

    // 3) Conseguir (o crear) la hoja "Leads".
    const sheet = getOrCreateSheet_();

    // 4) Armar la fila: fecha/hora + cada campo esperado, en orden.
    const row = buildRow_(payload);

    // 5) Escribir la fila. Usamos un Lock para que, si llegan dos
    //    envíos exactamente al mismo tiempo, no se pisen entre sí.
    //    Esto es lo que permite escalar de forma segura a muchos
    //    registros sin perder filas por condiciones de carrera.
    const lock = LockService.getScriptLock();
    lock.waitLock(10000); // espera hasta 10s si otra ejecución está escribiendo
    try {
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    // 6) Responder éxito, exactamente en el formato pedido.
    return jsonResponse_({ success: true });

  } catch (err) {
    // 7) Cualquier error (JSON inválido, falta el Sheet, etc.) se
    //    loguea para poder verlo en el editor de Apps Script
    //    (menú "Ejecuciones") y se responde de forma prolija, sin
    //    tirar un HTML de error genérico de Google.
    console.error('Error en doPost: ' + err);
    return jsonResponse_({ success: false, error: String(err) });
  }
}

/**
 * doGet opcional: sirve solo para poder chequear desde el navegador,
 * a mano, que el deploy está online (entrando a la URL /exec te
 * debería aparecer este mensaje en vez de un error). No lo usa la
 * landing para nada.
 */
function doGet(e) {
  return jsonResponse_({
    status: 'ok',
    message: '111 Padel Growth API — activa. Este endpoint solo acepta POST.'
  });
}

// --------------------------------------------------------------
// FUNCIONES INTERNAS
// --------------------------------------------------------------

/**
 * Extrae y parsea el JSON del cuerpo del request. Tira una excepción
 * clara si el body viene vacío o mal formado, en vez de romper con
 * un error críptico más abajo.
 */
function parseRequestBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Request sin body (postData.contents vacío).');
  }
  try {
    return JSON.parse(e.postData.contents);
  } catch (parseError) {
    throw new Error('El body no es JSON válido: ' + parseError);
  }
}

/**
 * Validación básica de seguridad/integridad antes de escribir en la
 * planilla: rechaza payloads vacíos, valida el formato del email si
 * vino completado, y recorta campos demasiado largos.
 */
function validatePayload_(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload inválido.');
  }

  const hasAtLeastOneField = FIELDS.some(function (f) {
    return payload[f] !== undefined && payload[f] !== null && String(payload[f]).trim() !== '';
  });
  if (!hasAtLeastOneField) {
    throw new Error('El formulario llegó completamente vacío.');
  }

  if (payload.email && String(payload.email).trim() !== '') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(String(payload.email).trim())) {
      throw new Error('El email recibido no tiene un formato válido: ' + payload.email);
    }
  }

  // Recorte defensivo de campos muy largos (protección básica contra
  // abuso/spam masivo de texto).
  FIELDS.forEach(function (f) {
    if (payload[f] && String(payload[f]).length > MAX_FIELD_LENGTH) {
      payload[f] = String(payload[f]).substring(0, MAX_FIELD_LENGTH);
    }
  });
}

/**
 * Devuelve la hoja "Leads" de la planilla. Si no existe todavía, la
 * crea con encabezados y la primera fila congelada.
 */
function getOrCreateSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Fecha', 'Nombre', 'Club', 'Cargo', 'País', 'Email', 'Mensaje']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Arma el array de valores para la fila nueva: fecha/hora + cada
 * campo esperado, en el orden de FIELDS, vacío si no vino.
 */
function buildRow_(payload) {
  const now = new Date();
  const timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');

  const row = [timestamp];
  FIELDS.forEach(function (field) {
    const value = (payload[field] !== undefined && payload[field] !== null)
      ? String(payload[field])
      : '';
    row.push(value);
  });
  return row;
}

/**
 * Arma una respuesta JSON estándar, con el Content-Type correcto.
 */
function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
