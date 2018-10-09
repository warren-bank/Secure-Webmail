import reducer from 'redux/reducers/todos'

const {addTodo, toggleTodo} = redux.actions

const reduce_addTodo = (todo, mutable_state=[]) => {
  let state  = [...mutable_state]
  let action = addTodo(todo)
  deepFreeze(state)
  deepFreeze(action)

  let new_state = reducer(state, action)
  return new_state
}

const reduce_toggleTodo = (id, mutable_state) => {
  let state  = [...mutable_state]
  let action = toggleTodo(id)
  deepFreeze(state)
  deepFreeze(action)

  let new_state = reducer(state, action)
  return new_state
}

describe('Redux reducer: todos', function() {

  it('should add new todo to empty state', function() {
    let todo  = 'commit changes'
    let state = reduce_addTodo(todo)
    expect(state).toHaveLength(1)
    expect(state[0]).toMatchObject({text: todo, completed: false})
  })

  it('should add new todo to non-empty state', function() {
    let todos = ['commit changes', 'push to remote']
    let state
    state = reduce_addTodo(todos[0])
    state = reduce_addTodo(todos[1], state)
    expect(state).toHaveLength(2)
    expect(state[0]).toMatchObject({text: todos[0], completed: false})
    expect(state[1]).toMatchObject({text: todos[1], completed: false})
  })

  it('should toggle todo', function() {
    let todos = ['commit changes', 'push to remote']
    let state
    state = reduce_addTodo(todos[0])
    state = reduce_addTodo(todos[1], state)

    state = reduce_toggleTodo(state[0].id, state)
    expect(state[0]).toMatchObject({text: todos[0], completed: true})

    state = reduce_toggleTodo(state[1].id, state)
    expect(state[1]).toMatchObject({text: todos[1], completed: true})

    state = reduce_toggleTodo(state[0].id, state)
    expect(state[0]).toMatchObject({text: todos[0], completed: false})

    state = reduce_toggleTodo(state[1].id, state)
    expect(state[1]).toMatchObject({text: todos[1], completed: false})
  })

})
