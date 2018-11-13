const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Thread_Summary'

const format_date = require('react/lib/format_date')[displayName]

const component = ({thread_id, summary, settings}, {actions, constants, history}) => {
  actions.DEBUG(`rendering: ${displayName}`, {thread_id, summary, settings})

  const date_modified = format_date(summary.date_modified, constants.months)

  const onClick = {
    open:      actions.OPEN_THREAD.bind(this, thread_id, history, true),
    unread:    actions.UPDATE_THREAD.MARK_UNREAD.bind(this, thread_id, !settings.unread),
    important: actions.UPDATE_THREAD.MARK_IMPORTANT.bind(this, thread_id, !settings.important),
    inbox:     settings.inbox ? null : actions.UPDATE_THREAD.MOVE_TO_INBOX.bind(this, thread_id),
    trash:     settings.trash ? null : actions.UPDATE_THREAD.MOVE_TO_TRASH.bind(this, thread_id),
    spam:      settings.spam  ? null : actions.UPDATE_THREAD.MOVE_TO_SPAM.bind(this, thread_id)
  }

  return (
    <div className={`component ${displayName.toLowerCase()} ${ (settings.unread) ? 'unread' : '' }`} onClick={onClick.open}>
      <div className="col col_1">
        <span className="msg_count">({summary.msg_count})</span>
      </div>
      <div className="col col_2">
        <span className="from" role="tooltip" title={summary.from}>{summary.from}</span>
      </div>
      <div className="col col_3">
        <span className="subject">{summary.subject}</span>
        <span>-</span>
        <span className="body">{summary.body}</span>
      </div>
      <div className="col col_4">
        <span className="date_modified">{date_modified}</span>
      </div>
      <div className="col col_5">
        <div className="settings_buttons">
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
      </div>
    </div>
  )
}

component.propTypes = {
  thread_id:  PropTypes.string.isRequired,
  summary:    PropTypes.object.isRequired,
  settings:   PropTypes.object.isRequired
}

component.contextTypes = {
  actions:    PropTypes.object.isRequired,
  constants:  PropTypes.object.isRequired,
  history:    PropTypes.object.isRequired
}

component.requireActions = ['DEBUG', 'OPEN_THREAD', 'UPDATE_THREAD']

component.displayName = displayName

module.exports = purify(component)
