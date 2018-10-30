const constants  = require('redux/data/constants')
const actions    = require('redux/actions')

const C = constants.actions

const TRIGGERS = {}

// -----------------------------------------------------------------------------
// reminder:
//   `state.app.draft_message.status.code` is the enumeration:
//     [0=can_edit, 1=busy_sending, 2=sent_success, 3=sent_error]

TRIGGERS['SEND_EMAIL'] = ({getState, dispatch, next, action}) => {
  let state, status_code

  // before other middleware executes
  state = getState()
  status_code = state.app.draft_message.status.code

  if (status_code > 0) return  // discard the action

  dispatch(
    actions.SAVE_APP.DRAFT_MESSAGE.SET_STATUS(1, "")  // BUSY_SENDING
  )

  next(action)

  // after other middleware executes
  state = getState()
  status_code = state.app.draft_message.status.code

  if (status_code === 1) {
    dispatch(
      actions.SAVE_APP.DRAFT_MESSAGE.SET_STATUS(2, "")  // SENT_SUCCESS
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
    case C.SEND_EMAIL.NEW_MESSAGE:
      TRIGGERS['SEND_EMAIL']({getState, dispatch, next, action})
      break

    case C.RESPOND_TO_USER_EVENT.OPEN_THREAD:
      TRIGGERS.OPEN_THREAD({getState, dispatch, next, action})
      next(action)
      break

    case C.RESPOND_TO_USER_EVENT.OPEN_COMPOSE_MESSAGE:
      TRIGGERS.OPEN_COMPOSE_MESSAGE({getState, dispatch, next, action})
      next(action)
      break

    default:
      next(action)
  }
}

module.exports = DRAFT_MESSAGE_middleware
