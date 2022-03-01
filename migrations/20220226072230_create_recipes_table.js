/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('recipes', function(table) {
      table.bigInteger('id').primary();
      table.text('name').notNullable();
      table.text('description');
      table.text('slug');
      table.text('thumbnail_url');
      table.text('beauty_url');
      table.text('video_url');
      table.string('servings_noun_singular');
      table.string('servings_noun_plural');
      table.smallint('total_time_minutes');
      table.smallint('prep_time_minutes');
      table.smallint('cook_time_minutes');
      table.smallint('num_servings');
      table.json('total_time_tier');
      table.json('credits');
      table.json('sections');
      table.json('instructions');
      table.json('nutrition');
      table.json('tags');

      table.index('slug');
      table.index('id');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('recipes');
};
