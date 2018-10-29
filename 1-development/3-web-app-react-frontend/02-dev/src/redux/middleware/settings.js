const constants  = require('redux/data/constants')
const actions    = require('redux/actions')

const storage    = require('redux/lib/middleware/storage')

const C = constants.actions

const SETTINGS = {}

// -----------------------------------------------------------------------------

SETTINGS['INIT'] = ({getState, dispatch, next, action}) => {
  const data = storage.GET.PRIVATE_KEY(getState)
  if (!data) return

  const {private_key, private_key_storage} = data

  dispatch(
    actions.SAVE_APP.SETTING.PRIVATE_KEY(private_key)
  )
  dispatch(
    actions.SAVE_APP.SETTING.PRIVATE_KEY_STORAGE(private_key_storage)
  )
}

// -----------------------------------------------------------------------------

SETTINGS['SAVE_RSA_PUBLIC_KEYS'] = ({getState, dispatch, next, action}) => {
  if (!action.public_keys) return

  const state     = getState()
  const my_email  = state.user.email_address
  const my_pubkey = action.public_keys[my_email]

  if (!my_email)  return
  if (!my_pubkey) return

  dispatch(
    actions.SAVE_APP.SETTING.PUBLIC_KEY(my_pubkey)
  )
}

// -----------------------------------------------------------------------------

SETTINGS['UPDATE_SETTINGS'] = ({getState, dispatch, next, action}) => {
  const {max_threads_per_page, private_key, private_key_storage} = Object.assign({}, constants.default_settings, action)

  storage.SET.PRIVATE_KEY(getState, private_key, private_key_storage)

  if (max_threads_per_page > 0) {
    dispatch(
      actions.SAVE_APP.SETTING.MAX_THREADS_PER_PAGE(max_threads_per_page)
    )
  }
  dispatch(
    actions.SAVE_APP.SETTING.PRIVATE_KEY(private_key)
  )
  dispatch(
    actions.SAVE_APP.SETTING.PRIVATE_KEY_STORAGE(private_key_storage)
  )
}

// -----------------------------------------------------------------------------

const SETTINGS_middleware = ({getState, dispatch}) => next => action => {
  switch (action.type) {

    case C.STORE_INITIALIZED:
      // 1st: allow "user" Redux reducer to store "email_address"
      next(action)

      // 2nd: retrieve private key from storage
      SETTINGS.INIT({getState, dispatch, next, action})
      break

    case C.SAVE_RSA_PUBLIC_KEYS:
      SETTINGS.SAVE_RSA_PUBLIC_KEYS({getState, dispatch, next, action})
      next(action)
      break

    case C.UPDATE_SETTINGS:
      SETTINGS.UPDATE_SETTINGS({getState, dispatch, next, action})
      break

    case C.SAVE_APP.SETTING.MAX_THREADS_PER_PAGE:
    case C.SAVE_APP.SETTING.PUBLIC_KEY:
    case C.SAVE_APP.SETTING.PRIVATE_KEY:
    case C.SAVE_APP.SETTING.PRIVATE_KEY_STORAGE:
    case C.SAVE_APP.SETTING.IS_GENERATING_KEYPAIR:
    default:
      next(action)
  }
}

module.exports = SETTINGS_middleware
