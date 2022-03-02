const express = require('express');
const router = express.Router();
const db = require('../models/connection');

/**
 * GET /users
 */
router.get('/', function(req, res) {
    console.log('req: ', req);
    console.log('res: ', res);
});

/**
 * POST /users
 */
router.post('/', function(req, res) {
    
});

/**
 * GET /users/user_id
 * 
 * Retrieve user information
 */
router.get('/:user_id', function(req, res) {

})

/**
 * PATCH /users/user_id
 * 
 * Update user information.
 */
router.patch('/:user_id', function(req, res) {

});

/**
 * GET /users/user_id/posts
 * 
 * Retrieve all posts belonging to user.
 */
router.get('/:user_id/posts', function(req, res) {

});

/**
 * POST /users/user_id/posts
 * 
 * Create post under user.
 */
router.post('/:user_id/posts', function(req, res) {

});

/**
 * GET /users/user_id/posts/post_id
 * 
 * Retrieve post under user.
 */
router.get('/:user_id/posts/:post_id', function(req, res) {

});

/**
 * PATCH /users/user_id/posts/post_id
 * 
 * Update post under user.
 */
router.patch('/:user_id/posts/:post_id', function(req, res) {

});

module.exports = router;