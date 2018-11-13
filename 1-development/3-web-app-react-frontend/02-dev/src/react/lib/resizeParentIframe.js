const global_css_selector = require('react/data/constants').resizeParentIframe_cssSelector.join(', ')

const get_top = (DOM_node) => {
  if (!(DOM_node instanceof HTMLElement)) return 0

  const top    = (DOM_node.offsetTop ? DOM_node.offsetTop : 0)
  const parent = DOM_node.offsetParent

  if (DOM_node === window.document.body)
    return top
  else if (parent === null)
    return top
  else
    return top + get_top(parent)
}

const get_height = (DOM_node) => {
  if (!(DOM_node instanceof HTMLElement)) return 0

  const top    = get_top(DOM_node)
  const height = DOM_node.offsetHeight

  return (top + height)
}

const resizeParentIframe = (css_selector) => {
  if (!window.top || (window.top === window)) return
  if (!css_selector || (typeof css_selector !== 'string')) return

  const DOM_nodes = window.document.querySelectorAll(css_selector)
  if (!((DOM_nodes instanceof NodeList) && (DOM_nodes.length))) return

  const heights = []
  DOM_nodes.forEach(DOM_node => {
    const height = get_height(DOM_node)
    if (height > 0) heights.push(height)
  })
  if (!heights.length) return

  const height = Math.max(...heights)

  const message = {
    type: "resizeParentIframe",
    height
  }
  window.top.postMessage(JSON.stringify(message), '*')
}

const scrollToBottom = () => {
  const message = {
    type: "scrollToBottom"
  }
  window.top.postMessage(JSON.stringify(message), '*')
}

const global_resizeParentIframe = (do_scrollToBottom) => {
  resizeParentIframe(global_css_selector)

  if (do_scrollToBottom) scrollToBottom()
}

module.exports = {resizeParentIframe, global_resizeParentIframe}
