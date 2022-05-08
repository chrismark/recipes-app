const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { checkPermissions: checkPerms, PermissionsConfig: PermsConfig } = require('../middleware/permissions');

/**
 * GET /users
 */
router.get('/', checkPerms(PermsConfig.FetchAllUsers), function(req, res) {
  console.log('req: ', req);
  console.log('res: ', res);
});

/**
 * GET /users/user_uuid
 * 
 * Retrieve user information
 */
router.get('/:user_id', checkPerms(PermsConfig.FetchUser), function(req, res) {

})

/**
 * PATCH /users/user_id
 * 
 * Update user information.
 */
router.patch('/:user_id', checkPerms(PermsConfig.UpdateUser), function(req, res) {

});

/**
 * GET /users/user_uuid/recipes - List saved recipes
 */
 router.get('/:user_uuid/recipes', checkPerms(PermsConfig.FetchUserRecipes), async function(req, res) {
  try {
    const recipes = await User.fetchRecipes(req.params.user_uuid);
    res.status(200).json(recipes);
  }
  catch (e) {
    console.error(e);
    res.status(200).send({
      errorMessage: 'There was a problem fetching saved recipes. Please try again later.'
    });
  }
});

/**
 * GET /users/user_uuid/recipes/:recipe_id - List saved recipes
 */
 router.get('/:user_uuid/recipes/:recipe_id', checkPerms(PermsConfig.FetchUserRecipes), async function(req, res) {
  try {
    const recipe = await User.fetchRecipe(req.params.user_uuid, req.params.recipe_id);
    res.status(200).json(recipe);
  }
  catch (e) {
    console.error(e);
    res.status(200).send({
      errorMessage: 'There was a problem fetching saved recipe. Please try again later.'
    });
  }
});

/**
 * POST /users/user_uuid/recipes/recipe_id/ratings - Submit rating for a recipe
 */

/**
 * GET /users/user_uuid/posts
 * 
 * Retrieve all posts belonging to user.
 */
router.get('/:user_uuid/posts', checkPerms(PermsConfig.FetchAllUserPosts), function(req, res) {
  res.send([]);
});

/**
 * POST /users/user_uuid/posts
 * 
 * Create post under user.
 */
router.post('/:user_uuid/posts', checkPerms(PermsConfig.CreatePost), function(req, res) {

});

/**
 * GET /users/user_uuid/posts/post_id
 * 
 * Retrieve post under user.
 */
router.get('/:user_uuid/posts/:post_id', checkPerms(PermsConfig.FetchPost), function(req, res) {

});

/**
 * PATCH /users/user_uuid/posts/post_id
 * 
 * Update post under user.
 */
router.patch('/:user_uuid/posts/:post_id', checkPerms(PermsConfig.UpdatePost), function(req, res) {

});

module.exports = router;