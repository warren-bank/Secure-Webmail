const constants  = require('redux/data/constants')
const actions    = require('redux/actions')

const C = constants.actions

const HELPERS  = {}
const TRIGGERS = {}
const API      = {}

// -----------------------------------------------------------------------------

HELPERS['FailureHandler'] = (dispatch, action) => (error) => {
  dispatch(
    actions.PROPOGATE_SERVER_API_ERROR(action.type, error)
  )
}

HELPERS['get_email'] = (getState) => {
  const state = getState()
  return state.user.email_address
}

// -----------------------------------------------------------------------------

TRIGGERS['PROPOGATE_SERVER_API_ERROR'] = ({getState, dispatch, next, action}) => {
  const {target, error} = action

  // occurs when the visitor is no-longer logged into any Google account
  if ((typeof error === 'string') && (error === 'NetworkError: Connection failure due to HTTP 401')) {
    const win = window.top || window
    win.location.reload(true)
    return
  }

  // returned by server API when the visitor has changed their "active" Google account
  if ((typeof error === 'string') && (error === 'Account Mismatch Error')) {
    const win = window.top || window
    win.location.reload(true)
    return
  }

  let show_alert    = false
  let debug_message = null

  switch(type) {
    case C.SET_RSA_PUBLIC_KEY:
      show_alert    = true
      debug_message = [
        'WARNING: Redux action "SET_RSA_PUBLIC_KEY" failed on the server.',
        'The most likely reason is that a "public_key" is already associated with the current Google user account.',
        'Updating the associated keypair will cause your mailbox to diverge: (1) the previous "private_key" will be required to decrypt older messages, and (2) the updated "private_key" will be required to decrypt newer messages.',
        'You should only consider updating your keypair if either: (1) you have lost your "private_key" and are no-longer able to read your encrypted messages, or (2) an untrusted 3rd party has gained access to your "private_key".'
      ].join(' ')

      break
    default:
      break
  }

  if (debug_message) {
    dispatch(
      actions.LOG_DEBUG_MESSAGE(`SERVER-SIDE ERROR: "API_middleware" -> "${target}":`, debug_message, {error})
    )

    if (show_alert)
      window.alert(debug_message)
  }
  else {
    dispatch(
      actions.LOG_DEBUG_MESSAGE(`SERVER-SIDE ERROR: "API_middleware" -> "${target}":`, {error})
    )
  }
}

// -----------------------------------------------------------------------------

API['GET_FOLDERS'] = ({getState, dispatch, next, action}) => {
  const onSuccess = folders => {
    if (!folders || !Array.isArray(folders) || !folders.length) return

    dispatch(
      actions.SAVE_FOLDERS(folders)
    )
  }

  const onFailure = HELPERS.FailureHandler(dispatch, action)
  const my_email  = HELPERS.get_email(getState)

  google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).get_folders(my_email)
}

// -----------------------------------------------------------------------------

API['GET_THREADS_IN_FOLDER'] = ({getState, dispatch, next, action}) => {
  const {folder_name, body_length, start, max, force} = action

  if (!folder_name || (typeof folder_name !== 'string')) throw new Error('ERROR: Redux action "GET_THREADS_IN_FOLDER" references an invalid folder name.')

  // catch unneeded requests
  {
    const state            = getState()
    const existing_threads = state.threads_in_folder[folder_name] || []

    if (!(
         (start === 0)
      || (start === existing_threads.length)
      || (
              (start < existing_threads.length)
           && ((start + max) > existing_threads.length)
         )
    )) return
  }

  const onSuccess = threads => {
    if (!threads || !Array.isArray(threads) || !threads.length) return

    const thread_ids = threads.map(thread => thread.thread_id)

    dispatch(
      actions.SAVE_THREADS_TO_FOLDER(folder_name, thread_ids, start, force)
    )
    dispatch(
      actions.SAVE_THREADS(threads)
    )
  }

  const onFailure = HELPERS.FailureHandler(dispatch, action)
  const my_email  = HELPERS.get_email(getState)

  google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).get_threads_in_folder(my_email, folder_name, body_length, start, max)
}

// -----------------------------------------------------------------------------

