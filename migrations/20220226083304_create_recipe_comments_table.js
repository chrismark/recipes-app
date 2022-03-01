/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('recipe_comments', function(table) {
    table.increments().primary();
    table.bigInteger('recipe_id').notNullable();
    table.text('message').notNullable();

    table.index('recipe_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('recipe_comments');
};
