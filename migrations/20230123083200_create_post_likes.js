/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('post_likes', function(table) {
    table.increments().primary();
    table.integer('post_id').notNullable();
    table.integer('user_id').notNullable();
    table.smallint('type').notNullable().comment('1 = Like, 2 = Heart, 3 = Care, 4 = Laugh, 5 = Sad, 6 = Surprise, 7 = Angry');

    table.index(['post_id', 'type']);
    table.index('user_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('post_likes');
};
