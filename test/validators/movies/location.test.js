'use strict';

const Joi = require('joi');

const LocationValidator = require('../../../lib/validators/movies/location');

describe('location validator', () => {

  describe('location', () => {

    it('is required', () => {
      const payload = {};
      const result = Joi.validate(payload, LocationValidator);

      expect(result.error.details[0].path).to.eql('id');
      expect(result.error.details[0].type).to.eql('any.required');
    });

  });

});

