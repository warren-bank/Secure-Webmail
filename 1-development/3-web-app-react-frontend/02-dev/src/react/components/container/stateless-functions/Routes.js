import React      from 'react'
import PropTypes  from 'prop-types'

// ---------------------------------------------------------

export const SetVisibilityFilter = ({history, dispatch_setVisibilityFilter, component: Component, state, visibilityFilter, activeFilter=""}, {actions}) => {
  if (activeFilter !== visibilityFilter) {
    // the requested route is valid, and specifies a filter different from that previously viewed.
    // dispatch an event to the Redux store that causes the state to be updated.
    dispatch_setVisibilityFilter(visibilityFilter)
  }

  // replace callback function: "context.actions.setVisibilityFilter".
  // after <App> is rendered, when this callback is fired within a presentation component..
  // the new callback causes the React Router to change route, rather than dispatching an event to the Redux store.
  // when the updated route is subsequently processed (above "if"), the event will be dispatched to the Redux store.
  actions.setVisibilityFilter = visibilityFilter => history.push(`/${visibilityFilter}`)

  // render <App>
  return <Component state={state} />
}

SetVisibilityFilter.contextTypes = {
  actions: PropTypes.object
}

// ---------------------------------------------------------

export const SetVisibilityRoute = ({history, dispatch_setVisibilityFilter, defaultFilter, activeFilter=""}) => {
  if (activeFilter) {
    // the Redux store contains the previously viewed filter.
    // cause the React Router to change route, and return to this view.
    history.replace(`/${activeFilter}`)
  }
  else {
    // save the default filter into the Redux store,
    // then cause the React Router to change route accordingly.
    dispatch_setVisibilityFilter(defaultFilter)
    history.replace(`/${defaultFilter}`)
  }
  return null
}

// ---------------------------------------------------------
