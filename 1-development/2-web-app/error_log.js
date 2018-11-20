function convert_error_object_to_string_(e) {
  if (typeof e === 'object') {
    if (e === null) return null

    try {
      var props = Object.getOwnPropertyNames(e)
      if (!props.length) return null

      var i, prop
      var str = ''

      str += '{'
      for (i=0; i < props.length; i++) {
        prop = props[i]
        if (i>0) str += ', '
        str += '"' + prop + '": ' + JSON.stringify(e[prop])
      }
      str += '}'

      return str
    }
    catch(err) {
      return e.message || null
    }
  }
  return e
}

function log_error_(script_name, script_version, script_context, user_email, error) {
  error = convert_error_object_to_string_(error)
  if (!error || (typeof error !== 'string')) return

  var POST_data = JSON.stringify({
    "script_name":    script_name,
    "script_version": script_version,
    "script_context": script_context,
    "user_email":     user_email,
    "error":          error
  })

  var options = {
    "method":                    "post",
    "contentType":               "application/json",
    "payload":                   POST_data,
    "followRedirects":           true,
    "muteHttpExceptions":        true,
    "validateHttpsCertificates": true
  }

  var response = UrlFetchApp.fetch(logger_service_URL, options)
  Logger.log('Log Service response: (' + response.getResponseCode() + ') ' + response.getContentText())
}

function log_server_error(e){
  log_error_(app.title, app.version, 'server', state.email_address, e)
}

function log_client_error(e){
  log_error_(app.title, app.version, 'client', state.email_address, e)
}
