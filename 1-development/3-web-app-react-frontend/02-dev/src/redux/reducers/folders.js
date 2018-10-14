const constants  = require('redux/data/constants')

const C = constants.actions

const folders = (state = [], action) => {
  switch (action.type) {
    case C.ADD_TODO:
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ]
    case C.TOGGLE_TODO:
      return state.map(todo =>
        (todo.id === action.id) 
          ? {...todo, completed: !todo.completed}
          : todo
      )
    default:
      return state
  }
}

module.exports = folders
