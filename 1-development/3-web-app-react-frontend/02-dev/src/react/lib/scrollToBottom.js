// =================
// https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
//   callback refs
// =================

class scrollToBottom {

  constructor() {
    this.DOM_ref       = null
    this.callbackQueue = []
  }

  scrollToBottom() {
    if (this.DOM_ref instanceof HTMLElement) {
      window.scrollTo(0, this.DOM_ref.scrollHeight)
    }
    else {
      this.callbackQueue.push((DOM_node) => {
        window.scrollTo(0, DOM_node.scrollHeight)
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
