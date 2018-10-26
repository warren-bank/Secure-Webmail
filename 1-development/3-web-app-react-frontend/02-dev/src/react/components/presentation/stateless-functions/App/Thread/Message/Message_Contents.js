const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Message_Contents'

const component = ({contents}) => {

  return (
    <div className={`component ${displayName.toLowerCase()}`}>
      {contents.body}
    </div>
  )
}

component.propTypes = {
  contents:  PropTypes.object.isRequired
}

component.displayName = displayName

module.exports = purify(component)
