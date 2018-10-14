const React      = require('react')
const PropTypes  = require('prop-types')

const purify     = require('react/components/higher-order/purify')
const FilterLink = require('./FilterLink')

const Footer = ({visibilityFilter}, {constants}) => {
  let C = constants.filter.values

  return (
    <p>
      Show:
      {' '}
      <FilterLink activeFilter={visibilityFilter} filter={C.SHOW_ALL}>
        All
      </FilterLink>
      {', '}
      <FilterLink activeFilter={visibilityFilter} filter={C.SHOW_ACTIVE}>
        Active
      </FilterLink>
      {', '}
      <FilterLink activeFilter={visibilityFilter} filter={C.SHOW_COMPLETED}>
        Completed
      </FilterLink>
    </p>
  )
}

Footer.propTypes = {
  visibilityFilter: PropTypes.string.isRequired
}

Footer.displayName = 'Footer'

module.exports = purify(Footer)
