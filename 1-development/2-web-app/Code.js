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

var state = {
  email_address: Session.getEffectiveUser().getEmail().toLowerCase(),
  thread_id:     '',
  debug:         false
}

var helpers = {}

helpers.include = function(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}

helpers.get_response = function(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate().setTitle(app.title).setSandboxMode(HtmlService.SandboxMode.IFRAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}

helpers.get_error_response = function(msg) {
  return HtmlService.createHtmlOutput().setTitle(app.title).setContent(msg).setSandboxMode(HtmlService.SandboxMode.IFRAME)
}

helpers.disallow_account_mismatch = function(active_email_address) {
  if (active_email_address !== state.email_address)
    throw 'Account Mismatch Error'
}

function doGet(e) {
  var html
  try {
    if (e && e.parameter && e.parameter.tid) {
      state.thread_id = e.parameter.tid
    }

    if (e && e.parameter && e.parameter.debug) {
      state.debug = true
    }

    html = helpers.get_response('index')
  }
  catch(err) {
    log_server_error(err)

    html = helpers.get_error_response(err.name + ' on line: ' + err.lineNumber + ' -> ' + err.message)
  }
  return html
}

function get_folders(active_email_address) {
  helpers.disallow_account_mismatch(active_email_address)

  var folders = [
    {
      folder_name:  "inbox",
      title:        "Inbox",
      unread_count: GmailApp.getInboxUnreadCount()
    },
    {
      folder_name:  "priority-inbox",
      title:        "Priority Inbox",
      unread_count: GmailApp.getPriorityInboxUnreadCount()
    },
    {
      folder_name:  "starred",
      title:        "Starred",
      unread_count: GmailApp.getStarredUnreadCount()
    },
    {
      folder_name:  "sent",
      title:        "Sent",
      unread_count: 0
    },
    {
      folder_name:  "spam",
      title:        "Spam",
      unread_count: GmailApp.getSpamUnreadCount()
    },
    {
      folder_name:  "trash",
      title:        "Trash",
      unread_count: 0
    },
    {
      folder_name:  "chat",
      title:        "Chat",
      unread_count: 0
    }
  ]

  return folders
}

function get_threads_in_folder(active_email_address, folder_name, body_length, start, max) {
  helpers.disallow_account_mismatch(active_email_address)

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
    if (!folder_name || typeof folder_name !== 'string') throw new Error('ERROR [get_threads_in_folder]: Invalid input.')

    switch (folder_name.toLowerCase()) {
      case 'inbox':
        process_threads( GmailApp.getInboxThreads(start, max) )
        break
      case 'priority-inbox':
        process_threads( GmailApp.getPriorityInboxThreads(start, max) )
        break
      case 'starred':
        process_threads( GmailApp.getStarredThreads(start, max) )
        break
      case 'sent':
        process_threads( GmailApp.search('in:sent', start, max) )
        break
      case 'spam':
        process_threads( GmailApp.getSpamThreads(start, max) )
        break
      case 'trash':
        process_threads( GmailApp.getTrashThreads(start, max) )
        break
      case 'chat':
        process_threads( GmailApp.getChatThreads(start, max) )
        break
      default:
        throw new Error('ERROR [get_threads_in_folder]: Cannot find threads in unknown folder "' + folder_name + '"')
    }
  }
  catch(err) {
    log_client_error(err)
  }

  // all primitives; no serialization is needed
  return threads
}

function get_thread(active_email_address, thread_id, html_format, current_message_count, body_length) {
  helpers.disallow_account_mismatch(active_email_address)

  var thread = {
    summary:      null,
    settings:     null,
    messages:     [],
    participants: []
  }

  var email_pattern = /[^\s,<>]+@[^\s,<>]+/g
  var parse_emails  = function(str) {
    var emails = (typeof str === 'string') ? str.match(email_pattern) : []
    return emails
  }

  var add_metadata = function(oMessages) {
    if (!oMessages || !oMessages.length) return

    var m0, m9
    m0 = oMessages[0]
    m9 = oMessages[ oMessages.length - 1 ]

    thread.summary = {
      from:          m0.getFrom(),                                                     // String
      subject:       m0.getSubject(),                                                  // String
      body:          (body_length ? m9.getPlainBody().substring(0, body_length) : ''), // String
      date_created:  m0.getDate().getTime(),                                           // Number (UTC timestamp in ms)
      date_modified: m9.getDate().getTime(),                                           // Number (UTC timestamp in ms)
      msg_count:     oMessages.length                                                  // Number
    }

    thread.settings = {
      star:          oThread.hasStarredMessages(),                                     // Boolean
      important:     oThread.isImportant(),                                            // Boolean
      unread:        oThread.isUnread(),                                               // Boolean
      trash:         oThread.isInTrash(),                                              // Boolean
      spam:          oThread.isInSpam(),                                               // Boolean
      inbox:         oThread.isInInbox()                                               // Boolean
    }
  }

  var process_messages = function(oMessages) {
    if (!oMessages || !oMessages.length) return

    if (current_message_count && (current_message_count === oMessages.length)) return

    add_metadata(oMessages)

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
            body:        (                            // String
                           (html_format === true)
                             ? oMessage.getBody()
                             : oMessage.getPlainBody()
                         ),
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
    if (!thread_id) throw new Error('ERROR [get_thread]: Invalid input.')

    var oThread = GmailApp.getThreadById(thread_id)
    if (!oThread) throw new Error('ERROR [get_thread]: Thread not found. <"' + thread_id + '">')

    process_messages( oThread.getMessages() )
  }
  catch(err) {
    log_client_error(err)
  }

  // all primitives; no serialization is needed
  return thread
}

