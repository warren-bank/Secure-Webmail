const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Folder'

const FontScaler  = require('../FontScaler')

const component = ({folder_name, title, unread_count, onClick, active}) => {
  const scalable_count = (
    <FontScaler text={unread_count} />
  )

  return (
    <div className={`component ${displayName.toLowerCase()} ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="title">{title}</span>
      <span className={`unread_count ${ (unread_count === 0) ? 'no_unread' : '' }`}>{scalable_count}</span>
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
