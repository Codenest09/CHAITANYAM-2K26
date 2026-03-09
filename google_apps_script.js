// ===================================================
// CHAITANYAM 2K26 - Google Apps Script for Google Sheets
// ===================================================
// 
// HOW TO SET UP:
// 1. Go to Google Sheets → create a new spreadsheet
// 2. Name it "CHAITANYAM 2K26 - Registrations"
// 3. Go to Extensions → Apps Script
// 4. Delete existing code and paste THIS entire file
// 5. Click "Deploy" → "New deployment"
// 6. Select type: "Web app"
// 7. Set "Execute as": "Me"
// 8. Set "Who has access": "Anyone"
// 9. Click "Deploy" and copy the Web App URL
// 10. Paste the URL into script.js (replace 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE')
//
// ===================================================

// Handle POST requests from the registration form
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);
    
    // Add headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Full Name',
        'PIN Number',
        'Class',
        'Year',
        'Branch',
        'Phone Number',
        'Email',
        'UTR Number'
      ]);
      
      // Style the header row
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4a90d9');
      headerRange.setFontColor('#ffffff');
      headerRange.setHorizontalAlignment('center');
      
      // Freeze header row
      sheet.setFrozenRows(1);
      
      // Auto-resize columns
      for (var i = 1; i <= 9; i++) {
        sheet.setColumnWidth(i, 150);
      }
    }
    
    // Get current timestamp in IST (Indian Standard Time)
    var timestamp = Utilities.formatDate(
      new Date(), 
      'Asia/Kolkata', 
      'dd-MM-yyyy HH:mm:ss'
    );
    
    // Append the registration data as a new row
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.pin || '',
      data.class || '',
      data.year || '',
      data.branch || '',
      data.phone || '',
      data.email || '',
      data.utr || ''
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'message': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 'status': 'CHAITANYAM 2K26 Registration API is active' }))
    .setMimeType(ContentService.MimeType.JSON);
}
