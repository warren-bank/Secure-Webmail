import React      from 'react'
import PropTypes  from 'prop-types'

import purify     from 'react/components/higher-order/purify'
import FilterLink from './FilterLink'

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

export default purify(Footer)
