const consoleMock = {
  log(){}
}

Object.defineProperty(window, 'console', { value: consoleMock })
