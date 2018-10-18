const {createStore, applyMiddleware}  = require('redux')

const initialState = require('redux/data/initial_state')
const rootReducer  = require('redux/reducers')
const middleware   = [
  require('redux/middleware/encryption'),
  require('redux/middleware/settings'),
  require('redux/middleware/triggers'),
  require('redux/middleware/server_API'),
  require('redux/middleware/react_router')
]

const storeFactory = (stateData = initialState) =>
    applyMiddleware(...middleware)(createStore)(
        rootReducer,
        stateData
    )

const store = storeFactory()

module.exports = {storeFactory, store}
