// https://stackoverflow.com/a/45905238

const download_data_url = (dataurl, filename) => {
  const a = window.document.createElement("a")
  a.href = dataurl
  a.setAttribute("download", filename)

  const b = window.document.createEvent("MouseEvents")
  b.initEvent("click", false, true)

  a.dispatchEvent(b)
}

module.exports = download_data_url
