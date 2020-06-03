# CHANGELOG
*versions follow [SemVer](http://semver.org)*

## 3.0.0 - 2020-06-03
**BREAKING CHANGES**: the database structure has been changed. You need to delete the previous database to restart with the new format.
* Add support for non-200 status code
* Store and return 301, 302 `location` header

## 2.0.0 - 2019-12-22
**BREAKING CHANGES**
* Replace the concept of freshness by a [ttl](https://github.com/maxlath/prerender-level-cache#ttl)
* [Update `level-party` to `v4.0.0`](https://github.com/Level/party/blob/master/CHANGELOG.md#400---2019-12-08)
