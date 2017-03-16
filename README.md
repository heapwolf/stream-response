# SYNOPSIS
Respond with `json`, `html`, `text`, or `redirect`. Extend headers easily.

# BUILD STATUS
[![Build Status](https://travis-ci.org/0x00A/stream-response.svg?branch=master)](https://travis-ci.org/0x00A/stream-response)

# USAGE
```js
const Response = require('stream-response')
const http = require('http')

http.createServer((req, res) => {
  const response = Response(res)
  response.json(200, { message: 'OK' })
}).listen(8080)
```

```js
response.html(401, '<h1>Not Allowed</h1>')
```

```js
response.text(418, 'Tea Time!')
```

## ABSOLUTE REDIRECTS
Defaults to `301`.

```js
response.redirect(req, 'https://google.com')
response.redirect(302, req, 'https://google.com')
```

## RELATIVE REDIRECTS
```js
response.redirect(req, '/login')
response.redirect(301, req, '/login')
```

## EXTEND HEADERS
Extend the headers for each request with the `headers()` method.

```js
response.headers({ 'content-type': 'application/x-www-form-urlencoded' })
response.end(200, { name: 'danzig', number: 13 })
```

