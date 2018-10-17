const redux_middleware_reducers  = require('./redux_middleware_reducers')
const react_router               = require('./react_router')

const actions = {
  ...redux_middleware_reducers,
  ...react_router
}

module.exports = actions
