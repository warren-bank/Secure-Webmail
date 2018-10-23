const constants  = require('redux/data/constants')

const C = constants.actions

const RDCR   = {}
const HELPER = {}

// -----------------------------------------------------------------------------

HELPER['NOOP'] = {}

HELPER['NOOP']['SETTINGS'] = (old_settings, new_settings) => {
  const all_option_keys = Object.keys(old_settings)
  let noop = true

  all_option_keys.forEach(key => {
    if ((new_settings[key] !== undefined) && (new_settings[key] !== old_settings[key]))
      noop = false
  })
  return noop
}

// -----------------------------------------------------------------------------

HELPER['UPDATE_THREAD_SUMMARY_FROM_LAST_MESSAGE'] = (new_thread) => {
  if (!new_thread || !new_thread.summary || !Array.isArray(new_thread.messages) || !new_thread.messages.length) return

  const last_message = new_thread.messages[ new_thread.messages.length - 1 ]

  new_thread.summary           = {...new_thread.summary}
  new_thread.summary.msg_count = new_thread.messages.length

  if (last_message.contents.body)
    new_thread.summary.body = last_message.contents.body.substring(0, 160)
  if (last_message.summary.timestamp)
    new_thread.summary.date_modified = last_message.summary.timestamp
}

// -----------------------------------------------------------------------------

RDCR['SAVE_THREADS'] = (state, {threads}) => {
  if (!threads || !Array.isArray(threads) || !threads.length) return state  // noop

  let insert_counter = 0

  const new_state = {...state}

  threads.forEach(thread => {
    let {thread_id, summary, settings} = thread

    if (!thread_id || !summary || !settings) return  // continue

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

RDCR['SAVE_THREAD'] = (state, {thread_id, thread}) => {
  if (!thread_id) return state  // noop
  if (!thread || (typeof thread !== 'object') || !thread.summary || !thread.settings || !Array.isArray(thread.messages) || !Array.isArray(thread.participants)) return state  // noop

  const new_state  = {...state}

  new_state[thread_id] = thread
  return new_state
}

// -----------------------------------------------------------------------------

RDCR['SAVE_REPLY_TO_THREAD'] = (state, {thread_id, recipient, body, cc, attachments}) => {
  if (!thread_id) return state  // noop
  if (! (body || (attachments && Array.isArray(attachments) && attachments.length)) ) return state  // noop

  const old_thread = state[thread_id]
  if (!old_thread || (typeof old_thread !== 'object') || !Array.isArray(old_thread.messages)) return state  // noop

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

  HELPER.UPDATE_THREAD_SUMMARY_FROM_LAST_MESSAGE(new_thread)

  new_state[thread_id] = new_thread
  return new_state
}

// -----------------------------------------------------------------------------

RDCR['SAVE_THREAD_UPDATE'] = (state, {thread_id, options}) => {
  if (!thread_id || !options || (typeof options !== 'object')) return state  // noop

  const old_thread = state[thread_id]
  if (!old_thread || (typeof old_thread !== 'object') || !old_thread.settings) return state  // noop

  if (HELPER.NOOP.SETTINGS(old_thread.settings, options)) return state  // noop

  const new_state  = {...state}

  const new_thread = {...old_thread, settings: {...old_thread.settings}}
  Object.assign(new_thread.settings, options)

  new_state[thread_id] = new_thread
  return new_state
}

// -----------------------------------------------------------------------------

RDCR['SAVE_MESSAGE_UPDATE'] = (state, {thread_id, message_id, options}) => {
  if (!thread_id || !message_id || !options || (typeof options !== 'object')) return state  // noop

  const old_thread = state[thread_id]
  if (!old_thread || (typeof old_thread !== 'object') || !Array.isArray(old_thread.messages)) return state  // noop

  const index = old_thread.messages.find(message => message.message_id === message_id)
  if ((typeof index !== 'number') || (index < 0)) return state  // noop

  const old_message = old_thread.messages[index]
  if (HELPER.NOOP.SETTINGS(old_message.settings, options)) return state  // noop

  const new_state  = {...state}
  const new_thread = {...old_thread, messages: [...old_thread.messages]}

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
      return RDCR.SAVE_THREADS(state, action)

    case C.SAVE_THREAD:
      return RDCR.SAVE_THREAD(state, action)

    case C.SAVE_REPLY_TO_THREAD:
      return RDCR.SAVE_REPLY_TO_THREAD(state, action)

    case C.SAVE_THREAD_UPDATE:
      return RDCR.SAVE_THREAD_UPDATE(state, action)

    case C.SAVE_MESSAGE_UPDATE:
      return RDCR.SAVE_MESSAGE_UPDATE(state, action)

    default:
      return state
  }
}

module.exports = threads
