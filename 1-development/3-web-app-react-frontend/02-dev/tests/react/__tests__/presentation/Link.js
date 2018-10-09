import Link from 'Link'

const {shallow} = enzyme

const get_component = active => {
    let onClick   = jest.fn().mockName('onClick')
    let children  = active ? 'on' : 'off'
    let props     = {active, onClick}
    let component = <Link {...props}>{children}</Link>
    return {...props, component, children}
}

describe('React stateless presentation component: Link', function() {

  // ===================================
  it('should render content when active', function() {
    let {component} = get_component(true)
    let wrapper  = shallow(component)
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('should render <span> when active', function() {
    let {component} = get_component(true)
    let wrapper  = shallow(component)
    expect(wrapper.type()).toBe('span')
  })

  it('should render {children} when active', function() {
    let {component, children} = get_component(true)
    let wrapper  = shallow(component)
    expect(wrapper.text()).toBe(children)
  })

  it('should not handle "click" events when active', function() {
    let {component, onClick} = get_component(true)
    let wrapper  = shallow(component)
    let event = {preventDefault: ()=>{}}
    wrapper.simulate('click', event)
    expect(onClick).not.toHaveBeenCalled()
  })

  // ===================================
  it('should render content when inactive', function() {
    let {component} = get_component(false)
    let wrapper  = shallow(component)
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('should render <a> when inactive', function() {
    let {component} = get_component(false)
    let wrapper  = shallow(component)
    expect(wrapper.type()).toBe('a')
  })

  it('should render {children} when inactive', function() {
    let {component, children} = get_component(false)
    let wrapper  = shallow(component)
    expect(wrapper.text()).toBe(children)
  })

  it('should handle "click" events when inactive', function() {
    let {component, onClick} = get_component(false)
    let wrapper  = shallow(component)
    let event = {preventDefault: ()=>{}}
    wrapper.simulate('click', event)
    expect(onClick).toHaveBeenCalled()
  })

})
