const constants  = require('redux/data/constants')

const C = constants.actions

const RDCR = {}

// -----------------------------------------------------------------------------

RDCR['REPLACE'] = (state, {folders}) => {
  if (!folders || !Array.isArray(folders) || !folders.length) return state  // noop

  const new_state = folders.map(folder => {return {...folder}})
  return new_state
}

// -----------------------------------------------------------------------------

const folders = (state = [], action) => {
  switch (action.type) {

    case C.SAVE_FOLDERS:
      return RDCR.REPLACE(state, action)

    default:
      return state
  }
}

module.exports = folders
