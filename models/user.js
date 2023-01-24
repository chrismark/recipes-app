require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const PermsConfig = require('../middleware/permissions').PermissionsConfig;
const RETURN_FIELDS = ['id', 'uuid', 'email', 'username', 'firstname', 'lastname'];
const GENERATE_TOKEN_SCOPE = [
  PermsConfig.FetchAllPosts, PermsConfig.FetchTastyRecipes,
  PermsConfig.CreatePost, PermsConfig.UpdatePost, PermsConfig.FetchPost, PermsConfig.LikePost, PermsConfig.UnlikePost, PermsConfig.FetchUserWhoLikedPost, PermsConfig.FetchAllUserPosts, 
  PermsConfig.CreateComment, PermsConfig.FetchAllComments, PermsConfig.UpdateComment,
  PermsConfig.FetchUser, PermsConfig.UpdateUser, 
  PermsConfig.CreateRecipe, PermsConfig.UpdateRecipe, PermsConfig.FetchAllRecipes,
  PermsConfig.CreateRecipeComment, PermsConfig.UpdateRecipeComment, PermsConfig.FetchAllRecipeComments,
  PermsConfig.CreateRating, PermsConfig.UpdateRating, PermsConfig.FetchAllRatings,
  PermsConfig.FetchUserRecipes
].join(' ');
const FETCH_RECIPES_FIELDS_MINIMAL = ['recipes.id', 'recipes.name', 'recipes.thumbnail_url', 'recipes.aspect_ratio' ];
const FETCH_RECIPES_FIELDS = ['recipes.id', 'recipes.name', 'recipes.slug', 'recipes.thumbnail_url', 'recipes.aspect_ratio', 'recipes.total_time_minutes', 'recipes.prep_time_minutes', 'recipes.cook_time_minutes', 'recipes.total_time_tier'];
const FETCH_RECIPE_FIELDS = [...FETCH_RECIPES_FIELDS, 'description', 'video_url', 'servings_noun_singular', 'servings_noun_plural', 'num_servings', 'credits', 'sections', 'instructions', 'nutrition', db.raw('coalesce(recipe_ratings.rating, 0) as rating'), 'recipe_ratings.id as rating_id'];

module.exports = {
  find: async function(fields) {
    return await db('users').select('*').where(fields);
  },
  findOne: async function(fields) {
    const user = await this.find(fields);
    console.log(user);
    return user[0];
  },
  isEmailExists: async function(email) {
    const user = await this.findOne({ email });
    console.log(!!user);
    return  !!(user);
  },
  generateToken: function(user) {
    return jwt.sign(
      {
        email: user.email,
        scope: GENERATE_TOKEN_SCOPE,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: process.env.TOKEN_EXPIRATION || '2h',
        subject: user.uuid,
        audience: 'recipe-app-frontend',
        issuer: 'recipe-app-backend',
      }
    );
  },
  authenticate: async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        let {uuid, email, username, firstname, lastname, timezone} = user;
        return {uuid, email, username, firstname, lastname, timezone};
      }
    }
    return null;
  },
  /**
  * Create a new user entry in the users table.
  * @param {object} fields 
  * @param {string} fields.firstname
  * @param {string} fields.lastname
  * @param {string} fields.email
  * @param {string} fields.password
  */
  create: async function({firstname, lastname, email, password}, returnFields = null) {
    try {
      // Encrypt user password
      let encryptedPassword = await bcrypt.hash(password, 10);
      // Create user 
      let user = await db('users').insert({
        uuid: uuidv4(),
        firstname,
        lastname,
        email: email.toLowerCase(),
        password: encryptedPassword,
      }).returning(
        returnFields || RETURN_FIELDS
      );
      return user[0];
    }
    catch (e) {
      console.error(e);
      return null;
    }
  },
  update: async function(id, fields, returnFields = null) {
    try {
      let user = await db.from('users').update(fields).where({id: id}).returning(
        returnFields || RETURN_FIELDS
      );
      return user[0];
    }
    catch (e) {
      console.error(e);
      return null;
    }  
  },
  fetchRecipes: async function(userUuid, page = 1, mode = 'full') {
    console.log('fetchRecipes: mode=', mode);
    /**
     * select
     *  r.*
     * from recipes r
     *  left join recipes_users ru on (ru.recipe_id = r.id)
     *  left join users u on (u.id = ru.user_id)
     * where
     *  ru.user_id = user_uuid
     */
    let fields = FETCH_RECIPES_FIELDS;
    if (mode == 'minimal') {
      fields = FETCH_RECIPES_FIELDS_MINIMAL;
    }
    const sql = db('recipes').select(fields)
      .leftJoin('recipes_users', 'recipes_users.recipe_id', 'recipes.id')
      .leftJoin('users', 'users.id', 'recipes_users.user_id')
      .where('users.uuid', userUuid)
      .orderBy('recipes.created_at', 'desc');
    console.log(sql.toString());
    return await sql;
  },
  fetchRecipe: async function(userUuid, recipe_id) {
    let query = db('recipes').select(FETCH_RECIPE_FIELDS)
      .leftJoin('recipes_users', 'recipes_users.recipe_id', 'recipes.id')
      .leftJoin('users', 'users.id', 'recipes_users.user_id')
      .leftJoin('recipe_ratings', 'recipe_ratings.recipe_id', 'recipes_users.recipe_id')
      .where('users.uuid', userUuid)
      .andWhere('recipes.id', parseInt(recipe_id, 10));
    console.log('query: ', query.toString());
    return await query;
  },
  fetchPosts: async function(userUuid, page = 1) {

  },
  fetchPost: async function(userUuid, post) {
    
  }
};

