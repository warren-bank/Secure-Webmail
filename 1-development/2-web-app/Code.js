var app = {
  title:   'Secure Webmail',
  version: '0.1.0'
}

var spreadsheet_id = {
  errors: '1m2Hl0fThhZ1MvYJI48o5rWI8BhYuTTKmRFh-kBCZIa4'
}

var state = {
  email_address: Session.getEffectiveUser().getEmail().toLowerCase(),
  thread_id:     ''
}

function get_error_response(msg) {
  return HtmlService.createHtmlOutput().setTitle(app.title).setContent(msg).setSandboxMode(HtmlService.SandboxMode.NATIVE)
}

function doGet(e) {
  var html
  try {
    if (e && e.parameter && e.parameter.tid) {
      state.thread_id = e.parameter.tid
    }

    html = HtmlService.createTemplateFromFile('index').evaluate().setTitle(app.title).setSandboxMode(HtmlService.SandboxMode.NATIVE)
  }
  catch(err) {
    log_server_error(err)

    html = get_error_response(err.name + ' on line: ' + err.lineNumber + ' -> ' + err.message)
  }
  return html
}

function get_folders() {
  var folders = [
    {
      name:   "Inbox",
      unread: GmailApp.getInboxUnreadCount()
    },
    {
      name:   "Priority Inbox",
      unread: GmailApp.getPriorityInboxUnreadCount()
    },
    {
      name:   "Starred",
      unread: GmailApp.getStarredUnreadCount()
    },
    {
      name:   "Chat",
      unread: 0
    },
    {
      name:   "Spam",
      unread: GmailApp.getSpamUnreadCount()
    },
    {
      name:   "Trash",
      unread: 0
    }
  ]

  return folders
}

function get_threads_in_folder(folder_name, body_length, start, max) {
  start = start ||  0
  max   = max   || 25

  var threads = []

  var process_threads = function(oThreads) {
    if (!oThreads || !oThreads.length) return

    oThreads.forEach(function(oThread){
      try {
        var oMessages, m0, m9, thread

        oMessages = oThread.getMessages()
        if (!oMessages || !oMessages.length) return

        m0 = oMessages[0]
        m9 = oMessages[ oMessages.length - 1 ]

        thread = {
          thread_id:       oThread.getId(),                                                  // String
          summary: {
            from:          m0.getFrom(),                                                     // String
            subject:       m0.getSubject(),                                                  // String
            body:          (body_length ? m9.getPlainBody().substring(0, body_length) : ''), // String
            date_created:  m0.getDate().getTime(),                                           // Number (UTC timestamp in ms)
            date_modified: m9.getDate().getTime(),                                           // Number (UTC timestamp in ms)
            msg_count:     oMessages.length                                                  // Number
          },
          settings: {
            star:          oThread.hasStarredMessages(),                                     // Boolean
            important:     oThread.isImportant(),                                            // Boolean
            unread:        oThread.isUnread(),                                               // Boolean
            trash:         oThread.isInTrash(),                                              // Boolean
            spam:          oThread.isInSpam(),                                               // Boolean
            inbox:         oThread.isInInbox()                                               // Boolean
          }
        }

        threads.push(thread)
      }
      catch(err) {
        log_client_error(err)
      }
    })
  }

  try {
    switch (folder_name.toLowerCase()) {
      case 'inbox':
        process_threads( GmailApp.getInboxThreads(start, max) )
        break
      case 'priority inbox':
        process_threads( GmailApp.getPriorityInboxThreads(start, max) )
        break
      case 'starred':
        process_threads( GmailApp.getStarredThreads(start, max) )
        break
      case 'chat':
        process_threads( GmailApp.getChatThreads(start, max) )
        break
      case 'spam':
        process_threads( GmailApp.getSpamThreads(start, max) )
        break
      case 'trash':
        process_threads( GmailApp.getTrashThreads(start, max) )
        break
      default:
        throw new Error('ERROR: Cannot find threads in unknown folder "' + folder_name + '"')
    }
  }
  catch(err) {
    log_client_error(err)
  }

  // all primitives; no serialization is needed
  return threads
}

