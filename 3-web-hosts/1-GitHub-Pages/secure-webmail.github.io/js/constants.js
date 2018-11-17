window.constants = (function(){

  var static_iframe_source = {
    response_503_service_unavailable: ("data:text/html;base64," + window.encodeURIComponent(window.btoa(
      '<html><body><br /><center><h1><b>"Secure-Webmail"</b> Service is offline for maintenance.</h1></center></body></html>'
    )))
  }

  var env = (window.location.search.toLowerCase().indexOf('env=test') === -1)
    ? 'production'
    : 'testing'

  return (env === 'production')
    ? {
        "clientId": "133752900170-96kd1367qdladljtl6isd7i2mo2pvi0c.apps.googleusercontent.com",
        "urls": {
            "iframe_parent": "https://secure-webmail.github.io/",
            "iframe_source": static_iframe_source.response_503_service_unavailable
        }
      }
    : {
        "clientId": "133752900170-96kd1367qdladljtl6isd7i2mo2pvi0c.apps.googleusercontent.com",
        "urls": {
            "iframe_parent": "https://secure-webmail.github.io/",
            "iframe_source": "https://script.google.com/macros/s/AKfycbxjGr_DXhEsXfQxDtKII3LkCEGC5zgsQcdx4DJNWJitkyx8FLZV/exec"
        }
      }
})()
