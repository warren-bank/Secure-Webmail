const constants  = require('redux/data/constants')
const actions    = require('redux/actions')

const C = constants.actions

const TRIGGERS = {}
const HELPERS  = {}

// -----------------------------------------------------------------------------

HELPERS['folders'] = {}

HELPERS['folders']['convert_to_hash'] = folders_array => {
  const folders_object = {}

  folders_array.forEach(folder => {
    let {folder_name, unread_count} = folder
    folders_object[folder_name] = unread_count
  })

  return folders_object
}

HELPERS['folders']['find_foldernames_by_threadid'] = (thread_id, state) => {
  const folder_names = []
  const all_folder_names = Object.keys(state.threads_in_folder)

  all_folder_names.forEach(folder_name => {
    const all_thread_ids = state.threads_in_folder[folder_name]
    const index = all_thread_ids.indexOf(thread_id)
    if (index >= 0) folder_names.push(folder_name)
  })

  return folder_names
}

// -----------------------------------------------------------------------------

TRIGGERS['INIT'] = ({getState, dispatch, next, action}) => {
  dispatch(
    actions.GET_FOLDERS()
  )
}

// -----------------------------------------------------------------------------

TRIGGERS['SAVE_FOLDERS'] = ({getState, dispatch, next, action}) => {
  if (!action.folders || !Array.isArray(action.folders) || !action.folders.length) return

  const state = getState()
  if (!state.folders || !Array.isArray(state.folders) || !state.folders.length) return

  const new_folders  = HELPERS.folders.convert_to_hash(action.folders)
  const old_folders  = HELPERS.folders.convert_to_hash(state.folders)
  const folder_names = Object.keys(old_folders)

  folder_names.forEach(folder_name => {
    if (new_folders[folder_name] !== old_folders[folder_name]) {
      dispatch(
        actions.SAVE_THREADS_TO_FOLDER.REFRESH(folder_name)
      )
    }
  })
}

// -----------------------------------------------------------------------------

TRIGGERS['SAVE_THREAD_UPDATE'] = ({getState, dispatch, next, action}) => {
  const {thread_id, options} = action
  if (!thread_id || !options) return

  const state = getState()

  const folder_names = HELPERS.folders.find_foldernames_by_threadid(thread_id, state)
  if (!folder_names.length) return

  const old_folders  = HELPERS.folders.convert_to_hash(state.folders)
  const old_settings = state.threads[thread_id].settings

  const new_folders  = state.folders.map(folder => ({...folder}))
  let dirty = false

  if (typeof options.unread === 'boolean') {
    if (options.unread !== old_settings.unread) {
      dirty = true
      let new_unread_count = {}
      folder_names.forEach(folder_name => {
        new_unread_count[folder_name] = old_folders[folder_name] + (options.unread ? 1 : -1)
      })
      new_folders.forEach(folder => {
        let {folder_name} = folder
        if (new_unread_count[folder_name] !== undefined)
          folder.unread_count = new_unread_count[folder_name]
      })
    }
  }

  if (dirty) {
    dispatch(
      actions.SAVE_FOLDERS(new_folders)
    )
  }
}

// -----------------------------------------------------------------------------

TRIGGERS['SAVE_MESSAGE_UPDATE'] = ({getState, dispatch, next, action}) => {
  const {thread_id, message_id, options} = action
  if (!thread_id || !message_id || !options) return

  const state = getState()

  const thread  = state.threads[thread_id]
  if (!thread || !thread.messages) return

  const message = thread.messages.find(message => (message.message_id === message_id))
  if (!message || !message.settings) return

  const old_settings = {
    message: message.settings,
    thread:  thread.settings
  }

  const new_options = {}
  let dirty = false

  if (typeof options.unread === 'boolean') {
    if (options.unread !== old_settings.message.unread) {
      let new_unread_count = (options.unread) ? 1 : 0
      thread.messages.forEach(message => {
        if (message.message_id !== message_id)
          if (message.settings.unread)
            new_unread_count++
      })
      let new_unread = (new_unread_count > 0)
      if (new_unread !== old_settings.thread.unread) {
        dirty = true
        new_options.unread = new_unread
      }
    }
  }

  if (dirty) {
    dispatch(
      actions.SAVE_THREAD_UPDATE(thread_id, new_options)
    )
  }
}

// -----------------------------------------------------------------------------

TRIGGERS['SAVE_THREAD'] = ({getState, dispatch, next, action}) => {
  if (!action.thread || !Array.isArray(action.thread.participants) || !action.thread.participants.length) return

  const participants = action.thread.participants

  // retrieve all public keys necessary to reply to every participant in thread
  dispatch(
    actions.GET_RSA_PUBLIC_KEYS([...participants])
  )
}

// -----------------------------------------------------------------------------

TRIGGERS['SEND_EMAIL'] = {}

TRIGGERS['SEND_EMAIL']['REPLY'] = ({getState, dispatch, next, action}) => {
  dispatch(
    actions.SAVE_REPLY_TO_THREAD(action)
  )
}

// -----------------------------------------------------------------------------

const TRIGGERS_middleware = ({getState, dispatch}) => next => action => {
  switch (action.type) {

    case C.STORE_INITIALIZED:
      next(action)
      TRIGGERS.INIT({getState, dispatch, next, action})
      break

    case C.SAVE_FOLDERS:
      TRIGGERS.SAVE_FOLDERS({getState, dispatch, next, action})
      next(action)
      break

    case C.SAVE_THREAD_UPDATE:
      TRIGGERS.SAVE_THREAD_UPDATE({getState, dispatch, next, action})
      next(action)
      break

    case C.SAVE_MESSAGE_UPDATE:
      TRIGGERS.SAVE_MESSAGE_UPDATE({getState, dispatch, next, action})
      next(action)
      break

    case C.SAVE_THREAD:
      TRIGGERS.SAVE_THREAD({getState, dispatch, next, action})
      next(action)
      break

    case C.SEND_EMAIL.REPLY:
      // "TRIGGERS_middleware" must run BEFORE "CRYPTO_middleware"
      TRIGGERS.SEND_EMAIL.REPLY({getState, dispatch, next, action})
      next(action)
      break

    default:
      next(action)
  }
}

module.exports = TRIGGERS_middleware
