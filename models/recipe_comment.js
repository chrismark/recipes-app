const db = require('./db');
const FETCH_FIELDS = [
  'recipe_comments.id', 'recipe_comments.parent_id', 'recipe_comments.message', 'recipe_comments.posted_on', 'recipe_comments.updated_on', 'users.uuid', 
  'recipe_comments.deleted',
  db.raw("COALESCE(users.username, users.firstname || ' ' || users.lastname) AS name"),
  db.raw("COUNT(replies.id) AS replies_count")
];
const RETURN_FIELDS = [
  'recipe_comments.id', 'recipe_comments.parent_id', 'recipe_comments.message', 'recipe_comments.posted_on', 'recipe_comments.updated_on', 'recipe_comments.deleted'
];

module.exports = {
  _composeFetchSubQuery: (userUuid, recipeId, parentId, deleted) => {
    let query = db('recipe_comments').select(FETCH_FIELDS)
      .leftJoin('users', 'users.id', 'recipe_comments.user_id')
      .leftJoin('recipe_comments as replies', 'replies.parent_id', 'recipe_comments.id')
      .where('recipe_comments.recipe_id', parseInt(recipeId, 10))
      .andWhere('recipe_comments.deleted', deleted);
    if (parentId == -1) {
      query = query.andWhere(db.raw('recipe_comments.parent_id IS NULL'));
    }
    else {
      query = query.andWhere('recipe_comments.parent_id', parseInt(parentId, 10));
    }
    query = query
      .groupBy(
        'recipe_comments.id', 'users.username', 'users.firstname', 'users.lastname', 'users.uuid'
      );
    if (deleted) {
      query = query.havingRaw('COUNT(replies.id) > 0')
    }
    return query;
  },
  fetch: async function(userUuid, recipeId, parentId = -1) {
    // Return union of:
    // - comments that aren't marked deleted and their replies (it's fine if there are none), and
    // - comments that are marked deleted and have replies
    let t1 = db.select('t1.*').from(
      this._composeFetchSubQuery(userUuid, recipeId, parentId, false).as('t1')
    );
    console.log('t1: ', t1.toString());
    let t2 = db.select('t2.*').from(
      this._composeFetchSubQuery(userUuid, recipeId, parentId, true).as('t2')
    );
    console.log('t2: ', t2.toString());
    let query = t1.union(t2).orderBy('posted_on', 'desc');
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
      if (newComment.parent_id > 0) {
        payload['parent_id'] = newComment.parent_id;
      }
      const [comment] = await db('recipe_comments').insert(payload).returning(RETURN_FIELDS);
      comment.uuid = userUuid;
      comment.name = user[0].name;
      comment.replies_count = 0;
      return comment;
    }
    catch (e) {
      console.log(e);
      return null;
    }
  },
  update: async function(editComment) {
    try {
      const query = db.from('recipe_comments').update({
        message: editComment.message
      }).update('updated_on', db.fn.now()).where({
        id: editComment.id
      }).returning(['id', 'message', 'updated_on']);
      console.log('query: ', query.toString());
      const comment = await query;
      return comment[0];
    }
    catch (e) {
      console.log(e);
      return null;
    }
  },
  delete: async function(userUuid, recipe_id, comment_id) {
    try {
      const query = db.from('recipe_comments').update({
        deleted: true
      }).where({
        id: comment_id,
        recipe_id: recipe_id
      })
      .andWhere('user_id', db.select('id').from('users').where('uuid', userUuid))
      .returning(['id', 'deleted']);
      console.log('query: ', query.toString());
      const comment = await query;
      return comment[0];
    }
    catch (e) {
      console.log(e);
      return null;
    }
  }
}