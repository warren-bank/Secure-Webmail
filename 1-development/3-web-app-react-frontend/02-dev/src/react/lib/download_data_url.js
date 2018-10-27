// https://stackoverflow.com/a/45905238

const download_data_url = (dataurl, filename) => {
  const a = window.document.createElement("a")
  a.href = dataurl
  a.setAttribute("download", filename)

  const e = window.document.createEvent("MouseEvents")
  e.initEvent("click", false, true)

  a.dispatchEvent(e)
}

module.exports = download_data_url
