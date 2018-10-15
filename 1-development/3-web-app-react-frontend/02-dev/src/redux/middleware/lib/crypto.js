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

crypto.RSA.get_public_key = (private_key) => {
  let js_crypt = new JSEncrypt()
  js_crypt.setPrivateKey(private_key)

  let public_key = js_crypt.getPublicKey()
  return public_key
}

crypto.RSA.encrypt = (cleartext, public_key) => {
  let js_crypt = new JSEncrypt()
  js_crypt.setPublicKey(public_key)

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

crypto.AES.generate_secret = () => {
  return new Promise((resolve, reject) => {
    const key_size = 256   // options: any multiple of 16
                           // reading: https://en.wikipedia.org/wiki/Key_size#Symmetric_algorithm_key_lengths
    const buffer = []
    for (let offset=0; (offset + 16) <= key_size; offset+=16) {
      uuidv4(null, buffer, offset)
    }

    let secret = String.fromCharCode(...buffer)
    resolve(secret)
  })
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
