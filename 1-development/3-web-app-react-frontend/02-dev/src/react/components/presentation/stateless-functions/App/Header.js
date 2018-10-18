const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Header'

const component   = ({user}) => {
  return (
    <div className={`component ${displayName.toLowerCase()}`}>
      <span className="title">Secure Webmail</span>
      <span>Google Account: </span><span className="email_address">{user.email_address}</span>
    </div>
  )
}

component.propTypes = {
  user: PropTypes.object.isRequired
}

component.displayName = displayName

module.exports = purify(component)
