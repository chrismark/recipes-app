/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('post_shares', function(table) {
    table.dropIndex('post_id');
    table.integer('recipe_id').nullable();
    table.index(['post_id', 'recipe_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('post_shares', function(table) {
    table.dropIndex(['post_id', 'recipe_id']);
    table.dropColumn('recipe_id');
    table.index('post_id');
  });
};
