const constants  = require('redux/data/constants')

const C       = constants.actions
const debug   = (window.location.protocol === 'file:') && window.mock_data
const verbose = false

const LOGGER_middleware = ({getState, dispatch}) => next => action => {
  if (action.type === C.LOG_DEBUG_MESSAGE) {
    if (debug) {
      let {message} = action
      console.log(...message)
    }
    return
  }

  let old_state

  if (debug) {
    old_state = getState()
    let data = {action, state: old_state}
    console.log('pre:', action.type, data)
    if (verbose)
      console.log(JSON.stringify(old_state, null, 4))
  }

  next(action)

  if (debug) {
    let new_state = getState()
    let is_same = (old_state === new_state)
    let status  = is_same ? 'no change' : 'NEW STATE'
    let data = is_same ? {action, state: old_state} : {action, old_state, new_state}
    console.log(`post (${status}):`, action.type, data)
    if (verbose)
      console.log(JSON.stringify(new_state, null, 4))
  }
}

module.exports = LOGGER_middleware
