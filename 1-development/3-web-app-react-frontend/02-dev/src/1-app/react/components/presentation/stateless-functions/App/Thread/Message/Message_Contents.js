const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Message_Contents'

const {sanitize_html}     = require('react/lib/sanitize_html')
const Message_Attachment  = require(`./${displayName}/Message_Attachment`)

const component = ({contents, html_format, onLoad}, {actions}) => {
  actions.DEBUG(`rendering: ${displayName}`, {html_format})

  const onRender = (el) => {
    if (!el || !onLoad) return

    const imgs = el.querySelectorAll('img')
    let loaded = 0

    imgs.forEach(img => {
      img.onload = () => {
        loaded++

        if (loaded === imgs.length) {
          onLoad()
          actions.DEBUG(`onLoad: ${displayName}`, {image_count: loaded})
        }
      }
    })
  }

  const body = (html_format === true)
    ? <div className="body trix-content" dangerouslySetInnerHTML={{__html: sanitize_html(contents.body)}} ref={onRender} />
    : <div className="body">{contents.body}</div>

  const Attachments = contents.attachments.map((attachment, i) => (
    <Message_Attachment key={i} attachment={attachment} />
  ))

  return (
    <div className={`component ${displayName.toLowerCase()}`}>
      {body}
      <div className="attachments">
        {Attachments}
      </div>
    </div>
  )
}

component.propTypes = {
  contents:     PropTypes.object.isRequired,
  html_format:  PropTypes.bool,
  onLoad:       PropTypes.func
}

component.contextTypes = {
  actions:  PropTypes.object.isRequired
}

component.displayName = displayName

module.exports = purify(component)
