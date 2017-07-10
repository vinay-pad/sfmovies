
exports.up = function(knex, Promise) {
  return knex.schema.createTable('movies', (table) => {
    table.increments('id').primary();
    table.text('title').notNullable();
    table.integer('release_year');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('movies'); 
};
