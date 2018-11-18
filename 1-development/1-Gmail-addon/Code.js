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
