const constants  = require('redux/data/constants')

const C   = constants.actions
const MAX = constants.default_settings.max_threads_per_page

const actions = {}

// -----------------------------------------------------------------------------

actions['STORE_INITIALIZED'] = ({email_address, thread_id}) => {
  return {
    type: C.STORE_INITIALIZED,
    email_address,
    thread_id
  }
}

actions['LOG_DEBUG_MESSAGE'] = (...message) => {
  return {
    type: C.LOG_DEBUG_MESSAGE,
    message
  }
}

// -----------------------------------------------------------------------------

actions['GET_FOLDERS'] = () => {
  return {
    type: C.GET_FOLDERS
  }
}

actions['SAVE_FOLDERS'] = (folders) => {
  return {
    type: C.SAVE_FOLDERS,
    folders
  }
}

// -----------------------------------------------------------------------------

actions['GET_THREADS_IN_FOLDER'] = (folder_name, start=0, max=MAX, force=false) => {
  let body_length = 0
                        // In paginated list of threads, the number of characters in 1st message of each thread to show as a preview "snippet".
                        // `160` is the value used by the official Gmail UI (at "comfortable" density).
                        // This feature has no value when messages are encrypted.

  if ( (typeof max !== 'number') || (max <= 0) || (max > MAX) )
    max = MAX

  return {
    type: C.GET_THREADS_IN_FOLDER,
    folder_name,
    body_length,
    start,
    max,
    force
  }
}

actions['SAVE_THREADS_TO_FOLDER'] = (folder_name, thread_ids, start, force=false) => {
  return {
    type: C.SAVE_THREADS_TO_FOLDER,
    folder_name,
    thread_ids,
    start,
    force
  }
}

actions['SAVE_THREADS'] = (threads) => {
  return {
    type: C.SAVE_THREADS,
    threads
  }
}

// -----------------------------------------------------------------------------

actions['GET_THREAD'] = (thread_id) => {
  return {
    type: C.GET_THREAD,
    thread_id
  }
}

actions['SAVE_THREAD'] = (thread_id, thread) => {
  return {
    type: C.SAVE_THREAD,
    thread_id,
    thread
  }
}

// -----------------------------------------------------------------------------

actions['SAVE_REPLY_TO_THREAD'] = ({thread_id, recipient, body, cc, attachments} = {}, from = '') => {
  return {
    type: C.SAVE_REPLY_TO_THREAD,
    thread_id,
    from,
    recipient,
    body,
    cc,
    attachments
  }
}

// -----------------------------------------------------------------------------

actions['UPDATE_THREAD'] = {}

actions['UPDATE_THREAD']['MARK_IMPORTANT'] = (thread_id, important) => {
  return {
    type: C.UPDATE_THREAD,
    thread_id,
    options: {
      important
    }
  }
}

actions['UPDATE_THREAD']['MARK_UNREAD'] = (thread_id, unread) => {
  return {
    type: C.UPDATE_THREAD,
    thread_id,
    options: {
      unread
    }
  }
}

actions['UPDATE_THREAD']['MOVE_TO_TRASH'] = (thread_id) => {
  return {
    type: C.UPDATE_THREAD,
    thread_id,
    options: {
      trash: true
    }
  }
}

actions['UPDATE_THREAD']['MOVE_TO_SPAM'] = (thread_id) => {
  return {
    type: C.UPDATE_THREAD,
    thread_id,
    options: {
      spam: true
    }
  }
}

actions['UPDATE_THREAD']['MOVE_TO_INBOX'] = (thread_id) => {
  return {
    type: C.UPDATE_THREAD,
    thread_id,
    options: {
      inbox: true
    }
  }
}

actions['SAVE_THREAD_UPDATE'] = (thread_id, options) => {
  return {
    type: C.SAVE_THREAD_UPDATE,
    thread_id,
    options
  }
}

// -----------------------------------------------------------------------------

