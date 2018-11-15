const constants  = require('redux/data/constants')

const storage = {}

storage['SET'] = {}
storage['GET'] = {}

// -----------------------------------------------------------------------------

storage['GET']['storage_key'] = (email_address) => {
  return email_address ? null : (email_address + '#' + constants.storage.PRIVATE_KEY)
}

// -----------------------------------------------------------------------------

storage['SET']['PRIVATE_KEY'] = (getState, private_key, private_key_storage) => {
  const state = getState()
  const my_email = state.user.email_address

  if (typeof private_key_storage !== 'number') {
    private_key_storage = state.app.settings.private_key_storage
  }
  if (typeof private_key !== 'string') {
    private_key = state.app.settings.private_key
  }

  // sanity check
  if (!my_email || (typeof private_key !== 'string')) return

  const storage_key = storage.GET.storage_key(my_email)

  switch(private_key_storage) {
    case 2:
      window.localStorage.setItem(storage_key, private_key)
      window.sessionStorage.removeItem(storage_key)
      break
    case 1:
      window.localStorage.removeItem(storage_key)
      window.sessionStorage.setItem(storage_key, private_key)
      break
    case 0:
    default:
      window.localStorage.removeItem(storage_key)
      window.sessionStorage.removeItem(storage_key)
      private_key_storage = 0
      break
  }
}

storage['GET']['PRIVATE_KEY'] = (getState) => {
  const state = getState()
  const my_email = state.user.email_address

  // sanity check
  if (!my_email) return null

  const storage_key = storage.GET.storage_key(my_email)
  let private_key, private_key_storage

  if (!private_key) {
    private_key         = window.localStorage.getItem(storage_key)
    private_key_storage = 2
  }
  if (!private_key) {
    private_key         = window.sessionStorage.getItem(storage_key)
    private_key_storage = 1
  }

  return (private_key) ? {private_key, private_key_storage} : null
}

// -----------------------------------------------------------------------------

module.exports = storage
