const React      = require('react')
const PropTypes  = require('prop-types')

const purify     = require('react/components/higher-order/purify')

const Link = ({active, children, onClick}, context) => {
  if (active) {
    return <span>{children}</span>
  }

  return (
    <a
      href=""
      onClick={e => {
        e.preventDefault()
        onClick()
      }}
    >
      {children}
    </a>
  )
}

Link.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
}

Link.displayName = 'Link'

module.exports = purify(Link)
