const urlParams = new window.URLSearchParams(window.location.search)

const getParam = (key) => urlParams.get(key)

const getQuerystring = (keys) => {
  if (!Array.isArray(keys))
    keys = [...urlParams.keys()]

  let qs = []
  for (let i=0; i < keys.length; i++) {
    let key = keys[i]
    let val = getParam(key)

    if (val)
      qs.push(`${key}=${encodeURIComponent(val)}`)
  }

  return (qs.length) ? qs.join('&') : ''
}

const removeQuerystring = () => {
  window.history.replaceState(null, null, window.location.pathname)
}

const reloadWindow = (keys) => {
  let qs  = getQuerystring(keys)
  let url = `${window.location.pathname}?${qs}`
  window.history.replaceState(null, null, url)
  window.location.reload(true)
}

module.exports = {getParam, getQuerystring, removeQuerystring, reloadWindow}
