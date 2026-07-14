/**
 * Arjun & Sandra — RSVP webhook for Google Sheets
 *
 * Deploy as a web app (Execute as: Me, Who has access: Anyone) and paste the
 * /exec URL into RSVP_SHEETS_URL in js/script.js.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Attending',
        'Name',
        'Mobile',
        'Email',
        'Adults',
        'Children',
        'Message / Wishes'
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.attending || '',
      data.name || '',
      data.mobile || '',
      data.email || '',
      data.adults !== undefined && data.adults !== null ? data.adults : '',
      data.children !== undefined && data.children !== null ? data.children : '',
      data.message || data.wishes || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
