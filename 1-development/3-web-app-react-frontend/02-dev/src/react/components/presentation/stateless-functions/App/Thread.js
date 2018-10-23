const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Thread'

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

const format_date = (timestamp) => {
  const then = new Date(timestamp)

  let month = then.getMonth() + 1
  let day   = then.getDate()
  let year  = then.getFullYear()

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

  month = pad_to_length(month, 2, '0')
  day   = pad_to_length(day,   2, '0')
  hours = pad_to_length(hours, 2, '0')
  mins  = pad_to_length(mins,  2, '0')

  return `${month}/${day}/${year} ${hours}:${mins} ${am_pm}`
}

const component = ({thread_id, summary, settings, messages, participants}, {actions, history}) => {

  if (!messages || !messages.length) {
    return (
      <div className={`component ${displayName.toLowerCase()}`}>
        <div className="loading">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
        </div>
      </div>
    )
  }

  if (settings.unread) {
    actions.UPDATE_THREAD.MARK_UNREAD(thread_id, false)
    return null
  }

  const date_modified = format_date(summary.date_modified)

  const onClick = {
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
    <div className={`component ${displayName.toLowerCase()}`}>
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
        <pre>{JSON.stringify(summary, null, 4)}</pre>
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
  actions:  PropTypes.object.isRequired,
  history:  PropTypes.object.isRequired
}

component.requireActions = ['UPDATE_THREAD', 'OPEN_COMPOSE_REPLY']

component.displayName = displayName

module.exports = purify(component)
