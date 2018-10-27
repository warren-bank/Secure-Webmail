const read_file_content = () => {
  return new Promise((resolve, reject) => {
    open_file_chooser(resolve, reject)
  })
}

const open_file_chooser = (resolve, reject) => {
  const el = window.document.createElement("input")
  el.setAttribute("type", "file")
  el.setAttribute("multiple", "true")
  el.value = null
  el.addEventListener("change", read_data_from_file_chooser.bind(this, el, resolve, reject), false)

  const e = window.document.createEvent("MouseEvents")
  e.initEvent("click", false, true)

  el.dispatchEvent(e)
}

const read_data_from_file_chooser = (el, resolve, reject, e) => {
  let resolved = false

  // sanity check
  if(!el || !el.files || (typeof el.files.length !== 'number') || !el.files.length)
    return reject({error: true, count: 0, file_contents: []})

  const files = []
  for(let i=0; i < el.files.length; i++) {
    files.push( el.files[i] )
  }

  const file_contents = []

  const add_file_content = (filename, data_URI) => {
    if (resolved) return

    const contentType = data_URI.substring(5, data_URI.indexOf(';'))

    const file_content = {
      name: filename,
      data: data_URI,
      contentType
    }

    file_contents.push(file_content)

    if (file_contents.length === files.length) {
      resolved = true
      resolve(file_contents)
    }
  }

  files.forEach(file => {
    if (resolved) return

    const reader = new FileReader()

    reader.onerror = (e) => {
      resolved = true
      reject({error: true, count: file_contents.length, file_contents})
    }

    reader.onabort = reader.onerror

    reader.onloadend = (e) => {
      add_file_content(file.name, e.target.result)
    }

    reader.readAsDataURL(file)
  })
}

module.exports = read_file_content


/* -----------------------------------------------
 * usage:
 * ======
 *
 * const read_file_content = require('./read_file_content')
 *
 * read_file_content()
 * .then(files => {
 *   console.log(JSON.stringify(files, null, 4))
 * })
 * .catch(error => {
 *   console.log(JSON.stringify(error, null, 4))
 * })
 *
 * -----------------------------------------------
 */
