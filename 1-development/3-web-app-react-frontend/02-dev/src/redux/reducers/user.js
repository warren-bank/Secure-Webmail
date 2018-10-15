const constants  = require('redux/data/constants')

const C = constants.actions

const RDCR = {}

// -----------------------------------------------------------------------------

RDCR['INIT'] = (state, action) => {
  let {email_address} = action

  if (email_address) {
    const new_state = {email_address}
    return new_state
  }

  return state  // noop
}

// -----------------------------------------------------------------------------

const user = (state = {}, action) => {
  switch (action.type) {

    case C.STORE_INITIALIZED:
      return RDCR.INIT(state, action)

    default:
      return state
  }
}

module.exports = user
