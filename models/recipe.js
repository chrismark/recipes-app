const db = require('./db');
const PermsConfig = require('../middleware/permissions').PermissionsConfig;
const RETURN_FIELDS = '*';

/**
  * @typedef {object} Recipe
  * @property {string} id
  * @property {string} name
  * @property {string} description
  * @property {string} slug
  * @property {string} thumbnail_url
  * @property {string} beauty_url
  * @property {string} video_url
  * @property {string} servings_noun_singular
  * @property {string} servings_noun_plural
  * @property {number} total_time_minutes
  * @property {number} prep_time_minutes
  * @property {number} cook_time_minutes
  * @property {number} num_servings
  * @property {object} total_time_tier
  * @property {object} credits
  * @property {object} sections
  * @property {object} instructions
  * @property {object} nutrition
  * @property {object} tags
  */

module.exports = {
  find: async function(fields, selectFields = '*') {
    return await db('recipes').select(selectFields).where(fields);
  },
  findOne: async function(fields, selectFields) {
    const recipe = await this.find(fields, selectFields);
    console.log(recipe);
    return recipe[0];
  },
  /**
   * 
   * @param {number[]} ids 
   * @param {string} [selectFields='*']
   * @returns {object[]}
   */
  findById: async function(ids, selectFields = '*') {
    return await db('recipes').select(selectFields).whereIn('id', ids);
  },
  /**
   * Returns recipes found in ids and linked to provided user id.
   * @param {number} userId 
   * @param {object[]} ids 
   * @returns {object[]}
   */
  findRecipeUserById: async function(userId, ids) {
    /**
     * select
     *  r.id
     * from recipes r
     *  left join recipes_users ru on (ru.recipe_id = r.id)
     * where
     *  ru.user_id = userId
     *  and ru.recipe_id in (ids)
     */
    return await db('recipes').select('recipes.*')
      .leftJoin('recipes_users', 'recipes_users.recipe_id', 'recipes.id')
      .where('recipes_users.user_id', userId)
      .whereIn('recipes_users.recipe_id', ids);
  },
  fetchAll: async function(selectFields = '*') {
    return await db('recipes').select(selectFields).orderBy('created_at', 'desc');
  },
  /**
   * Create new recipe entries in the recipes table.
   * @param {string} userUuid 
   * @param {Recipe[]} recipesSubmitted 
   * @param {string} returnFields 
   * @returns {object[]}
   */
  create: async function(userUuid, recipesSubmitted) {
    try {
      let recipesSubmittedProcessed = this._extractProps(recipesSubmitted);
      let recipesSubmittedProcessedIds = recipesSubmittedProcessed.map((recipe) => recipe.id);
      // Look up if recipe has not been saved yet for user
      let existingRecipes = await this.findById(recipesSubmittedProcessedIds);
      console.log('existing recipes: ', existingRecipes);
      // Filter out from recipesSubmittedProcessed the ones already saved
      let recipesToCreate = recipesSubmittedProcessed.filter((recipeSP) => {
        return existingRecipes.findIndex((existingRecipe) => existingRecipe.id == recipeSP.id) == -1;
      });
      console.log('recipesToCreate: ', recipesToCreate);

      let recipes = [];
      const user = await db('users').select('id').where({uuid: userUuid});
      console.log('user: ', user);
      if (recipesToCreate.length == recipesSubmittedProcessedIds.length) {
        // Create all new recipes
        recipes = await this._createRecipes(recipesToCreate);
        console.log('new recipes: ', recipes);
        // Link recipe with user
        await this._createRecipesUsers(user[0].id, recipes);
      }
      else {
        if (recipesToCreate.length > 0) {
          // Create new recipes
          await this._createRecipes(recipesToCreate);
        }
        // If the recipes have been created, then filter out ones already in recipes_users
        let existingRecipesUsers = await this.findRecipeUserById(user[0].id, recipesSubmittedProcessedIds);
        let recipesUsersToCreate = recipesSubmittedProcessed.filter((recipeSP) => {
          return existingRecipesUsers.findIndex((existingRecipeUser) => existingRecipeUser.id == recipeSP.id) == -1;
        });
        console.log('recipesUsersToCreate: ', recipesUsersToCreate);
        if (recipesUsersToCreate.length > 0) {
          // Link recipe with user
          await this._createRecipesUsers(user[0].id, recipesUsersToCreate);
          recipes = recipesUsersToCreate;
        }
      }

      return recipes;
    }
    catch (e) {
      console.error(e);
      return [];
    }
  },
  /**
  * Creates new recipe entries in the recipes table.
  * @param {Recipe[]} recipes 
  * @param {string[]} [returnFields=null]
  * @returns {object[]}
  */
  _createRecipes: async function(recipes, returnFields = '*') {
    try {
      return await db('recipes').insert(recipes).returning(
        returnFields || RETURN_FIELDS
      );
    }
    catch (e) {
      console.error(e);
      return [];
    }
  },
  /**
   * Create new recipes_users entries.
   * @param {number} userId 
   * @param {object[]} recipes 
   */
  _createRecipesUsers: async function(userId, recipes) {
    try {
      // compose props array for insertion
      let recipeUsers = recipes.map((recipe) => ({ user_id: userId, recipe_id: recipe.id }));
      await db('recipes_users').insert(recipeUsers);
    }
    catch (e) {
      console.error(e);
    }
  },
  /**
   * Returns a new object containing only the needed properties.
   * @param {object} recipe 
   * @returns {object}
   */
  _processProps: function(recipe) {
    let {
      id, name, description, slug, thumbnail_url, beauty_url, video_url, servings_noun_singular, 
      servings_noun_plural, total_time_minutes, prep_time_minutes, cook_time_minutes, num_servings, total_time_tier, 
      credits, sections, instructions, nutrition, tags, approved_at, aspect_ratio
    } = recipe;

    tags = JSON.stringify(tags);
    sections = JSON.stringify(sections);
    total_time_tier = JSON.stringify(total_time_tier);
    instructions = JSON.stringify(instructions);
    credits = JSON.stringify(credits);
    nutrition = JSON.stringify(nutrition);

    return {
      id, name, description, slug, thumbnail_url, beauty_url, video_url, servings_noun_singular, 
      servings_noun_plural, total_time_minutes, prep_time_minutes, cook_time_minutes, num_servings, total_time_tier, 
      credits, sections, instructions, nutrition, tags, approved_at, aspect_ratio
    };
  },
  /**
   * Extract and return an array of recipes with only the neede properties
   * @param {object[]} recipes - Each recipe contains all properties including ones not needed
   * @returns {object[]} Returns recipe with only the needed properties
   */
  _extractProps: function(recipes) {
    return recipes.map(this._processProps);
  }
}