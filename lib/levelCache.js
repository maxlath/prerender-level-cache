const store = require('./store')
const oneMonth = 30 * 24 * 3600 * 1000
let ttl = 2 * oneMonth

module.exports = {
  init: server => {
    if (server.options.ttl != null) ttl = server.options.ttl
    console.log('using prerender-level-cache', { ttl })
  },

  requestReceived: async (req, res, next) => {
    if (req.method !== 'GET') return next()
    if (req.refresh === true) return next()
    const { url } = req.prerender

    try {
      const { statusCode, redirection, content } = await store.get(url)
      console.log('cache hit', url)
      req.prerender.cacheHit = true;
      if (redirection) res.setHeader('location', redirection)
      res.send(statusCode, content)
    } catch (err) {
      if (err.name === 'NotFoundError') console.log('cache miss', url)
      else console.error(err)
      next()
    }
  },

  beforeSend: (req, res, next) => {
    const { statusCode, url, redirection } = req.prerender
    let { content } = req.prerender
    if (statusCode == null || statusCode >= 500) return next()

    if (redirection) content = ''

    // We don't need to wait for the store confirmation
    store.set(url, { statusCode, redirection, content })
    .catch(logStoreError)

    next()
  }
}

const logStoreError = err => console.error('store.set error', err)

// Unfortunately, prerender doesn't expost expressjs `setHeaders` function
const setWhitelistedHeaders = (res, headers) => {
  for (key of whitelistedHeaders) {
    if (headers[key] != null) {
      res.setHeader(key, headers[key]);
    }
  }
}

const whitelistedHeaders = [
  'location'
]
