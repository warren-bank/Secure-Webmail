const constants  = require('redux/data/constants')

const C = constants.actions

const actions = {}

// -----------------------------------------------------------------------------

actions['STORE_INITIALIZED'] = ({email_address, thread_id}) => {
  return {
    type: C.STORE_INITIALIZED,
    email_address,
    thread_id
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

actions['GET_THREADS_IN_FOLDER'] = (folder_name, start=0) => {
  let body_length = 0
                        // In paginated list of threads, the number of characters in 1st message of each thread to show as a preview "snippet".
                        // `160` is the value used by the official Gmail UI (at "comfortable" density).
                        // This feature has no value when messages are encrypted.
  let max         = 25
                        // In paginated list of threads, the number of threads per "page".
                        // `50` is the value used by the official Gmail UI (at "comfortable" density).

  return {
    type: C.GET_THREADS_IN_FOLDER,
    folder_name,
    body_length,
    start,
    max
  }
}

actions['SAVE_THREADS_TO_FOLDER'] = {}

actions['SAVE_THREADS_TO_FOLDER']['APPEND'] = (folder_name, thread_ids) => {
  return {
    type: C.SAVE_THREADS_TO_FOLDER.APPEND,
    folder_name,
    thread_ids
  }
}

actions['SAVE_THREADS_TO_FOLDER']['PREPEND'] = (folder_name, thread_ids) => {
  return {
    type: C.SAVE_THREADS_TO_FOLDER.PREPEND,
    folder_name,
    thread_ids
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

actions['SAVE_SETTING'] = {}

actions['SAVE_SETTING']['FOLDER_NAME'] = (folder_name) => {
  return {
    type: C.SAVE_SETTING.FOLDER_NAME,
    folder_name
  }
}

actions['SAVE_SETTING']['THREAD_ID'] = (thread_id) => {
  return {
    type: C.SAVE_SETTING.THREAD_ID,
    thread_id
  }
}

actions['SAVE_SETTING']['START_THREADS_INDEX'] = (start_threads_index) => {
  return {
    type: C.SAVE_SETTING.START_THREADS_INDEX,
    start_threads_index
  }
}

actions['SAVE_SETTING']['MAX_THREADS_PER_PAGE'] = (max_threads_per_page) => {
  return {
    type: C.SAVE_SETTING.MAX_THREADS_PER_PAGE,
    max_threads_per_page
  }
}

actions['SAVE_SETTING']['PRIVATE_KEY'] = (private_key) => {
  return {
    type: C.SAVE_SETTING.PRIVATE_KEY,
    private_key
  }
}

actions['SAVE_SETTING']['PRIVATE_KEY_STORAGE'] = (private_key_storage) => {
  return {
    type: C.SAVE_SETTING.PRIVATE_KEY_STORAGE,
    private_key_storage
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

module.exports = actions
