'use strict';

const Controller           = require('./controller');
const MovieCreateValidator = require('../../../validators/movies/create');

exports.register = (server, options, next) => {
  server.route([{
    method: 'POST',
    path: '/movies',
    config: {
      handler: (request, reply) => {
        reply(Controller.create(request.payload));
      },
      validate: {
        payload: MovieCreateValidator
      }
    }
  }]);
  next();
};

exports.register.attributes = {
  name: 'movies'
};
