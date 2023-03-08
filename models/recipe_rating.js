const db = require('./db');

module.exports = {
  create: async function(userUuid, recipeId, ratingValue) {
    try {
      const user = await db('users').select('id').where({uuid: userUuid});
      const query = db('recipe_ratings')
        .insert({
          recipe_id: recipeId, 
          user_id: user[0].id,
          rating: ratingValue
        })
        .onConflict(['recipe_id', 'user_id'])
        .merge()
        .returning(['id as rating_id', 'recipe_id as id', 'rating']);
      console.log('query: ', query.toString());
      const rating = await query;
      console.log(rating);
      return rating[0];
    }
    catch (e) {
      console.log(e);
      throw e;
    }
  },
  update: async function(ratingId, ratingValue) {
    try {
      const query = db.from('recipe_ratings')
        .update({ rating: ratingValue })
        .where({ id: ratingId })
        .returning(['id as rating_id', 'recipe_id as id', 'rating']);
      console.log('query: ', query.toString());
      const rating = await query;
      console.log(rating);
      return rating[0];
    }
    catch (e) {
      console.log(e);
      throw e;
    }
  }
}