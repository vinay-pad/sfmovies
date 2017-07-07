'use strict';

const Hapi = require('hapi');

const Config = require('../config');

const server = new Hapi.Server({
  connections: {
    router: { stripTrailingSlash: true } // removes trailing slashes on incoming paths
  }
});

server.connection({ port: Config.PORT });

server.register([
  require('hapi-bookshelf-serializer'),
  {
    register: require('hapi-format-error'),
    options: { joiStatusCode: 422 }
  },
  {
    register: require('hapi-query-filter'),
    options: {
      defaultEnabled: true // if true plugin will be used on all routes
    }
  },
  require('./plugins/features/movies')
], (err) => {
  /* istanbul ignore if */
  if (err) {
    throw err;
  }
});

module.exports = server;
