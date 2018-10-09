// could either aggregate all of the actions into an Object from a single ES6 module that exports multiple actions:
import * as actions from './actions'

// or..
// could import actions from multiple modules and manually aggregate them into the "actions" Object

export default actions
