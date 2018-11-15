/** @license Secure Webmail
 *
 * Copyright (c) 2018-present, Warren R. Bank
 *
 * canonical source code git repository:
 *   https://github.com/warren-bank/Secure-Webmail
 *
 * This source code is not licensed.
 * This source code is made available to the general public
 * for the purpose of security audit only.
 */

(() => {

  const React             = require('react')
  const ReactDOM          = require('react-dom')

  const App               = require('react/components/presentation/class/App')
  const addEventListener  = require('react/lib/resizeParentIframe')
  const constants         = require('react/data/constants')

  const iframe_id         = 'secure_webmail_iframe'
  const container_id      = 'root'

  //window.React = React

  const startApp = () => {
    ReactDOM.render(
      <App iframe_id={iframe_id} />,
      document.getElementById(container_id)
    )

    addEventListener(iframe_id, container_id)
  }

  if (`${top.location.protocol}//${top.location.hostname}/` !== constants.urls.iframe_parent) {
    top.location = constants.urls.iframe_parent
    return
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
