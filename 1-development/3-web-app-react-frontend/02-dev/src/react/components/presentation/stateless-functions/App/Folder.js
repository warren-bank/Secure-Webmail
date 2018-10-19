const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Folder'

const component   = ({folder_name, threads, thread_ids, start, max, history}, {actions}) => {
  return (
    <div className={`component ${displayName.toLowerCase()}`}>
      {folder_name}
    </div>
  )
}

component.propTypes = {
  folder_name: PropTypes.string.isRequired,
  threads:     PropTypes.object.isRequired,
  thread_ids:  PropTypes.arrayOf(PropTypes.string).isRequired,
  start:       PropTypes.number.isRequired,
  max:         PropTypes.number.isRequired,
  history:     PropTypes.object.isRequired
}

component.requireActions = ['GET_THREADS', 'OPEN_THREAD']

component.displayName = displayName

module.exports = purify(component)
