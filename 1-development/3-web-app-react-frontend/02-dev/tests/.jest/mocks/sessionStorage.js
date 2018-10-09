// https://stackoverflow.com/questions/32911630

const sessionStorageMock = (function() {
  let store = {}
  return {
    getItem: function(key) {
      return store[key]
    },
    setItem: function(key, value) {
      store[key] = value.toString()
    },
    clear: function() {
      store = {}
    },
    removeItem: function(key) {
      delete store[key]
    }
  }
})()

Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock })
