const {createStore, applyMiddleware}  = require('redux')

const initialState = require('redux/data/initial_state')
const rootReducer  = require('redux/reducers')
const middleware   = [
  require('redux/middleware/debug_logger'),
  require('redux/middleware/triggers'),
  require('redux/middleware/user_events'),
  require('redux/middleware/settings'),
  require('redux/middleware/server_API'),
  require('redux/middleware/encryption')
]

const storeFactory = (stateData = initialState) =>
    applyMiddleware(...middleware)(createStore)(
        rootReducer,
        stateData
    )

const store = storeFactory()

module.exports = {storeFactory, store}
