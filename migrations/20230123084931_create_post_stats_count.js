/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('post_stats_count', function(table) {
    table.increments().primary();
    table.integer('post_id').notNullable();
    table.integer('like').defaultTo(0);
    table.integer('heart').defaultTo(0);
    table.integer('care').defaultTo(0);
    table.integer('laugh').defaultTo(0);
    table.integer('sad').defaultTo(0);
    table.integer('surprise').defaultTo(0);
    table.integer('angry').defaultTo(0);
    table.integer('comments').defaultTo(0);
    table.integer('shares').defaultTo(0);

    table.index('post_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('post_stats_count');
};
