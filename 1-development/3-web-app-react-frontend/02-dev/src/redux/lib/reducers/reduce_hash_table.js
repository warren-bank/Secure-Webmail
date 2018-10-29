const reduce_hash_table = (state, action, key, is_required) => {
  if (state[key] === action[key]) return state  // noop

  if (is_required && (action[key] === undefined)) return state  // noop

  const new_state = {...state}
  new_state[key] = action[key]
  return new_state
}

module.exports = reduce_hash_table
