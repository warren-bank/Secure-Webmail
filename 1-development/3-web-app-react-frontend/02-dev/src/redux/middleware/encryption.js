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

    if (state.ui.settings.private_key)
      console.log('WARNING: Redux action "GENERATE_KEYPAIR" was called while the global state contains a "private_key" value. The existing value will be replaced. This operation will fail on the server if a "public_key" is already associated with the current Google user account.')

    dispatch(
      actions.UPDATE_SETTINGS(max_threads_per_page, private_key, private_key_storage)
    )
    dispatch(
      actions.SET_RSA_PUBLIC_KEY(public_key)
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
