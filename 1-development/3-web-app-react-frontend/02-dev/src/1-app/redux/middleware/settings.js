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

  const state         = getState()
  const my_email      = state.user.email_address
  const my_old_pubkey = state.app.settings.public_key
  const my_new_pubkey = action.public_keys[my_email]

  if ( my_old_pubkey) return  // value is already saved
  if (!my_email)      return
  if (!my_new_pubkey) return  // value is not available

  dispatch(
    actions.SAVE_APP.SETTING.PUBLIC_KEY(my_new_pubkey)
  )
}

// -----------------------------------------------------------------------------

SETTINGS['UPDATE_SETTINGS'] = ({getState, dispatch, next, action}) => {
  const {private_key, private_key_storage, display_html_format, compose_html_format, max_threads_per_page} = Object.assign({}, constants.default_settings, action)

  // required fields: [private_key, private_key_storage]
  // optional fields: [display_html_format, compose_html_format, max_threads_per_page]
  //   - null values are ignored

  storage.SET.PRIVATE_KEY(getState, private_key, private_key_storage)

  if (typeof display_html_format === 'boolean') {
    dispatch(
      actions.SAVE_APP.SETTING.DISPLAY_HTML_FORMAT(display_html_format)
    )
  }
  if (typeof compose_html_format === 'boolean') {
    dispatch(
      actions.SAVE_APP.SETTING.COMPOSE_HTML_FORMAT(compose_html_format)
    )
  }
  if ((typeof max_threads_per_page === 'number') && (max_threads_per_page > 0)) {
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
