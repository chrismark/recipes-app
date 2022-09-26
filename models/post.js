const db = require('./db');
const RETURN_FIELDS = '*';
const FETCH_RECIPES_FIELDS_MINIMAL = ['recipes.id', 'recipes.name', 'recipes.thumbnail_url', 'recipes.aspect_ratio'];
const FETCH_PAGINATION_LIMIT = 6;

/**
  * @typedef {object} Post
  * @property {number} id
  * @property {number} user_d
  * @property {string} message
  * @property {string} posted_on
  */

// TODO: 
module.exports = {
  find: async function(fields, selectFields = '*') {
    return await db('posts').select(selectFields).where(fields);
  },
  findOne: async function(fields, selectFields) {
    const post = await this.find(fields, selectFields);
    console.log(post);
    return post[0];
  },
  /**
   * 
   * @param {number[]} ids 
   * @param {string} [selectFields='*']
   * @returns {object[]}
   */
  findById: async function(ids, selectFields = '*') {
    return await db('posts').select(selectFields).whereIn('id', ids);
  },
  /**
   * 
   * @param {number} userUuid 
   * @param {string} [selectFields='*']
   */
  fetch: async function(userUuid, offset = -1, selectFields = '*') {
    let query = db('posts').select(selectFields);
    if (offset != -1) {
      offset = Math.max(0, offset * FETCH_PAGINATION_LIMIT);
      query = query.limit(FETCH_PAGINATION_LIMIT).offset(offset);
    }
    query = query.orderBy('posted_on', 'desc');
    console.log('query: ', query.toString());
    let posts = await query;
    // loop thru posts and fetch associated recipes
    for (let i = 0; i < posts.length; i++) {
      posts[i].recipes = await this._fetchRecipesPostByPostId(posts[i].id);
    }
    console.log('posts: ', posts);
    return posts;
  },
  _fetchRecipesPostByPostId: async function(postId, selectFields = '*') {
    let query = db('recipes_post').select(FETCH_RECIPES_FIELDS_MINIMAL)
      .leftJoin('recipes', 'recipes.id', 'recipes_post.recipe_id')
      .where('recipes_post.post_id', postId)
      .orderBy('recipe_id', 'asc');
    console.log('query: ', query.toString());
    return await query;
  },
  /**
   * Create new post and recipes_post entries
   * @param {string} userUuid 
   * @param {object} post 
   * @returns {object[]}
   */
  create: async function(userUuid, post) {
    try {
      const user = await db('users').select('id').where({uuid: userUuid});
      console.log('user: ', user);
      // Create new 'post'
      let postToCreate = {
        user_id: user[0].id,
        message: post.message
      };
      let createdPost = await this._createPost(postToCreate);
      console.log('createdPost: ', createdPost);
      // Create new 'recipes_post'
      let recipesPost = await this._createRecipesPost(createdPost, post.recipes);
      return {
        id: createdPost.id,
        message: createdPost.message,
        recipes: recipesPost
      };
    }
    catch (e) {
      console.error(e);
      return [];
    }
  },
  /**
  * Creates new post entry in the recipes table.
  * @param {Recipe[]} post 
  * @param {string[]} [returnFields=null]
  * @returns {object[]}
  */
  _createPost: async function(post, returnFields = '*') {
    try {
      let newPost = await db('posts').insert(post).returning(
        returnFields || RETURN_FIELDS
      );
      return newPost[0];
    }
    catch (e) {
      console.error(e);
      return null;
    }
  },
  /**
   * Create new recipes_posts entries.
   * @param {number} userId 
   * @param {object[]} recipes 
   */
  _createRecipesPost: async function(post, recipes, returnFields = '*') {
    try {
      // compose props array for insertion
      let recipePosts = recipes.map((recipe) => ({ post_id: post.id, recipe_id: recipe.id, caption: recipe.caption }));
      return await db('recipes_post').insert(recipePosts).returning(
        returnFields || RETURN_FIELDS
      );
    }
    catch (e) {
      console.error(e);
      return [];
    }
  },
};