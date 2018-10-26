const sanitize_html = html => html.replace(/[^a-zA-Z0-9 \.\,\?\!\-\+\_\~\@\#\$\%\&\*\(\)\:\/\\]/g, '')  // always strip: [<>]

module.exports = sanitize_html
