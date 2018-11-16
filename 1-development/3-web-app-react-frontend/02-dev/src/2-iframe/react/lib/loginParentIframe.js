const onMessage = function(doLogin, event){

  try {
    const data = JSON.parse(event.data)
    if (!(data instanceof Object)) return

    switch(data.type) {
      case 'loginParentIframe':
        if (data.email)
          doLogin(data.email)
        break
      default:
        break
    }
  }
  catch(err){}
}

const addEventListener = (doLogin) => {
  const eventListener = onMessage.bind(this, doLogin)

  window.addEventListener('message', eventListener, false)
}

module.exports = addEventListener
