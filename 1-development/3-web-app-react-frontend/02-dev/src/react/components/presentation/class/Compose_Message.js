const React       = require('react')
const PropTypes   = require('prop-types')

const displayName = 'Compose_Message'

class Compose_Message extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = this.get_state_from_props(props)

    this.eventHandlers = {
      onChange: this.handleChange.bind(this),
      onSubmit: this.handleSubmit.bind(this),
      onCancel: this.handleCancel.bind(this)
    }

    this.callbackQueue = []

    this.sent_msg_notification_timer = null
  }

  componentWillMount() {
    this.validateReplyInput()
  }

  componentWillReceiveProps(nextProps) {
    const unset_error = (this.sent_msg_notification_timer === null)
    const newState    = this.get_state_from_props(nextProps, unset_error)

    this.setState(newState)
  }

  componentDidUpdate() {
    while (this.callbackQueue.length) {
      ( this.callbackQueue.shift() )()
    }
  }

  get_state_from_props(props, unset_error=true) {
    const state = {
      is_reply:         props.is_reply,
      thread_id:       (props.thread_id || ''),
      recipient:       (props.recipient || ''),
      cc:              (Array.isArray(props.cc) ? props.cc.join(' ') : ''),
      cc_suggestions:  (Array.isArray(props.cc_suggestions) ? props.cc_suggestions : []),
      subject:         '',
      body:            '',
      attachments:     [],

      onSend:          ((typeof props.onSend   === 'function') ? props.onSend   : null),
      onCancel:        ((typeof props.onCancel === 'function') ? props.onCancel : null),
      txtCancel:       (props.txtCancel || 'Clear'),

      invalid_state:   false
    }

    if (unset_error)
      state.error_message = null

    return state
  }

  clearTimer() {
    if (this.sent_msg_notification_timer !== null) {
      window.clearTimeout(this.sent_msg_notification_timer)

      this.sent_msg_notification_timer = null
    }
  }

  setError(msg) {
    this.clearTimer()

    this.setState({error_message: msg})
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

    if (is_error) {
      this.setState({invalid_state: true})

      this.setError('Invalid State: Cannot Compose a Reply')
    }

    return !is_error
  }

  add_cc_suggestion(email) {
    const old_cc = this.state.cc
    const new_cc = `${old_cc.trim()} ${email}`

    const old_cc_suggestions = this.state.cc_suggestions
    const old_index          = old_cc_suggestions.indexOf(email)

    // sanity check
    if (old_index < 0) return

    const new_cc_suggestions = [...old_cc_suggestions]
    new_cc_suggestions.splice(old_index, 1)

    const newState = {
      cc: new_cc,
      cc_suggestions: new_cc_suggestions
    }
    this.setState(newState)
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

    this.setError(null)
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
      return this.setError(`The following required field${ (empty_required_fields.length > 1) ? 's are' : ' is' } incomplete: "${empty_required_fields.join('", "')}"`)

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
    this.sent_msg_notification_timer = window.setTimeout(
      () => {
        this.sent_msg_notification_timer = null

        this.setState({error_message: null})
      },
      5000
    )

    if (this.state.onSend)
      this.callbackQueue.push( this.state.onSend )
  }

  handleCancel(event) {
    event.stopPropagation()
    event.preventDefault()

    const newState = {
      subject:       '',
      body:          '',
      attachments:   []
    }
    this.setState(newState)

    this.setError(null)

    if (this.state.onCancel)
      this.callbackQueue.push( this.state.onCancel )
  }

  render() {

    const cc_suggestions = this.state.cc_suggestions.map(email => {
      return (
        <div key={email} className="cc_suggestion" onClick={this.add_cc_suggestion.bind(this, email)}>
          <span className="icon"></span>
          <span className="email">{email}</span>
        </div>
      )
    })

    return (
      <div className={`component ${displayName.toLowerCase()} ${ this.state.is_reply ? 'reply' : 'new_message' }`} >
        {
          (this.state.error_message !== null) &&
            <div className="error_message">
              <span>{this.state.error_message}</span>
            </div>
        }
        {
          (this.state.invalid_state !== true) &&
            <form onSubmit={this.eventHandlers.onSubmit} >
              <div className="grid">

                <label for="recipient">To:</label>
                <input type="text" id="recipient" value={this.state.recipient} onChange={this.eventHandlers.onChange} />

                <label for="cc">Cc:</label>
                <input type="text" id="cc" value={this.state.cc} onChange={this.eventHandlers.onChange} />

                {
                  (this.state.cc_suggestions.length > 0) &&
                    <label></label>
                }
                {
                  (this.state.cc_suggestions.length > 0) &&
                    <div className="cc_suggestions">
                      {cc_suggestions}
                    </div>
                }

                <label for="subject">Subject:</label>
                <input type="text" id="subject" value={this.state.subject} onChange={this.eventHandlers.onChange} />

                <label for="body">Message:</label>
                <textarea id="body" value={this.state.body} onChange={this.eventHandlers.onChange} ></textarea>

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
        }
      </div>
    )
  }
}

Compose_Message.propTypes = {
  is_reply:        PropTypes.bool,
  thread_id:       PropTypes.string,
  recipient:       PropTypes.string,
  cc:              PropTypes.arrayOf(PropTypes.string),
  cc_suggestions:  PropTypes.arrayOf(PropTypes.string),

  onSend:          PropTypes.func,
  onCancel:        PropTypes.func,
  txtCancel:       PropTypes.string
}

Compose_Message.defaultProps = {
  is_reply:        false,
  cc:              [],
  cc_suggestions:  [],
  txtCancel:       'Clear'
}

Compose_Message.contextTypes = {
  actions:         PropTypes.object.isRequired
}

module.exports = Compose_Message
