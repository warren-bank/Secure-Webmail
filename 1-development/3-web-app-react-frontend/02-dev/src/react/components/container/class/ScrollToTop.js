const React       = require('react')
const PropTypes   = require('prop-types')

const displayName = 'ScrollToTop'

class ScrollToTop extends React.Component {

  // =======================================================
  // https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/guides/scroll-restoration.md
  // =======================================================

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children || null
  }
}

ScrollToTop.propTypes = {
  location:  PropTypes.string.isRequired,
  children:  PropTypes.instanceOf(React.Component)
}

module.exports = ScrollToTop
