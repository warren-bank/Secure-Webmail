(() => {

  const React        = require('react')
  const ReactDOM     = require('react-dom')

  const store        = require('redux/store').store
  const actions      = (() => {
    const actions    = require('redux/actions')
    const namespace  = require('redux/data/constants').namespaces.REACT_ROUTER

    store.dispatch(
      actions.STORE_INITIALIZED(window.init_data || {})
    )

    return {
      ...actions[namespace],
      GENERATE_KEYPAIR: actions.CRYPTO.RSA.GENERATE_KEYPAIR,
      UPDATE_SETTINGS:  actions.UPDATE_SETTINGS,
      SEND_NEW_MESSAGE: actions.SEND_EMAIL.NEW_MESSAGE,
      SEND_REPLY:       actions.SEND_EMAIL.REPLY,
      UPDATE_THREAD:    actions.UPDATE_THREAD,
      UPDATE_MESSAGE:   actions.UPDATE_MESSAGE
    }
  })()

  const constants    = require('react/data/constants')
  const Router       = require('react/components/container/stateless-functions/Router')
  const Context      = require('react/components/container/class/Context')

  //window.React = React
  //window.store = store

  const startApp = () => {
    const props = {
      store,
      actions,
      constants,
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
