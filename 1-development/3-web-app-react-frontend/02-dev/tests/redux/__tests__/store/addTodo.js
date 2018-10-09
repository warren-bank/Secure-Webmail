const {storeFactory, initialState} = redux
const {addTodo}                    = redux.actions

describe('Redux store: dispatch action "addTodo"', function() {

  let store, new_state

  const todo = "task #4"

  beforeAll(() => {
    store = storeFactory(initialState)
    store.dispatch(addTodo(todo))
    new_state = store.getState()
  })

  it('should add new todo', function() {
    expect(new_state.todos).toHaveLength(4)
    expect(new_state.todos[3]).toMatchObject({text: todo, completed: false})
  })

})
