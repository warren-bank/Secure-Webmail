const get_shallow_copy = (val) => {
  if (Array.isArray(val))
    return [...val]

  if (val instanceof Object)
    return {...val}

  return val
}

const reduce_hash_table = (state, action, key, is_required) => {
  if (!(state instanceof Object)) return state  // noop
  if (state[key] === action[key]) return state  // noop

  if (is_required && (action[key] === undefined)) return state  // noop

  const new_state = get_shallow_copy( state       )
  const new_value = get_shallow_copy( action[key] )
  new_state[key] = new_value
  return new_state
}

module.exports = reduce_hash_table
