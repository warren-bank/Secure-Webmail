const constants          = require('redux/data/constants')
const reduce_hash_table  = require('redux/lib/reducers/reduce_hash_table')

const C = constants.actions

// -----------------------------------------------------------------------------

const ui = (state = {}, action) => {
  switch (action.type) {

    case C.STORE_INITIALIZED:
      return reduce_hash_table(state, action, 'thread_id', true)

    case C.SAVE_APP.UI.FOLDER_NAME:
      return reduce_hash_table(state, action, 'folder_name', true)

    case C.SAVE_APP.UI.THREAD_ID:
      return reduce_hash_table(state, action, 'thread_id', true)

    case C.SAVE_APP.UI.START_THREADS_INDEX:
      return reduce_hash_table(state, action, 'start_threads_index', true)

    default:
      return state
  }
}

module.exports = ui
