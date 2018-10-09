var app = {
  title:   'Secure Webmail',
  version: '0.1.0'
}

// reminder: URL needs to be added to "urlFetchWhitelist" in "appsscript.json"
var webapp_URL = 'https://script.google.com/macros/s/AKfycbxnc0ZHqZ-Yp-DYABFGTOc0xztb1l4iJ2T0rVmVk2WL3W09ay4/exec?tid='

var spreadsheet_id = {
  errors: '1SxaglFJxy8z1ViwWDsrMZM2TiXzUw43Cco1D9r2DVzk'
}

var user = {
  email: Session.getEffectiveUser().getEmail().toLowerCase()
}

var current_email = {
  thread_id: null
}

var process_current_email = function(e) {
  var accessToken, messageId, thread

  accessToken = e.messageMetadata.accessToken
  messageId   = e.messageMetadata.messageId

  GmailApp.setCurrentMessageAccessToken(accessToken)

  thread = GmailApp.getMessageById(messageId).getThread()

  current_email.thread_id = thread.getId()
}

function startApp(e) {
  try {
    process_current_email(e)

    return buildCard()
  }
  catch(e) {
    log_server_error(e)
  }
}