function get_thread(thread_id) {
  var thread = {
    messages: [],
    participants: []
  }

  var email_pattern = /[^\s,<>]+@[^\s,<>]+/g
  var parse_emails  = function(str) {
    var emails = (typeof str === 'string') ? str.match(email_pattern) : []
    return emails
  }

  var process_messages = function(oMessages) {
    if (!oMessages || !oMessages.length) return

    var participants = {}

    oMessages.forEach(function(oMessage){
      try {
        var emails, attachments, message

        emails = {
          from: parse_emails( oMessage.getFrom() ),
          to:   []
        }

        if (!emails.from || !emails.from.length) {
          log_client_error('ERROR: unable to parse "from" email address in string "' + oMessage.getFrom() + '"')
          return
        }

        if (emails.from.length > 1) {
          log_client_error('WARNING: parsed multiple "from" email addresses in string "' + oMessage.getFrom() + '"')
        }

        emails.to.push(oMessage.getTo())
        emails.to.push(oMessage.getCc())
        emails.to.push(oMessage.getBcc())

        emails.to = parse_emails( emails.to.join(',').toLowerCase() )

        emails.to.forEach(function(email){
          participants[email] = true
        })

        emails.from.forEach(function(email){
          participants[email] = true
        })

        emails.from = emails.from[0]

        attachments = []

        var process_attachments = function(oAttachments) {
          if (!oAttachments || !oAttachments.length) return

          oAttachments.forEach(function(oAttachment){
            try {
              var attachment = {
                data:        oAttachment.getDataAsString(),
                contentType: oAttachment.getContentType(),
                name:        oAttachment.getName()
              }

              attachments.push(attachment)
            }
            catch(err) {
              log_client_error(err)
            }
          })
        }
        process_attachments( oMessage.getAttachments() )

        message = {
          message_id:    oMessage.getId(),            // String
          summary: {
            from:        emails.from,                 // String
            to:          emails.to,                   // Array of String
            timestamp:   oMessage.getDate().getTime() // Number (UTC timestamp in ms)
          },
          contents: {
            body:        oMessage.getPlainBody(),     // String
            attachments: attachments                  // Array of Object {data: string, contentType: string, name: string}
          },
          settings: {
            star:        oMessage.isStarred(),        // Boolean
            unread:      oMessage.isUnread(),         // Boolean
            trash:       oMessage.isInTrash()         // Boolean
          }
        }

        thread.messages.push(message)
      }
      catch(err) {
        log_client_error(err)
      }
    })

    delete participants[state.email_address]
    thread.participants = Object.keys(participants)
  }

  try {
    var oThread = GmailApp.getThreadById(thread_id)
    if (oThread) process_messages( oThread.getMessages() )
  }
  catch(err) {
    log_client_error(err)
  }

  // all primitives; no serialization is needed
  return thread
}

function update_thread(thread_id, options) {
  try {
    var oThread = GmailApp.getThreadById(thread_id)
    if (!oThread) return false

    if (typeof options.important === 'boolean') {
      if (options.important)
        oThread.markImportant()
      else
        oThread.markUnimportant()
    }

    if (typeof options.unread === 'boolean') {
      if (options.unread)
        oThread.markUnread()
      else
        oThread.markRead()
    }

    if (typeof options.trash === 'boolean') {
      if (options.trash)
        oThread.moveToTrash()
    }

    if (typeof options.spam === 'boolean') {
      if (options.spam)
        oThread.moveToSpam()
    }

    if (typeof options.inbox === 'boolean') {
      if (options.inbox)
        oThread.moveToInbox()
    }

    return true
  }
  catch(err) {
    log_client_error(err)

    return false
  }
}

function update_message(message_id, options) {
  try {
    var oMessage = GmailApp.getMessageById(message_id)
    if (!oMessage) return false

    if (typeof options.star === 'boolean') {
      if (options.star)
        oMessage.star()
      else
        oMessage.unstar()
    }

    if (typeof options.unread === 'boolean') {
      if (options.unread)
        oMessage.markUnread()
      else
        oMessage.markRead()
    }

    if (typeof options.trash === 'boolean') {
      if (options.trash)
        oMessage.moveToTrash()
    }

    return true
  }
  catch(err) {
    log_client_error(err)

    return false
  }
}

// throws
function set_public_key(public_key) {
  dataStore.set_public_key(state.email_address, public_key)
}

// throws
function get_public_key(email_address) {
  return dataStore.get_public_key(email_address)
}

function get_public_keys(emails) {
  var keys = {}

  if (emails && Array.isArray(emails) && emails.length) {
    emails.forEach(function(email_address){
      try {
        keys[email_address] = get_public_key(email_address)
      }
      catch(err) {}
    })
  }
  return keys
}

function send_reply_to_thread(thread_id, body, cc, attachments) {
  try {
    var oThread = GmailApp.getThreadById(thread_id)
    if (!oThread) return false

    if (!cc && !attachments) {
      oThread.reply(body)
    }
    else {
      var options = {}

      if (cc) {
        if (typeof cc === 'string') options.cc = cc
        else if (Array.isArray(cc)) options.cc = cc.join(',')
      }

      if (attachments && Array.isArray(attachments) && attachments.length) {
        var process_attachment = function(attachment) {
          var data        = attachment.data         // String => ex: 'data:[<mediatype>][;base64],<data>' URI
          var contentType = attachment.contentType  // String => ex: 'text/plain'
          var name        = attachment.name         // String => ex: 'body.txt'

          var blob = Utilities.newBlob(data, contentType, name)
          return blob
        }
        options.attachments = attachments.map(function(attachment){ return process_attachment(attachment) })
      }
      oThread.reply(body, options)
    }

    return true
  }
  catch(err) {
    log_client_error(err)

    return false
  }
}
