'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('locations', (table) => {
    table.increments('id').primary();
    table.text('location').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('locations');
};
