'use strict';

const Movies = require('../../../../lib/server');

describe('movies integration', () => {

  describe('create', () => {

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

  describe('get', () => {

    it('Gets all movies', () => {
      return Movies.inject({
        url: '/movies',
        method: 'GET'
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
      });
    });

    it('Gets movies for a given release year', () => {
      return Movies.inject({
        url: '/movies?year=2011',
        method: 'GET'
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result.length).to.be.gt(0);
        expect(response.result[0]).to.have.all.keys([
          'id',
          'title',
          'release_year',
          'object'
        ]);
      });
    });

    it('Gets movies for a given range of release years', () => {
      return Movies.inject({
        url: '/movies?from=2011&to=2013',
        method: 'GET'
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result.length).to.be.gt(0);
        expect(response.result[0]).to.have.all.keys([
          'id',
          'title',
          'release_year',
          'object'
        ]);
      });
    });

    it('Gets movies for a given exact title', () => {
      return Movies.inject({
        url: '/movies?title_exact=Volver',
        method: 'GET'
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result.length).to.be.gt(0);
        expect(response.result[0]).to.have.all.keys([
          'id',
          'title',
          'release_year',
          'object'
        ]);
      });
    });

    it('Gets movies for a given fuzzy title', () => {
      return Movies.inject({
        url: '/movies?title_fuzzy=Volve',
        method: 'GET'
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result.length).to.be.gt(0);
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
