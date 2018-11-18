var app = {
  title:   'Secure Webmail',
  version: '0.1.0'
}

var config = {
  test:  true,
  debug: true
}

// reminder: URL needs to be added to "urlFetchWhitelist" in "appsscript.json"
var webapp_URL = 'https://secure-webmail.github.io/?'
if (config.test)
  webapp_URL += 'env=test&'
if (config.debug)
  webapp_URL += 'debug=1&'
webapp_URL += 'tid='

var spreadsheet_id = {
  errors: '1s4EQmS3glbUHb8x37FgzLiULwRC7i7A3SSk3Z5MWAcQ'
}
