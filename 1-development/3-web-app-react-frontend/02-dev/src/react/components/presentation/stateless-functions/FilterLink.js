const React      = require('react')
const PropTypes  = require('prop-types')

const purify     = require('react/components/higher-order/purify')
const Link       = require('./Link')

const FilterLink = ({activeFilter, filter, children}, {actions}) => {
  let active  = (activeFilter === filter)
  let onClick = () => actions.setVisibilityFilter(filter)
  let props   = {active, onClick}

  return (
    <Link {...props}>{children}</Link>
  )
}

FilterLink.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  filter:       PropTypes.string.isRequired
}

FilterLink.requireActions = ['setVisibilityFilter']

FilterLink.displayName = 'FilterLink'

module.exports = purify(FilterLink)
