import React        from 'react'
import ReactDOM     from 'react-dom'

import store        from 'redux/store'
import actions      from 'redux/actions'
import constants    from 'react/data/constants'
import Router       from 'react/components/container/stateless-functions/Router'
import Context      from 'react/components/container/class/Context'

window.React = React
window.store = store

{
  let props = {
    store,
    actions,
    constants,
    component: Router
  }

  let render = () => {
    ReactDOM.render(
      <Context {...props}  />,
      document.getElementById('root')
    )
  }

  switch(document.readyState) {
    case 'complete':
    case 'interactive':
    case 'loaded':
      render()
      break

    case 'loading':
    default:
      document.addEventListener('DOMContentLoaded', render, false)
      break
  }

}
