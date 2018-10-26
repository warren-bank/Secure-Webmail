const React       = require('react')

const purify      = require('react/components/higher-order/purify')
const displayName = 'About'

const component = () => {
  return (
    <div className={`top-component ${displayName.toLowerCase()}`}>
      Encryption is your friend!
    </div>
  )
}

component.displayName = displayName

module.exports = purify(component)
