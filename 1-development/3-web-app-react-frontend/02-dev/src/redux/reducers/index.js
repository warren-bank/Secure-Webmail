const {combineReducers}  = require('redux')

const folders            = require('./folders')
const threads_in_folder  = require('./threads_in_folder')
const threads            = require('./threads')
const user               = require('./user')
const public_keys        = require('./public_keys')
const ui                 = require('./app/ui')
const settings           = require('./app/settings')

const rootReducer = combineReducers({
  folders,
  threads_in_folder,
  threads,
  user,
  public_keys,
  app: combineReducers({
    ui,
    settings
  })
})

module.exports = rootReducer
