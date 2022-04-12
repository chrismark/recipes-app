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
  fetchAll: async function(selectFields = '*') {
    return await db('recipes').select(selectFields);
  },
  /**
   * Create new recipe entries in the recipes table.
   * @param {string} userUuid 
   * @param {Recipe[]} recipesToCreate 
   * @param {string} returnFields 
   * @returns {object[]}
   */
  create: async function(userUuid, recipesToCreate) {
    try {
      recipesToCreate = this._extractProps(recipesToCreate);
      let recipeIds = recipesToCreate.map((recipe) => recipe.id);
      // Look up if recipe has not been saved yet
      let recipes = await this.findById(recipeIds);
      console.log('existing recipes: ', recipes);
      // Filter out from recipesToCreate the ones already saved
      recipesToCreate = recipesToCreate.filter((recipe) => {
        return recipes.findIndex((savedRecipe) => savedRecipe.id == recipe.id) == -1;
      });
      console.log('recipesToCreate: ', recipesToCreate);
      if (recipesToCreate.length > 0) {
        // Link recipe with user
        const user = await db('users').select('id').where({uuid: userUuid});
        console.log('user: ', user);
        let newRecipes = await this._createRecipes(recipesToCreate);
        console.log('new recipes: ', newRecipes);
        await this._createRecipesUsers(user, newRecipes);
        recipes = [...recipes, ...newRecipes];
      }

      return recipes;
    }
    catch (e) {
      console.error(e);
      return [];
    }
  },
  /**
  * Creates new recipe entries in the recipes table.;/
  * @param {string} user_uuid
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
  _createRecipesUsers: async function(user, recipes) {
    try {
      // compose props array for insertion
      let recipeUsers = recipes.map((recipe) => ({ user_id: user[0].id, recipe_id: recipe.id }));
      await db('recipes_users').insert(recipeUsers);
    }
    catch (e) {
      console.error(e);
    }
  },
  _processProps: function(recipe) {
    let {
      id, name, description, slug, thumbnail_url, beauty_url, video_url, servings_noun_singular, 
      servings_noun_plural, total_time_minutes, prep_time_minutes, cook_time_minutes, num_servings, total_time_tier, 
      credits, sections, instructions, nutrition, tags
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
      credits, sections, instructions, nutrition, tags
    };
  },
  /**
   * 
   * @param {object[]} recipes - Each recipe contains all properties including ones not needed
   * @returns {object[]} Returns recipe with only the needed properties
   */
  _extractProps: function(recipes) {
    return recipes.map(this._processProps);
  }
}