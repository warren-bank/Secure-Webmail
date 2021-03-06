const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Folder'

const component = ({folder_name, title, unread_count, onClick, active}) => {
  return (
    <div className={`component ${displayName.toLowerCase()} ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="title">{title}</span>
      <span className={`unread_count ${ (unread_count === 0) ? 'no_unread' : '' }`}>{unread_count}</span>
    </div>
  )
}

component.propTypes = {
  folder_name:  PropTypes.string.isRequired,
  title:        PropTypes.string.isRequired,
  unread_count: PropTypes.number.isRequired,
  onClick:      PropTypes.func.isRequired,
  active:       PropTypes.bool.isRequired
}

component.displayName = displayName

module.exports = purify(component)