function update_thread(active_email_address, thread_id, options) {
  helpers.disallow_account_mismatch(active_email_address)

  try {
    if (!thread_id || !options || typeof options !== 'object') return false

    var oThread = GmailApp.getThreadById(thread_id)
    if (!oThread) return false

    var updated = false

    if (typeof options.important === 'boolean') {
      updated = true
      if (options.important)
        oThread.markImportant()
      else
        oThread.markUnimportant()
    }

    if (typeof options.unread === 'boolean') {
      updated = true
      if (options.unread)
        oThread.markUnread()
      else
        oThread.markRead()
    }

    if (typeof options.trash === 'boolean') {
      updated = true
      if (options.trash)
        oThread.moveToTrash()
    }

    if (typeof options.spam === 'boolean') {
      updated = true
      if (options.spam)
        oThread.moveToSpam()
    }

    if (typeof options.inbox === 'boolean') {
      updated = true
      if (options.inbox)
        oThread.moveToInbox()
    }

    return updated
  }
  catch(err) {
    log_client_error(err)

    return false
  }
}

function update_message(active_email_address, message_id, options) {
  helpers.disallow_account_mismatch(active_email_address)

  try {
    if (!message_id || !options || typeof options !== 'object') return false

    var oMessage = GmailApp.getMessageById(message_id)
    if (!oMessage) return false

    var updated = false

    if (typeof options.star === 'boolean') {
      updated = true
      if (options.star)
        oMessage.star()
      else
        oMessage.unstar()
    }

    if (typeof options.unread === 'boolean') {
      updated = true
      if (options.unread)
        oMessage.markUnread()
      else
        oMessage.markRead()
    }

    if (typeof options.trash === 'boolean') {
      updated = true
      if (options.trash)
        oMessage.moveToTrash()
    }

    return updated
  }
  catch(err) {
    log_client_error(err)

    return false
  }
}

// throws
function set_public_key(active_email_address, public_key, allow_update) {
  helpers.disallow_account_mismatch(active_email_address)

  dataStore.set_public_key(state.email_address, public_key, allow_update)
  return true
}

// throws
function get_public_key_(email_address) {
  return dataStore.get_public_key(email_address)
}

function get_public_keys(active_email_address, emails) {
  helpers.disallow_account_mismatch(active_email_address)

  var keys = {}

  if (emails && Array.isArray(emails) && emails.length) {
    emails.forEach(function(email_address){
      try {
        var val = get_public_key_(email_address)

        if (val)
          keys[email_address] = val
      }
      catch(err) {}
    })
  }
  return keys
}

helpers.get_compose_email_options = function(cc, attachments) {
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

  return options
}

function send_reply_to_thread(active_email_address, thread_id, body, cc, attachments) {
  helpers.disallow_account_mismatch(active_email_address)

  try {
    if (!thread_id || !body) return false

    var oThread = GmailApp.getThreadById(thread_id)
    if (!oThread) return false

    if (!cc && !attachments) {
      oThread.reply(body)
    }
    else {
      var options = helpers.get_compose_email_options(cc, attachments)

      oThread.reply(body, options)
    }

    return true
  }
  catch(err) {
    log_client_error(err)

    return false
  }
}

function send_new_email(active_email_address, recipient, subject, body, cc, attachments) {
  helpers.disallow_account_mismatch(active_email_address)

  try {
    if (!recipient || !subject || !body) return false

    if (!cc && !attachments) {
      GmailApp.sendEmail(recipient, subject, body)
    }
    else {
      var options = helpers.get_compose_email_options(cc, attachments)

      GmailApp.sendEmail(recipient, subject, body, options)
    }

    return true
  }
  catch(err) {
    log_client_error(err)

    return false
  }
}
