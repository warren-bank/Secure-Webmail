const React        = require('react')
const ReactDOM     = require('react-dom')

const store        = require('redux/store').store
const actions      = require('redux/actions')

const constants    = require('react/data/constants')
const Router       = require('react/components/container/stateless-functions/Router')
const Context      = require('react/components/container/class/Context')

window.React = React
window.store = store

{
  let startApp = () => {
    let props = {
      store,
      actions: actions['@@react_router'],
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
}
