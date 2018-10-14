// utils
const deepFreeze                = require('deep-freeze')
const toJSON                    = require('enzyme-to-json')

// React
const React                     = require('react')
const {shallow, mount, render}  = require('enzyme')

// Redux
const {compose}                 = require('redux')
const {storeFactory}            = require('redux/store')
const initialState              = require('redux/data/initial_state')
const actions                   = require('redux/actions')

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
