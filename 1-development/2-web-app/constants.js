var app = {
  title:   'Secure Webmail',
  version: '2.0.1'
}

var config = {
  test: true
}

app.public_url = (config.test)
  ? 'https://script.google.com/macros/s/AKfycbxjGr_DXhEsXfQxDtKII3LkCEGC5zgsQcdx4DJNWJitkyx8FLZV/exec'
  : 'https://script.google.com/macros/s/AKfycbzrmI7ej1jrk6hPXum6J_f49UM--KeUjf9yWKlu3X985O5iY-E/exec'

// reminder: URL needs to be added to "urlFetchWhitelist" in "appsscript.json"
var logger_service_URL = (config.test)
  ? 'https://script.google.com/macros/s/AKfycbz_PwK-fIKfpmSm1huz8cUXrfc2n5fPLr21aRHZenCsRA7D62Q/exec'
  : 'https://script.google.com/macros/s/AKfycbxpYS1gnjRxTotoBz1C2AKUZorn0fxHNshYfFgR5eMnvycgIL8/exec'
