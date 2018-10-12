import { combineReducers } from 'redux'

import folders           from './folders'
import threads_in_folder from './threads_in_folder'
import threads           from './threads'
import user              from './user'
import public_keys       from './public_keys'
import ui                from './ui'

const rootReducer = combineReducers({
  folders,
  threads_in_folder,
  threads,
  user,
  public_keys,
  ui
})

export default rootReducer
