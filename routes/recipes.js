const express = require('express');
const router = express.Router();

/**
 * GET /recipes - List saved recipes
 */
router.get('/', function(req, res) {

});

/**
 * POST /recipes - Save fetched recipe
 */
router.post('/', function(req, res) {
    
});

/**
 * GET /recipes/recipe_id
 */
router.get('/:recipe_id', function(req, res) {

})

/**
 * PATCH /recipes/recipe_id
 */
router.patch('/:recipe_id', function(req, res) {

});

/**
 * GET /recipes/recipe_id
 */
 router.get('/:recipe_id', function(req, res) {

})

/**
 * GET /recipes/recipe_id/comments 
 * 
 * Retrieve comments for recipe.
 */
router.get('/:recipe_id/comments', function(req, res) {

});

/**
 * POST /recipes/recipe_id/comments 
 * 
 * Post a comment under recipe.
 */
 router.post('/:recipe_id/comments', function(req, res) {

});

/**
 * PATCH /recipes/recipe_id/comments/comment_id 
 * 
 * Update a comment for recipe.
 */
 router.patch('/:recipe_id/comments/:comment_id', function(req, res) {

});

/**
 * GET /recipes/recipe_id/ratings 
 * 
 * Retrieve ratings for recipe.
 */
 router.get('/:recipe_id/ratings', function(req, res) {

});

/**
 * POST /recipes/recipe_id/ratings 
 * 
 * Submit a rating for recipe.
 */
 router.post('/:recipe_id/ratings', function(req, res) {

});

/**
 * GET /recipes/recipe_id/ratings/rating_id
 * 
 * Retrieve rating  for recipe.
 */
 router.get('/:recipe_id/ratings/:rating_id', function(req, res) {

});

/**
 * PATCH /recipes/recipe_id/ratings/rating_id
 * 
 * Update a rating for recipe.
 */
 router.patch('/:recipe_id/ratings/:rating_id', function(req, res) {

});

module.exports = router;