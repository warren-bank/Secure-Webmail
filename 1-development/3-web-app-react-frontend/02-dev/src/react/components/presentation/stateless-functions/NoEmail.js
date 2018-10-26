const React       = require('react')

const purify      = require('react/components/higher-order/purify')
const displayName = 'NoEmail'

const component = () => {
  return (
    <div className={`top-component ${displayName.toLowerCase()}`}>
      Please log into a Google account.
    </div>
  )
}

component.displayName = displayName

module.exports = purify(component)
