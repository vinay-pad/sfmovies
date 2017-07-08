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

    beforeEach(() => {
      return Knex.raw('TRUNCATE movies CASCADE')
        .then(() => {
          return Knex('movies').insert(movie_list);
        });
    });

    it('lists all movies with no filters specified', () => {
      const filter = {};
      return Controller.findAll(filter)
      .then((movies) => {
        expect(movies).to.have.length(3);
      });
    });

    it('lists all movies filtered by year', () => {
      const filter = { year: 2014 };
      return Controller.findAll(filter)
      .then((movies) => {
        expect(movies).to.have.length(1);
      });
    });

    it('lists all movies filtered by range', () => {
      const filter = { from: 2007, to: 2012 };
      return Controller.findAll(filter)
      .then((movies) => {
        expect(movies).to.have.length(2);
      });
    });

    it('lists all movies filtered by exact title', () => {
      const filter = { title_exact: 'Guardians of the Galaxy' };
      return Controller.findAll(filter)
      .then((movies) => {
        expect(movies).to.have.length(1);
      });
    });

    it('lists all movies filtered by fuzzy title', () => {
      const filter = { title_fuzzy: 'Bedazled' };
      return Controller.findAll(filter)
      .then((movies) => {
        expect(movies).to.have.length(1);
      });
    });

  });

  describe('add', () => {

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
        location: 'San Francisco'
      },
      {
        location: 'New York'
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
      return new Movie({ title: 'Bedazzled' }).fetch()
      .then((movie) => {
        const payload = { location: 'New York' };
        return Controller.addLocation(movie.id, payload);
      })
      .then((movie) => {
        const payload = { location: 'San Francisco' };
        return Controller.addLocation(movie.id, payload);
      })
      .then((movie) => {
        expect(movie.related('locations')).to.have.length(2);
      });

    });

  });

});

