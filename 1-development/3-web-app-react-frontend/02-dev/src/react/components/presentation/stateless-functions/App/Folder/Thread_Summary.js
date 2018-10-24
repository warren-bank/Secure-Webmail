const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Thread_Summary'

const pad_to_length = (str, length, chr, is_append) => {
  str = str.toString()

  let old_length = str.length
  let pad_length = length - old_length

  if (pad_length <= 0) return str

  let padding = chr.repeat(pad_length)
  return (is_append)
    ? `${str}${padding}`
    : `${padding}${str}`
}

const format_date = (timestamp, months) => {
  const then = new Date(timestamp)
  const now  = new Date()

  const same = {
    year:  (then.getFullYear() === now.getFullYear()),
    month: (then.getMonth()    === now.getMonth()),
    day:   (then.getDate()     === now.getDate())
  }

  if (same.year && same.month && same.day) {
    // same day
    let hours = then.getHours()
    let mins  = then.getMinutes()
    let am_pm = 'am'

    if (hours > 12) {
      hours -= 12
      am_pm  = 'pm'
    }
    if (hours === 0) {
      hours  = 12
    }

    hours = pad_to_length(hours, 2, '0')
    mins  = pad_to_length(mins,  2, '0')

    return `${hours}:${mins} ${am_pm}`
  }

  if (same.year) {
    // same year
    let month = months[ then.getMonth() ]
    let day   = then.getDate()

    return `${month} ${day}`
  }

  else {
    let month = then.getMonth() + 1
    let day   = then.getDate()
    let year  = then.getFullYear()

    month = pad_to_length(month, 2, '0')
    day   = pad_to_length(day,   2, '0')

    return `${month}/${day}/${year}`
  }
}

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

  // wrap all onclick handlers to prevent the event from propogating to other DOM elements
  Object.keys(onClick).forEach(key => {
    const func = onClick[key]
    if (func === null) return

    onClick[key] = (event) => {
      event.stopPropagation()
      event.preventDefault()
      func()
    }
  })

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
