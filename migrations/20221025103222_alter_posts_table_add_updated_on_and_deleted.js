/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('posts', function(table) {
    table.timestamp('updated_on', {useTz: true});
    table.boolean('deleted').defaultTo(knex.raw('FALSE'));

    table.index('deleted');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('posts', function(table) {
    table.dropColumn('updated_on');
    table.dropColumn('deleted');
  });
};
