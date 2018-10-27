const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Thread'

const Message          = require(`./${displayName}/Message`)
const Compose_Message  = require('react/components/presentation/class/Compose_Message')
const scrollToBottom   = require('react/lib/scrollToBottom')

const scroller              = new scrollToBottom()
scroller.componentDidUpdate = scroller.componentDidUpdate.bind(scroller)
scroller.scrollToBottom     = scroller.scrollToBottom.bind(scroller)

const component = ({thread_id, summary, settings, messages, participants}, {store, actions, history}) => {
  actions.DEBUG(`rendering: ${displayName}`, {thread_id, summary, settings})

  if (settings.unread)
    actions.UPDATE_THREAD.MARK_UNREAD(thread_id, false)

  if (settings.unread || !messages || !messages.length) {
    return (
      <div className={`component ${displayName.toLowerCase()}`}>
        <div className="loading">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
        </div>
      </div>
    )
  }

  const Messages = messages.map((message, i) => {
    const start_expanded = (message.settings.star === true) || (i === (messages.length - 1))

    return (
      <Message key={i} {...message} {...{thread_id, start_expanded}} />
    )
  })

  let ReplyForm
  {
    const msg = messages[ messages.length - 1 ]

    const state    = store.getState()
    const my_email = state.user.email_address

    const recipient      = msg.summary.from
    const cc             = msg.summary.to.filter(email => email !== my_email)                  // Reply to All: Recipients of Last Message
    const cc_sugg_filter = [...cc, recipient, my_email]
    const cc_suggestions = participants.filter(email => cc_sugg_filter.indexOf(email) === -1)  // Cc Suggestions: All Additional Thread Participants => Sent or Received Previous Message(s) in Thread

    const props = {
      is_reply:        true,
      thread_id,
      recipient,
      cc,
      cc_suggestions,

      onSend:          () => {
                         console.log('Reply Sent')

                         scroller.scrollToBottom()
                       },
      onCancel:        () => console.log('Reply Cancelled'),
      txtCancel:       'Cancel'
    }

    ReplyForm = (
      <Compose_Message {...props} />
    )
  }

  const onClick = {
    unread:    actions.UPDATE_THREAD.MARK_UNREAD.bind(this, thread_id, !settings.unread),
    important: actions.UPDATE_THREAD.MARK_IMPORTANT.bind(this, thread_id, !settings.important),
    inbox:     settings.inbox ? null : actions.UPDATE_THREAD.MOVE_TO_INBOX.bind(this, thread_id),
    trash:     settings.trash ? null : actions.UPDATE_THREAD.MOVE_TO_TRASH.bind(this, thread_id),
    spam:      settings.spam  ? null : actions.UPDATE_THREAD.MOVE_TO_SPAM.bind(this, thread_id)
  }

  return (
    <div className={`component ${displayName.toLowerCase()}`} ref={scroller.componentDidUpdate} >
      <h1>{summary.subject}</h1>
      <div className="action_buttons">
        <div className={`button unread    ${ (settings.unread)    ? 'is_unread'    : 'not_unread' }`}    onClick={onClick.unread}    role="img" title={`${ (settings.unread)    ? 'Mark Read'        : 'Mark Unread'    }`}></div>
        <div className={`button important ${ (settings.important) ? 'is_important' : 'not_important' }`} onClick={onClick.important} role="img" title={`${ (settings.important) ? 'Mark Unimportant' : 'Mark Important' }`}></div>
        {
          (onClick.inbox !== null) &&
            <div className="button inbox" onClick={onClick.inbox} role="img" title="Move to Inbox"></div>
        }
        {
          (onClick.trash !== null) &&
            <div className="button trash" onClick={onClick.trash} role="img" title="Move to Trash"></div>
        }
        {
          (onClick.spam !== null) &&
            <div className="button spam" onClick={onClick.spam}   role="img" title="Move to Spam"></div>
        }
      </div>
      <div className="messages">
        {Messages}
      </div>
      <div className="compose_reply">
        {ReplyForm}
      </div>
    </div>
  )
}

component.propTypes = {
  thread_id:     PropTypes.string.isRequired,
  summary:       PropTypes.object.isRequired,
  settings:      PropTypes.object.isRequired,
  messages:      PropTypes.arrayOf(PropTypes.object).isRequired,
  participants:  PropTypes.arrayOf(PropTypes.string).isRequired
}

component.contextTypes = {
  store:    PropTypes.object.isRequired,
  actions:  PropTypes.object.isRequired,
  history:  PropTypes.object.isRequired
}

component.requireActions = ['DEBUG', 'UPDATE_THREAD', 'OPEN_COMPOSE_REPLY']

component.displayName = displayName

module.exports = purify(component)
