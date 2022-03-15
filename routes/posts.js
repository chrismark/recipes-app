const express = require('express');
const router = express.Router();
const { checkPermissions: checkPerms, PermissionsConfig: PermsConfig } = require('../middleware/permissions');

/**
 * GET /posts
 * 
 * Retrieve all posts.
 */
router.get('/', checkPerms(PermsConfig.FetchAllPosts), function(req, res) {
  res.send([]);
});

/**
 * GET /posts/post_id
 * 
 * Retrieve post.
 */
router.get('/:post_id', checkPerms(PermsConfig.FetchPost), function(req, res) {

});

/**
 * GET /posts/post_id/comments
 * 
 * Retrieve all comments under post.
 */
router.get('/:post_id/comments', checkPerms(PermsConfig.FetchAllComments), function(req, res) {

});

/**
 * POST /posts/post_id/comments
 * 
 * Create new comment under post.
 */
router.post('/:post_id/comments', checkPerms(PermsConfig.CreateComment), function(req, res) {

});

/**
 * GET /posts/post_id/comments/comment_id
 * 
 * Retrieve comment under post.
 */
router.get('/:post_id/comments/:comment_id', checkPerms(PermsConfig.FetchComment), function(req, res) {

});

/**
 * PATCH /posts/post_id/comments/comment_id
 * 
 * Update comment under post.
 */
router.patch('/:post_id/comments/:comment_id', checkPerms(PermsConfig.UpdateComment), function(req, res) {

});

module.exports = router;