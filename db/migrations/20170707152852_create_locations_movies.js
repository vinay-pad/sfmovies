
exports.up = function(knex, Promise) {
  return knex.schema.createTable('locations_movies', (table) => {
    table.integer('location_id');
    table.integer('movie_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('locations_movies');
};
