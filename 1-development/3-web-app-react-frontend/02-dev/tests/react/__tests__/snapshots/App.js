import App       from 'App'
import constants from 'react/data/constants'

const {initialState} = redux
const {expectJSX}    = enzyme

describe('[snapshot] React stateless presentation component: App', function() {

  it('should render static JSX for the initial Redux state', function() {
    let component = <App state={initialState} />
    let context   = {constants}

    expectJSX(component, {context}).toMatchSnapshot()
  })

})
