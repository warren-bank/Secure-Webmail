const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Thread'

const Message          = require(`./${displayName}/Message`)
const Compose_Message  = require('react/components/presentation/class/Compose_Message')

// =================
// https://reactjs.org/docs/refs-and-the-dom.html#refs-and-function-components
//   React 16.3: added React.createRef() API
// https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
//   legacy: callback refs
// =================
const DOM_refs = {
  [displayName]: null
}
const callbackQueue = []
const scrollToBottom = () => {
  if (DOM_refs[displayName] instanceof HTMLElement) {
    window.scrollTo(0, DOM_refs[displayName].scrollHeight)
  }
  else {
    callbackQueue.push((DOM_node) => {
      window.scrollTo(0, DOM_node.scrollHeight)
    })
  }
}
const componentDidUpdate = (DOM_node) => {
  DOM_refs[displayName] = DOM_node

  if (DOM_node instanceof HTMLElement) {
    while (callbackQueue.length) {
      ( callbackQueue.shift() )(DOM_node)
    }
    scrollToBottom()
  }
}

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

    const cc = {
      ReplyAll: {
        message: msg.summary.to.filter(email => email !== my_email),  // Reply to All: Recipients of Last Message
        thread:  participants                                         // Reply to All: Participants in Thread
      }
    }

    const props = {
      is_reply:  true,
      thread_id,
      recipient: msg.summary.from,
      cc:        cc.ReplyAll.message,

      onSend:    () => {
                         console.log('Reply Sent')

                         scrollToBottom()
                       },
      onCancel:  () => console.log('Reply Cancelled'),
      txtCancel: 'Cancel'
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
    <div className={`component ${displayName.toLowerCase()}`} ref={componentDidUpdate} >
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
