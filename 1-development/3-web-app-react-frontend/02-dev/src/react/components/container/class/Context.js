const React      = require('react')
const PropTypes  = require('prop-types')

class Context extends React.Component {
    getChildContext() {
        const {store, constants} = this.props
        const actions            = {}

        // helper: in={key:val} out=[[key,val]]
        const entries = (obj) => Object.keys(obj).map(key => [key, obj[key]])

        entries(this.props.actions).map(([key, action]) => {
            actions[key] = (...args) => store.dispatch(action(...args))
        })

        return {
            store,
            actions,
            constants
        }
    }

    componentWillMount() {
        let {store} = this.props
        this.unsubscribe = store.subscribe(
            () => this.forceUpdate()
        )
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    render() {
        const {component: Component, store} = this.props
        const state = store.getState()
        return <Component state={state} />
    }
}

Context.propTypes = {
    store:     PropTypes.object.isRequired,
    actions:   PropTypes.object.isRequired,
    constants: PropTypes.object,
    component: PropTypes.oneOfType([
               PropTypes.func,
               PropTypes.instanceOf(React.Component)
               ]).isRequired
}

Context.defaultProps = {
    constants: {}
}

Context.childContextTypes = {
    store:     PropTypes.object.isRequired,
    actions:   PropTypes.object.isRequired,
    constants: PropTypes.object.isRequired
}

module.exports = Context
