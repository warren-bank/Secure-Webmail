const constants          = require('redux/data/constants')
const reduce_hash_table  = require('redux/lib/reducers/reduce_hash_table')

const C = constants.actions

const RDCR = {}

// -----------------------------------------------------------------------------

const initial_state = {
  "is_reply":         false,
  "thread_id":        "",
  "recipient":        "",
  "cc":               "",
  "cc_suggestions":   [],
  "subject":          "",
  "body":             "",
  "attachments":      [],
  "status": {
    "code":           0,
    "error_message":  ""
  }
}

const get_initial_state = () => {
  const cc_suggestions = [...initial_state.cc_suggestions]
  const attachments    = initial_state.attachments.map(file => {return {...file}})
  const status         = {...initial_state.status}

  return {...initial_state, cc_suggestions, attachments, status}
}

// -----------------------------------------------------------------------------

RDCR['STORE'] = (state, {is_reply, thread_id, recipient, cc, cc_suggestions, subject, body, attachments}) => {
  cc_suggestions  = [...cc_suggestions]
  attachments     = attachments.map(file => {return {...file}})

  const status    = {code: 0, error_message: ""}
  const new_state = {is_reply, thread_id, recipient, cc, cc_suggestions, subject, body, attachments, status}

  return new_state
}

// -----------------------------------------------------------------------------

const draft_message = (state = get_initial_state(), action) => {
  switch (action.type) {

    case C.SAVE_APP.DRAFT_MESSAGE.STORE:
      return RDCR.STORE(state, action)

    case C.SAVE_APP.DRAFT_MESSAGE.CLEAR:
      return get_initial_state()

    case C.SAVE_APP.DRAFT_MESSAGE.SET_STATUS:
      return reduce_hash_table(state, action, 'status', true)

    default:
      return state
  }
}

module.exports = draft_message
