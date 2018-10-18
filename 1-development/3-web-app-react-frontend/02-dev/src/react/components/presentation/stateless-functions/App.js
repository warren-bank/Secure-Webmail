const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'App'

const Header      = require(`./${displayName}/Header`)
const Sidebar     = require(`./${displayName}/Sidebar`)
const Folder      = require(`./${displayName}/Folder`)
const Thread      = require(`./${displayName}/Thread`)

const component   = ({state}) => {
  const page_content = (state.ui.thread_id)
    ? <Thread thread_id={state.ui.thread_id} {...state.threads[ state.ui.thread_id ]} />
    : <Folder name={state.ui.folder_name} threads={state.threads} thread_ids={state.threads_in_folder[ state.ui.folder_name ]} start={state.ui.start_threads_index || 0} max={state.ui.settings.max_threads_per_page || 25} />

  return (
    <div className={`top-component ${displayName.toLowerCase()}`}>
      <Header user={state.user} />
      <Sidebar folders={state.folders} />
      {page_content}
    </div>
  )
}

component.propTypes = {
  state: PropTypes.object.isRequired
}

component.displayName = displayName

module.exports = purify(component)
