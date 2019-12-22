const level = require('level-party')
const root = require('app-root-path')
const levelTtl = require('level-ttl')
const db = levelTtl(level(root.path + '/db'))

module.exports = {
  get: (key, callback) => {
    db.get(key, callback)
  },

  set: (key, value, options, callback) => {
    db.put(key, value, options, callback)
  }
}
