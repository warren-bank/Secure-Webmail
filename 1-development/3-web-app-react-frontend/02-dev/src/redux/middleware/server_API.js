const constants  = require('redux/data/constants')
const actions    = require('redux/actions')

const C = constants.actions

const API = {}

// -----------------------------------------------------------------------------

API['GET_FOLDERS'] = ({getState, dispatch, next, action}) => {
  const onSuccess = folders => {
    if (!folders || !Array.isArray(folders) || !folders.length) return

    dispatch(
      actions.SAVE_FOLDERS(folders)
    )
  }

  google.script.run.withSuccessHandler(onSuccess).get_folders()
}

// -----------------------------------------------------------------------------

API['GET_THREADS_IN_FOLDER'] = ({getState, dispatch, next, action}) => {
  const {folder_name, body_length, start, max} = action

  if (!folder_name || typeof folder_name !== 'string') throw new Error('ERROR: Redux action "GET_THREADS_IN_FOLDER" references an invalid folder name.')

  const onSuccess = threads => {
    if (!threads || !Array.isArray(threads) || !threads.length) return

    const thread_ids = threads.map(thread => thread.thread_id)

    dispatch(
      actions.SAVE_THREADS_TO_FOLDER.APPEND(folder_name, thread_ids)
    )
    dispatch(
      actions.SAVE_THREADS(threads)
    )
  }

  google.script.run.withSuccessHandler(onSuccess).get_threads_in_folder(folder_name, body_length, start, max)
}

// -----------------------------------------------------------------------------

API['GET_THREAD'] = ({getState, dispatch, next, action}) => {
  const {thread_id} = action

  if (!thread_id || typeof thread_id !== 'string') throw new Error('ERROR: Redux action "GET_THREAD" references an invalid thread ID.')

  const onSuccess = thread => {
    if (
      !thread || (typeof thread !== 'object') ||
      !thread.messages || !Array.isArray(thread.messages) || !thread.messages.length ||
      !thread.participants || !Array.isArray(thread.participants) || !thread.participants.length
    ) return

    dispatch(
      actions.SAVE_THREAD(thread_id, thread)
    )
  }

  google.script.run.withSuccessHandler(onSuccess).get_thread(thread_id)
}

// -----------------------------------------------------------------------------

API['UPDATE_THREAD'] = ({getState, dispatch, next, action}) => {
  const {thread_id, options} = action

  if (!thread_id || typeof thread_id !== 'string') throw new Error('ERROR: Redux action "UPDATE_THREAD" references an invalid thread ID.')
  if (!options || typeof options !== 'object')     throw new Error('ERROR: Redux action "UPDATE_THREAD" references invalid update options.')

  const onSuccess = result => {
    if (typeof result !== 'boolean') return

    if (result) {
      dispatch(
        actions.SAVE_THREAD_UPDATE(thread_id, options)
      )
    }
    else {
      console.log('WARNING: Redux action "UPDATE_THREAD" failed on the server.')
    }
  }

  google.script.run.withSuccessHandler(onSuccess).update_thread(thread_id, options)
}

// -----------------------------------------------------------------------------

API['UPDATE_MESSAGE'] = ({getState, dispatch, next, action}) => {
  const {message_id, options} = action

  if (!message_id || typeof message_id !== 'string') throw new Error('ERROR: Redux action "UPDATE_MESSAGE" references an invalid message ID.')
  if (!options || typeof options !== 'object')       throw new Error('ERROR: Redux action "UPDATE_MESSAGE" references invalid update options.')

  const onSuccess = result => {
    if (typeof result !== 'boolean') return

    if (result) {
      dispatch(
        actions.SAVE_MESSAGE_UPDATE(message_id, options)
      )
    }
    else {
      console.log('WARNING: Redux action "UPDATE_MESSAGE" failed on the server.')
    }
  }

  google.script.run.withSuccessHandler(onSuccess).update_message(message_id, options)
}

// -----------------------------------------------------------------------------

API['SET_RSA_PUBLIC_KEY'] = ({getState, dispatch, next, action}) => {
  const {public_key} = action

  if (!public_key || typeof public_key !== 'string') throw new Error('ERROR: Redux action "SET_RSA_PUBLIC_KEY" references an invalid public key.')

  const onSuccess = result => {
    if (typeof result !== 'boolean') return

    if (result) {
    }
    else {
      console.log('WARNING: Redux action "SET_RSA_PUBLIC_KEY" failed on the server.')
    }
  }

  google.script.run.withSuccessHandler(onSuccess).set_public_key(public_key)
}

API['GET_RSA_PUBLIC_KEYS'] = ({getState, dispatch, next, action}) => {
  const {emails} = action

  if (!emails || !Array.isArray(emails) || !emails.length) throw new Error('ERROR: Redux action "GET_RSA_PUBLIC_KEYS" references an invalid list of email addresses.')

  const onSuccess = keys => {
    if (!keys || typeof keys !== 'object') return

    dispatch(
      actions.SAVE_RSA_PUBLIC_KEYS(keys)
    )
  }

  google.script.run.withSuccessHandler(onSuccess).get_public_keys(emails)
}

// -----------------------------------------------------------------------------

const API_middleware = ({getState, dispatch}) => next => action => {
  switch (action.type) {

    case C.GET_FOLDERS:
      API.GET_FOLDERS({getState, dispatch, next, action})
      break

    case C.GET_THREADS_IN_FOLDER:
      API.GET_THREADS_IN_FOLDER({getState, dispatch, next, action})
      break

    case C.GET_THREAD:
      API.GET_THREAD({getState, dispatch, next, action})
      break

    case C.UPDATE_THREAD:
      API.UPDATE_THREAD({getState, dispatch, next, action})
      break

    case C.UPDATE_MESSAGE:
      API.UPDATE_MESSAGE({getState, dispatch, next, action})
      break

    case C.SET_RSA_PUBLIC_KEY:
      API.SET_RSA_PUBLIC_KEY({getState, dispatch, next, action})
      break

    case C.GET_RSA_PUBLIC_KEYS:
      API.GET_RSA_PUBLIC_KEYS({getState, dispatch, next, action})
      break

    case C.SAVE_FOLDERS:
    case C.SAVE_THREADS_TO_FOLDER.PREPEND:
    case C.SAVE_THREADS_TO_FOLDER.APPEND:
    case C.SAVE_THREADS:
    case C.SAVE_THREAD:
    case C.SAVE_THREAD_UPDATE:
    case C.SAVE_MESSAGE_UPDATE:
    case C.SAVE_RSA_PUBLIC_KEYS:
    default:
      next(action)
  }
}

module.exports = API_middleware
