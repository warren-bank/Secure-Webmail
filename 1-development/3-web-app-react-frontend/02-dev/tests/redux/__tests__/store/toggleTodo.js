const {storeFactory, initialState} = redux
const {toggleTodo}                 = redux.actions

describe('Redux store: dispatch action "toggleTodo"', function() {

  let store, id, new_state
  
  const id_index = 1
  const initial  = {
	length: initialState.todos.length,
	toggle: initialState.todos[id_index].completed
  }

  const do_toggle = id => {
    store.dispatch(toggleTodo(id))
    new_state = store.getState()
  }

  beforeAll(() => {
    store = storeFactory(initialState)
    id = store.getState().todos[id_index].id
    do_toggle(id)
  })

  it('should toggle todo from false to true', function() {
    expect(new_state.todos).toHaveLength(initial.length)
    expect(new_state.todos[id_index].completed).toBe(!initial.toggle)
  })

  it('should toggle todo from true to false', function() {
    do_toggle(id)
    expect(new_state.todos).toHaveLength(initial.length)
    expect(new_state.todos[id_index].completed).toBe(initial.toggle)
  })

})
