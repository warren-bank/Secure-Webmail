const React       = require('react')
const PropTypes   = require('prop-types')

const crypto      = require('redux/lib/middleware/crypto')

const displayName = 'Settings'

const resizeParentIframe = require('react/lib/resizeParentIframe').global_resizeParentIframe

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

  componentDidMount() {
    resizeParentIframe()
  }

  componentDidUpdate() {
    resizeParentIframe()
  }

  componentWillReceiveProps(nextProps) {
    const newState = this.get_state_from_props(nextProps)
    this.setState(newState)
  }

  get_state_from_props(props) {
    const {settings} = props

    const state = {...settings}
    return state
  }

  handleChange(event) {
    event.stopPropagation()
    event.preventDefault()

    const el       = event.currentTarget
    const key      = el.id
    const val      = (el.type === 'checkbox') ? el.checked : el.value
    const newState = {
      [key]: val
    }
    this.setState(newState)
  }

  handleSubmit(event) {
    event.stopPropagation()
    event.preventDefault()

    let {private_key, private_key_storage, display_html_format, compose_html_format, max_threads_per_page} = this.state

    // perform validation
    const validation_result = this.does_private_match_public(private_key)

    // validation has failed: show error message in alert dialog, then return
    if (validation_result > 0) {
      let msg

      switch(validation_result) {
        case 1:
          msg = [
            'The server reports that no "public key" is associated with the current Google user account.',
            '',
            'If this is incorrect, then please reload the webpage.',
            '',
            'Otherwise, you may generate a new keypair.',
            'The server will automatically store the "public key".',
            'You MUST save the "private key".',
            'If you lose this value, then you will NOT be able to read the encrypted email sent to you.'
          ].join("\n")
          break

        case 2:
          msg = [
            'The "private key" value entered is not valid.',
            'Please try again.'
          ].join("\n")
          break

        case 3:
          msg = [
            'ERROR:',
            '',
            'Redux state contains a "public key" value obtained from the server which is already associated with the current Google user account.',
            '',
            'The "private key" on this page cannot be saved because it does not form a valid cryptographic keypair.',
            '',
            'Please try again.'
          ].join("\n")
          break
      }

      if (msg)
        window.alert(msg)

      return
    }

    // cast to correct data types
    private_key_storage  = Number(private_key_storage)
    max_threads_per_page = Number(max_threads_per_page)

    if (
         (this.props.settings.private_key          !== private_key)
      || (this.props.settings.private_key_storage  !== private_key_storage)
      || (this.props.settings.display_html_format  !== display_html_format)
      || (this.props.settings.compose_html_format  !== compose_html_format)
      || (this.props.settings.max_threads_per_page !== max_threads_per_page)
    ) {
      this.context.actions.UPDATE_SETTINGS(private_key, private_key_storage, display_html_format, compose_html_format, max_threads_per_page)
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

  does_private_match_public(private_key) {
    let my_pubkey = this.state.public_key
    let generated_pubkey

    if (!my_pubkey) return 1  // don't allow the user to locally configure a private key if the server says there is no existing keypair

    try {
      generated_pubkey = crypto.RSA.get_public_key(private_key)
    }
    catch(err) {
      return 2  // don't allow the user to save a private key that is invalid
    }

    // text comparison ignoring whitespace
    const ignore_charset = /[\r\n\s\t]/g
    my_pubkey            = my_pubkey.replace(ignore_charset, '')
    generated_pubkey     = generated_pubkey.replace(ignore_charset, '')

    if (my_pubkey !== generated_pubkey) return 3  // don't allow the user to save a private key that doesn't pair with the public key (obtained from the server)

    return 0  // all good
  }

  should_keypair_allow_update() {
    const my_pubkey = this.state.public_key

    if (!my_pubkey) return false  // shouldn't be necessary

    let msg = [
      'WARNING:',
      '',
      'Redux state contains a "public key" value obtained from the server which is already associated with the current Google user account.',
      '',
      'Updating the associated keypair will cause your mailbox to diverge:',
      '  (1) the previous "private key" will be required to decrypt older messages, and',
      '  (2) the updated "private key" will be required to decrypt newer messages.',
      '',
      'You should only consider updating your keypair if either:',
      '  (1) you have lost your "private key" and are no-longer able to read your encrypted messages, or',
      '  (2) an untrusted 3rd party has gained access to your "private key".',
      '',
      'Proceed with creation of new keypair?'
    ].join("\n")

    const proceed = window.confirm(msg)

    return proceed ? true : null  // return null when the user cancels the operation
  }

  generate_keypair(event) {
    event.stopPropagation()
    event.preventDefault()

    if (this.state.is_generating_keypair === true) return

    const allow_update = this.should_keypair_allow_update()
    if (allow_update === null) return

    this.context.actions.GENERATE_KEYPAIR(allow_update)
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
          <input id="display_html_format" type="checkbox" checked={this.state.display_html_format} onChange={this.eventHandlers.onChange} />
          <label for="display_html_format">Allow HTML format to display messages</label>

          <input id="compose_html_format" type="checkbox" checked={this.state.compose_html_format} onChange={this.eventHandlers.onChange} />
          <label for="compose_html_format">Allow HTML format to compose messages</label>

          <label for="max_threads_per_page">Number of thread summaries to display in paginated folder list:</label>
          <input id="max_threads_per_page" type="number" value={this.state.max_threads_per_page} onChange={this.eventHandlers.onChange} />
  
          <label for="private_key">Private RSA Encryption Key:</label>
          <textarea id="private_key" value={this.state.private_key} onChange={this.eventHandlers.onChange} disabled={!this.state.public_key} ></textarea>
          {
            (this.state.is_generating_keypair !== true)
              ? <span className="icon button generate-keypair" role="img" title="Generate Keypair" onClick={this.eventHandlers.onClick.generate_keypair} ></span>
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
