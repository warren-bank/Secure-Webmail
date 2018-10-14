// --------------------------------------------------
// setup file
const {configure}  = require('enzyme')
const Adapter      = require('enzyme-adapter-react-16')

configure({ adapter: new Adapter() })

// --------------------------------------------------
// additional globals:
{
  let {compose}         = redux
  let {shallow, toJSON} = enzyme

  global.enzyme.expectJSX = compose(expect, toJSON, shallow)
}
