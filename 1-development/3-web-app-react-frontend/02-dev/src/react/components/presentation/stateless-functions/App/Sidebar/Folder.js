const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Folder'

const component   = ({folder_name, title, unread_count}) => {
  return (
    <div className={`component ${displayName.toLowerCase()}`}>
      <span className="unread_count">{unread_count}</span>
      <span className="title">{title}</span>
    </div>
  )
}

component.propTypes = {
  folder_name:  PropTypes.string.isRequired,
  title:        PropTypes.string.isRequired,
  unread_count: PropTypes.number.isRequired
}

component.displayName = displayName

module.exports = purify(component)
