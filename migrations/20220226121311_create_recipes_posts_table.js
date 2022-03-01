/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('recipes_post', function(table) {
    table.integer('post_id').notNullable();
    table.bigInteger('recipe_id').notNullable();

    table.index('post_id');
    table.index('recipe_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('recipes_post');
};
