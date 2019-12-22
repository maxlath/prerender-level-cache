# prerender-level-cache

Prerender plugin for level caching, to be used with the prerender node application from https://github.com/prerender/prerender.

## How it works

This plugin will store all prerendered pages into [LevelDB](https://github.com/Level/level).

## How to use

In your local prerender project run:
```sh
$ npm install prerender-level-cache
```

Then in the server.js that initializes the prerender:

```js
server.use(require('prerender-level-cache'));
```

## Features

### Ttl
It uses a default ttl of 2 months, but that can be overridden by setting a different value in prerender `server.options.ttl`.

### Refresh
You can force a refresh from another plugin by setting `req.refresh = true`

Exemple:
```js
// in another plugin placed before prerender-level-cache
module.exports = {
  requestReceived: (req, res, next) => {
    req.refresh = true
    next()
  }
}
```

Alternatively, you can delete the cache directly in the LevelDB database, using a tool such as [lev2](https://github.com/maxlath/lev2).

### Level-party
The plugin uses the [level-party](https://github.com/substack/level-party) module to get over the level multi-process restrictions.
