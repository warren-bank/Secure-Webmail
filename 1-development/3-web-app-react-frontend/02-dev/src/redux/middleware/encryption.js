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
      allow_update = !!allow_update  // cast to a boolean

      let my_email  = state.user.email_address
      let my_pubkey = state.public_keys[my_email]
      if (my_pubkey) {
        pass = allow_update

        let msg = [
          'WARNING: Redux action "GENERATE_KEYPAIR" was called while the global state contains a "public_key" value obtained from the server which is already associated with the current Google user account.',
          'Updating the associated keypair will cause your mailbox to diverge: (1) the previous "private_key" will be required to decrypt older messages, and (2) the updated "private_key" will be required to decrypt newer messages.',
          'You should only consider updating your keypair if either: (1) you have lost your "private_key" and are no-longer able to read your encrypted messages, or (2) an untrusted 3rd party has gained access to your "private_key".'
        ].join(' ')

        console.log(msg)

        if (allow_update)
          pass = window.confirm(msg + ' Proceed with creation of new keypair?')
        else
          window.alert(msg)
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
