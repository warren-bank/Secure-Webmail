(() => {

  const React        = require('react')
  const ReactDOM     = require('react-dom')

  const store        = require('redux/store').store
  const actions      = (() => {
    const actions    = require('redux/actions')

    // pass initialization data from the server (stored as globally scoped variables) to the Redux store
    store.dispatch(
      actions.STORE_INITIALIZED(window.init_data || {})
    )

    // cherry pick a subset of Redux actions that the UI can dispatch to the store
    return {
      ...actions.RESPOND_TO_USER_EVENT,
      DEBUG:               actions.LOG_DEBUG_MESSAGE,
      GENERATE_KEYPAIR:    actions.CRYPTO.RSA.GENERATE_KEYPAIR,
      UPDATE_SETTINGS:     actions.UPDATE_SETTINGS,
      SAVE_DRAFT_MESSAGE:  actions.SAVE_APP.DRAFT_MESSAGE.STORE,
      CLEAR_DRAFT_MESSAGE: actions.SAVE_APP.DRAFT_MESSAGE.CLEAR,
      SEND_NEW_MESSAGE:    actions.SEND_EMAIL.NEW_MESSAGE,
      SEND_REPLY:          actions.SEND_EMAIL.REPLY,
      UPDATE_THREAD:       actions.UPDATE_THREAD,             // {MARK_UNREAD, MOVE_TO_TRASH, MOVE_TO_SPAM, MOVE_TO_INBOX, MARK_IMPORTANT}
      UPDATE_MESSAGE:      actions.UPDATE_MESSAGE             // {MARK_UNREAD, MOVE_TO_TRASH, MARK_STAR}
    }
  })()

  const constants          = require('react/data/constants')
  const {history, Router}  = require('react/components/container/stateless-functions/Router')
  const Context            = require('react/components/container/class/Context')

  //window.React = React
  //window.store = store

  const startApp = () => {
    const props = {
      store,
      actions,
      constants,
      history,
      component: Router
    }

    ReactDOM.render(
      <Context {...props}  />,
      document.getElementById('root')
    )
  }

  switch(document.readyState) {
    case 'complete':
    case 'interactive':
    case 'loaded':
      startApp()
      break

    case 'loading':
    default:
      document.addEventListener('DOMContentLoaded', startApp, false)
      break
  }

})()
