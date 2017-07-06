'use strict';

const Controller = require('../../../../lib/plugins/features/movies/controller');
const Movie      = require('../../../../lib/models/movie');
const Knex       = require('../../../../lib/libraries/knex');

describe('movie controller', () => {

  describe('create', () => {

    it('creates a movie', () => {
      const payload = { title: 'WALL-E' };

      return Controller.create(payload)
      .then((movie) => {
        expect(movie.get('title')).to.eql(payload.title);

        return new Movie({ id: movie.id }).fetch();
      })
      .then((movie) => {
        expect(movie.get('title')).to.eql(payload.title);
      });
    });

  });

  describe('list', () => {

    beforeEach(() => {
      return Knex.raw('TRUNCATE movies CASCADE;');
    });

    beforeEach(() => {
      const movie_list = [
        {
          title: 'Argo',
          release_year: 2011
        },
        {
          title: 'Argo2',
          release_year: 2012
        },
        {
          title: 'Bedazzled',
          release_year: 2007
        }
      ];
      return Knex('movies').insert(movie_list);
    });

    it('List all movies. No filters specified', () => {
      const filter = {};
      return Controller.findAll(filter)
      .then((movies) => {
        expect(movies).to.have.length(3);
      });
    });

    it('List all movies, filtered by year ', () => {
      const filter = { year: 2011 };
      return Controller.findAll(filter)
      .then((movies) => {
        expect(movies).to.have.length(1);
      });
    });

    it('List all movies, filtered by range ', () => {
      const filter = { from: 2011, to: 2012 };
      return Controller.findAll(filter)
      .then((movies) => {
        expect(movies).to.have.length(2);
      });
    });

  });

});

