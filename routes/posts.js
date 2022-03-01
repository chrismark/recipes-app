const express = require('express');
const router = express.Router();

/**
 * GET /posts
 * 
 * Retrieve all posts.
 */
router.get('/', function(req, res) {

});

/**
 * GET /posts/post_id
 * 
 * Retrieve post.
 */
router.get('/:post_id', function(req, res) {

});

/**
 * GET /posts/post_id/comments
 * 
 * Retrieve all comments under post.
 */
router.get('/:post_id/comments', function(req, res) {

});

/**
 * POST /posts/post_id/comments
 * 
 * Create new comment under post.
 */
router.post('/:post_id/comments', function(req, res) {

});

/**
 * GET /posts/post_id/comments/comment_id
 * 
 * Retrieve comment under post.
 */
router.get('/:post_id/comments/:comment_id', function(req, res) {

});

/**
 * PATCH /posts/post_id/comments/comment_id
 * 
 * Update comment under post.
 */
router.patch('/:post_id/comments/:comment_id', function(req, res) {

});