API['GET_THREAD'] = ({getState, dispatch, next, action}) => {
  const {thread_id} = action

  if (!thread_id || (typeof thread_id !== 'string')) throw new Error('ERROR: Redux action "GET_THREAD" references an invalid thread ID.')

  const onSuccess = thread => {
    if (
      !thread              || (typeof thread !== 'object')                                       ||
      !thread.messages     || !Array.isArray(thread.messages)     || !thread.messages.length     ||
      !thread.participants || !Array.isArray(thread.participants)
    ) return

    // catch unneeded updates
    {
      const state               = getState()
      const existing_thread     = state.threads[thread_id]

      if (existing_thread) {
        const existing_messages = existing_thread.messages || []
        let no_change           = (existing_messages.length === thread.messages.length)

        for (let i=0; no_change && (i < existing_messages.length); i++) {
          no_change = (existing_messages[i].message_id === thread.messages[i].message_id)
        }

        if (no_change) return
      }
    }

    dispatch(
      // "TRIGGERS_middleware" will dispatch: `actions.GET_RSA_PUBLIC_KEYS(thread.participants)`
      // "CRYPTO_middleware"   will modify the action payload: decrypt all messages in thread
      actions.SAVE_THREAD(thread_id, thread)
    )
  }

  const onFailure = HELPERS.FailureHandler(dispatch, action)
  const my_email  = HELPERS.get_email(getState)

  const current_message_count = (() => {
    const state  = getState()
    const thread = state.threads[thread_id]

    return (!thread || !thread.messages) ? 0 : thread.messages.length
  })()

  google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).get_thread(my_email, thread_id, current_message_count)
}

// -----------------------------------------------------------------------------

API['UPDATE_THREAD'] = ({getState, dispatch, next, action}) => {
  const {thread_id, options} = action

  if (!thread_id || (typeof thread_id !== 'string')) throw new Error('ERROR: Redux action "UPDATE_THREAD" references an invalid thread ID.')
  if (!options   || (typeof options   !== 'object')) throw new Error('ERROR: Redux action "UPDATE_THREAD" references invalid update options.')

  const onSuccess = result => {
    if (typeof result !== 'boolean') return

    if (result) {
      dispatch(
        actions.SAVE_THREAD_UPDATE(thread_id, options)
      )
    }
    else {
      onFailure('WARNING: Redux action "UPDATE_THREAD" failed on the server.')
    }
  }

  const onFailure = HELPERS.FailureHandler(dispatch, action)
  const my_email  = HELPERS.get_email(getState)

  google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).update_thread(my_email, thread_id, options)
}

// -----------------------------------------------------------------------------

API['UPDATE_MESSAGE'] = ({getState, dispatch, next, action}) => {
  const {thread_id, message_id, options} = action

  if (!thread_id  || (typeof thread_id  !== 'string')) throw new Error('ERROR: Redux action "UPDATE_MESSAGE" references an invalid thread ID.')
  if (!message_id || (typeof message_id !== 'string')) throw new Error('ERROR: Redux action "UPDATE_MESSAGE" references an invalid message ID.')
  if (!options    || (typeof options    !== 'object')) throw new Error('ERROR: Redux action "UPDATE_MESSAGE" references invalid update options.')

  const onSuccess = result => {
    if (typeof result !== 'boolean') return

    if (result) {
      dispatch(
        actions.SAVE_MESSAGE_UPDATE(thread_id, message_id, options)
      )
    }
    else {
      onFailure('WARNING: Redux action "UPDATE_MESSAGE" failed on the server.')
    }
  }

  const onFailure = HELPERS.FailureHandler(dispatch, action)
  const my_email  = HELPERS.get_email(getState)

  google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).update_message(my_email, message_id, options)
}

// -----------------------------------------------------------------------------

API['SET_RSA_PUBLIC_KEY'] = ({getState, dispatch, next, action}) => {
  const {public_key} = action
  let {allow_update} = action

  if (!public_key || (typeof public_key !== 'string')) throw new Error('ERROR: Redux action "SET_RSA_PUBLIC_KEY" references an invalid public key.')

  allow_update = !!allow_update  // cast to a boolean

  const onSuccess = result => {
    if (typeof result !== 'boolean') return

    if (!result) onFailure()

    // save to store

    const public_keys = {[my_email]: public_key}

    dispatch(
      actions.SAVE_RSA_PUBLIC_KEYS(public_keys)
    )
  }

  const onFailure = HELPERS.FailureHandler(dispatch, action)
  const my_email  = HELPERS.get_email(getState)

  google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).set_public_key(my_email, public_key, allow_update)
}

