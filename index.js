var pkg = require('./package.json')
var provider = require('koop-provider')

var povcal = provider({
  name: 'github',
  version: pkg.version,
  model: require('./model/povcal'),
  controller: require('./controller'),
  routes: require('./routes')
})

module.exports = povcal
