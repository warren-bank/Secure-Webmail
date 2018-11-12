function log_error(ss, e) {
  var range = ss.getRange(ss.getLastRow()+1, 1, 1, 3)
  var values = [[new Date(), user.email, e]]
  range.setValues(values)
}

function log_server_error(e){
  var ss = SpreadsheetApp.openById(spreadsheet_id.errors).getSheetByName('errors_server')
  log_error(ss, e)
}

function log_client_error(e){
  var ss = SpreadsheetApp.openById(spreadsheet_id.errors).getSheetByName('errors_client')
  log_error(ss, e)
}
