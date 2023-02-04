/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('post_stats_count', function(table) {
    table.dropUnique('post_id');
    table.integer('recipe_id').nullable();
    table.unique(['post_id', 'recipe_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('post_stats_count', function(table) {
    table.dropUnique(['post_id', 'recipe_id']);
    table.dropColumn('recipe_id');
    table.unique('post_id');
  });
};
