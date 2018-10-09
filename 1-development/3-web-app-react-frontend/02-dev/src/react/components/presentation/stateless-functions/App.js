import React      from 'react'
import PropTypes  from 'prop-types'

import purify     from 'react/components/higher-order/purify'
import AddTodo    from './AddTodo'
import TodoList   from './TodoList'
import Footer     from './Footer'

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

export default purify(App)
