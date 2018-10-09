import uuid      from 'uuid'

import constants from 'redux/data/constants'

const C = constants.actions

export const addTodo = text => {
  return {
    type: C.ADD_TODO,
    id: uuid.v4(),
    text
  }
}

export const setVisibilityFilter = filter => {
  return {
    type: C.SET_VISIBILITY_FILTER,
    filter
  }
}

export const toggleTodo = id => {
  return {
    type: C.TOGGLE_TODO,
    id
  }
}
