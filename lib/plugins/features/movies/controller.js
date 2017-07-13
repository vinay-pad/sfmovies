'use strict';

const Bluebird = require('bluebird');
const Boom     = require('boom');

const Location = require('../../../models/location');
const Movie    = require('../../../models/movie');

exports.create = (payload) => {
  payload.name = payload.title;
  Reflect.deleteProperty(payload, 'title');
  return new Movie().save(payload)
  .then((movie) => {
    console.log(movie);
    return new Movie({ id: movie.id }).fetch();
  });
};

exports.addLocation = (movieId, payload) => {
  return Bluebird.all([
    new Movie({ id: movieId }).fetch({ require: true }),
    new Location({ id: payload.id }).fetch({ require: true })
  ])
  .spread((movie, location) => {
    return movie.related('locations').attach(location);
  })
  .catch(Movie.NotFoundError, (err) => {
    throw Boom.wrap(err, 404);
  })
  .catch(Location.NotFoundError, (err) => {
    throw Boom.wrap(err, 404);
  })
  .then(() => {
    return new Movie({ id: movieId }).fetch({ withRelated: Movie.RELATED });
  });
};

exports.findAll = (filter) => {
  return new Movie()
  .query((qb) => {
    if (filter.year) {
      qb.where('release_year', filter.year);
    }
    if (filter.from) {
      qb.where('release_year', '>=', filter.from);
    }
    if (filter.to) {
      qb.where('release_year', '<=', filter.to);
    }
    if (filter.title_exact) {
      qb.where('name', filter.title_exact);
    }
    if (filter.title_fuzzy) {
      qb.whereRaw(`name % '${filter.title_fuzzy}'`);
    }
  })
  .fetchAll({ withRelated: Movie.RELATED });
};
