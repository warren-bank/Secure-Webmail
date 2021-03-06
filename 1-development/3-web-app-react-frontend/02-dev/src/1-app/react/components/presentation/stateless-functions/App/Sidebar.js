const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Sidebar'

const Compose_New = require(`./${displayName}/Compose_New`)
const Folder      = require(`./${displayName}/Folder`)

const component = ({folders, active_folder}, {actions, history}) => {
  actions.DEBUG(`rendering: ${displayName}`, {folders, active_folder})

  const compose_button = (
    <Compose_New onClick={actions.OPEN_COMPOSE_MESSAGE.bind(this, history, true)} />
  )

  const folder_buttons = folders.map(
    folder => (
      <Folder {...folder} key={folder.folder_name} onClick={actions.OPEN_FOLDER.bind(this, folder.folder_name, 0, history, true, false)} active={active_folder === folder.folder_name} />
    )
  )

  return (
    <div className={`component ${displayName.toLowerCase()}`}>
      {compose_button}
      {folder_buttons}
    </div>
  )
}

component.propTypes = {
  folders:       PropTypes.arrayOf(PropTypes.object).isRequired,
  active_folder: PropTypes.string.isRequired
}

component.contextTypes = {
  actions:  PropTypes.object.isRequired,
  history:  PropTypes.object.isRequired
}

component.requireActions = ['DEBUG', 'OPEN_COMPOSE_MESSAGE', 'OPEN_FOLDER']

component.displayName = displayName

module.exports = purify(component)
