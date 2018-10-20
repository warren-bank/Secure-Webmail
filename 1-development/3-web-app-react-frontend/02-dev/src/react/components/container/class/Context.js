const React      = require('react')
const PropTypes  = require('prop-types')

class Context extends React.Component {
    getChildContext() {
        const {store, constants, history} = this.props
        const actions = {}

        // helper: in={key:val} out=[[key,val]]
        const entries = (obj) => Object.keys(obj).map(key => [key, obj[key]])

        // recursive (if needed)
        const get_auto_dispatch_actions = (obj_in, obj_out) => {
            const arr_in = entries(obj_in)
            arr_in.forEach(([key, action]) => {
                if (typeof action === 'function') {
                    obj_out[key] = (...args) => store.dispatch(action(...args))
                }
                else if ((typeof action === 'object') && (action !== null)) {
                    obj_out[key] = {}
                    get_auto_dispatch_actions(action, obj_out[key])
                }
            })
        }

        get_auto_dispatch_actions(this.props.actions, actions)

        return {
            store,
            actions,
            constants,
            history
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
    history:   PropTypes.object.isRequired,
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
    constants: PropTypes.object.isRequired,
    history:   PropTypes.object.isRequired
}

module.exports = Context
