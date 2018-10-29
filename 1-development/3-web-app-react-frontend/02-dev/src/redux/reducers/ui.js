const constants  = require('redux/data/constants')

const C = constants.actions

const RDCR = {}

// -----------------------------------------------------------------------------

RDCR['FOLDER_NAME'] = (state, {folder_name}) => {
  if (state.folder_name === folder_name) return state  // noop

  const new_state = {...state}
  Object.assign(new_state, {folder_name})
  return new_state
}

RDCR['THREAD_ID'] = (state, {thread_id}) => {
  if (state.thread_id === thread_id) return state  // noop

  const new_state = {...state}
  Object.assign(new_state, {thread_id})
  return new_state
}

RDCR['START_THREADS_INDEX'] = (state, {start_threads_index}) => {
  if (state.start_threads_index === start_threads_index) return state  // noop

  const new_state = {...state}
  Object.assign(new_state, {start_threads_index})
  return new_state
}

RDCR['MAX_THREADS_PER_PAGE'] = (state, {max_threads_per_page}) => {
  if (state.settings.max_threads_per_page === max_threads_per_page) return state  // noop

  const new_state = {...state, settings: {...state.settings}}
  Object.assign(new_state.settings, {max_threads_per_page})
  return new_state
}

RDCR['PUBLIC_KEY'] = (state, {public_key}) => {
  if (state.settings.public_key === public_key) return state  // noop

  const new_state = {...state, settings: {...state.settings}}
  Object.assign(new_state.settings, {public_key})
  return new_state
}

RDCR['PRIVATE_KEY'] = (state, {private_key}) => {
  if (state.settings.private_key === private_key) return state  // noop

  const new_state = {...state, settings: {...state.settings}}
  Object.assign(new_state.settings, {private_key})
  return new_state
}

RDCR['PRIVATE_KEY_STORAGE'] = (state, {private_key_storage}) => {
  if (state.settings.private_key_storage === private_key_storage) return state  // noop

  const new_state = {...state, settings: {...state.settings}}
  Object.assign(new_state.settings, {private_key_storage})
  return new_state
}

RDCR['IS_GENERATING_KEYPAIR'] = (state, {is_generating_keypair}) => {
  if (state.settings.is_generating_keypair === is_generating_keypair) return state  // noop

  const new_state = {...state, settings: {...state.settings}}
  Object.assign(new_state.settings, {is_generating_keypair})
  return new_state
}

// -----------------------------------------------------------------------------

RDCR['INIT'] = (state, action) => {
  let {thread_id} = action

  if (!thread_id) return state  // noop

  const new_state = RDCR.THREAD_ID(state, {thread_id})
  return new_state
}

// -----------------------------------------------------------------------------

const ui = (state = {settings: {...constants.default_settings}}, action) => {
  switch (action.type) {

    case C.STORE_INITIALIZED:
      return RDCR.INIT(state, action)

    case C.SAVE_SETTING.FOLDER_NAME:
      return RDCR.FOLDER_NAME(state, action)

    case C.SAVE_SETTING.THREAD_ID:
      return RDCR.THREAD_ID(state, action)

    case C.SAVE_SETTING.START_THREADS_INDEX:
      return RDCR.START_THREADS_INDEX(state, action)

    case C.SAVE_SETTING.MAX_THREADS_PER_PAGE:
      return RDCR.MAX_THREADS_PER_PAGE(state, action)

    case C.SAVE_SETTING.PUBLIC_KEY:
      return RDCR.PUBLIC_KEY(state, action)

    case C.SAVE_SETTING.PRIVATE_KEY:
      return RDCR.PRIVATE_KEY(state, action)

    case C.SAVE_SETTING.PRIVATE_KEY_STORAGE:
      return RDCR.PRIVATE_KEY_STORAGE(state, action)

    case C.SAVE_SETTING.IS_GENERATING_KEYPAIR:
      return RDCR.IS_GENERATING_KEYPAIR(state, action)

    default:
      return state
  }
}

module.exports = ui
