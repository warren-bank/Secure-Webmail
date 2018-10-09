// utils
import deepFreeze               from 'deep-freeze'
import toJSON                   from 'enzyme-to-json'

// React
import React                    from 'react'
import {shallow, mount, render} from 'enzyme'

// Redux
import {compose}                from 'redux'
import {storeFactory}           from 'redux/store'
import initialState             from 'redux/data/initial_state'
import actions                  from 'redux/actions'

Object.assign(global, {
  deepFreeze,
  React,
  enzyme: {
    shallow,
    mount,
    render,
    toJSON
  },
  redux: {
    compose,
    storeFactory,
    initialState,
    actions
  }
})
