const level = require('level-party')
const root = require('app-root-path')
const db = level(root.path + '/db')

module.exports = {
  get: (key, freshness, callback) => {
    const cb = getWrappedCallback(freshness, callback, key)
    return db.get(key, cb)
  },
  set: (key, value, callback) => {
    return db.put(key, getValueJson(value), callback)
  }
}

const getValueJson = value => {
  return JSON.stringify({
    body: value,
    timestamp: new Date().getTime()
  })
}

const getWrappedCallback = (freshness, cb, key) => (err, res) => {
  if (err != null) return cb(err)

  res = JSON.parse(res)
  if (isFreshEnough(res.timestamp, freshness)) {
    cb(null, res.body)
  } else {
    cb(new Error('expired'))
  }
}

const isFreshEnough = (timestamp, timespan) => {
  const age = Date.now() - timestamp
  return age < timespan
}
