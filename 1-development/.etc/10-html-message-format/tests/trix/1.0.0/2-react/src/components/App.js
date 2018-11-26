const React  = require('react')

const Trix   = require('./Trix')

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state              = {document: null}

    this.prevDocument       = null
    this.exportDocument     = null
    this.exportHTML         = null

    this.set_exportDocument = this.set_exportDocument.bind(this)
    this.set_exportHTML     = this.set_exportHTML.bind(this)

    this.timer_1            = null
    this.timer_2            = null
    this.start_timers()
  }

  set_exportDocument(func) {
    this.exportDocument     = func
  }

  set_exportHTML(func) {
    this.exportHTML         = func
  }

  start_timers() {
    this.timer_1 = setInterval(
      () => {
        if (this.exportDocument)
          this.prevDocument = this.exportDocument()
      },
      5000
    )

    this.timer_2 = setInterval(
      () => {
        if (this.prevDocument)
          this.setState({document: this.prevDocument})
      },
      1000
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.document !== this.state.document)
  }

  render() {
    console.log('rendering: App')

    return (
      <Trix document={this.state.document} set_exportDocument={this.set_exportDocument} set_exportHTML={this.set_exportHTML} />
    )
  }

}

module.exports = App
