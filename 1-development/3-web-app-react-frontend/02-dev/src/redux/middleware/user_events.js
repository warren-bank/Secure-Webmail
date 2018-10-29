const constants  = require('redux/data/constants')
const actions    = require('redux/actions')

const C = constants.actions

const EVENT = {}

// -----------------------------------------------------------------------------

EVENT['OPEN_FOLDER'] = ({getState, dispatch, next, action}) => {
  const {folder_name, start_threads_index = 0} = action
  if (!folder_name) return

  const thread_id = ''
  const state     = getState()
  const settings  = state.app.ui

  if (settings.folder_name !== folder_name)
    dispatch(
      actions.SAVE_APP.UI.FOLDER_NAME(folder_name)
    )

  if (settings.thread_id !== thread_id)
    dispatch(
      actions.SAVE_APP.UI.THREAD_ID(thread_id)
    )

  if (settings.start_threads_index !== start_threads_index)
    dispatch(
      actions.SAVE_APP.UI.START_THREADS_INDEX(start_threads_index)
    )
}

// -----------------------------------------------------------------------------

EVENT['OPEN_THREAD'] = ({getState, dispatch, next, action}) => {
  const {thread_id} = action
  if (!thread_id) return

  const state     = getState()
  const settings  = state.app.ui

  if (settings.thread_id !== thread_id)
    dispatch(
      actions.SAVE_APP.UI.THREAD_ID(thread_id)
    )
}

// -----------------------------------------------------------------------------

const EVENT_middleware = ({getState, dispatch}) => next => action => {
  switch (action.type) {

    case C.RESPOND_TO_USER_EVENT.OPEN_FOLDER:
      EVENT.OPEN_FOLDER({getState, dispatch, next, action})
      break

    case C.RESPOND_TO_USER_EVENT.OPEN_THREAD:
      EVENT.OPEN_THREAD({getState, dispatch, next, action})
      break

    case C.RESPOND_TO_USER_EVENT.OPEN_COMPOSE_MESSAGE:
    case C.RESPOND_TO_USER_EVENT.REDIRECT_URL:
      break

    default:
      next(action)
  }
}

module.exports = EVENT_middleware
