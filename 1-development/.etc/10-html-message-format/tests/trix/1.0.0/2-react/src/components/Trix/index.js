const React      = require('react')
const PropTypes  = require('prop-types')

const {initializeEditor, updateEditor, exportDocument, exportHTML} = require('./initializeEditor')

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

    this.updateRefs()
  }

  componentDidUpdate() {
    this.updateEditor()

    this.updateRefs()
  }

  componentWillUnmount() {
    this.updateRefs(true)
  }

  initializeEditor() {
    this.trix = document.getElementById( this.elementId )

    initializeEditor(this.trix, this.props.document)
  }

  updateEditor() {
    this.trix = document.getElementById( this.elementId )

    updateEditor(this.trix, this.props.document)
  }

  updateRefs(will_unmount) {
    if (this.props.set_exportDocument) {
      this.props.set_exportDocument(
        will_unmount
          ? null
          : exportDocument.bind(this, this.trix)
      )
    }
    if (this.props.set_exportHTML) {
      this.props.set_exportHTML(
        will_unmount
          ? null
          : exportHTML.bind(this, this.trix)
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
