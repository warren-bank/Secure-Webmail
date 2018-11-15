// =================
// https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
//   callback refs
// =================

class scrollToBottom {

  constructor() {
    this.logger        = null
    this.DOM_ref       = null
    this.callbackQueue = []
  }

  set_logger(logger) {
    this.logger = logger
  }

  get_top(DOM_node) {
    if (!(DOM_node instanceof HTMLElement)) return 0

    const top    = (DOM_node.offsetTop ? DOM_node.offsetTop : 0)
    const parent = DOM_node.offsetParent

    if (DOM_node === window.document.body)
      return top
    else if (parent === null)
      return top
    else
      return top + this.get_top(parent)
  }

  get_height(DOM_node) {
    if (!(DOM_node instanceof HTMLElement)) return 0

    const top    = this.get_top(DOM_node)
    const height = DOM_node.offsetHeight

    if (this.logger)
      this.logger('scrollToBottom of HTMLElement', {top, height, HTMLElement: DOM_node})

    return (top + height)
  }

  scrollToBottom() {
    if (this.DOM_ref instanceof HTMLElement) {
      window.scrollTo(0, this.get_height(this.DOM_ref))
    }
    else {
      this.callbackQueue.push((DOM_node) => {
        window.scrollTo(0, this.get_height(DOM_node))
      })
    }
  }

  componentDidUpdate(DOM_node) {
    this.DOM_ref = DOM_node

    if (DOM_node instanceof HTMLElement) {
      while (this.callbackQueue.length) {
        ( this.callbackQueue.shift() )(DOM_node)
      }
      this.scrollToBottom()
    }
  }

}

module.exports = scrollToBottom


/* -----------------------------------------------
 * usage:
 * ======
 *
 * const scrollToBottom = require('./scrollToBottom')
 *
 * class myComponent extends React.Component {
 *   constructor() {
 *     this.scroller                    = new scrollToBottom()
 *     this.scroller.componentDidUpdate = this.scroller.componentDidUpdate.bind(this.scroller)
 *     this.scroller.scrollToBottom     = this.scroller.scrollToBottom.bind(this.scroller)
 *   }
 *
 *   render() {
 *     return <div ref={this.scroller.componentDidUpdate} onClick={this.scroller.scrollToBottom}>Click Me</div>
 *   }
 * }
 * -----------------------------------------------
 */
