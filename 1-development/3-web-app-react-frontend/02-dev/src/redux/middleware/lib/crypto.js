const JSEncrypt = window.JSEncrypt  // external dependency (RSA)
const CryptoJS  = window.CryptoJS   // external dependency (AES)

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
    const key_size = 1024  // valid options: [512,1024,2048,4096]
    const js_crypt = new JSEncrypt({default_key_size: key_size})

    js_crypt.getKey(() => {
      let public_key  = js_crypt.getPublicKey()
      let private_key = js_crypt.getPrivateKey()

      resolve( {public_key, private_key} )
    })
  })
}

crypto.RSA.get_public_key = (private_key) => {
  let js_crypt = new JSEncrypt()
  js_crypt.setPrivateKey(private_key)

  let public_key = js_crypt.getPublicKey()
  return public_key
}

crypto.RSA.encrypt = (cleartext, private_key) => {
  let js_crypt = new JSEncrypt()
  js_crypt.setPrivateKey(private_key)

  let crypted = js_crypt.encrypt(cleartext)
  return crypted
}

crypto.RSA.decrypt = (crypted, private_key) => {
  let js_crypt = new JSEncrypt()
  js_crypt.setPrivateKey(private_key)

  let cleartext = js_crypt.decrypt(crypted)
  return cleartext
}

// -----------------------------------------------------------------------------

crypto.AES = {}

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
