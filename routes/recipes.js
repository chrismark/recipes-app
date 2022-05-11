const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const RecipeRating = require('../models/recipe_rating');
const { checkPermissions: checkPerms, PermissionsConfig: PermsConfig } = require('../middleware/permissions');
const { delay } = require('../lib/common');

/**
 * GET /recipes - List saved recipes
 */
router.get('/', checkPerms(PermsConfig.FetchAllRecipes), async function(req, res) {
  try {
    const recipes = await Recipe.fetchAll();
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
 * POST /recipes - Save fetched recipe
 */
router.post('/', checkPerms(PermsConfig.CreateRecipe), async function(req, res) {
  try {
    console.log('req.body: ', req.body);
    let recipes = await Recipe.create(req.user.sub, req.body);

    if (recipes) {
      res.status(recipes.length > 0 ? 201 : 200).json(recipes);
    }
    else {
      res.status(200).send({
        errorMessage: 'There was a problem saving the recipe. Please try again later.'
      });
    }
  }
  catch (e) {
    console.error(e);
    res.status(200).send({
      errorMessage: 'There was a problem saving the recipe. Please try again later.'
    });
  }
});

/**
 * GET /recipes/recipe_id
 */
router.get('/:recipe_id', checkPerms(PermsConfig.FetchRecipe), async function(req, res) {
  try {
    console.log('req.body: ', req.body);
    let recipe = await Recipe.find({id: req.params.recipe_id});
    res.status(200).json(recipe);
  }
  catch (e) {
    console.error(e);
    res.status(200).send({
      errorMessage: 'There was a problem fetching the recipe. Please try again later.'
    });
  }
});

/**
 * DELETE /recipes/recipe_id
 */
 router.delete('/:recipe_id', checkPerms(PermsConfig.FetchRecipe), function(req, res) {
  
});

/**
 * PATCH /recipes/recipe_id
 */
router.patch('/:recipe_id', checkPerms(PermsConfig.UpdateRecipe), function(req, res) {

});

/**
 * GET /recipes/recipe_id/comments 
 * 
 * Retrieve comments for recipe.
 */
router.get('/:recipe_id/comments', checkPerms(PermsConfig.FetchAllRecipeComments), function(req, res) {

});

/**
 * POST /recipes/recipe_id/comments 
 * 
 * Post a comment under recipe.
 */
 router.post('/:recipe_id/comments', checkPerms(PermsConfig.CreateRecipeComment), function(req, res) {

});

/**
 * PATCH /recipes/recipe_id/comments/comment_id 
 * 
 * Update a comment for recipe.
 */
 router.patch('/:recipe_id/comments/:comment_id', checkPerms(PermsConfig.UpdateRecipeComment), function(req, res) {

});

/**
 * GET /recipes/recipe_id/ratings 
 * 
 * Retrieve ratings for recipe.
 */
 router.get('/:recipe_id/ratings', checkPerms(PermsConfig.FetchAllRatings), function(req, res) {

});

/**
 * POST /recipes/recipe_id/ratings 
 * 
 * Submit a rating for recipe.
 */
router.post('/:recipe_id/ratings', checkPerms(PermsConfig.CreateRating), async function(req, res) {
  try {
    await delay(3000);
    console.log('req.params: ', req.params);
    console.log('req.body: ', req.body);
    let rating = await RecipeRating.create(req.user.sub, req.params.recipe_id, req.body.rating);

    if (rating) {
      res.status(200).json(rating);
    }
    else {
      res.status(200).send({
        errorMessage: 'There was a problem adding the rating. Please try again later.'
      });
    }
  }
  catch (e) {
    console.error(e);
    res.status(200).send({
      errorMessage: 'There was a problem adding the rating. Please try again later.'
    });
  }
});

/**
 * GET /recipes/recipe_id/ratings/rating_id
 * 
 * Retrieve rating  for recipe.
 */
router.get('/:recipe_id/ratings/:rating_id', checkPerms(PermsConfig.FetchRating), function(req, res) {

});

/**
 * POST /recipes/recipe_id/ratings/rating_id
 * 
 * Update a rating for recipe.
 */
router.post('/:recipe_id/ratings/:rating_id', checkPerms(PermsConfig.UpdateRating), async function(req, res) {
  try {
    await delay(3000);
    console.log('req.params: ', req.params);
    console.log('req.body: ', req.body);
    let rating = await RecipeRating.update(req.params.rating_id, req.body.rating);

    if (rating) {
      res.status(200).json(rating);
    }
    else {
      res.status(200).send({
        errorMessage: 'There was a problem updating the rating. Please try again later.'
      });
    }
  }
  catch (e) {
    console.error(e);
    res.status(200).send({
      errorMessage: 'There was a problem updating the rating. Please try again later.'
    });
  }
});

module.exports = router;