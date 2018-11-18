const reloadParentIframe = () => {
  if (!window.top || (window.top === window)) return

  const message = {
    type: "reloadParentIframe"
  }
  window.top.postMessage(JSON.stringify(message), '*')
}

module.exports = reloadParentIframe
