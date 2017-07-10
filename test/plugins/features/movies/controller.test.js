'use strict';

const Bluebird = require('bluebird');

const Controller = require('../../../../lib/plugins/features/movies/controller');
const Knex       = require('../../../../lib/libraries/knex');
const Location   = require('../../../../lib/models/location');
const Movie      = require('../../../../lib/models/movie');

const MOVIE_LIST = [
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

const LOCATION_LIST = [
  {
    name: 'SoMa'
  },
  {
    name: 'The Haight'
  }
];

describe('movie controller', () => {

  beforeEach(() => {
    return Bluebird.all([
      Knex.raw('TRUNCATE movies CASCADE'),
      Knex.raw('TRUNCATE locations CASCADE')
    ])
    .then(() => {
      return Bluebird.all([
        Knex('movies').insert(MOVIE_LIST),
        Knex('locations').insert(LOCATION_LIST)
      ]);
    });
  });

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
      const filter = { title_exact: MOVIE_LIST[1].title };
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

  describe('addLocation', () => {

    it('adds location to movie', () => {
      return Bluebird.all([
        new Movie({ title: MOVIE_LIST[2].title }).fetch(),
        new Location({ name: LOCATION_LIST[0].name }).fetch()
      ])
      .spread((movie, location) => {
        const payload = { id: location.id };
        return Controller.addLocation(movie.id, payload);
      })
      .then((movie) => {
        expect(movie.related('locations')).to.have.length(1);
      });
    });

    it('errs when passed a non-existent movie', () => {
      return new Location({ name: LOCATION_LIST[0].name }).fetch()
      .then((location) => {
        const payload = { id: location.id };
        const dummyMovId = 9999;
        return Controller.addLocation(dummyMovId, payload);
      })
      .catch((error) => error)
      .then((error) => {
        expect(error).to.be.instanceof(Movie.NotFoundError);
      });
    });

    it('errs when passed a non-existent location', () => {
      return  new Movie({ title: MOVIE_LIST[2].title }).fetch()
      .then((movie) => {
        const dummyLocId = 9999;
        const payload = { id: dummyLocId };
        return Controller.addLocation(movie.id, payload);
      })
      .catch((error) => error)
      .then((error) => {
        expect(error).to.be.instanceof(Location.NotFoundError);
      });
    });

  });

});
