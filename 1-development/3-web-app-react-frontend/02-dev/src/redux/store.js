const {createStore, applyMiddleware}  = require('redux')

const initialState    = require('redux/data/initial_state')
const server_API      = require('redux/middleware/server_API')
const rootReducer     = require('redux/reducers')

const storeFactory = (stateData=initialState) =>
    applyMiddleware(server_API)(createStore)(
        rootReducer,
        stateData
    )

const store = storeFactory()

module.exports = {storeFactory, store}