actions['UPDATE_MESSAGE'] = {}

actions['UPDATE_MESSAGE']['MARK_STAR'] = (thread_id, message_id, star) => {
  return {
    type: C.UPDATE_MESSAGE,
    thread_id,
    message_id,
    options: {
      star
    }
  }
}

actions['UPDATE_MESSAGE']['MARK_UNREAD'] = (thread_id, message_id, unread) => {
  return {
    type: C.UPDATE_MESSAGE,
    thread_id,
    message_id,
    options: {
      unread
    }
  }
}

actions['UPDATE_MESSAGE']['MOVE_TO_TRASH'] = (thread_id, message_id) => {
  return {
    type: C.UPDATE_MESSAGE,
    thread_id,
    message_id,
    options: {
      trash: true
    }
  }
}

actions['SAVE_MESSAGE_UPDATE'] = (thread_id, message_id, options) => {
  return {
    type: C.SAVE_MESSAGE_UPDATE,
    thread_id,
    message_id,
    options
  }
}

// -----------------------------------------------------------------------------

actions['SET_RSA_PUBLIC_KEY'] = (public_key, allow_update) => {
  return {
    type: C.SET_RSA_PUBLIC_KEY,
    public_key,
    allow_update
  }
}

actions['GET_RSA_PUBLIC_KEYS'] = (emails) => {
  return {
    type: C.GET_RSA_PUBLIC_KEYS,
    emails
  }
}

actions['SAVE_RSA_PUBLIC_KEYS'] = (public_keys) => {
  return {
    type: C.SAVE_RSA_PUBLIC_KEYS,
    public_keys
  }
}

// -----------------------------------------------------------------------------

actions['UPDATE_SETTINGS'] = (max_threads_per_page, private_key, private_key_storage) => {
  return {
    type: C.UPDATE_SETTINGS,
    max_threads_per_page,
    private_key,
    private_key_storage
  }
}

actions['SAVE_APP'] = {
  UI:            {},
  SETTING:       {},
  DRAFT_MESSAGE: {}
}

// -----------------------------------------------------------------------------

actions['SAVE_APP']['UI']['FOLDER_NAME'] = (folder_name) => {
  return {
    type: C.SAVE_APP.UI.FOLDER_NAME,
    folder_name
  }
}

actions['SAVE_APP']['UI']['THREAD_ID'] = (thread_id) => {
  return {
    type: C.SAVE_APP.UI.THREAD_ID,
    thread_id
  }
}

actions['SAVE_APP']['UI']['START_THREADS_INDEX'] = (start_threads_index) => {
  return {
    type: C.SAVE_APP.UI.START_THREADS_INDEX,
    start_threads_index
  }
}

// -----------------------------------------------------------------------------

actions['SAVE_APP']['SETTING']['MAX_THREADS_PER_PAGE'] = (max_threads_per_page) => {
  return {
    type: C.SAVE_APP.SETTING.MAX_THREADS_PER_PAGE,
    max_threads_per_page
  }
}

actions['SAVE_APP']['SETTING']['PUBLIC_KEY'] = (public_key) => {
  return {
    type: C.SAVE_APP.SETTING.PUBLIC_KEY,
    public_key
  }
}

actions['SAVE_APP']['SETTING']['PRIVATE_KEY'] = (private_key) => {
  return {
    type: C.SAVE_APP.SETTING.PRIVATE_KEY,
    private_key
  }
}

actions['SAVE_APP']['SETTING']['PRIVATE_KEY_STORAGE'] = (private_key_storage) => {
  return {
    type: C.SAVE_APP.SETTING.PRIVATE_KEY_STORAGE,
    private_key_storage
  }
}

actions['SAVE_APP']['SETTING']['IS_GENERATING_KEYPAIR'] = (is_generating_keypair) => {
  return {
    type: C.SAVE_APP.SETTING.IS_GENERATING_KEYPAIR,
    is_generating_keypair
  }
}

