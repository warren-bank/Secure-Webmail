const loginParentIframe = () => {
  if (!window.top || (window.top === window)) return

  let email
  try {
    email = window.init_data.email_address
  }
  catch(err){}
  if (!email) return

  const message = {
    type: "loginParentIframe",
    email
  }
  window.top.postMessage(JSON.stringify(message), '*')
}

module.exports = loginParentIframe
