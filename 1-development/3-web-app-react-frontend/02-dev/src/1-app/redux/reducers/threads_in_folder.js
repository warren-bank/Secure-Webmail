const constants  = require('redux/data/constants')

const C = constants.actions

const RDCR = {}

// -----------------------------------------------------------------------------

RDCR['SAVE'] = (state, {folder_name, thread_ids, start=0, force=false}) => {
  if (!folder_name || !thread_ids || !Array.isArray(thread_ids) || !thread_ids.length) return state  // noop

  const new_state = {...state}
  const existing_threads = state[folder_name]

  let updated_threads
  if (existing_threads && Array.isArray(existing_threads) && existing_threads.length) {
    if (start === 0) {
      let first_existing = existing_threads[0]
      let first_position = thread_ids.indexOf(first_existing)

      if (first_position >= 0) {
        let new_threads = thread_ids.slice(0, first_position)

        // only prepend new threads
        updated_threads = [...new_threads, ...existing_threads]
      }
      else if (force) {
        // prepend all threads
        updated_threads = [...thread_ids, ...existing_threads]
      }
      else {
        // refresh: replace the existing array
        updated_threads = [...thread_ids]
      }
    }
    else {
      if (start === existing_threads.length) {
        // append all threads
        updated_threads = [...existing_threads, ...thread_ids]
      }
      else if (
        (start < existing_threads.length)                       &&
        ((start + thread_ids.length) > existing_threads.length) &&
        (thread_ids[0] === existing_threads[start])
      ){
        let last_existing = existing_threads[ existing_threads.length - 1 ]
        let last_position = thread_ids.indexOf(last_existing)

        if (last_position >= 0) {
          let new_threads = thread_ids.slice(last_position + 1)

          // only append new threads (safe method)
          updated_threads = [...existing_threads, ...new_threads]
        }
        else {
          let old_threads = existing_threads.slice(0, start)

          // only append new threads (unsafe method)
          updated_threads = [...old_threads, ...thread_ids]
        }
      }
      else if (force) {
        // append all threads (blindly: DONT DO THIS)
        updated_threads = [...existing_threads, ...thread_ids]
      }
      else {
        // undeterministic
        return state  // noop
      }
    }
  }
  else {
    updated_threads = [...thread_ids]
  }

  new_state[folder_name] = updated_threads
  return new_state
}

// -----------------------------------------------------------------------------

const threads_in_folder = (state = {}, action) => {
  switch (action.type) {

    case C.SAVE_THREADS_TO_FOLDER:
      return RDCR.SAVE(state, action)

    default:
      return state
  }
}

module.exports = threads_in_folder
