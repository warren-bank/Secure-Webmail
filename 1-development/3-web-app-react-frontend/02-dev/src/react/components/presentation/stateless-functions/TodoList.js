import React      from 'react'
import PropTypes  from 'prop-types'

import purify     from 'react/components/higher-order/purify'
import Todo       from './Todo'

const TodoList = ({todos}, {actions}) => (
  <ul>
    {todos.map((todo, i) => (
      <Todo key={i} {...todo} onClick={() => actions.toggleTodo(todo.id)} />
    ))}
  </ul>
)

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
}

TodoList.requireActions = ['toggleTodo']

TodoList.displayName = 'TodoList'

export default purify(TodoList)
