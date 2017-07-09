'use strict';

const Bluebird = require('bluebird');
const Location = require('../../../models/location');
const Movie    = require('../../../models/movie');

exports.create = (payload) => {
  return new Movie().save(payload)
  .then((movie) => {
    return new Movie({ id: movie.id }).fetch();
  });
};

exports.addLocation = (movie_id, payload) => {
  return Bluebird.all([
    new Movie({ id: movie_id }).fetch(),
    new Location({ id: payload.id }).fetch()
  ])
  .spread((movie, location) => {
    return movie.related('locations').attach(location);
  })
  .then(() => {
    return new Movie({ id: movie_id })
	       .fetch({ withRelated: Movie.RELATED });
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
      qb.where('title', filter.title_exact);
    }
    if (filter.title_fuzzy) {
      qb.whereRaw(`title % '${filter.title_fuzzy}'`);
    }
  })
  .fetchAll({ withRelated: Movie.RELATED });
};
