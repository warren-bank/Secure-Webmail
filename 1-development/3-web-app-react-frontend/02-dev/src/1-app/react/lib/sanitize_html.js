const DOMPurify = require('dompurify')

const sanitize_html = (html) => {
  if (!html) return ''

  return DOMPurify.sanitize(html, {
    USE_PROFILES: {html: true},
    FORBID_TAGS:  ['html','head','style','form','input','select','option','textarea','button'],
    KEEP_CONTENT: false
  })
}

const strip_tags = (html) => {
  if (!html) return ''

  const closing_tag_pattern = new RegExp('</', 'g')
//html = html.replace(closing_tag_pattern, ($0) => ' ' + $0)
  html = html.replace(closing_tag_pattern, ' $&')

  html = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true
  })

  const multiple_spaces_pattern = /[ ]{2,}/g
  html = html.replace(multiple_spaces_pattern, ' ')
  html = html.trim()

  return html
}

module.exports = {sanitize_html, strip_tags}
