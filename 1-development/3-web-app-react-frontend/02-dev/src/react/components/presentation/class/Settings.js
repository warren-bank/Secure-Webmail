const React       = require('react')
const PropTypes   = require('prop-types')

const displayName = 'Settings'

class Settings extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = this.get_state_from_props(props)

    this.eventHandlers = {
      onChange: this.handleChange.bind(this),
      onSubmit: this.handleSubmit.bind(this),
      onCancel: this.handleCancel.bind(this),
      onClick: {
        generate_keypair: this.generate_keypair.bind(this)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const newState = this.get_state_from_props(nextProps)
    this.setState(newState)
  }

  get_state_from_props(props) {
    const {settings} = props

    const state = {...settings, is_generating_keypair: false}
    return state
  }

  handleChange(event) {
    event.stopPropagation()
    event.preventDefault()

    const key      = event.currentTarget.id
    const val      = event.currentTarget.value
    const newState = {
      [key]: val
    }
    this.setState(newState)
  }

  handleSubmit(event) {
    event.stopPropagation()
    event.preventDefault()

    let {max_threads_per_page, private_key, private_key_storage} = this.state

    // cast to correct data types
    max_threads_per_page = Number(max_threads_per_page)
    private_key_storage  = Number(private_key_storage)

    if (
         (this.props.settings.max_threads_per_page !== max_threads_per_page)
      || (this.props.settings.private_key          !== private_key)
      || (this.props.settings.private_key_storage  !== private_key_storage)
    ) {
      this.context.actions.UPDATE_SETTINGS(max_threads_per_page, private_key, private_key_storage)
    }

    if (this.context.history.location.pathname === '/settings')
      this.context.history.replace('/')
  }

  handleCancel(event) {
    event.stopPropagation()
    event.preventDefault()

    const newState = this.get_state_from_props(this.props)
    this.setState(newState)
  }

  generate_keypair(event) {
    event.stopPropagation()
    event.preventDefault()

    if (this.state.is_generating_keypair === true) return

    const allow_update = true
    this.context.actions.GENERATE_KEYPAIR(allow_update)

    this.setState({is_generating_keypair: true})
  }

  get_private_key_storage_options() {
    const descriptions = [
      'Do not store private key',
      'Use "sessionStorage" to store private key',
      'Use "localStorage" to store private key'
    ]
    const options = descriptions.map((txt, val) => {
      return (
        <option value={val} key={val}>{txt}</option>
      )
    })
    return options
  }

  render() {
    this.context.actions.DEBUG(`rendering: ${displayName}`, {settings: this.state})

    const private_key_storage_options = this.get_private_key_storage_options()

    return (
      <div className={`top-component ${displayName.toLowerCase()}`}>
        <form onSubmit={this.eventHandlers.onSubmit} >
          <label for="max_threads_per_page">Number of thread summaries to display in paginated folder list:</label>
          <input id="max_threads_per_page" type="number" value={this.state.max_threads_per_page} onChange={this.eventHandlers.onChange} />
  
          <label for="private_key">Private RSA Encryption Key:</label>
          <textarea id="private_key" value={this.state.private_key} onChange={this.eventHandlers.onChange} ></textarea>
          {
            (this.state.is_generating_keypair !== true)
              ? <span className="icon button generate-keypair" onClick={this.eventHandlers.onClick.generate_keypair} ></span>
              : <span className="icon loader is-generating"></span>
          }

          <label for="private_key_storage">Storage Private Key:</label>
          <select id="private_key_storage" value={this.state.private_key_storage} onChange={this.eventHandlers.onChange} >
            {private_key_storage_options}
          </select>
  
          <div className="buttons">
            <input className="send"   type="submit" value="Save Settings" disabled={this.state.is_generating_keypair} />
            <input className="cancel" type="button" value="Reset" onClick={this.eventHandlers.onCancel} />
          </div>
        </form>
      </div>
    )
  }
}

Settings.propTypes = {
  settings: PropTypes.object.isRequired
}

Settings.contextTypes = {
  actions:  PropTypes.object.isRequired,
  history:  PropTypes.object.isRequired
}

module.exports = Settings
