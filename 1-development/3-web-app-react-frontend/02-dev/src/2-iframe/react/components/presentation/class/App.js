const React       = require('react')
const PropTypes   = require('prop-types')

const {GoogleLogin, GoogleLogout} = require('react-google-login')

const constants = require('react/data/constants')

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {account: null}

    this.default_login_props = {
      clientId:         constants.clientId,
      scope:            "profile email",
      onSuccess:        this.onSuccess.bind(this),
      onFailure:        this.onFailure.bind(this),
      onRequest:        this.onRequest.bind(this)
    }

    this.default_logout_props = {
      onLogoutSuccess:  this.onLogoutSuccess.bind(this)
    }

    this.buttons = {
      login: (
        <GoogleLogin  className="google login"  {...this.default_login_props} prompt="consent" >
          <span className="icon"></span>
          <span class="buttonText">Login</span>
        </GoogleLogin>
      ),
      switch_account: (
        <GoogleLogin  className="google switch" {...this.default_login_props} prompt="select_account" >
          <span className="icon"></span>
          <span class="buttonText">Switch Account</span>
        </GoogleLogin>
      ),
      logout: (
        <GoogleLogout className="google logout" {...this.default_logout_props} >
          <span className="icon"></span>
          <span class="buttonText">Logout</span>
        </GoogleLogout>
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

  onRequest() {
    console.log('onRequest')
  }

  onLogoutSuccess() {
    console.log('onLogoutSuccess')

    this.setAccount(null)
  }

  render() {
    let url = constants.urls.iframe_source
    if (this.tid) url += '?tid=' + this.tid

    if (this.state.account) {
      return (
          <div className="app">
            <div className="header active_session">
              {this.buttons.switch_account}
              {this.buttons.logout}
            </div>
            <div className="iframe_container">
              <iframe
                x-data-account={this.state.account}
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
    else {
      return (
          <div className="app">
            <div className="header no_session">
              {this.buttons.login}
            </div>
          </div>
      )
    }

  }
}

App.propTypes = {
  iframe_id: PropTypes.string.isRequired
}

module.exports = App
