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
 * GET /users/user_id
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
 * GET /users/user_id/posts
 * 
 * Retrieve all posts belonging to user.
 */
router.get('/:user_id/posts', checkPerms(PermsConfig.FetchAllUserPosts), function(req, res) {

});

/**
 * POST /users/user_id/posts
 * 
 * Create post under user.
 */
router.post('/:user_id/posts', checkPerms(PermsConfig.CreatePost), function(req, res) {

});

/**
 * GET /users/user_id/posts/post_id
 * 
 * Retrieve post under user.
 */
router.get('/:user_id/posts/:post_id', checkPerms(PermsConfig.FetchPost), function(req, res) {

});

/**
 * PATCH /users/user_id/posts/post_id
 * 
 * Update post under user.
 */
router.patch('/:user_id/posts/:post_id', checkPerms(PermsConfig.UpdatePost), function(req, res) {

});

module.exports = router;