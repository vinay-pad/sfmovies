'use strict';

const Controller           = require('./controller');
const MovieCreateValidator = require('../../../validators/movies/create');
const LocationValidator    = require('../../../validators/movies/location');

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
  },
  {
    method: 'POST',
    path: '/movies/{id}/locations',
    config: {
      handler: (request, reply) => {
        reply(Controller.addLocation(request.params.id, request.payload));
      },
      validate: {
        payload: LocationValidator
      }
    }
  },
  {
    method: 'GET',
    path: '/movies',
    config: {
      handler: (request, reply) => {
        reply(Controller.findAll(
	  request.query.filter
	));
      },
      plugins: {
        queryFilter: {
          enabled: true,
          params: ['year', 'from', 'to', 'title_exact', 'title_fuzzy']
        }
      }
    }
  }]);
  next();
};

exports.register.attributes = {
  name: 'movies'
};
