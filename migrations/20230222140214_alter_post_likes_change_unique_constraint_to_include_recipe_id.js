/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('post_likes', function(table) {
    table.dropUnique(['post_id', 'user_id']);
    table.unique(['post_id', 'user_id', 'recipe_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('post_likes', function(table) {
    table.dropUnique(['post_id', 'user_id', 'recipe_id']);
    table.unique(['post_id', 'user_id']);
  });
};
