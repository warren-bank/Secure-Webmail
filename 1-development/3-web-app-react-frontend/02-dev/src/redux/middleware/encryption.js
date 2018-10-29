const constants  = require('redux/data/constants')
const actions    = require('redux/actions')

const crypto     = require('redux/lib/middleware/crypto')

const C = constants.actions

const RSA = {}
const AES = {}

const FILTER = {}
const HELPER = {}

// -----------------------------------------------------------------------------

RSA['GENERATE_KEYPAIR'] = ({getState, dispatch, next, action}) => {
  dispatch(
    actions.SAVE_APP.SETTING.IS_GENERATING_KEYPAIR(true)
  )

  crypto.RSA.generate_keypair()
  .then(({public_key, private_key}) => {

    let {allow_update}        = action
    allow_update              = !!allow_update  // cast to a boolean

    let state                 = getState()
    let max_threads_per_page  = 0  // "SETTINGS_middleware" only updates positive integer values
    let {private_key_storage} = state.app.settings

    dispatch(
      actions.SET_RSA_PUBLIC_KEY(public_key, allow_update)
    )
    dispatch(
      actions.SAVE_APP.SETTING.PUBLIC_KEY(public_key)
    )
    dispatch(
      actions.UPDATE_SETTINGS(max_threads_per_page, private_key, private_key_storage)
    )
    dispatch(
      actions.SAVE_APP.SETTING.IS_GENERATING_KEYPAIR(false)
    )
  })
  .catch((err) => {})
}

// -----------------------------------------------------------------------------

FILTER['DECRYPT_MESSAGES_IN_THREAD'] = ({getState, dispatch, next, action}) => {
  if (!action.thread || !Array.isArray(action.thread.messages) || !action.thread.messages.length) return

  const messages     = action.thread.messages
  const filename     = {...constants.encryption.RESERVED_ATTACHMENT_NAME}

  const state        = getState()
  const my_email     = state.user.email_address
  const my_pvtkey    = state.app.settings.private_key

  // sanity checks:
  if (!my_email)  throw new Error('ERROR: Redux action "DECRYPT_MESSAGES_IN_THREAD" requires that the global state contain the email address associated with the current Google user account.')
  if (!my_pvtkey) throw new Error('ERROR: Redux action "DECRYPT_MESSAGES_IN_THREAD" requires that the global state contain the private RSA encryption key associated with the current Google user account.')

  for (let i=0; i < messages.length; i++) {
    let contents = messages[i].contents

    if (!contents.attachments || !Array.isArray(contents.attachments) || !contents.attachments.length) continue  // next message

    let index_ciphers = contents.attachments.findIndex(attachment => attachment.name === filename.CIPHERS)
    if ((typeof index_ciphers !== 'number') || (index_ciphers < 0)) continue  // next message

    try {
      const new_contents = {body: '', attachments: []}

      const ciphers = JSON.parse( contents.attachments[index_ciphers]['data'] )
      if (!ciphers || (typeof ciphers !== 'object')) throw ''

      const cipher = ciphers[my_email]
      if (!cipher || (typeof cipher !== 'string')) throw ''

      const secret = crypto.RSA.decrypt(cipher, my_pvtkey)
      if (!secret || (typeof secret !== 'string') || (secret.length !== 256)) throw ''

      for (let j=0; j < contents.attachments.length; j++) {
        if (j === index_ciphers) continue  // next attachment

        let attachment   = contents.attachments[j]
        let {data, name} = attachment

        let cleartext = crypto.AES.decrypt(data, secret)

        if (name === filename.BODY) {
          new_contents.body = cleartext
        }
        else {
          const new_attachment = {
            data:        cleartext,                                      // data URI format: 'data:[<mediatype>][;base64],<data>'
            contentType: cleartext.substring(5, cleartext.indexOf(';')),
            name
          }
          new_contents.attachments.push(new_attachment)
        }
      }

      messages[i].contents = new_contents
    }
    catch(err) {
      continue  // next message
    }
  }
}

// -----------------------------------------------------------------------------

HELPER['ENCRYPT_OUTBOUND_MESSAGE'] = ({recipient, body, cc, attachments}, getState) => {
  const action_update = {}

  if (!recipient || !body) return action_update

  const new_attachments = []

  const secret     = crypto.AES.generate_secret()
  const state      = getState()
  const filename   = {...constants.encryption.RESERVED_ATTACHMENT_NAME}

  let all_emails   = [recipient, state.user.email_address]
  if (cc) {
    if (typeof cc === 'string')
      all_emails.push(cc)
    else if (Array.isArray(cc) && cc.length)
      all_emails = [...all_emails, ...cc]
  }

  const ciphers   = {}
  const no_pubkey = []
  all_emails.forEach(email => {
    let pubkey = state.public_keys[email]

    if (!pubkey) {
      no_pubkey.push(email)
    }
    else {
      ciphers[email] = crypto.RSA.encrypt(secret, pubkey)
    }
  })

  if (no_pubkey.length)
    console.log('WARNING: Redux action "ENCRYPT_OUTBOUND_MESSAGE" cannot encrypt ciphers for the following recipient email addresses because they are not associated with a public RSA encryption key:', no_pubkey)

  // attach: CIPHERS
  new_attachments.push({
    data:         JSON.stringify(ciphers),
    contentType: 'text/plain',
    name:        filename.CIPHERS
  })

  // attach: BODY
  new_attachments.push({
    data:         crypto.AES.encrypt(body, secret),
    contentType: 'text/plain',
    name:        filename.BODY
  })

  if (attachments && Array.isArray(attachments) && attachments.length) {
    attachments.forEach(attachment => {
      let {data, name} = attachment

      // attach
      new_attachments.push({
        data:         crypto.AES.encrypt(data, secret),
        contentType: 'text/plain',
        name
      })
    })
  }

  action_update.body        = constants.encryption.CLEARTEXT_CONTENT.BODY
  action_update.attachments = new_attachments

  return action_update
}

FILTER['ENCRYPT_OUTBOUND_MESSAGE'] = ({getState, dispatch, next, action}) => {
  const action_update = HELPER.ENCRYPT_OUTBOUND_MESSAGE(action, getState)
  Object.assign(action, action_update)
}

// -----------------------------------------------------------------------------

const CRYPTO_middleware = ({getState, dispatch}) => next => action => {
  switch (action.type) {

    case C.CRYPTO.RSA.GENERATE_KEYPAIR:
      RSA.GENERATE_KEYPAIR({getState, dispatch, next, action})
      break

    case C.SAVE_THREAD:
      FILTER.DECRYPT_MESSAGES_IN_THREAD({getState, dispatch, next, action})
      next(action)
      break

    case C.SEND_EMAIL.REPLY:
    case C.SEND_EMAIL.NEW_MESSAGE:
      FILTER.ENCRYPT_OUTBOUND_MESSAGE({getState, dispatch, next, action})
      next(action)
      break

    default:
      next(action)
  }
}

module.exports = CRYPTO_middleware
