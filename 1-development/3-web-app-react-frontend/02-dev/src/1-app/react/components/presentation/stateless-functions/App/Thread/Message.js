const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Message'

const {strip_tags}      = require('react/lib/sanitize_html')
const ExpandCollapse    = require('react/components/presentation-abstract/stateless-functions/ExpandCollapse')
const Message_Summary   = require(`./${displayName}/Message_Summary`)
const Message_Contents  = require(`./${displayName}/Message_Contents`)

const component = ({thread_id, message_id, summary, settings, contents, html_format, start_expanded, onExpandCollapse}) => {

  const has_attachments = !!(contents && Array.isArray(contents.attachments) && contents.attachments.length)

  if (!(
    contents && (contents.body || has_attachments)
  )) return null

  const body    = strip_tags(contents.body).substring(0, 160)
  const label   = <Message_Summary  {...{thread_id, message_id, has_attachments, body, summary, settings}} />
  const content = <Message_Contents {...{contents, html_format, onLoad: ((start_expanded && html_format) ? onExpandCollapse : null)}} />

  return (
    <div className={`component ${displayName.toLowerCase()}`}>
      <ExpandCollapse {...{label, content, start_expanded, onExpandCollapse}} />
    </div>
  )
}

component.propTypes = {
  thread_id:        PropTypes.string.isRequired,
  message_id:       PropTypes.string.isRequired,
  summary:          PropTypes.object.isRequired,
  settings:         PropTypes.object.isRequired,
  contents:         PropTypes.object.isRequired,
  html_format:      PropTypes.bool,
  start_expanded:   PropTypes.bool,
  onExpandCollapse: PropTypes.func
}

component.displayName = displayName

module.exports = purify(component)
