const constants  = require('redux/data/constants')
const actions    = require('redux/actions')

const C = constants.actions

const TRIGGERS = {}
const HELPERS  = {}

// -----------------------------------------------------------------------------

HELPERS['PUBLIC_KEYS_NEEDED'] = ({getState, dispatch, next, action}, allow_state_transition) => {
  const state = getState()
  const {recipient, cc} = action

  if (!recipient) throw new Error('required field: recipient email address')

  let all_emails = [recipient, state.user.email_address]
  if (cc) {
    if (typeof cc === 'string')
      all_emails.push(cc)
    else if (Array.isArray(cc) && cc.length)
      all_emails = [...all_emails, ...cc]
  }

  const no_pubkey = []
  all_emails.forEach(email => {
    let pubkey = state.public_keys[email]
    if (!pubkey) {
      no_pubkey.push(email)
    }
  })

  if (no_pubkey.length && allow_state_transition) {
    dispatch(
      actions.SAVE_APP.DRAFT_MESSAGE.SET_STATUS(1, "")  // BUSY_GETTING_PUBKEYS
    )
    dispatch(
      actions.GET_RSA_PUBLIC_KEYS(no_pubkey)
    )
  }

  return no_pubkey
}

// -----------------------------------------------------------------------------

HELPERS['SAVE_REPLY_TO_THREAD'] = ({getState, dispatch, next, action}, is_reply) => {
  const state = getState()

  if (is_reply) {
    const from          = state.user.email_address
    const draft_message = state.app.draft_message

    // validate that action matches draft_message
    let is_match = true
    {
      const {thread_id: a_thread_id, recipient: a_recipient, cc: a_cc} = action
      const {thread_id: d_thread_id, recipient: d_recipient, cc: d_cc} = draft_message

      is_match = is_match || (a_thread_id !== d_thread_id)
      is_match = is_match || (a_recipient !== d_recipient)
      is_match = is_match || (a_cc.length !== d_cc.length)
    }

    if (is_match) {
      dispatch(
        actions.SAVE_REPLY_TO_THREAD(draft_message, from)
      )
    }
  }
}

// -----------------------------------------------------------------------------
// reminder:
//   `state.app.draft_message.status.code` is the enumeration:
//     [0=can_edit, 1=busy_getting_pubkeys, 2=busy_sending, 3=sent_success, 4=sent_error]

TRIGGERS['SEND_EMAIL'] = ({getState, dispatch, next, action}, is_reply) => {
  let state, status_code

  // before other middleware executes
  state = getState()
  status_code = state.app.draft_message.status.code

  if (status_code > 1)
    return  // discard the action

  let no_pubkey
  if (status_code === 0) {
    no_pubkey = HELPERS.PUBLIC_KEYS_NEEDED({getState, dispatch, next, action}, true)

    if (no_pubkey.length)
      return  // discard the action while waiting for a server response; a copy of the draft message will be resent when the asynchronous callback occurs.
  }
  if (status_code === 1) {
    no_pubkey = HELPERS.PUBLIC_KEYS_NEEDED({getState, dispatch, next, action}, false)

    // error: public keys were already requested but some are still missing.
    if (no_pubkey.length) {
      let error_message_htm = `<div class="encryption_error">The following email address${ (no_pubkey.length > 1) ? 'es are' : ' is' } not associated with a public encryption key:` + ((no_pubkey.length > 1) ? ('<ul class="count_many"><li>' + no_pubkey.join('</li><li>') + '</li></ul>') : ` <span class="count_one">"${no_pubkey[0]}"</span>`) + '</div>'
      dispatch(
        actions.SAVE_APP.DRAFT_MESSAGE.SET_STATUS(4, error_message_htm)  // SENT_ERROR
      )
      return  // discard the action
    }
  }

  dispatch(
    actions.SAVE_APP.DRAFT_MESSAGE.SET_STATUS(2, "")  // BUSY_SENDING
  )

  next(action)

  // after other middleware executes
  state = getState()
  status_code = state.app.draft_message.status.code

  if (status_code === 2) {
    dispatch(
      actions.SAVE_APP.DRAFT_MESSAGE.SET_STATUS(3, "")  // SENT_SUCCESS
    )

    HELPERS.SAVE_REPLY_TO_THREAD({getState, dispatch, next, action}, is_reply)
  }
}

// -----------------------------------------------------------------------------

TRIGGERS['SAVE_RSA_PUBLIC_KEYS'] = ({getState, dispatch, next, action}) => {
  const state         = getState()
  const draft_message = state.app.draft_message
  const status_code   = state.app.draft_message.status.code

  if (status_code !== 1) return

  if (draft_message.is_reply) {
    let {thread_id, recipient, body, cc, attachments} = draft_message
    dispatch(
      actions.SEND_EMAIL.REPLY(thread_id, recipient, body, cc, attachments)
    )
  }
  else {
    let {recipient, subject, body, cc, attachments} = draft_message
    dispatch(
      actions.SEND_EMAIL.NEW_MESSAGE(recipient, subject, body, cc, attachments)
    )
  }
}

// -----------------------------------------------------------------------------

TRIGGERS['OPEN_THREAD'] = ({getState, dispatch, next, action}) => {
  dispatch(
    actions.SAVE_APP.DRAFT_MESSAGE.CLEAR()
  )
}

TRIGGERS['OPEN_COMPOSE_MESSAGE'] = ({getState, dispatch, next, action}) => {
  dispatch(
    actions.SAVE_APP.DRAFT_MESSAGE.CLEAR()
  )
}

// -----------------------------------------------------------------------------

const DRAFT_MESSAGE_middleware = ({getState, dispatch}) => next => action => {
  switch (action.type) {

    case C.SEND_EMAIL.REPLY:
      TRIGGERS.SEND_EMAIL({getState, dispatch, next, action}, true)
      break

    case C.SEND_EMAIL.NEW_MESSAGE:
      TRIGGERS.SEND_EMAIL({getState, dispatch, next, action}, false)
      break

    // allow reducer to update state before attempting to resend the draft message
    case C.SAVE_RSA_PUBLIC_KEYS:
      next(action)
      TRIGGERS.SAVE_RSA_PUBLIC_KEYS({getState, dispatch, next, action})
      break

    case C.RESPOND_TO_USER_EVENT.OPEN_THREAD:
      TRIGGERS.OPEN_THREAD({getState, dispatch, next, action})
      next(action)
      break

    // should never occur
    case C.RESPOND_TO_USER_EVENT.OPEN_COMPOSE_MESSAGE:
      TRIGGERS.OPEN_COMPOSE_MESSAGE({getState, dispatch, next, action})
      next(action)
      break

    case C.RESPOND_TO_USER_EVENT.REDIRECT_URL:
      switch(action.target) {
        case C.RESPOND_TO_USER_EVENT.OPEN_COMPOSE_MESSAGE:
          TRIGGERS.OPEN_COMPOSE_MESSAGE({getState, dispatch, next, action})
          break
      }
      next(action)
      break

    default:
      next(action)
  }
}

module.exports = DRAFT_MESSAGE_middleware
