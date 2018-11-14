const dataurl_pattern = /^data:/i

const is_data_url = (data) => {
  return ((typeof data === 'string') && dataurl_pattern.test(data))
}

const get_data_url = (data, contentType) => {
  if (is_data_url(data)) return data

  let b64, dataurl
  b64 = window.btoa(data)
  b64 = window.encodeURIComponent(b64)
  dataurl = `data:${contentType};base64,${b64}`
  return dataurl
}

// https://stackoverflow.com/a/45905238

const download_data_url = (dataurl, filename) => {
  const a = window.document.createElement("a")
  a.href = dataurl
  a.setAttribute("download", filename)

  const e = window.document.createEvent("MouseEvents")
  e.initEvent("click", false, true)

  a.dispatchEvent(e)
}

module.exports = {get_data_url, download_data_url}
