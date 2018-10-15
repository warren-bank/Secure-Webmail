const constants  = require('redux/data/constants')
const actions    = require('redux/actions')

const C = constants.actions

const TRIGGERS = {}

// -----------------------------------------------------------------------------

TRIGGERS['SAVE_THREAD'] = ({getState, dispatch, next, action}) => {
  if (action && action.thread && action.thread.participants && action.thread.participants.length) {
    const participants = action.thread.participants

    // retrieve all public keys necessary to reply to every participant in thread
    dispatch(
      actions.GET_RSA_PUBLIC_KEYS([...participants])
    )
  }

  next(action)
}

// -----------------------------------------------------------------------------

TRIGGERS['SEND_EMAIL'] = {}

TRIGGERS['SEND_EMAIL']['REPLY'] = ({getState, dispatch, next, action}) => {
  dispatch(
    actions.SAVE_REPLY_TO_THREAD(action)
  )

  next(action)
}

// -----------------------------------------------------------------------------

const TRIGGERS_middleware = ({getState, dispatch}) => next => action => {
  switch (action.type) {

    case C.SAVE_THREAD:
      TRIGGERS.SAVE_THREAD({getState, dispatch, next, action})
      break

    case C.SEND_EMAIL.REPLY:
      // "TRIGGERS_middleware" must run BEFORE "CRYPTO_middleware"
      TRIGGERS.SEND_EMAIL.REPLY({getState, dispatch, next, action})
      break

    default:
      next(action)
  }
}

module.exports = TRIGGERS_middleware
