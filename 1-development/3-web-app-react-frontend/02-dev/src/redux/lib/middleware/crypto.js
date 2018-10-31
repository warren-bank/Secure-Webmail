const JSEncrypt = window.JSEncrypt  // external dependency (RSA)
const CryptoJS  = window.CryptoJS   // external dependency (AES)
const uuidv4    = window.uuidv4     // external dependency

const crypto = {}

// -----------------------------------------------------------------------------

crypto.RSA = {}

/* =================================== *
 * return: Promise                     *
 * resolves: {public_key, private_key} *
 * =================================== *
 */
crypto.RSA.generate_keypair = () => {
  return new Promise((resolve, reject) => {
    const key_size = 2048  // options: [512,1024,2048,4096]
                           // reading: https://en.wikipedia.org/wiki/Key_size#Asymmetric_algorithm_key_lengths
    const js_crypt = new JSEncrypt({default_key_size: key_size})

    js_crypt.getKey(() => {
      let public_key  = js_crypt.getPublicKey()
      let private_key = js_crypt.getPrivateKey()

      resolve( {public_key, private_key} )
    })
  })
}

// throws
crypto.RSA.get_public_key = (private_key) => {
  let js_crypt = new JSEncrypt()
  js_crypt.setPrivateKey(private_key)

  let public_key = js_crypt.getPublicKey()
  return public_key
}

// throws
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

// -----------------------------------------------------------------------------

crypto.AES = {}

// (256 - 11): the maximum string length that a 2048-bit RSA key will encrypt
// RSA lib:    https://github.com/travist/jsencrypt/blob/v3.0.0-rc.1/bin/jsencrypt.js#L2850
// reading:    https://en.wikipedia.org/wiki/Key_size#Symmetric_algorithm_key_lengths
crypto.AES.key_size = 245

crypto.AES.generate_secret = () => {
  const key_size = crypto.AES.key_size

  let buffer = []
  for (let offset=0; offset < key_size; offset+=16) {
    uuidv4(null, buffer, offset)
  }
  buffer = buffer.map(c => (c < 128) ? c : (c - 128))

  let secret
  secret = String.fromCharCode(...buffer)
  secret = secret.substring(0, key_size)
  return secret
}

crypto.AES.encrypt = (cleartext, secret) => {
  let crypted = CryptoJS.AES.encrypt(cleartext, secret).toString()  // base64
  return crypted
}

crypto.AES.decrypt = (crypted, secret) => {
  let cleartext = CryptoJS.AES.decrypt(crypted, secret).toString(CryptoJS.enc.Utf8)
  return cleartext
}

// -----------------------------------------------------------------------------

module.exports = crypto
