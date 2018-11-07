const React       = require('react')
const PropTypes   = require('prop-types')

const displayName = 'Compose_Message'

const read_file_content  = require('react/lib/read_file_content')

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
    if (!this.validateReplyInput()) return
  }

  componentWillReceiveProps(nextProps) {
    const unset_error = (this.sent_msg_notification_timer === null)
    const oldState    = this.state
    const newState    = this.get_state_from_props(nextProps, unset_error)

    this.setState(newState)

    this.handlePostSubmit(newState)
  }

  componentDidUpdate() {
    if (!this.validateReplyInput()) return

    while (this.callbackQueue.length) {
      ( this.callbackQueue.shift() )()
    }

    if (this.state.onDomChange)
      this.state.onDomChange()
  }

  get_state_from_props(props, unset_error=true) {
    const draft          = props.draft
    const cc             = draft.cc.join(' ')
    const cc_suggestions = [...draft.cc_suggestions]
    const attachments    = draft.attachments.map(file => {return {...file}})
    const status         = {...draft.status}

    const onDomChange    = ((typeof props.onDomChange === 'function') ? props.onDomChange : null)
    const onSend         = ((typeof props.onSend      === 'function') ? props.onSend      : null)
    const onCancel       = ((typeof props.onCancel    === 'function') ? props.onCancel    : null)
    const txtCancel      = (props.txtCancel || 'Clear')
    const invalid_state  = false

    const state = {...draft, cc, cc_suggestions, attachments, status, onDomChange, onSend, onCancel, txtCancel, invalid_state}

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

  add_attachment() {
    const add_new_files = files => {
      const old_attachments = this.state.attachments
      const new_attachments = [...old_attachments, ...files]

      const newState = {
        attachments: new_attachments
      }
      this.setState(newState)
    }

    read_file_content()
    .then(files => {
      add_new_files(files)
    })
    .catch(error => {
      if (Array.isArray(error.file_contents) && error.file_contents.length) {
        add_new_files(error.file_contents)
        this.setError('ERROR: some attachments failed to be read from disk')
      }
      else {
        this.setError('WARNING: did not detect any files selected')
      }
    })
  }

  remove_attachment(attachment) {
    const old_attachments = this.state.attachments
    const old_index       = old_attachments.indexOf(attachment)

    // sanity check
    if (old_index < 0) return

    const new_attachments = [...old_attachments]
    new_attachments.splice(old_index, 1)

    const newState = {
      attachments: new_attachments
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

    let {is_reply, thread_id, recipient, cc, cc_suggestions, subject, body, attachments} = this.state

    // trim string values
    recipient = recipient.trim()
    cc        = cc.trim()
    subject   = subject.trim()
    body      = body.trim()

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

    // format data, make deep copy of objects
    cc             = cc.split(/\s*[,\s]\s*/g).filter(val => val.length)
    cc_suggestions = [...cc_suggestions]
    attachments    = attachments.map(file => {return {...file}})

    // if "recipient" contains multiple email addresses, keep the first and move the remainder to "cc"
    recipient = recipient.split(/\s*[,\s]\s*/g).filter(val => val.length)
    if (recipient.length > 1) {
      let more_cc
      ;[recipient, ...more_cc] = recipient
      cc = [...cc, ...more_cc]
    }
    else {
      recipient = recipient[0]
    }

    // save draft
    this.context.actions.DEBUG('SAVING DRAFT MESSAGE', {origin: displayName, old_draft: this.props.draft, new_draft: {is_reply, thread_id, recipient, cc, cc_suggestions, subject, body, attachments}})
    this.context.actions.SAVE_DRAFT_MESSAGE(is_reply, thread_id, recipient, cc, cc_suggestions, subject, body, attachments)

    // send message
    if (is_reply)
      this.context.actions.SEND_REPLY(thread_id, recipient, body, cc, attachments)
    else
      this.context.actions.SEND_NEW_MESSAGE(recipient, subject, body, cc, attachments)
  }

  handlePostSubmit(store) {
    if (!store) store = this.state

    switch (store.status.code) {
      case 0:
        break

      case 1:
        this.setError('Retrieving Public Encryption Keys...')
        break

      case 2:
        this.setError('Message is Sending...')
        break

      case 3:
        this.setError('Message Sent')

        // wait 5 seconds, then remove success notification
        this.sent_msg_notification_timer = window.setTimeout(
          () => {
            this.sent_msg_notification_timer = null

            this.setError(null)
          },
          5000
        )

        if (store.onSend)
          this.callbackQueue.push( store.onSend )

        this.context.actions.CLEAR_DRAFT_MESSAGE()

        break

      case 4:
        this.setError( store.status.error_message )
        break
    }
  }

  handleCancel(event) {
    event.stopPropagation()
    event.preventDefault()

    this.setError(null)

    if (this.state.onCancel)
      this.callbackQueue.push( this.state.onCancel )

    this.context.actions.CLEAR_DRAFT_MESSAGE()
  }

  render() {
    this.context.actions.DEBUG(`rendering: ${displayName}`, {draft: this.props.draft})

    const cc_suggestions = this.state.cc_suggestions.map(email => {
      return (
        <div key={email} className="cc_suggestion" onClick={this.add_cc_suggestion.bind(this, email)} >
          <span className="icon"></span>
          <span className="email">{email}</span>
        </div>
      )
    })

    const attachments = this.state.attachments.map(attachment => {
      return (
        <div key={attachment.name} className="attachment" onClick={this.remove_attachment.bind(this, attachment)} >
          <span className="icon icon-remove"></span>
          <span className="filename">{attachment.name}</span>
        </div>
      )
    })

    let error_message
    {
      if (this.state.error_message !== null) {
        if (this.state.error_message.indexOf('<div class="encryption_error">') === 0) {
          // special case: the message contains raw html
          error_message = <div dangerouslySetInnerHTML={{__html: this.state.error_message}} />
        }
        else {
          error_message = <span>{this.state.error_message}</span>
        }
      }
    }

    return (
      <div className={`component ${displayName.toLowerCase()} ${ this.state.is_reply ? 'reply' : 'new_message' }`} >
        {
          (error_message) &&
            <div className="error_message">
              {error_message}
            </div>
        }
        {
          (this.state.invalid_state !== true) &&
            <form onSubmit={this.eventHandlers.onSubmit} >
              <div className="grid">

                <label for="recipient">To:</label>
                <input type="text" id="recipient" value={this.state.recipient} onChange={this.eventHandlers.onChange} disabled={this.state.is_reply} />

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
                  <div className="attachment static-icons">
                    <span className="icon icon-add" role="img" title="Add File Attachment" onClick={this.add_attachment.bind(this)}></span>
                  </div>
                  {attachments}
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
  draft:        PropTypes.object.isRequired,

  onDomChange:  PropTypes.func,
  onSend:       PropTypes.func,
  onCancel:     PropTypes.func,
  txtCancel:    PropTypes.string
}

Compose_Message.defaultProps = {
  txtCancel:    'Clear'
}

Compose_Message.contextTypes = {
  actions:      PropTypes.object.isRequired
}

module.exports = Compose_Message
