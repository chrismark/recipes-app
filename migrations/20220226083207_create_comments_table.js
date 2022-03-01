/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('post_comments', function(table) {
    table.increments().primary();
    table.integer('user_id');
    table.integer('post_id');
    table.text('message').notNullable();
    table.timestamp('posted_on', {useTz: true}).defaultTo(knex.fn.now());

    table.index('post_id');
    table.index('posted_on');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('post_comments');
};
