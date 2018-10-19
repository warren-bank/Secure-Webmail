const React       = require('react')
const PropTypes   = require('prop-types')

const purify      = require('react/components/higher-order/purify')
const displayName = 'Settings'

const component   = ({settings}, {actions}) => {

  const save_settings = (e) => {
    e.preventDefault()

    const form                 = e.target
    const max_threads_per_page = Number( form.max_threads_per_page.value )
    const private_key          = form.private_key.value
    const private_key_storage  = Number( form.private_key_storage.value )

    if (
         (settings.max_threads_per_page !== max_threads_per_page)
      || (settings.private_key          !== private_key)
      || (settings.private_key_storage  !== private_key_storage)
    ) {
      actions.UPDATE_SETTINGS(max_threads_per_page, private_key, private_key_storage)
    }
  }

  const get_private_key_storage_options = () => {
    const descriptions = [
      'Do not store private key',
      'Use "sessionStorage" to store private key',
      'Use "localStorage" to store private key'
    ]
    const options = descriptions.map((txt, val) => {
      let selected = (Number(settings.private_key_storage) === val)
      return (
        <option value={val} key={val} selected={selected}>{txt}</option>
      )
    })
    return options
  }

  return (
    <div className={`top-component ${displayName.toLowerCase()}`}>
      <form onSubmit={save_settings} >
        <label for="max_threads_per_page">Number of thread summaries to display in paginated folder list:</label>
        <input id="max_threads_per_page" name="max_threads_per_page" type="number" value={settings.max_threads_per_page} />

        <label for="private_key">Private RSA Encryption Key:</label>
        <textarea id="private_key" name="private_key">{settings.private_key}</textarea>

        <label for="private_key_storage">Storage Private Key:</label>
        <select id="private_key_storage" name="private_key_storage">
          {get_private_key_storage_options()}
        </select>

        <button type="submit">Save Settings</button>
      </form>
    </div>
  )
}

component.propTypes = {
  settings: PropTypes.object.isRequired
}

component.requireActions = ['UPDATE_SETTINGS']

component.displayName = displayName

module.exports = purify(component)
