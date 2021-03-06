const React                    = require('react')
const PropTypes                = require('prop-types')
const {Router, Switch, Route}  = require('react-router-dom')
const {createHashHistory}      = require('history')

const ScrollToTop              = require('react/components/container/class/ScrollToTop')

const purify                   = require('react/components/higher-order/purify')

const About                    = require('react/components/presentation/stateless-functions/About')
const TOS                      = require('react/components/presentation/stateless-functions/About/TOS')
const NoEmail                  = require('react/components/presentation/stateless-functions/NoEmail')
const Settings                 = require('react/components/presentation/class/Settings')

const App                      = require('react/components/presentation/stateless-functions/App')
const Folder                   = require('react/components/presentation/stateless-functions/App/Folder')
const Thread                   = require('react/components/presentation/stateless-functions/App/Thread')
const Compose_Message          = require('react/components/presentation/class/Compose_Message')

const displayName = 'Router'
const HashHistory = createHashHistory()

const component   = ({state}, {store, actions, constants, history}) => {
  actions.DEBUG(`rendering: ${displayName}`, {state})

  if (!state.user.email_address)
    return <NoEmail />

  if (!state.app.settings.private_key)
    return <Settings settings={state.app.settings} />

  const folder_redirects = constants.folders.names.map((folder_name, i) => {
    const _render = ({history}) => {
      actions.OPEN_FOLDER(folder_name, 0, history, false)
      return null
    }
    return <Route exact strict path={`/${folder_name}`} render={_render} key={i} />
  })

  const default_redirect = (() => {
    const _render = ({history}) => {
      if (state.app.ui.thread_id)
        actions.OPEN_THREAD(state.app.ui.thread_id, history, false)
      else if (state.app.ui.folder_name)
        actions.OPEN_FOLDER(state.app.ui.folder_name, (state.app.ui.start_threads_index || 0), history, false)
      else
        actions.OPEN_FOLDER(constants.folders.default, 0, history, false)
      return null
    }
    return <Route render={_render} />
  })()

  const wrapScrollToTop = component => (
    <ScrollToTop location={HashHistory.location.pathname} >
      {component}
    </ScrollToTop>
  )

  const thread_route = (() => {
    const _render = ({history, match}) => {
      const {thread_id} = match.params

      if (state.app.ui.thread_id !== thread_id)
        actions.OPEN_THREAD(thread_id)  // `history` is not passed to prevent URL redirect

      const component = /*wrapScrollToTop*/(
        <Thread thread_id={thread_id} {...state.threads[thread_id]} draft_message={state.app.draft_message} />
      )

      return <App state={state} component={component} />
    }
    return <Route exact strict path="/thread/:thread_id" render={_render} />
  })()

  const folder_route = (() => {
    const _render = ({history, match}) => {
      let {folder_name, start_threads_index} = match.params

      if (start_threads_index === undefined) {
        // redirect:
        actions.OPEN_FOLDER(folder_name, 0, history, false)
        return null
      }

      start_threads_index = Number(start_threads_index)

      if ((state.app.ui.folder_name !== folder_name) || (state.app.ui.start_threads_index !== start_threads_index) || (state.app.ui.thread_id))
        actions.OPEN_FOLDER(folder_name, start_threads_index)  // `history` is not passed to prevent URL redirect

      const component = wrapScrollToTop(
        <Folder folder_name={folder_name} threads={state.threads} thread_ids={state.threads_in_folder[folder_name]} start={start_threads_index || 0} max={state.app.settings.max_threads_per_page} />
      )

      return (<App state={state} component={component} />)
    }
    return <Route exact strict path="/folder/:folder_name/:start_threads_index?" render={_render} />
  })()

  const compose_route = (() => {
    const _render = ({history}) => {
      const props = {
        draft:        state.app.draft_message,
        html_format:  state.app.settings.compose_html_format,
        onDomChange:  null,
        onNewMessage: null,
        onSend:       () => {
                        console.log('Message Sent')

                        history.replace('/')
                      },
        onCancel:     () => console.log('Message Cancelled'),
        txtCancel:    'Cancel'
      }

      const component = wrapScrollToTop(
        <Compose_Message {...props} />
      )

      return (<App state={state} component={component} />)
    }
    return <Route exact strict path="/compose" render={_render} />
  })()

  const settings_route = (() => {
    const _render = () => {
      const component = wrapScrollToTop(
        <Settings settings={state.app.settings} />
      )

      return component
    }
    return <Route exact strict path="/settings" render={_render} />
  })()

  const about_route = (() => {
    const _render = () => {
      const component = wrapScrollToTop(
        <About />
      )

      return component
    }
    return <Route exact strict path="/about" render={_render} />
  })()

  const TOS_route = (() => {
    const _render = () => {
      const component = wrapScrollToTop(
        <TOS />
      )

      return component
    }
    return <Route exact strict path="/about/TOS" render={_render} />
  })()

  return (
    <Router history={HashHistory} >
      <Switch>
        {thread_route}
        {folder_route}
        {compose_route}
        {settings_route}
        {about_route}
        {TOS_route}
        {folder_redirects}
        {default_redirect}
      </Switch>
    </Router>
  )
}

component.propTypes = {
  state: PropTypes.object.isRequired
}

component.contextTypes = {
  store:     PropTypes.object,
  actions:   PropTypes.object,
  constants: PropTypes.object,
  history:   PropTypes.object
}

component.requireActions = ['DEBUG']

component.displayName = displayName

module.exports = {history: HashHistory, Router: purify(component)}
