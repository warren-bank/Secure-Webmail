const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'App'

const Header      = require(`./${displayName}/Header`)
const Sidebar     = require(`./${displayName}/Sidebar`)

const component = ({state, component}) => {
  return (
    <div className={`top-component ${displayName.toLowerCase()}`}>
      <Header user={state.user} />
      <Sidebar folders={state.folders} active_folder={state.app.ui.folder_name} />
      {component}
    </div>
  )
}

component.propTypes = {
  state:      PropTypes.object.isRequired,
  component:  PropTypes.instanceOf(React.Component).isRequired
}

component.displayName = displayName

module.exports = purify(component)
