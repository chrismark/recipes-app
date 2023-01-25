/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('post_stats_count', function(table) {
    table.dropIndex('post_id');
    table.unique('post_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('post_stats_count', function(table) {
    table.dropUnique('post_id');
    table.index('post_id');
  });
};
