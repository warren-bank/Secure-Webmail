function get_error_string_chunks(e) {
  try {
    var props = Object.getOwnPropertyNames(e)
    var i, prop
    var str = ''

    str += '{'
    for (i=0; i < props.length; i++) {
      prop = props[i]
      if (i>0) str += ', '
      str += '"' + prop + '": ' + JSON.stringify(e[prop])
    }
    str += '}'

    // prevent error: "Your input contains more than the maximum of 50000 characters in a single cell."
    var chunks = str.match(/.{1,50000}/g)
    return chunks
  }
  catch(err){
    return [e.message, err.message]
  }
}

function log_error(ss, e) {
  var string_chunks = get_error_string_chunks(e)
  var last_column_index = 2 + string_chunks.length
  var row_data = [new Date(), state.email_address].concat(string_chunks)

  var range = ss.getRange(ss.getLastRow()+1, 1, 1, last_column_index)
  var values = [row_data]
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
