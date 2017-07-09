'use strict';

const Bluebird = require('bluebird');
const Knex     = require('../../../../lib/libraries/knex');
const Location = require('../../../../lib/models/location');
const Movies   = require('../../../../lib/server');
const Movie    = require('../../../../lib/models/movie');

describe('movies integration', () => {

  describe('create', () => {

    beforeEach(() => {
      return Knex.raw('TRUNCATE movies CASCADE');
    });

    it('creates a movie', () => {
      return Movies.inject({
        url: '/movies',
        method: 'POST',
        payload: { title: 'Volver',
                   release_year: '2011' }
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result.object).to.eql('movie');
      });
    });

  });

  describe('list', () => {

    it('Lists all movies', () => {
      return Movies.inject({
        url: '/movies',
        method: 'GET'
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
      });
    });

    it('lists movies for a given release year', () => {
      return Movies.inject({
        url: '/movies?year=2011',
        method: 'GET'
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result.length).to.be.eq(1);
        expect(response.result[0]).to.have.all.keys([
          'id',
          'title',
          'release_year',
          'locations',
          'object'
        ]);
      });
    });

    it('lists movies for a given range of release years', () => {
      return Movies.inject({
        url: '/movies?from=2011&to=2013',
        method: 'GET'
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result.length).to.be.eq(1);
        expect(response.result[0]).to.have.all.keys([
          'id',
          'title',
          'release_year',
          'locations',
          'object'
        ]);
      });
    });

    it('lists movies for a given fuzzy title', () => {
      return Movies.inject({
        url: '/movies?title_fuzzy=Volve',
        method: 'GET'
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result.length).to.be.eq(1);
        expect(response.result[0]).to.have.all.keys([
          'id',
          'title',
          'release_year',
          'locations',
          'object'
        ]);
      });
    });

  });

  describe('addLocation', () => {

    const movie_list = [
      {
        title: 'Argo',
        release_year: 2012
      },
      {
        title: 'Guardians of the Galaxy',
        release_year: 2014
      },
      {
        title: 'Bedazzled',
        release_year: 2007
      }
    ];

    const locations_list = [
      {
        location: 'SoMa'
      },
      {
        location: 'The Haight'
      }
    ];

    beforeEach(() => {
      return Knex.raw('TRUNCATE movies CASCADE')
        .then(() => {
          return Knex('movies').insert(movie_list);
        });
    });

    beforeEach(() => {
      return Knex.raw('TRUNCATE locations CASCADE')
        .then(() => {
          return Knex('locations').insert(locations_list);
        });
    });

    it('location to movie', () => {
      return Bluebird.all([
        new Movie({ title: 'Bedazzled' }).fetch(),
        new Location({ location: 'SoMa' }).fetch()
      ])
      .spread((movie, location) => {
        return Movies.inject({
          url: `/movies/${movie.id}/locations`,
          method: 'POST',
          payload: { id: location.id }
        });
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
      });
    });

  });

});
