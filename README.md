### Secure Webmail

#### Purpose

* Email encryption should be easy!

#### Goals

* All cleartext should be restricted to the client.
  * no unencrypted data (ie: message body, file attachments) should ever be shared with the server
* All symmetric encryption keys (ie: AES secret) should be managed by the email application.
  * automatic generation of a unique key per message
  * automatic distribution of this unique key to all recipients of the message
* All asymmetric public encryption keys (ie: RSA) should be managed by the email application.
  * automatic storage on the server with a one-to-one association per user account

#### Survey of Existing Solutions _<sup>[1-2]</sup>_

* Pretty Good Privacy (PGP) is the [standard](https://tools.ietf.org/html/rfc4880) for securing email communication with encryption.
  * it works as a technical solution
    * the cryptography is sound
  * it fails as a practical solution
    * there is no defacto keystore from which to obtain asymmetric public keys
    * support by popular email service providers (ex: Gmail) is non-existent
    * support by popular email clients (ex: [Thunderbird](https://support.mozilla.org/en-US/kb/digitally-signing-and-encrypting-messages)) is very limited
    * support for basic features in experimental tools that only the technically-minded might use (ex: [mailvelope](https://github.com/mailvelope/mailvelope/issues/608)) is incomplete
* Specialized email service providers that combine a proprietary keystore with a proprietary client,
  which requires that all email participants use the service to send and receive messages.
* Specialized services that layer on top of any email service provider.
  * encryption can be performed on the client
  * decryption can be performed on the client
  * out-of-band communication between email participants is needed to share the symmetric encryption key required to decrypt the message

#### Proposal for New Solution

* Specialized service that layers on top of Gmail.
* Uses "Google Apps Script" to:
  * determine the email address of the currently active Google account
  * access the content of Gmail threads and messages
  * store the 1-to-1 association between each email address and an asymmetric public key in the Properties Service

#### Technical Foundation

* ["Google Apps Script"](https://developers.google.com/apps-script/)
  * provides APIs to access data from Google services (ex: Gmail)
  * scripts can run as the currently active Google account
    * any permissions needed to access data from Google services must first be granted (ie: one-time)
  * scripts can be published as a "web app"
    * perfect for a single-page app (SPA)
      * the client side can make asynchronous calls to functions that execute on the server
      * the server side code can access service APIs and return data to the client
    * perfect for integration with React/Redux
      * all asynchronous server-side requests can be managed by a single Redux middleware library
      * when responses are received, the data obtained from the server can be passed to Redux reducers
      * when the Redux state is changed, React components will render any changes to the user interface (UI)
* ["CryptoJS"](https://github.com/brix/crypto-js)
  * javascript implementation of AES symmetric key encryption
    * used to encrypt and decrypt message content (ie: message body, file attachments)
    * each message is encrypted with a newly generated key
      * each key is 245 characters long
        * each character is 1-byte ascii in the range: 0-127
* ["JSEncrypt"](https://github.com/travist/jsencrypt)
  * javascript implementation of RSA asymmetric key encryption
    * used to encrypt and decrypt AES keys
    * each message needs to share the AES key required for decryption with all of its recipients
      * the message can be used to distribute the AES key, but its value needs to be encrypted in such a way that only the recipients can recover the AES key
        * each recipient has both a public RSA encryption key, as well as a private RSA encryption key
        * the public RSA encryption key belonging to each of the message recipients can be used to encrypt the AES key
        * the encrypted value of the AES key is unique to each recipient, and its value can only be decrypted with the private RSA encryption key belonging to the corresponding recipient
        * the message can include a hash table that maps each recipient to the corresponding encrypted value of the AES key

#### Pros

* All cryptographic operations are transparent to the end-user.
  * initial generation of an asymmetric keypair requires a single mouse-click
  * persistent storage of the private RSA encryption key is the responsibility of the end-user
    * if lost, then all emails sent or received using that keypair can no-longer be decrypted by the corresponding Google account
* All of the stated goals are satisfied.
  * replacing the user interface (UI) to Gmail with a custom single-page app (SPA) gives complete control over what data is shared with the Gmail server
    * there is no automatic saving of draft messages
    * all cryptographic operations are performed in the client
    * only encrypted data is shared with Gmail for storage and distribution to recipients

#### Cons

* Cannot send messages to non-Gmail recipients.

#### References

1. https://trendblog.net/encrypt-gmail-openpgp/
2. http://www.primalsecurity.net/pgp-encryption/

- - - -

#### About the Author

![Warren Bank](https://avatars3.githubusercontent.com/u/6810270)

&copy; [Warren Bank](https://github.com/warren-bank)
