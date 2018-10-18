const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Compose_New'

const component   = () => {
  return (
    <div className={`component ${displayName.toLowerCase()}`}>
      <span>Compose</span>
    </div>
  )
}

component.displayName = displayName

module.exports = purify(component)
