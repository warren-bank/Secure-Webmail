import React        from 'react'
import ReactDOM     from 'react-dom'

import store        from 'redux/store'
import actions      from 'redux/actions'
import constants    from 'react/data/constants'
import Router       from 'react/components/container/stateless-functions/Router'
import Context      from 'react/components/container/class/Context'

window.React = React

{
  let props = {
    store,
    actions,
    constants,
    component: Router
  }

  ReactDOM.render(
    <Context {...props}  />,
    document.getElementById("root")
  )
}
