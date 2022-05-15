const db = require('./db');
const FETCH_FIELDS = [
  'recipe_comments.id', 'recipe_comments.parent_id', 'recipe_comments.user_id', 
  'recipe_comments.message', 'recipe_comments.posted_on',
  db.raw("COALESCE(users.username, users.firstname || ' ' || users.lastname) AS name"),
  db.raw("COUNT(replies.id) AS replies_count")
];

module.exports = {
  fetch: async function(userUuid, recipeId, parentId = -1) {
    let query = db('recipe_comments').select(FETCH_FIELDS)
      .leftJoin('users', 'users.id', 'recipe_comments.user_id')
      .leftJoin('recipe_comments as replies', 'replies.parent_id', 'recipe_comments.id')
      .where('recipe_comments.recipe_id', parseInt(recipeId, 10))
      // .andWhere('recipe_comments.deleted', false)
      .andWhere('users.uuid', userUuid);
    if (parentId == -1) {
      query = query.andWhere(db.raw('recipe_comments.parent_id IS NULL'));
    }
    else {
      query = query.andWhere('recipe_comments.parent_id', parseInt(parentId, 10));
    }
    query = query.groupBy('recipe_comments.id', 'users.username', 'users.firstname', 'users.lastname').orderBy('posted_on', 'desc')

    console.log('query: ', query.toString());
    const comments = await query;
    console.log('comments: ', comments);
    return comments;
  },
  create: async function(userUuid, recipeId, newComment) {
    try {
      const user = await db('users').select([
        'id',
        db.raw("COALESCE(users.username, users.firstname || ' ' || users.lastname) AS name")
      ]).where({uuid: userUuid});
      const payload = {
        recipe_id: recipeId, 
        user_id: user[0].id,
        message: newComment.message
      };
      if (newComment.parentId > 0) {
        payload['parent_id'] = newComment.parentId;
      }
      const [comment] = await db('recipe_comments').insert(payload).returning('*');
      comment.name = user[0].name;
      comment.replies_count = 0;
      return comment;
    }
    catch (e) {
      console.log(e);
      return null;
    }
  },
  update: async function(comment) {
    try {
      const query = db.from('recipe_comments').update({
        message: comment.message
      }).where({
        id: comment.id
      }).returning('*');
      console.log('query: ', query.toString());
      const rating = await query;
      return rating[0];
    }
    catch (e) {
      console.log(e);
      return null;
    }
  }
}