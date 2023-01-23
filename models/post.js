const {z} = require('zod');
const db = require('./db');
const RETURN_FIELDS = '*';
const FETCH_RECIPES_POST_FIELDS_MINIMAL = ['recipes_post.post_id', 'recipes.id', 'recipes.name', 'recipes.thumbnail_url', 'recipes.aspect_ratio', 'recipes_post.caption'];
const FETCH_PAGINATION_LIMIT = 6;
const LIKE_SCHEMA = z.object({
  like: z.number().gte(1).lte(7)
});
const LIKE_VAL_TO_COL = ['like', 'heart', 'care', 'laugh', 'sad', 'surprise', 'angry'];

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
  _fetchRecipesPostByPostId: async function(postId, transaction = null) {
    let query = db('recipes_post').select(FETCH_RECIPES_POST_FIELDS_MINIMAL)
      .leftJoin('recipes', 'recipes.id', 'recipes_post.recipe_id')
      .where('recipes_post.post_id', postId)
      .orderBy('order', 'asc');
    if (transaction != null) {
      query.transacting(transaction);
    }
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
  * @param {object} post 
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
        db('recipes_post').insert(recipePosts).returning(['post_id', 'order', 'recipe_id', 'caption'])
      )
      .select(FETCH_RECIPES_POST_FIELDS_MINIMAL)
      .from('inserted_recipes_post as recipes_post')
      .leftJoin('recipes', 'recipes.id', 'recipes_post.recipe_id')
      .orderBy('recipes_post.order', 'asc');
      console.log('query: ', query.toString());
      return await query;
    }
    catch (e) {
      console.error(e);
      return [];
    }
  },
  update: async function(userUuid, postId, post) {
    let trx = null;
    try {
      trx = await db.transaction();
      // Update post
      let editPost = {
        id: postId,
        message: post.message
      };
      let updatedPost = await this._updatePost(trx, editPost);

      // Update existing recipes_post
      let updateRecipesPost = post.recipes.filter(rp => rp.post_id != undefined && rp.deleted == undefined);
      for (let i = 0; i < updateRecipesPost.length; i++) {
        await this._updateRecipesPost(trx, updateRecipesPost[i]);
      }
      // Delete existing recipes_post and matching recipes_post_comments
      let deleteRecipesPost = post.recipes.filter(rp => rp.deleted == true);
      for (let i = 0; i < deleteRecipesPost.length; i++) {
        await this._deleteRecipesPost(trx, deleteRecipesPost[i]);
      }
      // Create recipes_post
      let createRecipesPost = post.recipes.filter(rp => rp.post_id == undefined);
      for (let i = 0; i < createRecipesPost.length; i++) {
        await this._createRecipesPostOnly(trx, updatedPost, createRecipesPost[i]);
      }

      let recipes = await this._fetchRecipesPostByPostId(updatedPost.id, trx);

      if (!trx.isCompleted()) {
        await trx.commit();
      }

      return {
        id: updatedPost.id,
        message: updatedPost.message,
        recipes: recipes
      };
    }
    catch (e) {
      trx.rollback();
      console.log(e);
      return null;
    }
  },
  _updatePost: async function(trx, {id, message}, returnFields = '*') {
    try {
      let updatedPost = await trx('posts').update({message}).where({id}).returning(
        returnFields
      );
      return updatedPost[0];
    }
    catch (e) {
      console.error(e);
      throw e;
    }
  },
  _updateRecipesPost: async function(trx, recipe_post) {
    try {
      // compose props array for insertion
      let query = trx('recipes_post')
        .update({ caption: recipe_post.caption, order: recipe_post.order })
        .where({post_id: recipe_post.post_id, recipe_id: recipe_post.id});
      console.log('query: ', query.toString());
      return await query;
    }
    catch (e) {
      console.error(e);
      return [];
    }
  },
  _createRecipesPostOnly: async function(trx, post, recipe) {
    try {
      // compose props array for insertion
      let query = trx('recipes_post')
        .insert({ post_id: post.id, recipe_id: recipe.id, caption: recipe.caption, order: recipe.order });
      console.log('query: ', query.toString());
      return await query;
    }
    catch (e) {
      console.error(e);
      return [];
    }
  },
  _deleteRecipesPost: async function(trx, recipe_post) {
    try {
      // compose props array for insertion
      let query = trx('recipes_post')
        .where({post_id: recipe_post.post_id, recipe_id: recipe_post.id})
        .delete();
      console.log('query: ', query.toString());
      return await query;
    }
    catch (e) {
      console.error(e);
      return [];
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
  },
  like: async function(userUuid, postId, like) {
    LIKE_SCHEMA.parse(like);
    let trx = null;
    try {
      trx = await db.transaction();
      const user = await db('users').select('id').where({uuid: userUuid});
      // create post_likes
      let postLike = await this._createPostLike(trx, postId, user[0].id, like);
      console.log('new post like: ', postLike);
      // update post stats count after
      let updatedPostStat = await this._updateLike(trx, postId, like);
      console.log('updated post stat: ', updatedPostStat);
      if (!trx.isCompleted()) {
        await trx.commit();
      }

    }
    catch (e) {
      if (trx) {
        trx.rollback();
      }
      console.log(e);
      return null;
    }
  },
  _createPostLike: async function(trx, postId, userId, like) {
    try {
      let query = trx('post_likes').insert({
        post_id: postId,
        user_id: userId,
        type: like.like
      });
      console.log('query: ', query.toString());
      return await query;
    }
    catch (e) {
      console.log(e);
      throw e;
    }
  },
  _updateLike: async function(trx, postId, like) {
    try {
      let col = LIKE_VAL_TO_COL[like.like - 1];
      let query = trx('post_stats_count')
                  .increment(col, 1)
                  .where({post_id: postId})
                  .returning(['id', 'post_id', col]);
      console.log('_updateLike: ', query.toString());
      return await query;
    }
    catch (e) {
      console.log(e);
      throw e;
    }
  }
};