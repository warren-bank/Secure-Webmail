const React      = require('react')
const PropTypes  = require('prop-types')

const purify     = require('react/components/higher-order/purify')
const AddTodo    = require('./AddTodo')
const TodoList   = require('./TodoList')
const Footer     = require('./Footer')

const App = ({state}, {constants}) => {
  return (
    <div>
      <AddTodo />
      <TodoList todos={state.todos} />
      <Footer visibilityFilter={state.visibilityFilter} />
    </div>
  )
}

App.propTypes = {
  state: PropTypes.object.isRequired
}

App.displayName = 'App'

module.exports = purify(App)
