var app = {
  title:   'Secure Webmail',
  version: '1.0.0'
}

var config = {
  test: true
}

app.public_url = (config.test)
  ? 'https://script.google.com/macros/s/AKfycbxjGr_DXhEsXfQxDtKII3LkCEGC5zgsQcdx4DJNWJitkyx8FLZV/exec'
  : 'https://script.google.com/macros/s/AKfycbwAsEsZwqiPoC0CyKYC-GzzsFFffMNz3UehxzJOYXgX8ePDnzs/exec'

// reminder: URL needs to be added to "urlFetchWhitelist" in "appsscript.json"
var logger_service_URL = (config.test)
  ? 'https://script.google.com/macros/s/AKfycbz_PwK-fIKfpmSm1huz8cUXrfc2n5fPLr21aRHZenCsRA7D62Q/exec'
  : 'https://script.google.com/macros/s/AKfycbzdT1rVCmsna_DleU11gb2snuBbDejCMxI4pydEDZ9kwvz7FMb-/exec'
