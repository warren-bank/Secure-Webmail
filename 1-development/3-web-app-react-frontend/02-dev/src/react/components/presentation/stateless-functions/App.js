const React      = require('react')
const PropTypes  = require('prop-types')

const purify     = require('react/components/higher-order/purify')
const AddTodo    = require('./AddTodo')
const TodoList   = require('./TodoList')
const Footer     = require('./Footer')

const getVisibleTodos = (todos, filter, C) => {
  switch (filter) {
    case C.SHOW_COMPLETED:
      return todos.filter(t => t.completed)
    case C.SHOW_ACTIVE:
      return todos.filter(t => !t.completed)
    case C.SHOW_ALL:
    default:
      return todos
  }
}

const App = ({state}, {constants}) => {
  let C     = constants.filter.values
  let todos = getVisibleTodos(state.todos, state.visibilityFilter, C)

  return (
    <div>
      <AddTodo />
      <TodoList todos={todos} />
      <Footer visibilityFilter={state.visibilityFilter} />
    </div>
  )
}

App.propTypes = {
  state: PropTypes.object.isRequired
}

App.displayName = 'App'

module.exports = purify(App)
