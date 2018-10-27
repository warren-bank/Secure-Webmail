const React       = require('react')
const PropTypes   = require('prop-types')

const displayName = 'Compose_Message'

class Compose_Message extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      is_reply:       props.is_reply,
      thread_id:     (props.thread_id || ''),
      recipient:     (props.recipient || ''),
      cc:            (Array.isArray(props.cc) ? props.cc.join(' ') : ''),
      subject:       '',
      body:          '',
      attachments:   [],

      onSend:        ((typeof props.onSend   === 'function') ? props.onSend   : null),
      onCancel:      ((typeof props.onCancel === 'function') ? props.onCancel : null),
      txtCancel:     (props.txtCancel || 'Clear'),

      error_message: null
    }

    this.eventHandlers = {
      onChange: this.handleChange.bind(this),
      onSubmit: this.handleSubmit.bind(this),
      onCancel: this.handleCancel.bind(this)
    }
  }

  componentWillMount() {
    this.validateReplyInput()
  }

  componentWillReceiveProps(nextProps) {
    const newState = {
      is_reply:       nextProps.is_reply,
      thread_id:     (nextProps.thread_id || ''),
      recipient:     (nextProps.recipient || ''),
      cc:            (Array.isArray(nextProps.cc) ? nextProps.cc.join(' ') : ''),
      subject:       '',
      body:          '',
      attachments:   [],

      onSend:        ((typeof nextProps.onSend   === 'function') ? nextProps.onSend   : null),
      onCancel:      ((typeof nextProps.onCancel === 'function') ? nextProps.onCancel : null),
      txtCancel:     (nextProps.txtCancel || 'Clear'),

      error_message: null
    }

    this.setState(newState)
  }

  // mutates state
  validateReplyInput(store) {
    if (!store) store = this.state

    const is_error = (
      store.is_reply && (
        !store.thread_id ||
        !store.recipient
      )
    )

    if (is_error)
      this.setState({error_message: 'Invalid Input: Cannot Compose a Reply'})

    return !is_error
  }

  handleChange(event) {
    event.stopPropagation()
    event.preventDefault()

    let key = event.currentTarget.id
    let val = event.currentTarget.value

    let state = {}
    state[key] = val

    if (this.state.error_message !== null)
      state['error_message'] = null

    this.setState(state)
  }

  handleSubmit(event) {
    event.stopPropagation()
    event.preventDefault()

    if (!this.validateReplyInput()) return

    const {is_reply, thread_id, recipient, subject, body, attachments} = this.state
    let {cc} = this.state

    cc = cc.trim().split(/\s*[,\s]\s*/g).filter(val => val.length)

    // validate required fields
    const empty_required_fields = []
    if (!recipient)
      empty_required_fields.push('To')
    if (!subject && !is_reply)
      empty_required_fields.push('Subject')
    if (!body)
      empty_required_fields.push('Message')
    if (empty_required_fields.length)
      return this.setState({error_message: `The following required field${ (empty_required_fields.length > 1) ? 's are' : ' is' } incomplete: "${empty_required_fields.join('", "')}"`})

    // clean previous error message
    this.setState({error_message: null})

    // send message
    if (is_reply)
      this.context.actions.SEND_REPLY(thread_id, recipient, body, cc, attachments)
    else
      this.context.actions.SEND_NEW_MESSAGE(recipient, subject, body, cc, attachments)

    // cleanup form fields, display a success notification
    const newState = {
      subject:       '',
      body:          '',
      attachments:   [],
      error_message: 'Message Sent'
    }
    this.setState(newState)

    // wait 5 seconds, then remove success notification
    window.setTimeout(
      this.setState.bind(this, {error_message: null}),
      5000
    )

    if (this.state.onSend)
      this.state.onSend()
  }

  handleCancel(event) {
    event.stopPropagation()
    event.preventDefault()

    const newState = {
      subject:       '',
      body:          '',
      attachments:   [],
      error_message: null
    }
    this.setState(newState)

    if (this.state.onCancel)
      this.state.onCancel()
  }

  render() {
    return (
      <div className={`component ${displayName.toLowerCase()} ${ this.state.is_reply ? 'reply' : 'new_message' }`} >
        {
          (this.state.error_message !== null) &&
            <div className="error_message">
              <span>{this.state.error_message}</span>
            </div>
        }
        <form onSubmit={this.eventHandlers.onSubmit} >
          <div className="grid">

            <label for="recipient">To:</label>
            <input type="text" id="recipient" value={this.state.recipient} onChange={this.eventHandlers.onChange} />

            <label for="cc">Cc:</label>
            <input type="text" id="cc" value={this.state.cc} onChange={this.eventHandlers.onChange} />

            <label for="subject">Subject:</label>
            <input type="text" id="subject" value={this.state.subject} onChange={this.eventHandlers.onChange} />

            <label for="body">Message:</label>
            <textarea id="body" onChange={this.eventHandlers.onChange} >
              {this.state.body}
            </textarea>

            <label>Files:</label>
            <div className="attachments">
            </div>

            <label></label>
            <div className="buttons">
              <input className="send"   type="submit" value="Send" />
              <input className="cancel" type="button" value={this.state.txtCancel} onClick={this.eventHandlers.onCancel} />
            </div>

          </div>
        </form>
      </div>
    )
  }
}

Compose_Message.propTypes = {
  is_reply:  PropTypes.bool,
  thread_id: PropTypes.string,
  recipient: PropTypes.string,
  cc:        PropTypes.arrayOf(PropTypes.string),

  onSend:    PropTypes.func,
  onCancel:  PropTypes.func,
  txtCancel: PropTypes.string
}

Compose_Message.defaultProps = {
  is_reply:  false
}

Compose_Message.contextTypes = {
  actions:   PropTypes.object.isRequired
}

module.exports = Compose_Message