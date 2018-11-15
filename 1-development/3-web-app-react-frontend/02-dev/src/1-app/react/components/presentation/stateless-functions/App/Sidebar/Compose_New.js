const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Compose_New'

const component = ({onClick}) => {
  return (
    <div className={`component ${displayName.toLowerCase()}`} onClick={onClick}>
      <span>Compose</span>
    </div>
  )
}

component.propTypes = {
  onClick: PropTypes.func.isRequired
}

component.displayName = displayName

module.exports = purify(component)
