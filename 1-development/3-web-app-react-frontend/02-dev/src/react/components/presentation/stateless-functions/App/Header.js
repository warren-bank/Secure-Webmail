const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Header'

const component = ({user}, {history}) => {
  const onClick = {
    settings: () => history.push('/settings'),
    about:    () => history.push('/about')
  }

  return (
    <div className={`component ${displayName.toLowerCase()}`}>
      <span onClick={onClick.settings} className="settings_button"></span>
      <span onClick={onClick.about}    className="title">Secure Webmail</span>
      <span>Google Account: </span><span className="email_address">{user.email_address}</span>
    </div>
  )
}

component.propTypes = {
  user:  PropTypes.object.isRequired
}

component.contextTypes = {
  history:  PropTypes.object.isRequired
}

component.displayName = displayName

module.exports = purify(component)
