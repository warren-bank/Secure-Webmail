const Trix = window.Trix

// -----------------------------------------------------------------------------

const addToolbarIcon_embedImage = (trix) => {
  const toolBar = trix.toolbarElement
  const button  = document.createElement("button")

  button.setAttribute("type", "button")
  button.setAttribute("class", "trix-button trix-button--icon trix-button--icon-embed-image")
  button.setAttribute("data-trix-action", "x-attach")
  button.setAttribute("title", "Embed an image")
  button.setAttribute("tabindex", "-1")
  button.innerText = "Embed an image"

  toolBar.querySelector('.trix-button-group[data-trix-button-group="block-tools"]').appendChild(button)

  button.addEventListener("click", () => {
    const fileInput = document.createElement("input")

    fileInput.setAttribute("type", "file")
    fileInput.setAttribute("accept", "image/*")
    fileInput.setAttribute("multiple", "")

    fileInput.addEventListener("change", () => {
      let file, _i

      const _ref = fileInput.files
      const _len = _ref.length

      for (_i = 0; _i < _len; _i++) {
        file = _ref[_i]
        trix.editor.insertFile(file)
      }
    })

    fileInput.click()
  })
}

const addToolbarIcon_hr = (trix) => {
  const toolBar = trix.toolbarElement
  const button  = document.createElement("button")

  button.setAttribute("type", "button")
  button.setAttribute("class", "trix-button trix-button--icon trix-button--icon-hr")
  button.setAttribute("data-trix-action", "x-hrule")
  button.setAttribute("title", "Horizontal rule")
  button.setAttribute("tabindex", "-1")
  button.innerText = "Horizontal rule"

  toolBar.querySelector('.trix-button-group[data-trix-button-group="block-tools"]').appendChild(button)

  button.addEventListener("click", () => {
    const attachment = new Trix.Attachment({ content: "<hr>", contentType: "application/vnd.trix.horizontal-rule.html" })
    trix.editor.insertAttachment(attachment)
  })
}

// -----------------------------------------------------------------------------

const handleAttachmentAdd = (trix, attachment) => {
  readFile(attachment.file)
  .then((data) => {
    attachment.remove()
    trix.editor.insertHTML(`<img src="${data}" />`)
  })
}

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    const max_retries = 3
    let retry_counter = 0

    const retry = (e) => {
      if (retry_counter)
        reader.abort()

      if (retry_counter < max_retries) {
        retry_counter++

        reader.readAsDataURL(file)
      }
      else {
        reject(e)
      }
    }

    reader.onload = () => {
      resolve(reader.result)
    }

    reader.onerror = retry

    retry()
  })
}

// -----------------------------------------------------------------------------

const scrollToPosition = (trix) => {
  setTimeout(
    () => {
      try {
        const selectedRange  = trix.editor.getSelectedRange()
        const endPosition    = selectedRange[1]
        const rect           = trix.editor.getClientRectAtPosition(endPosition - 1)

        const elementTop     = trix.scrollTop + rect.y
        const elementHeight  = rect.height
        const viewportHeight = trix.clientHeight
        const halfVPH        = Math.floor(viewportHeight / 2)
        const scrollTop      = elementTop + elementHeight - halfVPH

        trix.scrollTop = scrollTop
      }
      catch(e){}
    },
    0
  )
}

// -----------------------------------------------------------------------------

const exportDocument = (trix) => {
  return trix.editor.getDocument()
}

const exportHTML = (trix) => {
  const node = trix.cloneNode(true)

  node.querySelectorAll('figure.attachment').forEach(figure => {
    const payload = figure.firstChild
    figure.parentNode.replaceChild(payload, figure)
  })

  node.querySelectorAll('span[data-trix-serialize="false"]').forEach(el => {
    el.parentNode.removeChild(el)
  })

  const nodeIterator = document.createNodeIterator(
    node,
    NodeFilter.SHOW_COMMENT,
    {
      acceptNode: (node) => NodeFilter.FILTER_ACCEPT
    }
  )

  // Remove all comment nodes
  while( nodeIterator.nextNode() ) {
    const commentNode = nodeIterator.referenceNode
    commentNode.parentNode.removeChild(commentNode)
  }

  return node.innerHTML
}

// -----------------------------------------------------------------------------

const initializeEditor = (trix, doc) => {

  trix.addEventListener('trix-initialize', () => {
    addToolbarIcon_embedImage(trix)
    addToolbarIcon_hr(trix)
  })

  trix.addEventListener("trix-attachment-add", (e) => {
    const attachment = e.attachment

    if (attachment.file && attachment.file.type && (attachment.file.type.toLowerCase().indexOf('image') === 0)) {
      handleAttachmentAdd(trix, attachment)
    }
    else if (attachment.attachment && attachment.attachment.attributes && attachment.attachment.attributes.values && (attachment.attachment.attributes.values.contentType === "image") && attachment.attachment.attributes.values.url && (attachment.attachment.attributes.values.url.toLowerCase().indexOf('data:') === 0)) {
      scrollToPosition(trix)
    }
    else if (attachment.attachment && attachment.attachment.attributes && attachment.attachment.attributes.values && (attachment.attachment.attributes.values.contentType === "application/vnd.trix.horizontal-rule.html")) {
      scrollToPosition(trix)
    }
    else {
      // ignore
      attachment.remove()
    }
  })

  trix.addEventListener("trix-paste", () => {
    scrollToPosition(trix)
  })

  if (doc) {
    trix.editor.loadDocument(doc)
  }

}

// -----------------------------------------------------------------------------

const updateEditor = (trix, doc) => {
  if (doc) {
    trix.editor.loadDocument(doc)
  }
}

// -----------------------------------------------------------------------------

module.exports = {initializeEditor, updateEditor, exportDocument, exportHTML}
