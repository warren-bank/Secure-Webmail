// https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
// https://developer.mozilla.org/en-US/docs/Web/API/Storage

const sessionStorageMock = (function() {
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

Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock })
