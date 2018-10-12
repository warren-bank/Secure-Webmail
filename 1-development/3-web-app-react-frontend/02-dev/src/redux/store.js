import { createStore, applyMiddleware } from 'redux'

import initialState from 'redux/data/initial_state'
import server_API   from 'redux/middleware/server_API'
import rootReducer  from 'redux/reducers'

export const storeFactory = (stateData=initialState) =>
    applyMiddleware(server_API)(createStore)(
        rootReducer,
        stateData
    )

const store = storeFactory()

export default store
