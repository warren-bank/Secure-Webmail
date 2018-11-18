const onMessage = function(event){

  try {
    const data = JSON.parse(event.data)
    if (!(data instanceof Object)) return

    switch(data.type) {
      case 'reloadParentIframe':
        window.location.reload(true)
        break
      default:
        break
    }
  }
  catch(err){}
}

const addEventListener = () => {
  const eventListener = onMessage

  window.addEventListener('message', eventListener, false)
}

module.exports = addEventListener
