/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('recipes_users', function(table) {
    table.integer('user_id').notNullable();
    table.bigInteger('recipe_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index(['user_id', 'recipe_id']);
    table.index('created_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('recipes_users');
};
