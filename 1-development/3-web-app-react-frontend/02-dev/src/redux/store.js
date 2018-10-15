const {createStore, applyMiddleware}  = require('redux')

const initialState = require('redux/data/initial_state')
const rootReducer  = require('redux/reducers')
const middleware   = [
  require('redux/middleware/settings'),
  require('redux/middleware/encryption'),
  require('redux/middleware/server_API')
]

const storeFactory = (stateData=initialState) =>
    applyMiddleware(...middleware)(createStore)(
        rootReducer,
        stateData
    )

const store = storeFactory()

// -----------------------------------------------------------------------------

const actions = require('redux/actions')

store.dispatch(
  actions.STORE_INITIALIZED(window.init_data || {})
)

// -----------------------------------------------------------------------------

module.exports = {storeFactory, store}
