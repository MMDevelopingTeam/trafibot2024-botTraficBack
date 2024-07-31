const getExpeditiousCache = require('express-expeditious');

const defaultOptions = {
  namespace: 'expresscache',
  defaultTtl: '5 minute',
  statusCodeExpires: {
    404: '5minutes',
    500: 0
  }
}

const cacheInit = getExpeditiousCache(defaultOptions)

module.exports = { cacheInit }