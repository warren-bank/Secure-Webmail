import constants from 'redux/data/constants'

const C = constants.actions

const visibilityFilter = (state = '', action) => {
  switch (action.type) {
    case C.SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}

export default visibilityFilter
