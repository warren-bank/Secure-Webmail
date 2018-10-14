const constants  = require('redux/data/constants')
const actions    = require('redux/actions')

const crypto     = require('./lib/crypto')

const C = constants.actions

const RSA = {}
const AES = {}

// -----------------------------------------------------------------------------

RSA['GENERATE_KEYPAIR'] = ({getState, dispatch, next, action}) => {
  crypto.RSA.generate_keypair()
  .then(({public_key, private_key}) => {

    let state                 = getState()
    let max_threads_per_page  = 0  // "SETTINGS_middleware" only updates positive integer values
    let {private_key_storage} = state.ui.settings

    let sanity_check = () => {
      let pass = true

      let {allow_update} = action
      if (allow_update) return pass

      let my_email  = state.user.email_address
      let my_pubkey = state.public_keys[my_email]
      if (my_pubkey) {
        pass = false

        let msg = 'WARNING: Redux action "GENERATE_KEYPAIR" was called while the global state contains a "public_key" value obtained from the server which is already associated with the current Google user account. This association is permanent; keypairs cannot be changed, otherwise all previously encrypted messages would become unrecoverable.'
        console.log(msg)
        alert(msg)
      }

      if (pass && state.ui.settings.private_key)
        console.log('WARNING: Redux action "GENERATE_KEYPAIR" was called while the global state contains a "private_key" value. The existing value will be replaced. This operation will fail on the server if a "public_key" is already associated with the current Google user account.')

      return pass
    }
    if (! sanity_check()) return

    dispatch(
      actions.UPDATE_SETTINGS(max_threads_per_page, private_key, private_key_storage)
    )
    dispatch(
      actions.SET_RSA_PUBLIC_KEY(public_key, allow_update)
    )
  })
  .catch(() => {})
}

// -----------------------------------------------------------------------------

const CRYPTO_middleware = ({getState, dispatch}) => next => action => {
  switch (action.type) {

    case C.CRYPTO.RSA.GENERATE_KEYPAIR:
      RSA.GENERATE_KEYPAIR({getState, dispatch, next, action})
      break

    default:
      next(action)
  }
}

module.exports = CRYPTO_middleware
