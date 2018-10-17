const constants  = require('redux/data/constants')
const actions    = require('redux/actions')

const namespace  = '@@react_router'

const C = constants.actions[namespace]

const ROUTER = {}

// -----------------------------------------------------------------------------

ROUTER['OPEN_FOLDER'] = ({getState, dispatch, next, action}) => {
  const {folder_name, start_threads_index = 0} = action
  if (!folder_name) return

  dispatch(
    actions.SAVE_SETTING.FOLDER_NAME(folder_name)
  )
  dispatch(
    actions.SAVE_SETTING.START_THREADS_INDEX(start_threads_index)
  )
}

// -----------------------------------------------------------------------------

ROUTER['OPEN_THREAD'] = ({getState, dispatch, next, action}) => {
  const {thread_id} = action
  if (!thread_id) return

  dispatch(
    actions.SAVE_SETTING.THREAD_ID(thread_id)
  )
}

// -----------------------------------------------------------------------------

const ROUTER_middleware = ({getState, dispatch}) => next => action => {
  switch (action.type) {

    case C.OPEN_FOLDER:
      ROUTER.OPEN_FOLDER({getState, dispatch, next, action})
      break

    case C.OPEN_THREAD:
      ROUTER.OPEN_THREAD({getState, dispatch, next, action})
      break

    default:
      next(action)
  }
}

module.exports = ROUTER_middleware
