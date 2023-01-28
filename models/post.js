const {z} = require('zod');
const db = require('./db');
const RETURN_FIELDS = '*';
const FETCH_RECIPES_POST_FIELDS_MINIMAL = ['recipes_post.post_id', 'recipes.id', 'recipes.name', 'recipes.thumbnail_url', 'recipes.aspect_ratio', 'recipes_post.caption'];
const FETCH_PAGINATION_LIMIT = 6;
const LIKE_SCHEMA = z.object({
  like: z.number().gte(1).lte(7),
  prev: z.number().gte(1).lte(7).optional()
});
const LIKE_VAL_TO_COL = ['like', 'love', 'care', 'laugh', 'sad', 'surprise', 'angry'];
const FETCH_POST_STATS_COUNT = ['like', 'love', 'care', 'laugh', 'sad', 'surprise', 'angry', db.raw('"like" + "love" + "care" + "laugh" + "sad" + "surprise" + "angry" as total_likes'), 'comments', 'shares'];

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
  fetch: async function(userUuid, offset = -1, selectFields = 'posts.*') {
    const user = await db('users').select('id').where({uuid: userUuid});
    let query = db('posts').select([
      selectFields, 
      db.raw('CASE WHEN post_likes.id IS NULL THEN false ELSE true END AS liked'),
      db.raw(
        'CASE ' +
          'WHEN post_likes.type = 1 THEN \'like\' ' +
          'WHEN post_likes.type = 2 THEN \'love\' ' +
          'WHEN post_likes.type = 3 THEN \'care\' ' +
          'WHEN post_likes.type = 4 THEN \'laugh\' ' +
          'WHEN post_likes.type = 5 THEN \'sad\' ' +
          'WHEN post_likes.type = 6 THEN \'surprise\' ' +
          'WHEN post_likes.type = 7 THEN \'angry\' ' +
        'END AS like_type'
      )
    ])
    .leftJoin('post_likes', function() {
      this.on('post_likes.post_id', '=', 'posts.id')
          .andOn('post_likes.user_id', '=', user[0].id);
    });
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
      posts[i].stats = await this._fetchPostStatsCountByPostId(posts[i].id);
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
  _fetchPostStatsCountByPostId: async function(postId, transaction = null) {
    let query = db('post_stats_count').select(FETCH_POST_STATS_COUNT)
      .where('post_id', postId);
    if (transaction != null) {
      query.transacting(transaction);
    }
    console.log('query: ', query.toString());
    const result = await query;
    return result[0];
  },
  /**
   * Create new post and recipes_post entries
   * @param {string} userUuid 
   * @param {object} post 
   * @returns {object[]}
   */
  create: async function(userUuid, post) {
    try {
      // TODO: Use transactions
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
      let recipesPost = null;
      if (post.recipes && post.recipes.length > 0) {
         recipesPost = await this._createRecipesPost(createdPost, post.recipes);
      }
      let postStatsCount = await this._createPostStatsCount(createdPost);
      return {
        id: createdPost.id,
        message: createdPost.message,
        user_id: createdPost.user_id,
        posted_on: createdPost.posted_on,
        recipes: recipesPost || [],
        stats: postStatsCount,
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
  _createPostStatsCount: async function(post) {
    try {
      let query = db('post_stats_count')
        .insert({post_id: post.id})
        .returning(FETCH_POST_STATS_COUNT);
      let result = await query;
      return result[0];
    }
    catch (e) {
      console.error(e);
      return {};
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
      let stats = await this._fetchPostStatsCountByPostId(updatedPost.id, trx);

      if (!trx.isCompleted()) {
        await trx.commit();
      }

      return {
        id: updatedPost.id,
        message: updatedPost.message,
        recipes: recipes,
        stats: stats,
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
    let trx = null;
    let postLike = null;
    let updatedPostStat = null;
    try {
      LIKE_SCHEMA.parse(like);
      trx = await db.transaction();
      const user = await db('users').select('id').where({uuid: userUuid});
      // create post_likes
      postLike = await this._createUpdatePostLike(trx, postId, user[0].id, like);
      console.log('new post like: ', postLike);
      // update post stats count after
      updatedPostStat = await this._incrementLikeStatsCount(trx, postId, like);
      console.log('updated post stat: ', updatedPostStat);

      if (!trx.isCompleted()) {
        await trx.commit();
      }

      return {
        post_id: postId,
        like_type: LIKE_VAL_TO_COL[like.like - 1],
        stats: updatedPostStat[0]
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
  unlike: async function(userUuid, postId, like) {
    let trx = null;
    let postLike = null;
    let updatedPostStat = null;
    try {
      LIKE_SCHEMA.parse(like);
      trx = await db.transaction();
      const user = await db('users').select('id').where({uuid: userUuid});
      // removed post_likes
      postLike = await this._removePostLike(trx, postId, user[0].id);
      console.log('deleted post like: ', postLike);
      // update post stats count after
      updatedPostStat = await this._decrementLikeStatsCount(trx, postId, like);
      console.log('updated post stat: ', updatedPostStat);

      if (!trx.isCompleted()) {
        await trx.commit();
      }
      return {
        post_id: postId,
        stats: updatedPostStat[0]
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
  _createUpdatePostLike: async function(trx, postId, userId, like) {
    try {
      let query = trx('post_likes')
        .insert({
          post_id: postId,
          user_id: userId,
          type: like.like
        })
        .onConflict(['post_id', 'user_id'])
        .merge(['type'])
        .returning('*');
      console.log('query: ', query.toString());
      return await query;
    }
    catch (e) {
      console.log(e);
      throw e;
    }
  },
  _removePostLike: async function(trx, postId, userId) {
    try {
      let query = trx('post_likes')
        .where({ post_id: postId, user_id: userId})
        .delete()
        .returning('*');
      console.log('query: ', query.toString());
      return await query;
    }
    catch (e) {
      console.log(e);
      throw e;
    }
  },
  _incrementLikeStatsCount: async function(trx, postId, like) {
    try {
      let col = LIKE_VAL_TO_COL[like.like - 1];
      let query = trx('post_stats_count')
        .increment(col, 1);
      let returnCols = [col];
      if (like.prev) {
        // decrement previous like column
        let prev_col = LIKE_VAL_TO_COL[like.prev - 1];
        query = query.decrement(prev_col, 1);
        returnCols.push(prev_col);
      }
      query = query.where({post_id: postId})
        .returning(returnCols);
      console.log('_updateLike: ', query.toString());
      return await query;
    }
    catch (e) {
      console.log(e);
      throw e;
    }
  },
  _decrementLikeStatsCount: async function(trx, postId, like) {
    try {
      let col = LIKE_VAL_TO_COL[like.like - 1];
      let query = trx('post_stats_count')
        .decrement(col, 1)
        .where({post_id: postId})
        .returning([col]);
      console.log('_updateLike: ', query.toString());
      return await query;
    }
    catch (e) {
      console.log(e);
      throw e;
    }
  },
};