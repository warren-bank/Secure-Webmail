const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Sidebar'

const Compose_New_Email_Button = require(`./${displayName}/Compose_New_Email_Button`)
const Folder_Select_Button     = require(`./${displayName}/Folder_Select_Button`)

const component   = ({folders, history}, {actions}) => {
  const folder_buttons = folders.map(
    (folder, i) => (
      <Folder_Select_Button {...folder} key={i} onClick={() => actions.OPEN_FOLDER(folder.folder_name, 0, history, true)} />
    )
  )

  return (
    <div className={`component ${displayName.toLowerCase()}`}>
      <Compose_New_Email_Button />
      {folder_buttons}
    </div>
  )
}

component.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.object.isRequired
}

component.requireActions = ['OPEN_FOLDER']

component.displayName = displayName

module.exports = purify(component)
