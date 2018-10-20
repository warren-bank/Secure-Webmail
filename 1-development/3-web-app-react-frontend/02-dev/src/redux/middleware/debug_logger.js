const debug = (window.location.protocol === 'file:') && window.mock_data

const LOGGER_middleware = ({getState, dispatch}) => next => action => {
  if (debug)
    console.log(action.type, action)

  next(action)
}

module.exports = LOGGER_middleware
