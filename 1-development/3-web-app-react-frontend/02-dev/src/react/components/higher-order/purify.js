const React      = require('react')
const PropTypes  = require('prop-types')

const resizeParentIframe = require('react/lib/resizeParentIframe').global_resizeParentIframe

const purify = function(stateless_func) {
    const postRender = () => {
        let key = 'postRender'
        let val = stateless_func[key]
        if (typeof val === 'function') {
            val()
        }
        else {
            resizeParentIframe()
        }
    }

    class PureComponentWrap extends React.PureComponent {

        // validate that the application includes an action creator for each "action" the stateless function needs the ability to dispatch
        componentWillMount() {
            let validate_action = action => {
                let {actions} = this.context
                if ((actions instanceof Object) && (actions[action] !== undefined)) return true

                let name = stateless_func.displayName || stateless_func.name || '[anonymous]'
                throw new Error(`React stateless presentation component "${name}" requires a Redux action creator "${action}" which is not defined in the context of the React component tree`)
            }
            let key = 'requireActions'
            let val = stateless_func[key]
            if (val instanceof Array) {
                val.forEach(action => validate_action(action))
            }
            else if (typeof val === 'string') {
                validate_action(val)
            }
        }

        // only called by the update lifecycle when "props" have changed
        render() {
            return stateless_func(this.props, this.context)
        }

        componentDidMount() {
            postRender()
        }

        componentDidUpdate() {
            postRender()
        }
    }

    PureComponentWrap.contextTypes = {
        store:     PropTypes.object,
        actions:   PropTypes.object,
        constants: PropTypes.object,
        history:   PropTypes.object,
          //   - <Context> creates the child context: {store, actions, constants, history}
        router:    PropTypes.object
          // https://github.com/search?type=Commits&q=context+repo:ReactTraining/react-router
          // https://github.com/ReactTraining/react-router/commit/b18b9dd418a12f3c175e71dece289ead22ef9a09
          //   - version 4.0.0-beta.7
          //     * old context: {history}
          //     * new context: {router: {history}}
    };

    ["propTypes", "defaultProps"].forEach(key => {
        let val = stateless_func[key]
        if (val instanceof Object) {
            PureComponentWrap[key] = val
        }
    })

    {
        let key = 'displayName'
        let val = (stateless_func[key] || "").trim()
        if (val) {
            // enforce rule that first character must be uppercase.
            // this convention allows the component to be found by its "displayName" with a selector in "Enzyme".
            val = val[0].toUpperCase() + val.substr(1)

            PureComponentWrap[key] = val
        }
    }

    return PureComponentWrap
}

module.exports = purify

/* ---------------------------------------------------------
 * usage:
 * ======
 * 
 * const Component = (props, context) => {
 *     let {store, actions, constants} = context
 * 
 *     actions.INCREMENT_COUNTER(1)
 * 
 *     store.dispatch({type: 'INCREMENT_COUNTER', count: 1})
 * 
 *     return <pre>{JSON.stringify(store.getState())}</pre>
 * }
 * 
 * Component.propTypes    = {}
 * Component.defaultProps = {}
 * Component.displayName  = "Presentation Component"
 * 
 * const PureComponent = purify(Component)
 * 
 * --------------------------------------------------------- */
