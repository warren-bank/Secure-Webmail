// https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
// https://developer.mozilla.org/en-US/docs/Web/API/Storage

const localStorageMock = (function() {
  let store = {}
  return {
    getItem: function(key) {
      return store[key]
    },
    setItem: function(key, value) {
      store[key] = value.toString()
    },
    removeItem: function(key) {
      delete store[key]
    },
    clear: function() {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })
