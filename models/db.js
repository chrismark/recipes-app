const environment = process.env.ENVIRONMENT || 'development';
const config = require('../knexfile.js')[environment];
const knex = require('knex');
// TODO: Implement caching
// const cache = {};
// knex.QueryBuilder.extend('cache', async function() {
//   try {
//     const cacheKey = this.toString();
//     if(cache[cacheKey]) { 
//         return cache[cacheKey];
//     }
//     const data = await this;
//     cache[cacheKey] = data;
//     return data;
//   } catch (e) {
//     throw new Error(e)
//   }
// });
module.exports = knex(config);