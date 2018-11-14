const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Message_Attachment'

const {get_data_url, download_data_url}  = require('react/lib/download_data_url')

const component = ({attachment}) => {

  const open_attachment = event => {
    event.stopPropagation()
    event.preventDefault()

    let dataurl = get_data_url(attachment.data, attachment.contentType)

    download_data_url(dataurl, attachment.name)
  }

  return (
    <div className={`component ${displayName.toLowerCase()}`} onClick={open_attachment} >
      <span className="icon"></span>
      <span className="name">{attachment.name}</span>
    </div>
  )
}

component.propTypes = {
  attachment:  PropTypes.object.isRequired
}

component.displayName = displayName

module.exports = purify(component)
