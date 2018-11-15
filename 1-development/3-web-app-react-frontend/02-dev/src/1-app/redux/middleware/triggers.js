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

  /* ===================================
   * the following actions
   * trigger a common chain of events:
   * ===================================
   *  - API_middleware
   *     * GET_FOLDERS
   *        - SAVE_FOLDERS(folders)
   *  - TRIGGERS_middleware
   *     * SAVE_FOLDERS
   *        - foreach folder with a larger "unread_count" than was previously in state
   *           * GET_THREADS_IN_FOLDER(folder_name, start=0, max=diff, force=true)
   *  - API_middleware
   *     * GET_THREADS_IN_FOLDER
   *        - SAVE_THREADS_TO_FOLDER(folder_name, thread_ids, start=0, force=true)
   *  - reducer: "threads_in_folder"
   *     * prepend (forcefully) new thread_ids to: state.threads_in_folder[folder_name]
   * ===================================
   */

TRIGGERS['INIT'] = ({getState, dispatch, next, action}) => {
  const state    = getState()
  const my_email = state.user.email_address

  dispatch(
    actions.GET_FOLDERS()
  )
  dispatch(
    actions.GET_RSA_PUBLIC_KEYS([my_email])
  )
}

TRIGGERS['OPEN_FOLDER'] = ({getState, dispatch, next, action}) => {
  dispatch(
    actions.GET_FOLDERS()
  )

  // conditionally requested threads from server
  {
    const {folder_name, start_threads_index} = action
    const state = getState()
    const available_thread_ids = state.threads_in_folder[folder_name]

    let start = null
    if (!available_thread_ids)
      start = 0
    else if (start_threads_index === available_thread_ids.length)
      start = start_threads_index

    if (start !== null)
      dispatch(
        actions.GET_THREADS_IN_FOLDER(folder_name, start)
      )
  }
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
    if (new_folders[folder_name] > old_folders[folder_name]) {
      let start = 0
      let max   = new_folders[folder_name] - old_folders[folder_name]
      let force = true
      dispatch(
        actions.GET_THREADS_IN_FOLDER(folder_name, start, max, force)
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

  if (typeof options.star === 'boolean') {
    if (options.star !== old_settings.message.star) {
      let new_star_count = (options.star) ? 1 : 0
      thread.messages.forEach(message => {
        if (message.message_id !== message_id)
          if (message.settings.star)
            new_star_count++
      })
      let new_important = (new_star_count > 0)
      if (new_important !== old_settings.thread.important) {
        dirty = true
        new_options.important = new_important
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

TRIGGERS['OPEN_THREAD'] = ({getState, dispatch, next, action}) => {
  // conditionally requested thread from server
  {
    const {thread_id} = action
    const state = getState()
    const thread = state.threads[thread_id]

    if (thread && thread.settings && thread.settings.unread)
      dispatch(
        actions.UPDATE_THREAD.MARK_UNREAD(thread_id, false)
      )

    if (thread && thread.summary && thread.settings && Array.isArray(thread.messages) && Array.isArray(thread.participants) && thread.messages.length) return

    dispatch(
      actions.GET_THREAD(thread_id)
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

TRIGGERS['REDIRECT_URL'] = {}

TRIGGERS['REDIRECT_URL']['OPEN_FOLDER'] = ({getState, dispatch, next, action}) => {
  const {is_refresh} = action

  if (is_refresh !== true) return

  dispatch(
    actions.SAVE_APP.UI.START_THREADS_INDEX(-1)
  )
}

// -----------------------------------------------------------------------------

const TRIGGERS_middleware = ({getState, dispatch}) => next => action => {
  switch (action.type) {

    case C.STORE_INITIALIZED:
      next(action)
      TRIGGERS.INIT({getState, dispatch, next, action})
      break

    case C.RESPOND_TO_USER_EVENT.OPEN_FOLDER:
      TRIGGERS.OPEN_FOLDER({getState, dispatch, next, action})
      next(action)
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

    case C.RESPOND_TO_USER_EVENT.OPEN_THREAD:
      TRIGGERS.OPEN_THREAD({getState, dispatch, next, action})
      next(action)
      break

    case C.SAVE_THREAD:
      TRIGGERS.SAVE_THREAD({getState, dispatch, next, action})
      next(action)
      break

    case C.RESPOND_TO_USER_EVENT.REDIRECT_URL:
      switch(action.target) {
        case C.RESPOND_TO_USER_EVENT.OPEN_FOLDER:
          TRIGGERS.REDIRECT_URL.OPEN_FOLDER({getState, dispatch, next, action})
          break
      }
      next(action)
      break

    default:
      next(action)
  }
}

module.exports = TRIGGERS_middleware
