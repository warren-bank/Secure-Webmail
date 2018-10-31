const crypto = {AES: {}, RSA: {}}

crypto.AES.key_size = 245

crypto.AES.generate_secret = () => {
  const key_size = crypto.AES.key_size
  const buffer = []
  for (let offset=0; (offset + 16) <= key_size; offset+=16) {
    uuidv4(null, buffer, offset)
  }

  let secret = String.fromCharCode(...buffer)
  return secret
}

crypto.RSA.encrypt = (cleartext, public_key) => {
  let js_crypt = new JSEncrypt()
  js_crypt.setPublicKey(public_key)

  let crypted = js_crypt.encrypt(cleartext)
  if (!crypted) throw new Error('RSA encryption failed')

  return crypted
}

// throws
crypto.RSA.decrypt = (crypted, private_key) => {
  let js_crypt = new JSEncrypt()
  js_crypt.setPrivateKey(private_key)

  let cleartext = js_crypt.decrypt(crypted)
  if (!cleartext) throw new Error('RSA decryption failed')

  return cleartext
}

let root

const log = (...msg) => {
  msg = msg.join(' ')

  console.log(msg)

  let el = document.createElement('p')
  el.textContent = msg
  root.appendChild(el)
}

window.onload = () => {
  try {
    root = document.getElementById('root')

    let {public_key, private_key} = window.mock_data.RSA_keypair

    let cleartext = crypto.AES.generate_secret()
    log('AES secret [cleartext]:', cleartext)

    let crypted = crypto.RSA.encrypt(cleartext, public_key)
    log('AES secret [crypted]:', crypted)

    let uncrypted = crypto.RSA.decrypt(crypted, private_key)
    log('AES secret [uncrypted]:', uncrypted)

    log( (uncrypted === cleartext) ? 'SUCCESS' : 'FAILURE' )
  }
  catch(err) {
    log('ERROR:', err.message)
  }
}
