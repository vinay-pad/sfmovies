'use strict';

const Movies    = require('./data/movies');
const Locations = require('./data/locations');

exports.seed = function (Knex) {
  return Promise.all([
    Knex('movies').truncate(),
    Knex('locations').truncate()
  ])
  .then(() => {
    return Promise.all([
      Knex('locations').insert(Locations),
      Knex('movies').insert(Movies)
    ]);
  });
};

