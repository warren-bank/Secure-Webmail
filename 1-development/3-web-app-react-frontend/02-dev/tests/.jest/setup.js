// --------------------------------------------------
// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// --------------------------------------------------
// additional globals:
{
  let {compose}         = redux
  let {shallow, toJSON} = enzyme

  global.enzyme.expectJSX = compose(expect, toJSON, shallow)
}