// -----------------------------------------------------------------------------

actions['SAVE_APP']['DRAFT_MESSAGE']['STORE'] = (is_reply, thread_id, recipient, cc, cc_suggestions, subject, body, attachments) => {
  return {
    type: C.SAVE_APP.DRAFT_MESSAGE.STORE,
    is_reply,
    thread_id,
    recipient,
    cc,
    cc_suggestions,
    subject,
    body,
    attachments
  }
}

actions['SAVE_APP']['DRAFT_MESSAGE']['CLEAR'] = () => {
  return {
    type: C.SAVE_APP.DRAFT_MESSAGE.CLEAR
  }
}

actions['SAVE_APP']['DRAFT_MESSAGE']['SET_STATUS'] = (code, error_message="") => {
  return {
    type: C.SAVE_APP.DRAFT_MESSAGE.STORE,
    status: {
      code,
      error_message
    }
  }
}

// -----------------------------------------------------------------------------

actions['CRYPTO'] = {
  RSA: {},
  AES: {}
}

actions['CRYPTO']['RSA']['GENERATE_KEYPAIR'] = (allow_update) => {
  return {
    type: C.CRYPTO.RSA.GENERATE_KEYPAIR,
    allow_update
  }
}

// -----------------------------------------------------------------------------

actions['SEND_EMAIL'] = {}

actions['SEND_EMAIL']['REPLY'] = (thread_id, recipient, body, cc, attachments) => {
  return {
    type: C.SEND_EMAIL.REPLY,
    thread_id,
    recipient,
    body,
    cc,
    attachments
  }
}

actions['SEND_EMAIL']['NEW_MESSAGE'] = (recipient, subject, body, cc, attachments) => {
  return {
    type: C.SEND_EMAIL.NEW_MESSAGE,
    recipient,
    subject,
    body,
    cc,
    attachments
  }
}

// -----------------------------------------------------------------------------

actions['RESPOND_TO_USER_EVENT'] = {}

actions['RESPOND_TO_USER_EVENT']['OPEN_FOLDER'] = (folder_name, start_threads_index, history, is_push) => {
  if (typeof start_threads_index !== 'number')
    start_threads_index = 0

  if (history && folder_name) {
    let URL = `/folder/${folder_name}/${start_threads_index}`
    ;(is_push ? history.push : history.replace)(URL)

    return {
      type:   C.RESPOND_TO_USER_EVENT.REDIRECT_URL,
      target: C.RESPOND_TO_USER_EVENT.OPEN_FOLDER,
      URL
    }
  }

  return {
    type: C.RESPOND_TO_USER_EVENT.OPEN_FOLDER,
    folder_name,
    start_threads_index
  }
}

actions['RESPOND_TO_USER_EVENT']['OPEN_THREAD'] = (thread_id, history, is_push) => {
  if (history && thread_id) {
    let URL = `/thread/${thread_id}`
    ;(is_push ? history.push : history.replace)(URL)

    return {
      type:   C.RESPOND_TO_USER_EVENT.REDIRECT_URL,
      target: C.RESPOND_TO_USER_EVENT.OPEN_THREAD,
      URL
    }
  }

  return {
    type: C.RESPOND_TO_USER_EVENT.OPEN_THREAD,
    thread_id
  }
}

actions['RESPOND_TO_USER_EVENT']['OPEN_COMPOSE_MESSAGE'] = (history, is_push) => {
  if (history) {
    let URL = `/compose`
    ;(is_push ? history.push : history.replace)(URL)

    return {
      type:   C.RESPOND_TO_USER_EVENT.REDIRECT_URL,
      target: C.RESPOND_TO_USER_EVENT.OPEN_COMPOSE_MESSAGE,
      URL
    }
  }

  return {
    type: C.RESPOND_TO_USER_EVENT.OPEN_COMPOSE_MESSAGE
  }
}

// -----------------------------------------------------------------------------

module.exports = actions
