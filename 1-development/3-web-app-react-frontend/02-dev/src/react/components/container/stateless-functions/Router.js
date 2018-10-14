const React                        = require('react')
const PropTypes                    = require('prop-types')
const {HashRouter, Switch, Route}  = require('react-router-dom')

const App                          = require('react/components/presentation/stateless-functions/App')
const Routes                       = require('./Routes')

const {SetVisibilityFilter, SetVisibilityRoute} = Routes

const Router = ({state}, {store, actions, constants}) => {

  // keep a backup of the real callback.
  // it will be replaced by Routes, which will become responsible for its management.
  const dispatch_setVisibilityFilter = actions.setVisibilityFilter

  let known_routes = []

  Object.keys(constants.filter.values).forEach((filter, i) => {
    let _render = props => <SetVisibilityFilter {...props} dispatch_setVisibilityFilter={dispatch_setVisibilityFilter} component={App} state={state} visibilityFilter={filter} activeFilter={state.visibilityFilter} />
    let _route  = <Route exact strict path={`/${filter}`} render={_render} key={i} />
    known_routes.push(_route)
  })

  let default_route
  {
    let filter  = constants.filter.default
    let _render = props => <SetVisibilityRoute {...props} dispatch_setVisibilityFilter={dispatch_setVisibilityFilter} defaultFilter={filter} activeFilter={state.visibilityFilter} />
    let _route  = <Route render={_render} />
    default_route = _route
  }

  return (
    <HashRouter>
      <Switch>
        {known_routes}
        {default_route}
      </Switch>
    </HashRouter>
  )
}

Router.propTypes = {
  state: PropTypes.object.isRequired
}

Router.contextTypes = {
  store:     PropTypes.object,
  actions:   PropTypes.object,
  constants: PropTypes.object
}

Router.displayName = 'Router'

module.exports = Router
