### &ldquo;Secure Webmail&rdquo;

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
* Uses &ldquo;Google Apps Script&rdquo; to:
  * determine the email address of the currently active Google account
  * access the content of Gmail threads and messages
  * store the 1-to-1 association between each email address and an asymmetric public key in the &ldquo;Properties Service&rdquo;

#### Technical Foundation

* [&ldquo;Google Apps Script&rdquo;](https://developers.google.com/apps-script/)
  * provides APIs to access data from Google services (ex: Gmail)
  * scripts can run as the currently active Google account
    * any permissions needed to access data from Google services must first be granted (ie: one-time)
  * scripts can be published as a &ldquo;web app&rdquo;
    * perfect for a single-page app (SPA)
      * the client side can make asynchronous calls to functions that execute on the server
      * the server side code can access service APIs and return data to the client
    * perfect for integration with React/Redux
      * all asynchronous server-side requests can be managed by a single Redux middleware library
      * when responses are received, the data obtained from the server can be passed to Redux reducers
      * when the Redux state is changed, React components will render any changes to the user interface (UI)
* [&ldquo;CryptoJS&rdquo;](https://github.com/brix/crypto-js)
  * javascript implementation of AES symmetric key encryption
    * used to encrypt and decrypt message content (ie: message body, file attachments)
    * each message is encrypted with a newly generated key
      * each key is 245 characters long
        * each character is 1-byte ascii in the range: 0-127
* [&ldquo;JSEncrypt&rdquo;](https://github.com/travist/jsencrypt)
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

1. [https://trendblog.net/encrypt-gmail-openpgp/](https://trendblog.net/encrypt-gmail-openpgp/)
2. [http://www.primalsecurity.net/pgp-encryption/](http://www.primalsecurity.net/pgp-encryption/)

- - - -

#### About the Author

![Warren Bank](https://avatars3.githubusercontent.com/u/6810270)

&copy; [Warren Bank](https://github.com/warren-bank)

- - - -

#### License

* [no license](https://choosealicense.com/no-permission/)
  * the source code is publicly available for the purpose of security audit
  * full copyright is held by the author
    * code contributions will __NOT__ be accepted, unless the contributor transfers copyright ownership to the author
  * permission is __NOT__ granted to any other individual or business entity to host (publicly or privately) any of the source code (in its original form or in any derived form)
    * derivation includes but is not limited to:
      * modification
      * obfuscation
      * minification
      * compilation
      * transcompilation
* a private license is available for purchase
  * intended for use by a limited number of members belonging to a private organization
  * implications:
    * when the source code is published, the new instance does not share the same &ldquo;Properties Service&rdquo; key-value store
      * this store is used to associate each email address with its asymmetric public encryption key
      * this store will only contain the email addresses belonging to members of the private organization
      * encrypted messages can only be sent between members of this limited set of email addresses

- - - -

### &ldquo;Secure Webmail&rdquo; Terms of Service

Last modified: November 06, 2018

#### Welcome to &ldquo;Secure Webmail&rdquo;!

Thanks for using our products and services (&ldquo;Services&rdquo;).

By using our Services, you are agreeing to these terms. Please read them carefully.

#### Using our Services

You must follow any policies made available to you within the Services.

Don&rsquo;t misuse our Services. For example, don&rsquo;t interfere with our Services or try to access them using a method other than the interface and the instructions that we provide. You may use our Services only as permitted by law, including applicable export and re-export control laws and regulations. We may suspend or stop providing our Services to you if you do not comply with our terms or policies or if we are investigating suspected misconduct.

Using our Services does not give you ownership of any intellectual property rights in our Services or the content you access. You may not use content from our Services unless you obtain permission from its owner or are otherwise permitted by law. These terms do not grant you the right to use any branding or logos used in our Services. Don&rsquo;t remove, obscure, or alter any legal notices displayed in or along with our Services.

Our Services display some content that is not our own. This content is the sole responsibility of the entity that makes it available. Due to encryption, we are not able to review content to determine whether it is illegal or violates our policies.

Some of our Services are available on mobile devices. Do not use such Services in a way that distracts you and prevents you from obeying traffic or safety laws.

#### Your Google Account

You will need a Google Account in order to use our Services. You may create your own Google Account, or your Google Account may be assigned to you by an administrator, such as your employer or educational institution. If you are using a Google Account assigned to you by an administrator, different or additional terms may apply and your administrator may be able to access or disable your account.

#### Privacy and Copyright Protection

Our Services require that you grant permission to access messages in your Gmail account. Our Services will access only the minimum amount of data required to perform their proper operation. Our Services will not retain any data or meta-data belonging to your Gmail account. Our Services will not come into possession of the encryption key(s) necessary to decrypt any of the messages sent using our Services through your Gmail account. Due to encryption, we are not able to respond to notices of alleged copyright infringement.

#### About Software in our Services

The copyright holder of our Services gives you a personal, worldwide, royalty-free, non-assignable and non-exclusive license to use the software provided to you as part of the Services. This license is for the sole purpose of enabling you to use and enjoy the benefit of the Services as provided by the copyright holder, in the manner permitted by these terms. You may not copy, modify, distribute, sell, or lease any part of our Services or included software, nor may you reverse engineer or attempt to extract the source code of that software, unless laws prohibit those restrictions or you have our written permission.

Open source software is important to us. Some software used in our Services may be offered under an open source license that we will make available to you. There may be provisions in the open source license that expressly override some of these terms.

#### Modifying and Terminating our Services

We are constantly changing and improving our Services. We may add or remove functionalities or features, and we may suspend or stop a Service altogether.

You can stop using our Services at any time, although we&rsquo;ll be sorry to see you go. The copyright holder may also stop providing Services to you, or add or create new limits to our Services at any time.

We believe that you own your data and preserving your access to such data is important. If we discontinue a Service, where reasonably possible, we will give you reasonable advance notice and a chance to get information out of that Service.

#### Our Warranties and Disclaimers

We provide our Services using a commercially reasonable level of skill and care and we hope that you will enjoy using them. But there are certain things that we don&rsquo;t promise about our Services.

OTHER THAN AS EXPRESSLY SET OUT IN THESE TERMS OR ADDITIONAL TERMS, NEITHER THE COPYRIGHT HOLDER NOR SUPPLIERS OR DISTRIBUTORS MAKE ANY SPECIFIC PROMISES ABOUT THE SERVICES. FOR EXAMPLE, WE DON&rsquo;T MAKE ANY COMMITMENTS ABOUT THE CONTENT WITHIN THE SERVICES, THE SPECIFIC FUNCTIONS OF THE SERVICES, OR THEIR RELIABILITY, AVAILABILITY, OR ABILITY TO MEET YOUR NEEDS. WE PROVIDE THE SERVICES &ldquo;AS IS&rdquo;.

SOME JURISDICTIONS PROVIDE FOR CERTAIN WARRANTIES, LIKE THE IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. TO THE EXTENT PERMITTED BY LAW, WE EXCLUDE ALL WARRANTIES.

#### Liability for our Services

WHEN PERMITTED BY LAW, THE COPYRIGHT HOLDER, AND SUPPLIERS AND DISTRIBUTORS, WILL NOT BE RESPONSIBLE FOR LOST PROFITS, REVENUES, OR DATA, FINANCIAL LOSSES OR INDIRECT, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES.

TO THE EXTENT PERMITTED BY LAW, THE TOTAL LIABILITY OF THE COPYRIGHT HOLDER, AND SUPPLIERS AND DISTRIBUTORS, FOR ANY CLAIMS UNDER THESE TERMS, INCLUDING FOR ANY IMPLIED WARRANTIES, IS LIMITED TO THE AMOUNT YOU PAID US TO USE THE SERVICES (OR, IF WE CHOOSE, TO SUPPLYING YOU THE SERVICES AGAIN).

IN ALL CASES, THE COPYRIGHT HOLDER, AND SUPPLIERS AND DISTRIBUTORS, WILL NOT BE LIABLE FOR ANY LOSS OR DAMAGE THAT IS NOT REASONABLY FORESEEABLE.

#### Business uses of our Services

If you are using our Services on behalf of a business, that business accepts these terms. It will hold harmless and indemnify the copyright holder and affiliates, officers, agents, and employees from any claim, suit or action arising from or related to the use of the Services or violation of these terms, including any liability or expense arising from claims, losses, damages, suits, judgments, litigation costs and attorneys&rsquo; fees.

#### About these Terms

We may modify these terms or any additional terms that apply to a Service to, for example, reflect changes to the law or changes to our Services. You should look at the terms regularly. We&rsquo;ll post notice of modifications to these terms on this page. We&rsquo;ll post notice of modified additional terms in the applicable Service. Changes will not apply retroactively and will become effective no sooner than fourteen days after they are posted. However, changes addressing new functions for a Service or changes made for legal reasons will be effective immediately. If you do not agree to the modified terms for a Service, you should discontinue your use of that Service.

If there is a conflict between these terms and the additional terms, the additional terms will control for that conflict.

These terms control the relationship between the copyright holder and you. They do not create any third party beneficiary rights.

If you do not comply with these terms, and we don&rsquo;t take action right away, this doesn&rsquo;t mean that we are giving up any rights that we may have (such as taking action in the future).

If it turns out that a particular term is not enforceable, this will not affect any other terms.

The laws of California, U.S.A., excluding California&rsquo;s conflict of laws rules, will apply to any disputes arising out of or relating to these terms or the Services. All claims arising out of or relating to these terms or the Services will be litigated exclusively in the federal or state courts of Santa Clara County, California, USA, and you and the copyright holder consent to personal jurisdiction in those courts.
