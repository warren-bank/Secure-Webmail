var app = {
  title:   'Gmail Add-on for Secure Webmail',
  version: '1.0.0'
}

var config = {
  test:  false,
  debug: false
}

// reminder: URL needs to be added to "gmail.openLinkUrlPrefixes" in "appsscript.json"
var webapp_URL = 'https://secure-webmail.github.io/?'
if (config.test)
  webapp_URL += 'env=test&'
if (config.debug)
  webapp_URL += 'debug=1&'
webapp_URL += 'tid='

// reminder: URL needs to be added to "urlFetchWhitelist" in "appsscript.json"
var logger_service_URL = (config.test)
  ? 'https://script.google.com/macros/s/AKfycbz_PwK-fIKfpmSm1huz8cUXrfc2n5fPLr21aRHZenCsRA7D62Q/exec'
  : 'https://script.google.com/macros/s/AKfycbxpYS1gnjRxTotoBz1C2AKUZorn0fxHNshYfFgR5eMnvycgIL8/exec'
