const stringify = require('json-stringify-safe')

function decorate (s, statusCode, headers) {
  s.statusCode = statusCode
  Object.keys(headers).map(k => s.setHeader(k, headers[k]))
  return s
}

function isStream (s) {
  const notNull = s !== null
  const isObject = typeof s === 'object'
  const hasPipe = typeof s.pipe === 'function'

  if (!s._events.error) {
    console.warn('stream has no error handler!')
  }

  return notNull && isObject && hasPipe
}

module.exports = function Response (stream, initialHeaders) {
  if (!isStream(stream)) return

  initialHeaders = initialHeaders || {}

  const api = {}
  let headers = Object.assign({}, initialHeaders)

  api.headers = obj => (headers = Object.assign(headers, obj))

  api.json = (statusCode, data) => {
    if (!isStream(stream)) return

    headers['content-type'] = 'application/json'
    const s = decorate(stream, statusCode, headers)
    s.end(stringify(data))
  }

  api.html = (statusCode, data) => {
    if (!isStream(stream)) return

    headers['content-type'] = 'text/html'
    const s = decorate(stream, statusCode, headers)
    s.end(data)
  }

  api.text = (statusCode, data) => {
    if (!isStream(stream)) return

    headers['content-type'] = 'text/plain'
    const s = decorate(stream, statusCode, headers)
    s.end(data)
  }

  api.end = (statusCode, data) => {
    if (!isStream(stream)) return

    const s = decorate(stream, statusCode, headers)
    s.end(data)
  }

  api.redirect = (...args) => {
    let statusCode = 302
    let location
    let req

    if (args.length === 3) {
      [statusCode, req, location] = args
    } else {
      [req, location] = args
    }

    if (!isStream(stream)) return

    if (location[0] === '/') {
      const protocol = req.connection.encrypted ? 'https' : 'http'
      location = [protocol, '://', req.headers.host, location].join('')
    }

    const s = decorate(stream, statusCode, {
      location,
      'Content-Type': 'text/plain'
    })

    s.end('Redirecting to ' + location)
  }

  return api
}
