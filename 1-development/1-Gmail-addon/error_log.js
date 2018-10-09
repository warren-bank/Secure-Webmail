function log_error(ss, e) {
  var range = ss.getRange(ss.getLastRow()+1, 1, 1, 2)
  var values = [[new Date(), e]]
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
