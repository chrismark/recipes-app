const db = require('./db');

module.exports = {
  create: async function(userUuid, recipeId, ratingValue) {
    try {
      const user = await db('users').select('id').where({uuid: userUuid});
      const rating = await db('recipe_ratings').insert({
        recipe_id: recipeId, 
        user_id: user[0].id,
        rating: ratingValue
      }).returning('*');
      return rating[0];
    }
    catch (e) {
      console.log(e);
      return null;
    }
  },
  update: async function(ratingId, ratingValue) {
    try {
      const query = db.from('recipe_ratings').update({
        rating: ratingValue
      }).where({
        id: ratingId
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