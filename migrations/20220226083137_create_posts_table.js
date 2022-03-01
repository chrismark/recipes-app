/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('posts', function(table) {
    table.increments().primary();
    table.integer('user_id').notNullable();
    table.text('message').notNullable();
    table.timestamp('posted_on').defaultTo(knex.fn.now());

    table.index('user_id');
    table.index('posted_on');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('posts');
};
