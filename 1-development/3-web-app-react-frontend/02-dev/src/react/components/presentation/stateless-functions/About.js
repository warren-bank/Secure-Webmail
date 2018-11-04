const React       = require('react')

const purify      = require('react/components/higher-order/purify')
const displayName = 'About'

const component = () => {
  return (
    <div className={`top-component ${displayName.toLowerCase()}`}>
      <h3>Secure Webmail</h3>

      <h4>Purpose</h4>
      <ul>
        <li>Email encryption should be easy!</li>
      </ul>

      <h4>Goals</h4>
      <ul>
        <li>All cleartext should be restricted to the client.
          <ul>
            <li>no unencrypted data (ie: message body, file attachments) should ever be shared with the server</li>
          </ul>
        </li>
        <li>All symmetric encryption keys (ie: AES secret) should be managed by the email application.
          <ul>
            <li>automatic generation of a unique key per message</li>
            <li>automatic distribution of this unique key to all recipients of the message</li>
          </ul>
        </li>
        <li>All asymmetric public encryption keys (ie: RSA) should be managed by the email application.
          <ul>
            <li>automatic storage on the server with a one-to-one association per user account</li>
          </ul>
        </li>
      </ul>

      <h4>Survey of Existing Solutions <em><sup className="small">[1-2]</sup></em></h4>
      <ul>
        <li>Pretty Good Privacy (PGP) is the <a href="https://tools.ietf.org/html/rfc4880">standard</a> for securing email communication with encryption.
          <ul>
            <li>it works as a technical solution
              <ul>
                <li>the cryptography is sound</li>
              </ul>
            </li>
            <li>it fails as a practical solution
              <ul>
                <li>there is no defacto keystore from which to obtain asymmetric public keys</li>
                <li>support by popular email service providers (ex: Gmail) is non-existent</li>
                <li>support by popular email clients (ex: <a href="https://support.mozilla.org/en-US/kb/digitally-signing-and-encrypting-messages">Thunderbird</a>) is very limited</li>
                <li>support for basic features in experimental tools that only the technically-minded might use (ex: <a href="https://github.com/mailvelope/mailvelope/issues/608">mailvelope</a>) is incomplete</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>Specialized email service providers that combine a proprietary keystore with a proprietary client, which requires that all email participants use the service to send and receive messages.</li>
        <li>Specialized services that layer on top of any email service provider.
          <ul>
            <li>encryption can be performed on the client</li>
            <li>decryption can be performed on the client</li>
            <li>out-of-band communication between email participants is needed to share the symmetric encryption key required to decrypt the message</li>
          </ul>
        </li>
      </ul>

      <h4>Proposal for New Solution</h4>
      <ul>
        <li>Specialized service that layers on top of Gmail.</li>
        <li>Uses "Google Apps Script" to:
          <ul>
            <li>determine the email address of the currently active Google account</li>
            <li>access the content of Gmail threads and messages</li>
            <li>store the 1-to-1 association between each email address and an asymmetric public key in the Properties Service</li>
          </ul>
        </li>
      </ul>

      <h4>Technical Foundation</h4>
      <ul>
        <li><a href="https://developers.google.com/apps-script/">"Google Apps Script"</a>
          <ul>
            <li>provides APIs to access data from Google services (ex: Gmail)</li>
            <li>scripts can run as the currently active Google account
              <ul>
                <li>any permissions needed to access data from Google services must first be granted (ie: one-time)</li>
              </ul>
            </li>
            <li>scripts can be published as a "web app"
              <ul>
                <li>perfect for a single-page app (SPA)
                  <ul>
                    <li>the client side can make asynchronous calls to functions that execute on the server</li>
                    <li>the server side code can access service APIs and return data to the client</li>
                  </ul>
                </li>
                <li>perfect for integration with React/Redux
                  <ul>
                    <li>all asynchronous server-side requests can be managed by a single Redux middleware library</li>
                    <li>when responses are received, the data obtained from the server can be passed to Redux reducers</li>
                    <li>when the Redux state is changed, React components will render any changes to the user interface (UI)</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li><a href="https://github.com/brix/crypto-js">"CryptoJS"</a>
          <ul>
            <li>javascript implementation of AES symmetric key encryption
              <ul>
                <li>used to encrypt and decrypt message content (ie: message body, file attachments)</li>
                <li>each message is encrypted with a newly generated key
                  <ul>
                    <li>each key is 245 characters long
                      <ul>
                        <li>each character is 1-byte ascii in the range: 0-127</li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li><a href="https://github.com/travist/jsencrypt">"JSEncrypt"</a>
          <ul>
            <li>javascript implementation of RSA asymmetric key encryption
              <ul>
                <li>used to encrypt and decrypt AES keys</li>
                <li>each message needs to share the AES key required for decryption with all of its recipients
                  <ul>
                    <li>the message can be used to distribute the AES key, but its value needs to be encrypted in such a way that only the recipients can recover the AES key
                      <ul>
                        <li>each recipient has both a public RSA encryption key, as well as a private RSA encryption key</li>
                        <li>the public RSA encryption key belonging to each of the message recipients can be used to encrypt the AES key</li>
                        <li>the encrypted value of the AES key is unique to each recipient, and its value can only be decrypted with the private RSA encryption key belonging to the corresponding recipient</li>
                        <li>the message can include a hash table that maps each recipient to the corresponding encrypted value of the AES key</li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>

      <h4>Pros</h4>
      <ul>
        <li>All cryptographic operations are transparent to the end-user.
          <ul>
            <li>initial generation of an asymmetric keypair requires a single mouse-click</li>
            <li>persistent storage of the private RSA encryption key is the responsibility of the end-user
              <ul>
                <li>if lost, then all emails sent or received using that keypair can no-longer be decrypted by the corresponding Google account</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>All of the stated goals are satisfied.
          <ul>
            <li>replacing the user interface (UI) to Gmail with a custom single-page app (SPA) gives complete control over what data is shared with the Gmail server
              <ul>
                <li>there is no automatic saving of draft messages</li>
                <li>all cryptographic operations are performed in the client</li>
                <li>only encrypted data is shared with Gmail for storage and distribution to recipients</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>

      <h4>Cons</h4>
      <ul>
        <li>Cannot send messages to non-Gmail recipients.</li>
      </ul>

      <h4>References</h4>
      <ol>
        <li>https://trendblog.net/encrypt-gmail-openpgp/</li>
        <li>http://www.primalsecurity.net/pgp-encryption/</li>
      </ol>

      <hr />

      <h4>About the Author</h4>
      <p><img src="https://avatars3.githubusercontent.com/u/6810270" alt="Warren Bank" /></p>
      <p><span className="small">&copy;</span> <a href="https://github.com/warren-bank">Warren Bank</a></p>
    </div>
  )
}

component.displayName = displayName

module.exports = purify(component)
