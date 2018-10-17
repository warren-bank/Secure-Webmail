const constants  = require('redux/data/constants')

const namespace = '@@react_router'

const C = constants.actions[namespace]

const actions = {}

actions[namespace] = {}

// -----------------------------------------------------------------------------

actions[namespace]['OPEN_FOLDER'] = ({folder_name, start_threads_index = 0, history, is_push}) => {
  if (folder_name)
    (is_push ? history.push : history.replace)(`/folder/${folder_name}${start_threads_index ? `/${start_threads_index}` : '' }`)

  return {
    type: C.OPEN_FOLDER,
    folder_name,
    start_threads_index
  }
}

// -----------------------------------------------------------------------------

actions[namespace]['OPEN_THREAD'] = ({thread_id, history, is_push}) => {
  if (thread_id)
    (is_push ? history.push : history.replace)(`/thread/${thread_id}`)

  return {
    type: C.OPEN_THREAD,
    thread_id
  }
}

// -----------------------------------------------------------------------------

actions[namespace]['OPEN_COMPOSE_REPLY'] = ({thread_id, history, is_push}) => {
  if (thread_id)
    (is_push ? history.push : history.replace)(`/thread/${thread_id}/compose`)

  return {
    type: C.OPEN_COMPOSE_REPLY,
    thread_id
  }
}

// -----------------------------------------------------------------------------

actions[namespace]['OPEN_COMPOSE_MESSAGE'] = ({history, is_push}) => {
  (is_push ? history.push : history.replace)(`/compose`)

  return {
    type: C.OPEN_COMPOSE_MESSAGE
  }
}

// -----------------------------------------------------------------------------

module.exports = actions
