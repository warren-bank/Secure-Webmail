const constants  = require('redux/data/constants')

const C = constants.actions

const RDCR = {}

// -----------------------------------------------------------------------------

RDCR['INSERT_MANY'] = (state, {folder_name, thread_ids, method='APPEND'}) => {
  const new_state = {...state}
  const existing_threads = state[folder_name]

  let updated_threads
  if (existing_threads && Array.isArray(existing_threads) && existing_threads.length) {
    updated_threads = (method === 'PREPEND')
      ? [...thread_ids, ...existing_threads]
      : [...existing_threads, ...thread_ids]
  }
  else {
    updated_threads = [...thread_ids]
  }

  new_state[folder_name] = updated_threads
  return new_state
}

RDCR['APPEND_MANY'] = (state, action) => {
  return RDCR.INSERT_MANY(state, action, 'APPEND')
}

RDCR['PREPEND_MANY'] = (state, action) => {
  return RDCR.INSERT_MANY(state, action, 'PREPEND')
}

RDCR['REFRESH'] = (state, {folder_name}) => {
  const existing_threads = state[folder_name]
  if (existing_threads && Array.isArray(existing_threads) && !existing_threads.length) return state  // noop

  const new_state = {...state}
  new_state[folder_name] = []
  return new_state
}

// -----------------------------------------------------------------------------

const threads_in_folder = (state = {}, action) => {
  switch (action.type) {

    case C.SAVE_THREADS_TO_FOLDER.APPEND:
      return RDCR.APPEND_MANY(state, action)

    case C.SAVE_THREADS_TO_FOLDER.PREPEND:
      return RDCR.PREPEND_MANY(state, action)

    case C.SAVE_THREADS_TO_FOLDER.REFRESH:
      return RDCR.REFRESH(state, action)

    default:
      return state
  }
}

module.exports = threads_in_folder
