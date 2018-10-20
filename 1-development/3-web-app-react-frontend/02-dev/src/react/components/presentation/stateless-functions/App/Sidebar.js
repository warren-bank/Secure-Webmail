const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Sidebar'

const Compose_New = require(`./${displayName}/Compose_New`)
const Folder      = require(`./${displayName}/Folder`)

const component   = ({folders}, {actions, history}) => {
  const compose_button = (
    <Compose_New onClick={actions.OPEN_COMPOSE_MESSAGE.bind(this, history, true)} />
  )

  const folder_buttons = folders.map(
    (folder, i) => (
      <Folder {...folder} key={i} onClick={actions.OPEN_FOLDER.bind(this, folder.folder_name, 0, history, true)} />
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
  folders:  PropTypes.arrayOf(PropTypes.object).isRequired
}

component.contextTypes = {
  actions:  PropTypes.object.isRequired,
  history:  PropTypes.object.isRequired
}

component.requireActions = ['OPEN_COMPOSE_MESSAGE', 'OPEN_FOLDER']

component.displayName = displayName

module.exports = purify(component)
