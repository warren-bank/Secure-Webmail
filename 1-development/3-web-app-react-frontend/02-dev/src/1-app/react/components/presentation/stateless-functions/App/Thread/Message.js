const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Message'

const sanitize_html     = require('react/lib/sanitize_html')

const ExpandCollapse    = require('react/components/presentation-abstract/stateless-functions/ExpandCollapse')
const Message_Summary   = require(`./${displayName}/Message_Summary`)
const Message_Contents  = require(`./${displayName}/Message_Contents`)

const component = ({thread_id, message_id, summary, settings, contents, start_expanded, onExpandCollapse}) => {

  if (!(
    contents &&
    (
      contents.body ||
      (
        Array.isArray(contents.attachments) && contents.attachments.length
      )
    )
  )) return null

  const body     = sanitize_html( contents.body.substring(0, 160) )

  const label   = <Message_Summary  {...{thread_id, message_id, body, summary, settings}} />
  const content = <Message_Contents {...{contents}} />

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
  start_expanded:   PropTypes.bool,
  onExpandCollapse: PropTypes.func
}

component.displayName = displayName

module.exports = purify(component)
