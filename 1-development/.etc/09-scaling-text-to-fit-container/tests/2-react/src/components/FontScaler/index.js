require('./style.css')

const React       = require('react')
const PropTypes   = require('prop-types')
const displayName = 'FontScaler'

const component = ({text, className=''}) => {
  return (
    <div className={`component ${displayName.toLowerCase()} ${className}`}>
      <svg width="100%" height="100%">
        <text x="0" y="100%" textLength="100%">{text}</text>
      </svg>
    </div>
  )
}

component.propTypes = {
  text:       PropTypes.string.isRequired,
  className:  PropTypes.string
}

component.displayName = displayName

module.exports = component
