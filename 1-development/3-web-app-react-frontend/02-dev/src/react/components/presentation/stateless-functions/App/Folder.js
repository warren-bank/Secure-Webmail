const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Folder'

const Thread_Summary  = require(`./${displayName}/Thread_Summary`)

const component = ({folder_name, threads, thread_ids, start, max}, {actions, constants, history}) => {
  actions.DEBUG(`rendering: ${displayName}`, {folder_name, threads, thread_ids, start})

  const settings  = {
    nav: {
      start: {
        back:    null,
        forward: null
      },
      onClick: {
        back:    null,
        forward: null,
        refresh: null
      }
    },
    folder_title: null,
    pagination: {
      thread_ids: null
    }
  }

  // calculate settings
  {
    let new_start, available

    if (start > 0) {
      new_start = start - max
      settings.nav.start.back = (new_start > 0) ? new_start : 0
    }

    available = (thread_ids) ? thread_ids.length : 0
    new_start = start + max
    if (new_start < available) {
      // already in state
      settings.nav.start.forward = new_start
    }
    else if (new_start === available) {
      // action will trigger server request
      settings.nav.start.forward = new_start
    }

    if (settings.nav.start.back !== null) {
      settings.nav.onClick.back    = actions.OPEN_FOLDER.bind(this, folder_name, settings.nav.start.back, history, false)
    }

    if (settings.nav.start.forward !== null) {
      settings.nav.onClick.forward = actions.OPEN_FOLDER.bind(this, folder_name, settings.nav.start.forward, history, false)
    }

    settings.nav.onClick.refresh   = actions.OPEN_FOLDER.bind(this, folder_name, 0, history, false)

    let folder_index = constants.folders.names.indexOf(folder_name)
    settings.folder_title = (folder_index >= 0) ? constants.folders.titles[folder_index] : folder_name

    if (available) {
      settings.pagination.thread_ids = thread_ids.slice(start, start + max)
    }
  }

  if (!settings.pagination.thread_ids || !settings.pagination.thread_ids.length) {
    return (
      <div className={`component ${displayName.toLowerCase()}`}>
        <h1>{settings.folder_title}</h1>
        <div className="loading">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
        </div>
      </div>
    )
  }

  const thread_summaries = []
  settings.pagination.thread_ids.forEach((thread_id, i) => {
    const thread = threads[thread_id]

    if (!thread || !thread.summary || !thread.settings) return

    thread_summaries.push(
      <Thread_Summary key={i} thread_id={thread_id} summary={thread.summary} settings={thread.settings} />
    )
  })

  return (
    <div className={`component ${displayName.toLowerCase()}`}>
      <div className="action_buttons">
        {
          (settings.nav.start.back !== null) &&
            <div className="button back"    onClick={settings.nav.onClick.back}></div>
        }
        <div     className="button refresh" onClick={settings.nav.onClick.refresh}></div>
        {
          (settings.nav.start.forward !== null) &&
            <div className="button forward" onClick={settings.nav.onClick.forward}></div>
        }
      </div>
      <h1>{settings.folder_title}</h1>
      <div className="thread_summaries">
        {thread_summaries}
      </div>
    </div>
  )
}

component.propTypes = {
  folder_name:  PropTypes.string.isRequired,
  threads:      PropTypes.object.isRequired,
  thread_ids:   PropTypes.arrayOf(PropTypes.string).isRequired,
  start:        PropTypes.number.isRequired,
  max:          PropTypes.number.isRequired
}

component.contextTypes = {
  actions:   PropTypes.object.isRequired,
  constants: PropTypes.object.isRequired,
  history:   PropTypes.object.isRequired
}

component.requireActions = ['DEBUG', 'OPEN_FOLDER']

component.displayName = displayName

module.exports = purify(component)
