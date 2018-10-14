const constants  = require('redux/data/constants')
const actions    = require('redux/actions')

const C = constants.actions

const SETTINGS = {}

// -----------------------------------------------------------------------------

SETTINGS['UPDATE_SETTINGS'] = ({getState, dispatch, next, action}) => {
  const {max_threads_per_page = 25, private_key = '', private_key_storage = 0} = action

  const storage_key = constants.storage.PRIVATE_KEY

  switch(private_key_storage) {
    case 2:
      window.localStorage.setItem(storage_key, private_key)
      window.sessionStorage.removeItem(storage_key)
      break
    case 1:
      window.localStorage.removeItem(storage_key)
      window.sessionStorage.setItem(storage_key, private_key)
      break
    case 0:
    default:
      window.localStorage.removeItem(storage_key)
      window.sessionStorage.removeItem(storage_key)
      private_key_storage = 0
      break
  }

  if (max_threads_per_page > 0) {
    dispatch(
      actions.SAVE_SETTING.MAX_THREADS_PER_PAGE(max_threads_per_page)
    )
  }
  dispatch(
    actions.SAVE_SETTING.PRIVATE_KEY(private_key)
  )
  dispatch(
    actions.SAVE_SETTING.PRIVATE_KEY_STORAGE(private_key_storage)
  )
}

// -----------------------------------------------------------------------------

const SETTINGS_middleware = ({getState, dispatch}) => next => action => {
  switch (action.type) {

    case C.UPDATE_SETTINGS:
      SETTINGS.UPDATE_SETTINGS({getState, dispatch, next, action})
      break

    case C.SAVE_SETTING.MAX_THREADS_PER_PAGE:
    case C.SAVE_SETTING.PRIVATE_KEY:
    case C.SAVE_SETTING.PRIVATE_KEY_STORAGE:
    default:
      next(action)
  }
}

module.exports = SETTINGS_middleware
