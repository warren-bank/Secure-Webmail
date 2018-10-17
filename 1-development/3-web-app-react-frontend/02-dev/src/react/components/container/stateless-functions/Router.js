const React                        = require('react')
const PropTypes                    = require('prop-types')
const {HashRouter, Switch, Route}  = require('react-router-dom')

const App                          = require('react/components/presentation/stateless-functions/App')
const Settings                     = require('react/components/presentation/stateless-functions/Settings')
const About                        = require('react/components/presentation/stateless-functions/About')
const NoEmail                      = require('react/components/presentation/stateless-functions/NoEmail')

const Router = ({state}, {store, actions, constants}) => {

  if (!state.user.email_address)
    return <NoEmail />

  if (!state.ui.settings.private_key)
    return <Settings settings={state.ui.settings} />

  const folder_redirects = constants.folders.names.map((folder_name, i) => {
    const _render = ({history}) => {
      actions.OPEN_FOLDER(folder_name, 0, history, false)
      return null
    }
    return <Route exact strict path={`/${folder_name}`} render={_render} key={i} />
  })

  const default_redirect = (() => {
    const _render = ({history}) => {
      if (state.ui.thread_id)
        actions.OPEN_THREAD(state.ui.thread_id, history, false)
      else if (state.ui.folder_name)
        actions.OPEN_FOLDER(state.ui.folder_name, (state.ui.start_threads_index || 0), history, false)
      else
        actions.OPEN_FOLDER(constants.folders.default, 0, history, false)
      return null
    }
    return <Route render={_render} />
  })()

  const thread_route = (() => {
    const _render = ({history, match}) => {
      const {thread_id} = match.params

      actions.OPEN_THREAD(thread_id)  // `history` is not passed to prevent URL redirect

      return <App state={state} />
    }
    return <Route exact strict path="/thread/:thread_id" render={_render} />
  })()

  const folder_route = (() => {
    const _render = ({history, match}) => {
      const {folder_name, start_threads_index} = match.params

      if (start_threads_index === undefined) {
        // redirect:
        actions.OPEN_FOLDER(folder_name, 0, history, false)
        return null
      }

      actions.OPEN_FOLDER(folder_name, start_threads_index)  // `history` is not passed to prevent URL redirect

      return <App state={state} />
    }
    return <Route exact strict path="/folder/:folder_name/:start_threads_index?" render={_render} />
  })()

  const settings_route = (() => {
    const _render = () => {
      return <Settings settings={state.ui.settings} />
    }
    return <Route exact strict path="/settings" render={_render} />
  })()

  return (
    <HashRouter>
      <Switch>
        {thread_route}
        {folder_route}
        {settings_route}
        <Route exact strict path="/about" component={About} />
        {folder_redirects}
        {default_redirect}
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
