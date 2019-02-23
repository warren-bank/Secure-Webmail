const React       = require('react')
const PropTypes   = require('prop-types')

const displayName = 'App'

const Summary                             = require(`./${displayName}/Summary`)
const {GoogleLogin, GoogleLogout}         = require('react-google-login')

const {getQuerystring, removeQuerystring} = require('react/lib/querystring')
const addEventListener                    = require('react/lib/loginParentIframe')
const constants                           = window.constants

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

    removeQuerystring()

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
      let qs     = getQuerystring(['tid', 'debug'])
      if (qs)
        params.push(qs)
      if (this.state.account)
        params.push(`email=${window.encodeURIComponent(this.state.account)}`)
      if (params.length) {
        params = params.join('&')
        url += '?' + params
      }
    }

    return (
      <div className={displayName.toLowerCase()}>
      {
        !this.state.account &&
        <div className="header">
          {this.buttons.login}
        </div>
      }
      {
        !this.state.account &&
        <div className="summary_container">
          <Summary />
        </div>
      }
        <div className={`iframe_container ${this.state.account ? '' : 'hidden'}`}>
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
