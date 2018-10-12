import constants from 'redux/data/constants'
import actions   from 'redux/actions'

const C = {
  a: constants.actions,
  m: constants.middleware
}

const get_threads_in_folder = function({getState, dispatch, next, action}) {
  // -----------------------------------------------------------------------------------------------
  // * next(action) is not called
  // * dispatch() will be called twice
  //   - each call passes a new action that contains data retrieved from the server,
  //     and is intended for a specific reducer
  // * the server function:
  //     get_threads_in_folder(folder_name, body_length, start, max)
  //   returns a data structure that needs to update 2 attributes of the global state;
  //   each attribute is managed by a specific reducer..
  //   so the data needs to be broken apart and passed in 2 discrete actions.
  // -----------------------------------------------------------------------------------------------

  const {folder_name, body_length, start, max} = action

  const onSuccess = threads => {
    if (!threads || !Array.isArray(threads) || !threads.length) return

    const thread_ids = threads.map(thread => thread.thread_id)

    dispatch(
      actions.APPEND_THREADS_TO_FOLDER(thread_ids)
    )
    dispatch(
      actions.SAVE_THREADS(threads)
    )
  }

  google.script.run.withSuccessHandler(onSuccess).get_threads_in_folder(folder_name, body_length, start, max)
}

const server_API = ({getState, dispatch}) => next => action => {
  switch (action.type) {
    case C.a.GET_THREADS_IN_FOLDER:
      get_threads_in_folder({getState, dispatch, next, action})
      break

    case C.a.APPEND_THREADS_TO_FOLDER:
    case C.a.SAVE_THREADS:
    default:
      next(action)
  }
}

export default server_API
