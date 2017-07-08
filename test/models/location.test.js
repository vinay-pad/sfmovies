'use strict';

const Location = require('../../lib/models/location');

describe('location model', () => {

  describe('serialize', () => {

    it('includes all of the necessary fields', () => {
      const location = Location.forge().serialize();
      expect(location).to.have.all.keys([
        'id',
        'location',
        'object'
      ]);
    });

  });

});
