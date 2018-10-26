require('./style.css')

const generate_random_string  = require('./generate_random_string')

const React       = require('react')
const PropTypes   = require('prop-types')
const displayName = 'ExpandCollapse'

const component = ({label, content, start_expanded}) => {
  const dom_id = generate_random_string()

  return (
    <div className={`component ${displayName.toLowerCase()}`}>
      <input  id={dom_id} type="checkbox" defaultChecked={!!start_expanded} />
      <label for={dom_id}>
        {label}
      </label>
      <div className="content">
        {content}
      </div>
    </div>
  )
}

component.propTypes = {
  label:           PropTypes.string.isRequired,
  content:         PropTypes.string.isRequired,
  start_expanded:  PropTypes.bool
}

component.displayName = displayName

module.exports = component
