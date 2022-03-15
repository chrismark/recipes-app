const authz = require('express-jwt-authz');

module.exports.checkPermissions = (permissions = []) => {
  return authz([permissions], {
    checkAllScopes: true,
    failWithError: true
  });
};

module.exports.PermissionsConfig = {
  FetchAllPosts: 'fetch:posts',
  FetchPost: 'fetch:post',
  FetchAllComments: 'fetch:comments',
  CreateComment: 'create:comment',
  FetchComment: 'fetch:comment',
  UpdateComment: 'update:comment',
  FetchAllRecipes: 'fetch:recipes',
  CreateRecipe: 'create:recipe',
  FetchRecipe: 'fetch:recipe',
  UpdateRecipe: 'update:recipe',
  FetchAllRecipeComments: 'fetch:recipe-comments',
  CreateRecipeComment: 'create:recipe-comment',
  UpdateRecipeComment: 'update:recipe-comment',
  FetchAllRatings: 'fetch:ratings',
  CreateRating: 'create:rating',
  FetchRating: 'fetch:rating',
  UpdateRating: 'update:rating',
  FetchAllUsers: 'fetch:users',
  FetchUser: 'fetch:user',
  UpdateUser: 'update:user',
  FetchAllUserPosts: 'fetch:user-posts',
  CreatePost: 'create:post',
  FetchPost: 'fetch:post',
  UpdatePost: 'update:post',
}