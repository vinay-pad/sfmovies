'use strict';

const Movies = require('../../../../lib/server');
const Knex   = require('../../../../lib/libraries/knex');

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
          'object'
        ]);
      });
    });

  });

});
