const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Thread'

const Message            = require(`./${displayName}/Message`)
const Compose_Message    = require('react/components/presentation/class/Compose_Message')
const scrollToBottom     = require('react/lib/scrollToBottom')
const resizeParentIframe = require('react/lib/resizeParentIframe').global_resizeParentIframe

const scroller              = new scrollToBottom()
scroller.componentDidUpdate = scroller.componentDidUpdate.bind(scroller)
scroller.scrollToBottom     = scroller.scrollToBottom.bind(scroller)

const component = ({thread_id, summary, settings, messages, participants, draft_message}, {store, actions, history}) => {
  actions.DEBUG(`rendering: ${displayName}`, {thread_id, summary, settings})
  scroller.set_logger( actions.DEBUG )

  if (settings && settings.unread)
    actions.UPDATE_THREAD.MARK_UNREAD(thread_id, false)

  if (!summary || !settings || !messages || !messages.length) {
    return (
      <div className={`component ${displayName.toLowerCase()}`}>
        <div className="loading">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
        </div>
      </div>
    )
  }

  const state = store.getState()

  const Messages = messages.map((message, i) => {
    const html_format      = state.app.settings.display_html_format
    const start_expanded   = (message.settings.star === true) || (i === (messages.length - 1))
    const onExpandCollapse = resizeParentIframe.bind(this, false)

    return (
      <Message key={message.message_id} {...message} {...{thread_id, html_format, start_expanded, onExpandCollapse}} />
    )
  })

  let ReplyForm
  {
    const props = {
      draft:           draft_message,
      html_format:     state.app.settings.compose_html_format,
      onDomChange:     null,
      onNewMessage:    () => {
                         scroller.scrollToBottom()
                         resizeParentIframe(true)
                       },
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

  const save_draft = () => {
    if (draft_message.status.code) return

    const msg      = messages[ messages.length - 1 ]
    const my_email = state.user.email_address

    const is_reply       = true
    const recipient      = msg.summary.from
    const cc             = msg.summary.to.filter(email => email !== my_email)                  // Reply to All: Recipients of Last Message
    const cc_sugg_filter = [...cc, recipient, my_email]
    const cc_suggestions = participants.filter(email => cc_sugg_filter.indexOf(email) === -1)  // Cc Suggestions: All Additional Thread Participants => Sent or Received Previous Message(s) in Thread
    const subject        = ''
    const body           = {
      text_message:        '',
      html_document:       null
    }
    const attachments    = []

    const is_new_draft   = () => {
      let dirty     = false
      let new_draft = {is_reply, thread_id, recipient}
      const keys    = Object.keys(new_draft)

      for (let i=0; !dirty && (i < keys.length); i++) {
        let key = keys[i]
        if (draft_message[key] !== new_draft[key])
          dirty = true
      }

      dirty = dirty || (draft_message.cc.length                !== cc.length)
      dirty = dirty || (draft_message.cc.join(',')             !== cc.join(',') )

      dirty = dirty || (draft_message.cc_suggestions.length    !== cc_suggestions.length)
      dirty = dirty || (draft_message.cc_suggestions.join(',') !== cc_suggestions.join(',') )

      return dirty
    }

    const requires_update = is_new_draft()

    if (requires_update)
      actions.DEBUG('SAVING DRAFT MESSAGE', {origin: displayName, old_draft: draft_message, new_draft: {is_reply, thread_id, recipient, cc, cc_suggestions, subject, body, attachments}, html_format: state.app.settings.compose_html_format})
    else
      actions.DEBUG('DRAFT MESSAGE IS NOT MODIFIED', {origin: displayName, draft: draft_message})

    if (requires_update)
      actions.SAVE_DRAFT_MESSAGE(is_reply, thread_id, recipient, cc, cc_suggestions, subject, body, attachments)

    return requires_update
  }
  save_draft()

  const onClick = {
    unread:    actions.UPDATE_THREAD.MARK_UNREAD.bind(this, thread_id, !settings.unread),
    important: actions.UPDATE_THREAD.MARK_IMPORTANT.bind(this, thread_id, !settings.important),
    inbox:     settings.inbox ? null : actions.UPDATE_THREAD.MOVE_TO_INBOX.bind(this, thread_id),
    trash:     settings.trash ? null : actions.UPDATE_THREAD.MOVE_TO_TRASH.bind(this, thread_id),
    spam:      settings.spam  ? null : actions.UPDATE_THREAD.MOVE_TO_SPAM.bind(this, thread_id)
  }

  setTimeout(scroller.scrollToBottom, 0)

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
  participants:  PropTypes.arrayOf(PropTypes.string).isRequired,
  draft_message: PropTypes.object.isRequired
}

component.contextTypes = {
  store:    PropTypes.object.isRequired,
  actions:  PropTypes.object.isRequired,
  history:  PropTypes.object.isRequired
}

component.requireActions = ['DEBUG', 'UPDATE_THREAD', 'SAVE_DRAFT_MESSAGE']

component.postRender = resizeParentIframe.bind(this, true)

component.displayName = displayName

module.exports = purify(component)
