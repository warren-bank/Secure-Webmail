/** @license Secure Webmail
 *
 * Copyright (c) 2018-present, Warren R. Bank
 *
 * canonical source code git repository:
 *   https://github.com/warren-bank/Secure-Webmail
 *
 * This source code is not licensed.
 * This source code is made available to the general public
 * for the purpose of security audit only.
 */

function send_response(is_success) {
  var result = {success: is_success}
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON)
}

function get_error_string_chunks_(str) {
  // prevent error: "Your input contains more than the maximum of 50000 characters in a single cell."

  var chunks = str.match(/.{1,50000}/g)
  return chunks
}

function sanitize_row_data_(row_data) {
  return row_data.map(function(cell_data){
    try {
      if (typeof cell_data !== 'string')
        cell_data = JSON.stringify(cell_data)
      return cell_data.substring(0, 50000)
    }
    catch(err) {
      return ''
    }
  })
}

function log_error_(row_data) {
  row_data = sanitize_row_data_(row_data)

  var ss                = SpreadsheetApp.openById(spreadsheet_id).getSheetByName('errors')
  var last_column_index = row_data.length
  var range             = ss.getRange(ss.getLastRow()+1, 1, 1, last_column_index)
  var values            = [row_data]
  range.setValues(values)
}

function doPost(e) {
  if (!e.postData.length || (e.postData.type !== 'application/json'))
    return send_response(false)

  var data = JSON.parse(e.postData.contents)
  if (
       (typeof data !== 'object')
    || (data === null)
    || (!data.script_name)
    || (!data.script_version)
    || (!data.script_context)
    || (!data.user_email)
    || (!data.error)
    || (typeof data.error !== 'string')
  ) return send_response(false)

  var chunks = get_error_string_chunks_(data.error)
  if (!Array.isArray(chunks) || !chunks.length)
    return send_response(false)

  var row_data = [new Date(), data.script_name, data.script_version, data.script_context, data.user_email].concat(chunks)

  log_error_(row_data)
  return send_response(true)
}
