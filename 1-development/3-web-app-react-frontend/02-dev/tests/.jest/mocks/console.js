// https://developer.mozilla.org/en-US/docs/Web/API/Console
// https://developer.mozilla.org/en-US/docs/Web/API/Window/console

const noop = () => 1

const consoleMock = {
  assert:          noop,
  clear:           noop,
  count:           noop,
  countReset:      noop,
  debug:           noop,
  dir:             noop,
  dirxml:          noop,
  error:           noop,
  exception:       noop,
  group:           noop,
  groupCollapsed:  noop,
  groupEnd:        noop,
  info:            noop,
  log:             noop,
  profile:         noop,
  profileEnd:      noop,
  table:           noop,
  time:            noop,
  timeEnd:         noop,
  timeLog:         noop,
  timeStamp:       noop,
  trace:           noop,
  warn:            noop
}

Object.defineProperty(window, 'console', { value: consoleMock })
