const constants  = require('redux/data/constants')

const C = constants.actions

const RDCR = {}

// -----------------------------------------------------------------------------

RDCR['SAVE'] = (state, {public_keys}) => {
  if (!public_keys || (typeof public_keys !== 'object')) return state  // noop

  const new_state = {...state}
  Object.assign(new_state, public_keys)
  return new_state
}

// -----------------------------------------------------------------------------

const public_keys = (state = {}, action) => {
  switch (action.type) {

    case C.SAVE_RSA_PUBLIC_KEYS:
      return RDCR.SAVE(state, action)

    default:
      return state
  }
}

module.exports = public_keys
