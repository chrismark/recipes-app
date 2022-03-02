/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
      table.increments().primary();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('username');
      table.string('firstname');
      table.string('lastname');
      table.string('timezone').defaultTo('Asia/Chongqing').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
