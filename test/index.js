const test = require('tape')
const http = require('http')
const body = require('stream-body')
const Respond = require('../index')
const QS = require('querystring')

const get = (p, cb) => {
  const opts = {
    method: 'GET',
    path: p,
    hostname: 'localhost',
    port: 3000,
    headers: {
      'content-type': 'json/application'
    }
  }
  return http.request(opts, cb).end()
}

test('[passing] setup', assert => {
  const server = http.createServer((req, res) => {
    const respond = Respond(res)

    if (req.url === '/text') {
      respond.text(200, 'Hello World\n')
    }

    if (req.url === '/form') {
      respond.headers({ 'Content-Type': 'application/x-www-form-urlencoded' })
      respond.end(200, QS.stringify({ message: 'OK' }))
    }

    if (req.url === '/json') {
      respond.json(201, { message: 'OK' })
    }

    if (req.url === '/redirect') {
      respond.redirect(req, '/redirected')
    }

    if (req.url === 'http://localhost:3000/redirected') {
      respond.text(200, 'OK')
    }
  })

  server.listen(3000, 'localhost', () => {
    assert.end()
  })
})

test('[passing] json is parsed properly', assert => {
  get('/json', res => body.parse(res, (err, data) => {
    if (err) assert.fail(true, err, 'There was an unexpected error')
    assert.equal(data.message, 'OK', 'The text "OK" was expected on the object')
    assert.end()
  }))
})

test('[passing] forms are parsed properly', assert => {
  get('/form', res => body.parse(res, (err, data) => {
    if (err) assert.fail(true, err, 'There was an unpexpected error')
    assert.equal(res.headers['content-type'], 'application/x-www-form-urlencoded')
    assert.equal(data.message, 'OK', 'The text "OK" was expected on the object')
    assert.end()
  }))
})

test('[passing] redirect', assert => {
  get('/redirect', res => {
    assert.equal(res.statusCode, 301)
    get(res.headers['location'], res => body.parse(res, (err, data) => {
      assert.ok(!err, 'There should not be an error here')
      assert.equal(res.statusCode, 200, 'status should be success')
      assert.equal(res.headers['content-type'], 'text/plain', 'content should be text plain (not form urlencoded)')
      assert.equal(data, 'OK', 'The text "OK" was expected on the object')
      assert.end()
    }))
  })
})

// TODO add some failing tests

test('[passing] teardown', assert => {
  assert.end()
  process.exit(0)
})
