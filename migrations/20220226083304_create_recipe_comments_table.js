/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('recipe_comments', function(table) {
    table.increments().primary();
    table.integer('parent_id');
    table.bigInteger('recipe_id').notNullable();
    table.integer('user_id');
    table.text('message').notNullable();
    table.timestamp('posted_on', {useTz: true}).defaultTo(knex.fn.now());
    table.timestamp('updated_on', {useTz: true});
    table.boolean('deleted').defaultTo(knex.raw('FALSE'));

    table.index('parent_id');
    table.index('recipe_id');
    table.index('posted_on');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('recipe_comments');
};
