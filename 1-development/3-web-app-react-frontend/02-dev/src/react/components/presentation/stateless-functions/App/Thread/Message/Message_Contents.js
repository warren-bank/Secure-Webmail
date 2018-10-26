const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Message_Contents'

const Message_Attachment  = require(`./${displayName}/Message_Attachment`)

const component = ({contents}) => {

  const Attachments = contents.attachments.map((attachment, i) => (
    <Message_Attachment key={i} attachment={attachment} />
  ))

  return (
    <div className={`component ${displayName.toLowerCase()}`}>
      <div className="body">
        {contents.body}
      </div>
      <div className="attachments">
        {Attachments}
      </div>
    </div>
  )
}

component.propTypes = {
  contents:  PropTypes.object.isRequired
}

component.displayName = displayName

module.exports = purify(component)
