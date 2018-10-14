const React      = require('react')
const PropTypes  = require('prop-types')

const purify     = require('react/components/higher-order/purify')

const AddTodo = (props, {actions}) => {
  let input

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!input.value.trim()) {
            return
          }
          actions.addTodo(input.value)
          input.value = ''
        }}
      >
        <input
          ref={node => {
            input = node
          }}
        />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}

AddTodo.requireActions = ['addTodo']

AddTodo.displayName = 'AddTodo'

module.exports = purify(AddTodo)
