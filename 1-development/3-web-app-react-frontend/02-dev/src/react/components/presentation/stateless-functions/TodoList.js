const React      = require('react')
const PropTypes  = require('prop-types')

const purify     = require('react/components/higher-order/purify')
const Todo       = require('./Todo')

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

module.exports = purify(TodoList)
