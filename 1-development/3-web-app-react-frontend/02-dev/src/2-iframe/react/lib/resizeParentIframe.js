const onMessage = function(iframe_id, container_id, event){

  const resizeParentIframe = function(height) {
    const iframe = window.document.getElementById(iframe_id)
    iframe.style.height = height + 'px'
  }

  const scrollToBottom = function() {
    const container = window.document.getElementById(container_id)
    const height = container.offsetHeight
    window.scrollTo(0, height)
  }

  try {
    const data = JSON.parse(event.data)
    if (!(data instanceof Object)) return

    switch(data.type) {
      case 'resizeParentIframe':
        if ((typeof data.height === 'number') && (data.height > 0))
          resizeParentIframe(data.height)
        break
      case 'scrollToBottom':
        scrollToBottom()
        break
      default:
        break
    }
  }
  catch(err){}
}

const addEventListener = (iframe_id, container_id) => {
  const eventListener = onMessage.bind(this, iframe_id, container_id)

  window.addEventListener('message', eventListener, false)
}

module.exports = addEventListener
