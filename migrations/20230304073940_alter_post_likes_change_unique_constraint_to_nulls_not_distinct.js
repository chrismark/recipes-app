/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.raw('ALTER TABLE post_likes ADD CONSTRAINT "post_likes_post_id_user_id_recipe_id_unique_nulls_not_distinct" UNIQUE NULLS NOT DISTINCT (post_id, user_id, recipe_id);').alterTable('post_likes', function(table) {
    table.dropUnique(['post_id', 'user_id', 'recipe_id'], 'post_likes_post_id_user_id_recipe_id_unique');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('post_likes', function(table) {
    table.dropUnique(['post_id', 'user_id', 'recipe_id'], 'post_likes_post_id_user_id_recipe_id_unique_nulls_not_distinct');
    table.unique(['post_id', 'user_id', 'recipe_id']);
  });
};
