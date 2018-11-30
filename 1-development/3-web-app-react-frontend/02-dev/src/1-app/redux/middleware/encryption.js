const constants  = require('redux/data/constants')
const actions    = require('redux/actions')

const crypto       = require('redux/lib/middleware/crypto')
const {strip_tags} = require('react/lib/sanitize_html')

const C = constants.actions

const RSA = {}
const AES = {}

const FILTER = {}

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
    let {private_key_storage} = state.app.settings

    dispatch(
      actions.SET_RSA_PUBLIC_KEY(public_key, allow_update)
    )
    dispatch(
      actions.SAVE_APP.SETTING.PUBLIC_KEY(public_key)
    )
    dispatch(
      actions.UPDATE_SETTINGS(private_key, private_key_storage)
    )
    dispatch(
      actions.SAVE_APP.SETTING.IS_GENERATING_KEYPAIR(false)
    )
    dispatch(
      actions.RESPOND_TO_USER_EVENT.DOWNLOAD_PRIVATE_KEY(private_key)
    )
  })
  .catch((err) => {})
}

// -----------------------------------------------------------------------------

// throws
FILTER['DECRYPT_MESSAGES_IN_THREAD'] = ({getState, dispatch, next, action}) => {
  if (!action.thread || !Array.isArray(action.thread.messages) || !action.thread.messages.length) return

  const messages     = action.thread.messages
  const summary      = action.thread.summary
  const filename     = {...constants.encryption.RESERVED_ATTACHMENT_NAME}

  const state        = getState()
  const my_email     = state.user.email_address
  const my_pvtkey    = state.app.settings.private_key

  // sanity checks:
  if (!my_email)  throw new Error('Redux state does not contain the email address associated with the current Google user account.')
  if (!my_pvtkey) throw new Error('Redux state does not contain the private RSA encryption key associated with the current Google user account.')

  const update_summary = (msg_index, msg_body) => {
    if ((msg_index === 0) && msg_body) {
      summary.body = strip_tags(msg_body).substring(0, 160)
    }
  }

  for (let i=0; i < messages.length; i++) {
    let contents = messages[i].contents

    if (!contents.attachments || !Array.isArray(contents.attachments) || !contents.attachments.length) {
      update_summary(i, contents.body)
      continue  // next message
    }

    let index_ciphers = contents.attachments.findIndex(attachment => attachment.name === filename.CIPHERS)
    if ((typeof index_ciphers !== 'number') || (index_ciphers < 0)) {
      update_summary(i, contents.body)
      continue  // next message
    }

    // intercept and ignore problems with individual messages. when in doubt, allow the message to pass through without decryption.
    try {
      const new_contents = {body: '', attachments: []}

      const ciphers = JSON.parse( contents.attachments[index_ciphers]['data'] )
      if (!ciphers || (typeof ciphers !== 'object')) throw new Error(`Attachment "${filename.CIPHERS}" in message #${i+1} of thread ID "${action.thread_id}" contains invalid JSON and could not be parsed.`)

      const cipher = ciphers[my_email]
      if (!cipher || (typeof cipher !== 'string')) throw new Error(`Attachment "${filename.CIPHERS}" in message #${i+1} of thread ID "${action.thread_id}" does not include an RSA encrypted cipher for the current Google user account.`)

      const secret = crypto.RSA.decrypt(cipher, my_pvtkey)
      if ((typeof secret !== 'string') || (secret.length !== crypto.AES.key_size)) throw new Error('RSA decryption failed')

      for (let j=0; j < contents.attachments.length; j++) {
        if (j === index_ciphers) continue  // next attachment

        let attachment   = contents.attachments[j]
        let {data, name} = attachment

        let cleartext = crypto.AES.decrypt(data, secret)

        if (name === filename.BODY) {
          new_contents.body = cleartext

          update_summary(i, cleartext)
        }
        else {
          name = name.replace(/\.txt$/, '')
          name = name.replace('-', '/')
          name = window.atob(name)
          name = crypto.AES.decrypt(name, secret)

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
      update_summary(i, contents.body)
      continue  // next message
    }
  }
}

// -----------------------------------------------------------------------------

// throws
FILTER['ENCRYPT_OUTBOUND_MESSAGE'] = ({getState, dispatch, next, action}) => {
  const {recipient, body, cc, attachments} = action
  const state = getState()

  if (!recipient || !body || !body.text_message) return

  let all_emails = [recipient, state.user.email_address]
  if (cc) {
    if (typeof cc === 'string')
      all_emails.push(cc)
    else if (Array.isArray(cc) && cc.length)
      all_emails = [...all_emails, ...cc]
  }

  // pass #1
  const no_pubkey = []
  all_emails.forEach(email => {
    let pubkey = state.public_keys[email]
    if (!pubkey) {
      no_pubkey.push(email)
    }
  })

  // add error code to Redux state, throw (to prevent `next(action)` from being called)
  if (no_pubkey.length) {
    let error_message_txt = `The following email address${ (no_pubkey.length > 1) ? 'es are' : ' is' } not associated with a public encryption key:` + ' "' + no_pubkey.join('", "') + '"'
    let error_message_htm = `<div class="encryption_error">The following email address${ (no_pubkey.length > 1) ? 'es are' : ' is' } not associated with a public encryption key:` + ((no_pubkey.length > 1) ? ('<ul class="count_many"><li>' + no_pubkey.join('</li><li>') + '</li></ul>') : ` <span class="count_one">"${no_pubkey[0]}"</span>`) + '</div>'
    let err = new Error(error_message_txt)
    err.error_message = error_message_htm
    err.DRAFT_MESSAGE = true
    throw err
  }

  const secret          = crypto.AES.generate_secret()
  const filename        = {...constants.encryption.RESERVED_ATTACHMENT_NAME}
  const new_attachments = []
  const action_update   = {}

  // pass #2
  const ciphers = {}
  all_emails.forEach(email => {
    let pubkey = state.public_keys[email]
    ciphers[email] = crypto.RSA.encrypt(secret, pubkey)
  })

  // attach: CIPHERS
  new_attachments.push({
    data:         JSON.stringify(ciphers),
    contentType: 'text/plain',
    name:        filename.CIPHERS
  })

  // attach: BODY
  new_attachments.push({
    data:         crypto.AES.encrypt(body.text_message, secret),
    contentType: 'text/plain',
    name:        filename.BODY
  })

  if (attachments && Array.isArray(attachments) && attachments.length) {
    attachments.forEach(attachment => {
      let {data, name} = attachment

      data = crypto.AES.encrypt(data, secret)
      name = crypto.AES.encrypt(name, secret)
      name = window.btoa(name)
      name = name.replace('/', '-')
      name = name + '.txt'

      // attach
      new_attachments.push({
        data,
        contentType: 'text/plain',
        name
      })
    })
  }

  action_update.body        = constants.encryption.CLEARTEXT_CONTENT.BODY
  action_update.attachments = new_attachments

  // monkey patch the `action` object that propogates down the middleware chain toward the Redux reducer
  Object.assign(action, action_update)
}

// -----------------------------------------------------------------------------

const CRYPTO_middleware = ({getState, dispatch}) => next => action => {
  switch (action.type) {

    case C.CRYPTO.RSA.GENERATE_KEYPAIR:
      RSA.GENERATE_KEYPAIR({getState, dispatch, next, action})
      break

    case C.SAVE_THREAD:
      try {
        FILTER.DECRYPT_MESSAGES_IN_THREAD({getState, dispatch, next, action})
        next(action)
      }
      catch(err) {
        dispatch(
          actions.LOG_DEBUG_MESSAGE('ERROR: "DECRYPT_MESSAGES_IN_THREAD"', err.message)
        )
      }
      break

    case C.SEND_EMAIL.REPLY:
    case C.SEND_EMAIL.NEW_MESSAGE:
      try {
        FILTER.ENCRYPT_OUTBOUND_MESSAGE({getState, dispatch, next, action})
        next(action)
      }
      catch(err) {
        dispatch(
          actions.LOG_DEBUG_MESSAGE('ERROR: "ENCRYPT_OUTBOUND_MESSAGE"', err.message)
        )
        dispatch(
          actions.SAVE_APP.DRAFT_MESSAGE.SET_STATUS(4, err.error_message || err.message)  // SENT_ERROR
        )
      }
      break

    default:
      next(action)
  }
}

module.exports = CRYPTO_middleware
