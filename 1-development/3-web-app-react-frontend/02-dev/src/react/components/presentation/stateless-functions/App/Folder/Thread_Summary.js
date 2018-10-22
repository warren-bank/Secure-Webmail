const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Thread_Summary'

const pad_to_length = (str, length, chr, is_append) => {
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

const component = ({thread_id, summary, settings}, {actions, constants}) => {
  const date_modified = format_date(summary.date_modified, constants.months)

  return (
    <div className={`component ${displayName.toLowerCase()} ${ (settings.unread) ? 'unread' : '' }`}>
      <div className="col_1">
        <span className="from">{summary.from}</span>
        <span className="msg_count">({summary.msg_count})</span>
      </div>
      <div className="col_2">
        <span className="subject">{summary.subject}</span>
        <span>-</span>
        <span className="body">({summary.body})</span>
      </div>
      <div className="col_3">
        <span className="date_modified">({date_modified})</span>
      </div>
      <div className="settings_buttons">
        
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
  constants:  PropTypes.object.isRequired
}

component.requireActions = ['UPDATE_THREAD']

component.displayName = displayName

module.exports = purify(component)
