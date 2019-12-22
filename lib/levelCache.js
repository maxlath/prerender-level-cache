const cacheManager = require('cache-manager')
const oneMonth = 30 * 24 * 3600 * 1000
const store = require('./store')

module.exports = {
  init: function (server) {
    const ttl = server.options.ttl || 2 * oneMonth
    this.options = { ttl }
    console.log('using prerender-level-cache', this.options)
    this.cache = cacheManager.caching({ store })
  },

  requestReceived: function (req, res, next) {
    if (req.method !== 'GET') return next()
    if (req.refresh === true) return next()
    const { url } = req.prerender

    this.cache.get(url, function (err, result) {
      if (err) console.error(err)

      if (!err && result) {
        console.log('cache hit')
        req.prerender.cacheHit = true;
        return res.send(200, result)
      } else {
        next()
      }
    })
  },

  beforeSend: function (req, res, next) {
    const { url, content } = req.prerender
    this.cache.set(url, content, this.options, (err, result) => {
      if (err) console.error(err)
      else next()
    })
  }
}
