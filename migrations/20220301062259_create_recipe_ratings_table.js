/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('recipe_ratings', function(table) {
    table.increments().primary();
    table.bigInteger('recipe_id').notNullable();
    table.integer('user_id').notNullable();
    table.smallint('rating').defaultTo(0);

    table.unique(['recipe_id', 'user_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('recipe_ratings');
};
