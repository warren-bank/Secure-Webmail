const React       = require('react')
const PropTypes   = require('prop-types')

const {GoogleLogin, GoogleLogout} = require('react-google-login')

const addEventListener  = require('react/lib/loginParentIframe')
const constants         = window.constants

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {account: null}

    this.default_login_props = {
      clientId:         constants.clientId,
      scope:            "profile email",
      onSuccess:        this.onSuccess.bind(this),
      onFailure:        this.onFailure.bind(this)
    }

    this.buttons = {
      login: (
        <GoogleLogin  className="google login"  {...this.default_login_props} prompt="consent" >
          <span className="icon"></span>
          <span class="buttonText">Login</span>
        </GoogleLogin>
      )
    }

    this.tid = (() => {
      if (window.location.search) {
        const search_pattern = /[\?&]tid=([^&]+)(?:&|$)/
        const matches        = search_pattern.exec(window.location.search)

        if (matches && Array.isArray(matches)) {
          window.history.replaceState(null, null, window.location.pathname)
          return matches[1]
        }
      }
      return null
    })()

    addEventListener( this.setAccount.bind(this) )
  }

  setAccount(account) {
    this.setState({account})
  }

  onSuccess(response) {
    console.log('onSuccess:', response)

    this.setAccount(response.profileObj.email)
  }

  onFailure(response) {
    console.error('onFailure:', response)
  }

  render() {
    let url    = constants.urls.iframe_source

    if (url.indexOf('data:text/html;base64,') !== 0) {
      let params = []
      if (this.tid)
        params.push(`tid=${window.encodeURIComponent(this.tid)}`)
      if (this.state.account)
        params.push(`email=${window.encodeURIComponent(this.state.account)}`)
      if (params.length) {
        params = params.join('&')
        url += '?' + params
      }
    }

    return (
      <div className="app">
      {
        !this.state.account &&
        <div className="header">
          {this.buttons.login}
        </div>
      }
        <div className="iframe_container">
          <iframe
            id={this.props.iframe_id}
            src={url}
            frameborder="0"
            width="100%"
            marginheight="0"
            marginwidth="0"
            scrolling="no"
          ></iframe>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  iframe_id: PropTypes.string.isRequired
}

module.exports = App
