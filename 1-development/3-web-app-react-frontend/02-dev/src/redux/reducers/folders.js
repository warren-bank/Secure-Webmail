const constants  = require('redux/data/constants')

const C = constants.actions

const RDCR = {}

// -----------------------------------------------------------------------------

RDCR['REPLACE'] = (state, {folders}) => {
  if (!folders || !Array.isArray(folders) || !folders.length) return state  // noop

  // catch unneeded updates
  {
    let no_change = (state.length === folders.length)

    for (let i=0; no_change && (i < state.length); i++) {
      no_change = (
       (state[i].folder_name  === folders[i].folder_name) &&
       (state[i].unread_count === folders[i].unread_count)
      )
    }

    if (no_change) return state  // noop
  }

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
