const React       = require('react')

const displayName = 'Summary'

class Summary extends React.PureComponent {
  render() {
    return (
      <div className={displayName.toLowerCase()}>
        <div className="github_ribbon">
          {/* https://github.blog/2008-12-19-github-ribbons/ */}
          <a target="_blank" href="https://github.com/warren-bank/Secure-Webmail">
            <img width="149" height="149" src="https://github.blog/wp-content/uploads/2008/12/forkme_left_gray_6d6d6d.png?resize=149%2C149" alt="Fork me on GitHub" />
          </a>
        </div>
        <div className="README">
          <h3><a target="_blank" href="https://github.com/warren-bank/Secure-Webmail">“Secure Webmail”</a></h3>
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
          <hr />
          <h4>Survey of Existing Solutions <em><sup>[1-3]</sup></em></h4>
          <ul>
            <li>Pretty Good Privacy (PGP) is the <a target="_blank" href="https://tools.ietf.org/html/rfc4880" rel="nofollow">standard</a> for securing email communication with encryption.
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
                    <li>support by popular email clients (ex: <a target="_blank" href="https://support.mozilla.org/en-US/kb/digitally-signing-and-encrypting-messages" rel="nofollow">Thunderbird</a>) is very limited</li>
                    <li>open-source tools are all highly experimental, and either:
                      <ul>
                        <li>feature incomplete (ex: <a target="_blank" href="https://github.com/mailvelope/mailvelope/issues/608">mailvelope</a>)</li>
                        <li>outright abandoned (ex: <a target="_blank" href="https://github.com/google/end-to-end/issues/391">Google End-To-End</a>)</li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>Specialized email service providers:
              <ul>
                <li>combine a proprietary keystore with a proprietary client</li>
                <li>require that all email participants use the service to both send and receive messages</li>
              </ul>
            </li>
            <li>Specialized services that layer on top of any email service provider:
              <ul>
                <li>encryption and decryption are performed on the client</li>
                <li>out-of-band communication between email participants is needed to share encryption key(s)</li>
              </ul>
            </li>
          </ul>
          <h4>References</h4>
          <ol>
            <li><a target="_blank" href="https://trendblog.net/encrypt-gmail-openpgp/" rel="nofollow">https://trendblog.net/encrypt-gmail-openpgp/</a></li>
            <li><a target="_blank" href="http://www.primalsecurity.net/pgp-encryption/" rel="nofollow">http://www.primalsecurity.net/pgp-encryption/</a></li>
            <li><a target="_blank" href="https://www.wired.com/2017/02/3-years-gmails-end-end-encryption-still-vapor/" rel="nofollow">https://www.wired.com/2017/02/3-years-gmails-end-end-encryption-still-vapor/</a></li>
          </ol>
          <hr />
          <h4>Proposal for New Solution</h4>
          <ul>
            <li>Specialized service that layers on top of Gmail.</li>
            <li>Uses “Google Apps Script” to:
              <ul>
                <li>determine the email address of the currently active Google account</li>
                <li>access the content of Gmail threads and messages</li>
                <li>store the 1-to-1 association between each email address and an asymmetric public key in the “Properties Service”</li>
              </ul>
            </li>
          </ul>
          <h4>Technical Foundation</h4>
          <ul>
            <li><a target="_blank" href="https://developers.google.com/apps-script/" rel="nofollow">“Google Apps Script”</a>
              <ul>
                <li>provides APIs to access data from Google services (ex: Gmail)</li>
                <li>scripts can run as the currently active Google account
                  <ul>
                    <li>any permissions needed to access data from Google services must first be granted (ie: one-time)</li>
                  </ul>
                </li>
                <li>scripts can be published as a “web app”
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
            <li><a target="_blank" href="https://github.com/brix/crypto-js">“CryptoJS”</a>
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
            <li><a target="_blank" href="https://github.com/travist/jsencrypt">“JSEncrypt”</a>
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
            <li>All cryptographic operations are transparent to the end-user, with the following caveats:
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
          <hr />
          <h4>Website Hosts</h4>
          <ul>
            <li><a target="_blank" href="https://secure-webmail.github.io/" rel="nofollow">GitHub Pages</a></li>
            <li><a target="_blank" href="https://secure-webmail.gitlab.io/" rel="nofollow">GitLab Pages</a></li>
          </ul>
          <p>Authorization Instructions:</p>
          <ul>
            <li>click: "REVIEW PERMISSIONS"
              <ul>
                <li>in confirmation dialog window:
                  <ul>
                    <li>select: Google account (to grant permissions)</li>
                    <li>under: "This app isn't verified"
                      <ul>
                        <li>click: "Advanced"</li>
                        <li>scroll to bottom</li>
                        <li>click: "Go to Secure Webmail (unsafe)"</li>
                      </ul>
                    </li>
                    <li>under the list of required permissions
                      <ul>
                        <li>click: "Allow"</li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
          <p>Required Permissions:</p>
          <ul>
            <li><code>Read, compose, send, and permanently delete all your email from Gmail</code>
              <ul>
                <li>required to read and send messages
                  <ul>
                    <li>will not permanently delete any email</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><code>Connect to an external service</code>
              <ul>
                <li>only used to log errors (if any should occur)</li>
              </ul>
            </li>
          </ul>
          <hr />
          <h4>Gmail Add-on</h4>
          <p>Installation Instructions:</p>
          <ul>
            <li>open: <a target="_blank" href="https://mail.google.com/mail/u/0/#settings/addons" rel="nofollow">Settings &gt; Add-ons</a></li>
            <li>check: "Enable developer add-ons for my account"
              <ul>
                <li>in confirmation dialog window:
                  <ul>
                    <li>click: "Enable"</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>in text field: "Developer add-ons"
              <ul>
                <li>enter: <code>AKfycbxT8y51i6_JN6Ac9SBXl13r0h5owk8s7fX70B5cYGeFhsgog2oY7I5k_bhWj4XE7JVXbw</code>
                  <ul>
                    <li>Deployment ID for: <code>Gmail Add-on for Secure Webmail (Version: 1)</code></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>click: "Install"
              <ul>
                <li>in confirmation dialog window:
                  <ul>
                    <li>check: "I trust the developer of this add-on"</li>
                    <li>click: "Install"</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
          <p>Authorization Instructions:</p>
          <ul>
            <li>open the add-on by <a target="_blank" href="https://developers.google.com/gmail/add-ons/how-tos/using-addons" rel="nofollow">clicking its icon</a></li>
            <li>click: "AUTHORIZE ACCESS"
              <ul>
                <li>in confirmation dialog window:
                  <ul>
                    <li>select: Google account (to grant permissions)</li>
                    <li>under: "This app isn't verified"
                      <ul>
                        <li>click: "Advanced"</li>
                        <li>scroll to bottom</li>
                        <li>click: "Go to Gmail Add-on for Secure Webmail (unsafe)"</li>
                      </ul>
                    </li>
                    <li>under the list of required permissions
                      <ul>
                        <li>click: "Allow"</li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
          <p>Required Permissions:</p>
          <ul>
            <li><code>Run as a Gmail add-on</code>
              <ul>
                <li>required by all Gmail add-ons</li>
              </ul>
            </li>
            <li><code>View your email message metadata when the add-on is running</code>
              <ul>
                <li>required to obtain the ID of the open email thread</li>
              </ul>
            </li>
            <li><code>Connect to an external service</code>
              <ul>
                <li>only used to log errors (if any should occur)</li>
              </ul>
            </li>
          </ul>
          <p>Purpose and Usage:</p>
          <ul>
            <li>this add-on is entirely optional</li>
            <li>it integrates with official Gmail client(s) and provides a single button</li>
            <li>when an email thread is open:
              <ul>
                <li>clicking this button opens the same email thread in "Secure Webmail" (in a new browser tab)</li>
              </ul>
            </li>
            <li>by doing so:
              <ul>
                <li>an encrypted message can be read</li>
                <li>an encrypted response can be written and sent</li>
              </ul>
            </li>
          </ul>
          <p>Notes:</p>
          <ul>
            <li>when the button in the add-on is clicked and a new browser tab is being opened:
              <ul>
                <li>most browsers block the new tab from opening</li>
              </ul>
            </li>
            <li>if this occurs, some browser configuration is needed
              <ul>
                <li>in Chrome / Chromium:
                  <ul>
                    <li>open: Settings (Advanced) &gt; Privacy and security &gt; Content settings &gt; Popups</li>
                    <li>click: Allow &gt; ADD</li>
                    <li>enter: <code>https://mail.google.com:443</code></li>
                    <li>click: ADD</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
          <hr />
          <h4>Screencasts</h4>
          <h5>Google account login</h5>
          <p>
            <img src="https://github.com/warren-bank/Secure-Webmail/raw/master/4-screencasts/1.%20Google%20account%20login/2.%20animation/1.%20Google%20account%20login.gif" alt="Google account login" />
          </p>
          <h5>New user</h5>
          <p>
            <img src="https://github.com/warren-bank/Secure-Webmail/raw/master/4-screencasts/2.%20new%20user/2.%20animation/2.%20new%20user.gif" alt="New user" />
          </p>
          <h5>Returning user</h5>
          <p>
            <img src="https://github.com/warren-bank/Secure-Webmail/raw/master/4-screencasts/3.%20existing%20user/2.%20animation/3.%20existing%20user.gif" alt="Returning user" />
          </p>
          <hr />
          <h4>About the Author</h4>
          <p>
            <img width="274" height="274" src="https://avatars3.githubusercontent.com/u/6810270" alt="Warren Bank" />
          </p>
          <p>© <a target="_blank" href="https://github.com/warren-bank">Warren Bank</a></p>
          <hr />
          <h4>License</h4>
          <ul>
            <li><a target="_blank" href="https://choosealicense.com/no-permission/" rel="nofollow">No license.</a>
              <ul>
                <li>the <a target="_blank" href="https://github.com/warren-bank/Secure-Webmail">source code</a> is publicly available for the purpose of <a target="_blank" href="https://github.com/warren-bank/Secure-Webmail/issues/1">security audit</a></li>
                <li>full copyright is held by the author
                  <ul>
                    <li>code contributions will <strong>NOT</strong> be accepted, unless the contributor transfers copyright ownership to the author</li>
                  </ul>
                </li>
                <li>permission is <strong>NOT</strong> granted to any other individual or business entity to host (publicly or privately) any of the source code (in its original form or in any derived form)
                  <ul>
                    <li>derivation includes but is not limited to:
                      <ul>
                        <li>modification</li>
                        <li>obfuscation</li>
                        <li>minification</li>
                        <li>compilation</li>
                        <li>transcompilation</li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>A private license is <a target="_blank" href="mailto:secure.webmail.addon@gmail.com?subject=private-license">available for purchase</a>.
              <ul>
                <li>intended for use by a limited number of members belonging to a private organization</li>
                <li>implications:
                  <ul>
                    <li>when the source code is published, the new instance does not share the same “Properties Service” key-value store
                      <ul>
                        <li>this store is used to associate each email address with its asymmetric public encryption key</li>
                        <li>this store will only contain the email addresses belonging to members of the private organization</li>
                        <li>encrypted messages can only be sent between members of this limited set of email addresses</li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <hr />
        <div className="policies">
          <h3>Policies:</h3>
          <ul>
            <li><a target="_blank" href="/etc/policies/privacy_policy.html">Privacy Policy</a></li>
            <li><a target="_blank" href="/etc/policies/terms_of_service.html">Terms of Service</a></li>
          </ul>
        </div>
      </div>
    )
  }
}

module.exports = Summary
