const constants          = require('redux/data/constants')
const reduce_hash_table  = require('redux/lib/reducers/reduce_hash_table')

const C = constants.actions

// -----------------------------------------------------------------------------

const settings = (state = {...constants.default_settings}, action) => {
  switch (action.type) {

    case C.SAVE_APP.SETTING.MAX_THREADS_PER_PAGE:
      return reduce_hash_table(state, action, 'max_threads_per_page', true)

    case C.SAVE_APP.SETTING.PUBLIC_KEY:
      return reduce_hash_table(state, action, 'public_key', true)

    case C.SAVE_APP.SETTING.PRIVATE_KEY:
      return reduce_hash_table(state, action, 'private_key', true)

    case C.SAVE_APP.SETTING.PRIVATE_KEY_STORAGE:
      return reduce_hash_table(state, action, 'private_key_storage', true)

    case C.SAVE_APP.SETTING.IS_GENERATING_KEYPAIR:
      return reduce_hash_table(state, action, 'is_generating_keypair', true)

    default:
      return state
  }
}

module.exports = settings
