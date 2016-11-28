const stringify = require('json-stringify-safe')

function decorate (s, statusCode, headers) {
  s.statusCode = statusCode
  Object.keys(headers).map(k => s.setHeader(k, headers[k]))
  return s
}

module.exports = function Response (stream, initialHeaders) {
  initialHeaders = initialHeaders || {}

  const api = {}
  let headers = Object.assign({}, initialHeaders)

  api.headers = obj => (headers = Object.assign(headers, obj))

  api.json = (statusCode, data) => {
    headers['content-type'] = 'application/json'
    const s = decorate(stream, statusCode, headers)
    s.end(stringify(data))
  }

  api.html = (statusCode, data) => {
    headers['content-type'] = 'text/html'
    const s = decorate(stream, statusCode, headers)
    s.end(data)
  }

  api.text = (statusCode, data) => {
    headers['content-type'] = 'text/plain'
    const s = decorate(stream, statusCode, headers)
    s.end(data)
  }

  api.end = (statusCode, data) => {
    const s = decorate(stream, statusCode, headers)
    s.end(data)
  }

  api.redirect = (req, location) => {
    const msg = req.url + ' -> ' + location

    const s = decorate(stream, 302, {
      'Content-Length': msg.length,
      'location': location
    })

    if (req.method === 'HEAD') {
      s.end()
    } else {
      return s.end()
    }
  }

  return api
}

