const db = require('./db');
const RETURN_FIELDS = '*';
const FETCH_RECIPES_POST_FIELDS_MINIMAL = ['recipes.id', 'recipes.name', 'recipes.thumbnail_url', 'recipes.aspect_ratio', 'recipes_post.caption'];
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
    let query = db('recipes_post').select(FETCH_RECIPES_POST_FIELDS_MINIMAL)
      .leftJoin('recipes', 'recipes.id', 'recipes_post.recipe_id')
      .where('recipes_post.post_id', postId)
      .orderBy('order', 'asc');
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
        user_id: createdPost.user_id,
        posted_on: createdPost.posted_on,
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
        returnFields
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
  _createRecipesPost: async function(post, recipes, returnFields = 'id, name, thumbnail_url, aspect_ratio') {
    try {
      // compose props array for insertion
      let recipePosts = recipes.map((recipe, index) => ({ post_id: post.id, recipe_id: recipe.id, caption: recipe.caption, order: index }));
      let query = db.with('inserted_recipes_post', 
        db('recipes_post').insert(recipePosts).returning(['order', 'recipe_id', 'caption'])
      )
      .select(FETCH_RECIPES_POST_FIELDS_MINIMAL)
      .from('inserted_recipes_post')
      .leftJoin('recipes', 'recipes.id', 'inserted_recipes_post.recipe_id')
      .orderBy('inserted_recipes_post.order', 'asc');
      console.log('query: ', query.toString());
      return await query;
    }
    catch (e) {
      console.error(e);
      return [];
    }
  },
  update: async function(userUuid, post) {
    try {
      // TODO: 
      // 1. If post message changed, Update
      // 2. For each recipes,
      //  2.1 If recipe has no ID then it's new, Create
      //  2.2 If recipe has ID,
      //   2.2.1 If caption changed, Update
      //   2.2.2 If caption NOT changed, Delete
    }
    catch (e) {
      console.log(e);
      return null;
    }
  },
  delete: async function(userUuid, post) {
    try {
      // TODO: 
    }
    catch (e) {
      console.log(e);
      return null;
    }
  }
};