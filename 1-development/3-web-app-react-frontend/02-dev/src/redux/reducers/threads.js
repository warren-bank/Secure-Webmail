const constants  = require('redux/data/constants')

const C = constants.actions

const RDCR = {}

// -----------------------------------------------------------------------------

RDCR['INSERT_MANY'] = (state, {threads}) => {
  const new_state = {...state}

  threads.forEach(thread => {
    let {thread_id, summary, settings} = thread

    new_state[thread_id] = {
      summary:  {...summary},
      settings: {...settings}
    }
  })

  return new_state
}

// -----------------------------------------------------------------------------

RDCR['UPDATE_ONE'] = {
  "THREAD":  {},
  "MESSAGE": {}
}

RDCR['UPDATE_ONE']['THREAD']['MESSAGES'] = (state, {thread_id, thread}) => {
  const old_thread = state[thread_id]
  if (!old_thread || (typeof old_thread !== 'object') || !old_thread.summary || !old_thread.settings) return state  // noop

  const new_state  = {...state}
  const new_thread = {
    summary:      {...old_thread.summary},
    settings:     {...old_thread.settings},
    messages:     [...thread.messages],
    participants: [...thread.participants]
  }

  // todo: this would be a good time to decrypt all of the messages in the thread, and cache them as cleartext in the global Redux store

  new_state[thread_id] = new_thread
  return new_state
}

RDCR['UPDATE_ONE']['THREAD']['SETTINGS'] = (state, {thread_id, options}) => {
  const old_thread = state[thread_id]
  if (!old_thread || (typeof old_thread !== 'object') || !old_thread.settings) return state  // noop

  const new_state  = {...state}

  const new_thread = {...old_thread, settings: {...old_thread.settings}}
  Object.assign(new_thread.settings, options)

  new_state[thread_id] = new_thread
  return new_state
}

RDCR['UPDATE_ONE']['MESSAGE']['SETTINGS'] = (state, {thread_id, message_id, options}) => {
  const old_thread = state[thread_id]
  if (!old_thread || (typeof old_thread !== 'object') || !old_thread.messages || !Array.isArray(old_thread.messages) || !old_thread.messages.length) return state  // noop

  const index = old_thread.messages.find(message => message.message_id === message_id)
  if ((typeof index !== 'number') || (index < 0)) return state  // noop

  const new_state  = {...state}
  const new_thread = {...old_thread, messages: [...old_thread.messages]}

  const old_message = old_thread.messages[index]
  const new_message = {...old_message, settings: {...old_message.settings}}
  Object.assign(new_message.settings, options)

  new_thread.messages[index] = new_message
  new_state[thread_id] = new_thread
  return new_state
}

// -----------------------------------------------------------------------------

const threads = (state = {}, action) => {
  switch (action.type) {

    case C.SAVE_THREADS:
      return RDCR.INSERT_MANY(state, action)

    case C.SAVE_THREAD:
      return RDCR.UPDATE_ONE.THREAD.MESSAGES(state, action)

    case C.SAVE_THREAD_UPDATE:
      return RDCR.UPDATE_ONE.THREAD.SETTINGS(state, action)

    case C.SAVE_MESSAGE_UPDATE:
      return RDCR.UPDATE_ONE.MESSAGE.SETTINGS(state, action)

    default:
      return state
  }
}

module.exports = threads