API['GET_RSA_PUBLIC_KEYS'] = ({getState, dispatch, next, action}) => {
  const {emails} = action

  if (!emails || !Array.isArray(emails) || !emails.length) throw new Error('ERROR: Redux action "GET_RSA_PUBLIC_KEYS" references an invalid list of email addresses.')

  const filtered_emails = (() => {
    const state = getState()

    // add current user
    const all_emails = [...emails, state.user.email_address]

    // only keep emails for which the public key is NOT already known
    return all_emails.filter(email => (state.public_keys[email] === undefined))
  })()

  // short-circuit if no new data is needed
  if (!filtered_emails.length) return

  const onSuccess = keys => {
    if (!keys || (typeof keys !== 'object')) return

    dispatch(
      actions.SAVE_RSA_PUBLIC_KEYS(keys)
    )
  }

  const onFailure = HELPERS.FailureHandler(dispatch, action)
  const my_email  = HELPERS.get_email(getState)

  google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).get_public_keys(my_email, filtered_emails)
}

// -----------------------------------------------------------------------------

API['SEND_EMAIL'] = {}

API['SEND_EMAIL']['REPLY'] = ({getState, dispatch, next, action}) => {
  const {thread_id, body, cc = null, attachments = null} = action

  if (!thread_id || (typeof thread_id !== 'string')) throw new Error('ERROR: Redux action "SEND_EMAIL_REPLY" references an invalid thread ID.')
  if (!body      || (typeof body      !== 'string')) throw new Error('ERROR: Redux action "SEND_EMAIL_REPLY" references an invalid message body.')

  const onSuccess = result => {
    if (typeof result !== 'boolean') return

    if (!result)
      onFailure('WARNING: Redux action "SEND_EMAIL_REPLY" failed on the server.')
  }

  const onFailure = HELPERS.FailureHandler(dispatch, action)
  const my_email  = HELPERS.get_email(getState)

  google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).send_reply_to_thread(my_email, thread_id, body, cc, attachments)
}

API['SEND_EMAIL']['NEW_MESSAGE'] = ({getState, dispatch, next, action}) => {
  const {recipient, subject, body, cc = null, attachments = null} = action

  if (!recipient || (typeof recipient !== 'string')) throw new Error('ERROR: Redux action "SEND_EMAIL_NEW_MESSAGE" references an invalid recipient.')
  if (!subject   || (typeof subject   !== 'string')) throw new Error('ERROR: Redux action "SEND_EMAIL_NEW_MESSAGE" references an invalid subject.')
  if (!body      || (typeof body      !== 'string')) throw new Error('ERROR: Redux action "SEND_EMAIL_NEW_MESSAGE" references an invalid message body.')

  const onSuccess = result => {
    if (typeof result !== 'boolean') return

    if (!result)
      onFailure('WARNING: Redux action "SEND_EMAIL_NEW_MESSAGE" failed on the server.')
  }

  const onFailure = HELPERS.FailureHandler(dispatch, action)
  const my_email  = HELPERS.get_email(getState)

  google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).send_new_email(my_email, recipient, subject, body, cc, attachments)
}

// -----------------------------------------------------------------------------

const API_middleware = ({getState, dispatch}) => next => action => {
  switch (action.type) {

    case C.PROPOGATE_SERVER_API_ERROR:
      TRIGGERS.PROPOGATE_SERVER_API_ERROR({getState, dispatch, next, action})
      break

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

    case C.SEND_EMAIL.REPLY:
      // [as the action travels toward the Redux reducer] "CRYPTO_middleware" will modify the action payload: encrypt message
      // [as the action returns from   the Redux reducer] "DRAFT_MESSAGE_middleware" will dispatch: `actions.GET_THREAD(thread_id)`, but only if `draft_message.status.code` indicates that the message was sent successfully
      next(action)

      // send the encrypted payload
      API.SEND_EMAIL.REPLY({getState, dispatch, next, action})
      break

    case C.SEND_EMAIL.NEW_MESSAGE:
      // "CRYPTO_middleware" will modify the action payload: encrypt message
      next(action)

      // send the encrypted payload
      API.SEND_EMAIL.NEW_MESSAGE({getState, dispatch, next, action})
      break

    // "TRIGGERS_middleware" will dispatch: `actions.GET_THREADS_IN_FOLDER(folder_name, start=0, max=diff, force=true)` when `unread_count` has changed
    case C.SAVE_FOLDERS:

    case C.SAVE_THREADS_TO_FOLDER:
    case C.SAVE_THREADS:

    // "TRIGGERS_middleware" will dispatch: `actions.GET_RSA_PUBLIC_KEYS(action.thread.participants)`
    // "CRYPTO_middleware" will modify the action payload: decrypt all messages in thread
    case C.SAVE_THREAD:

    case C.SAVE_THREAD_UPDATE:
    case C.SAVE_MESSAGE_UPDATE:
    case C.SAVE_RSA_PUBLIC_KEYS:
    default:
      next(action)
  }
}

module.exports = API_middleware
