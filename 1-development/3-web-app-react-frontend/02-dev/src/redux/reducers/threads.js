const constants  = require('redux/data/constants')

const C = constants.actions

const RDCR = {}

// -----------------------------------------------------------------------------

RDCR['INSERT_MANY'] = (state, {threads}) => {
  let insert_counter = 0

  const new_state = {...state}

  threads.forEach(thread => {
    let {thread_id, summary, settings} = thread

    if (new_state[thread_id] === undefined) {
      insert_counter++

      new_state[thread_id] = {
        summary:  {...summary},
        settings: {...settings}
      }
    }
  })

  return insert_counter ? new_state : state
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

  new_state[thread_id] = new_thread
  return new_state
}

RDCR['UPDATE_ONE']['THREAD']['MESSAGE'] = (state, {{thread_id, recipient, body, cc, attachments}}) => {
  const old_thread = state[thread_id]
  if (!old_thread || (typeof old_thread !== 'object') || !old_thread.settings) return state  // noop

  const new_message = (() => {
    let to = [recipient]
    if (cc) {
      if (typeof cc === 'string')
        to.push(cc)
      else if (Array.isArray(cc) && cc.length)
        to = [...to, ...cc]
    }

    return {
      message_id:     '',
      summary: {
        from:         state.user.email_address,
        to,
        timestamp:    (new Date().getTime())
      },
      contents: {
        body,
        attachments
      },
      settings: {
        star:         false,
        unread:       false,
        trash:        false 
      }
    }
  })()

  const new_state  = {...state}
  const new_thread = {...old_thread, messages: [...old_thread.messages, new_message]}  // APPEND new message to thread

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

    case C.SAVE_REPLY_TO_THREAD:
      return RDCR.UPDATE_ONE.THREAD.MESSAGE(state, action)

    case C.SAVE_THREAD_UPDATE:
      return RDCR.UPDATE_ONE.THREAD.SETTINGS(state, action)

    case C.SAVE_MESSAGE_UPDATE:
      return RDCR.UPDATE_ONE.MESSAGE.SETTINGS(state, action)

    default:
      return state
  }
}

module.exports = threads
