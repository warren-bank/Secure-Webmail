const constants  = require('redux/data/constants')

const C = constants.actions

const RDCR = {}

// -----------------------------------------------------------------------------

RDCR['INSERT_MANY'] = (state, {public_keys}) => {
  const new_state = {...state}

  Object.assign(new_state, public_keys)

  return new_state
}

// -----------------------------------------------------------------------------

const public_keys = (state = {}, action) => {
  switch (action.type) {

    case C.SAVE_RSA_PUBLIC_KEYS:
      return RDCR.INSERT_MANY(state, action)

    default:
      return state
  }
}

module.exports = public_keys
