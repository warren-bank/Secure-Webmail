const generate_random_string = (length=10) => {
  if ((typeof length !== 'number') || (length <= 0)) length = 10
  let str = ''
  while (str.length < length)
    str += Math.random().toString(36).substring(2, 15)
  str = str.substring(0, length)
  return str
}

module.exports = generate_random_string
