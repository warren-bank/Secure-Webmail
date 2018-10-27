const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Message_Summary'

const format_date = require('react/lib/format_date')[displayName]

const format_to = (to, store) => {
  const state    = store.getState()
  const my_email = state.user.email_address

  let result
  result = to.filter(email => email !== my_email)

  if (result.length < to.length)
    result.unshift('me')

  result = result.join(', ')
  return result
}

const component = ({thread_id, message_id, body, summary, settings}, {store, actions}) => {
  actions.DEBUG(`rendering: ${displayName}`, {message_id, summary, settings})

  const timestamp = format_date(summary.timestamp)
  const to        = format_to(summary.to, store)

  const onClick = {
    unread:  actions.UPDATE_MESSAGE.MARK_UNREAD.bind(this, thread_id, message_id, !settings.unread),
    star:    actions.UPDATE_MESSAGE.MARK_STAR.bind(this, thread_id, message_id, !settings.star),
    trash:   settings.trash ? null : actions.UPDATE_MESSAGE.MOVE_TO_TRASH.bind(this, thread_id, message_id)
  }

  return (
    <div className={`component ${displayName.toLowerCase()}`}>
      <div className="row row_1">
        <div className="col col_1">
          <span className="from" role="tooltip" title={summary.from}>{summary.from}</span>
        </div>
        <div className="col col_2">
          <span className="timestamp">{timestamp}</span>
        </div>
        <div className="col col_3">
          <div className="settings_buttons">
            <div className={`button unread ${ (settings.unread) ? 'is_unread' : 'not_unread' }`} onClick={onClick.unread} role="img" title={`${ (settings.unread) ? 'Mark Read'   : 'Mark Unread'    }`}></div>
            <div className={`button star   ${ (settings.star)   ? 'is_star'   : 'not_star'   }`} onClick={onClick.star}   role="img" title={`${ (settings.star)   ? 'Remove Star' : 'Mark with Star' }`}></div>
            {
              (onClick.trash !== null) &&
                <div className="button trash" onClick={onClick.trash} role="img" title="Move to Trash"></div>
            }
          </div>
        </div>
      </div>
      <div className="row row_2 checked_expand">
        <span className="to" role="tooltip" title={to}>{to}</span>
      </div>
      <div className="row row_3 checked_collapse">
        <span className="body">{body}</span>
      </div>
    </div>
  )
}

component.propTypes = {
  thread_id:   PropTypes.string.isRequired,
  message_id:  PropTypes.string.isRequired,
  body:        PropTypes.string.isRequired,
  summary:     PropTypes.object.isRequired,
  settings:    PropTypes.object.isRequired
}

component.contextTypes = {
  store:    PropTypes.object.isRequired,
  actions:  PropTypes.object.isRequired
}

component.requireActions = ['DEBUG', 'UPDATE_MESSAGE']

component.displayName = displayName

module.exports = purify(component)
