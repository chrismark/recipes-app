/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('post_shares', function(table) {
    table.increments().primary();
    table.integer('post_id').notNullable();
    table.integer('user_id').notNullable();

    table.index('post_id');
    table.index('user_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('post_shares');
};
