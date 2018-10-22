const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Thread'

const component = ({thread_id, summary, settings, messages, participants}, {actions, history}) => {

  if (!messages || !messages.length) {
    return (
      <div className={`component ${displayName.toLowerCase()}`}>
        <div className="loading">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
        </div>
      </div>
    )
  }

  return (
    <div className={`component ${displayName.toLowerCase()}`}>
      <h1>{summary.subject}</h1>
      <div className="messages">
        <pre>{JSON.stringify(summary, null, 4)}</pre>
      </div>
    </div>
  )
}

component.propTypes = {
  thread_id:     PropTypes.string.isRequired,
  summary:       PropTypes.object.isRequired,
  settings:      PropTypes.object.isRequired,
  messages:      PropTypes.arrayOf(PropTypes.object).isRequired,
  participants:  PropTypes.arrayOf(PropTypes.string).isRequired
}

component.contextTypes = {
  actions:  PropTypes.object.isRequired,
  history:  PropTypes.object.isRequired
}

component.requireActions = ['OPEN_COMPOSE_REPLY']

component.displayName = displayName

module.exports = purify(component)
