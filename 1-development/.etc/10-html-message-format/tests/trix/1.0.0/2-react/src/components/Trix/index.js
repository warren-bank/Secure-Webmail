const React      = require('react')
const PropTypes  = require('prop-types')

const {initializeEditor, updateEditor, finalizeEditor, exportDocument, exportHTML} = require('./initializeEditor')

require('./configureTrix')
require('./style.css')

class TrixEditor extends React.Component {
  constructor(props) {
    super(props)

    this.elementId = `trix-editor-${Date.now()}`
    this.trix      = null
  }

  componentDidMount() {
    this.initializeEditor()
  }

  componentDidUpdate() {
    this.updateEditor()
  }

  componentWillUnmount() {
    this.finalizeEditor()
  }

  initializeEditor() {
    this.trix = document.getElementById( this.elementId )

    initializeEditor(this.trix, this.props.document)

    this.updateRefs()
  }

  updateEditor() {
    this.trix = document.getElementById( this.elementId )

    updateEditor(this.trix, this.props.document)

    this.updateRefs()
  }

  finalizeEditor() {
    this.trix = null

    finalizeEditor()

    this.updateRefs()
  }

  updateRefs() {
    if (this.props.set_exportDocument) {
      this.props.set_exportDocument(
        (this.trix instanceof HTMLElement)
          ? exportDocument.bind(this, this.trix)
          : null
      )
    }
    if (this.props.set_exportHTML) {
      this.props.set_exportHTML(
        (this.trix instanceof HTMLElement)
          ? exportHTML.bind(this, this.trix)
          : null
      )
    }
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.document && (nextProps.document !== this.props.document))
  }

  render() {
    return (
      React.createElement("trix-editor", {
        "class":     "trix-content",
        "autofocus": "true",
        "id":        this.elementId
      })
    )
  }

}

TrixEditor.propTypes = {
  document:            PropTypes.object,
  set_exportDocument:  PropTypes.func,
  set_exportHTML:      PropTypes.func
}

module.exports = TrixEditor
