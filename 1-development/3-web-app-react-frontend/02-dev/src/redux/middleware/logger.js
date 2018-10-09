const logger = store => next => action => {
    console.log('Redux action:', action)
    next(action)
    console.log('Redux post-reducer state:', store.getState())
}

export default logger
