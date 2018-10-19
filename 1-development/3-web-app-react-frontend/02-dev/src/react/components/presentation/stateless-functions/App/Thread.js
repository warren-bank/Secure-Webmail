const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Thread'

const component   = ({thread_id, summary, settings, messages, participants, history}, {actions}) => {
  return (
    <div className={`component ${displayName.toLowerCase()}`}>
      {JSON.stringify(summary)}
    </div>
  )
}

component.propTypes = {
  thread_id:    PropTypes.string.isRequired,
  summary:      PropTypes.object.isRequired,
  settings:     PropTypes.object.isRequired,
  messages:     PropTypes.arrayOf(PropTypes.object).isRequired,
  participants: PropTypes.arrayOf(PropTypes.string).isRequired,
  history:      PropTypes.object.isRequired
}

component.requireActions = ['OPEN_COMPOSE_REPLY']

component.displayName = displayName

module.exports = purify(component)