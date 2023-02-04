/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('post_likes', function(table) {
    table.dropIndex(['post_id', 'type']);
    table.integer('recipe_id').nullable();
    table.index(['post_id', 'recipe_id', 'type']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('post_likes', function(table) {
    table.dropIndex(['post_id', 'recipe_id', 'type']);
    table.dropColumn('recipe_id');
    table.index(['post_id', 'type']);
  });
};
