require('dotenv').config();
const config = process.env;
const express = require('express');
const router = express.Router();
const axios = require('axios').default;
const { checkPermissions: checkPerms, PermissionsConfig: PermsConfig } = require('../middleware/permissions');

/**
 * GET /tasty
 * 
 * Retrieve all posts.
 */
router.get('/', checkPerms(PermsConfig.FetchTastyRecipes), async function(req, res) {
  try {
    const { offset, size } = req.query;
    console.log('req.query: ', req.query);
    let options = {
      url: 'https://tasty.p.rapidapi.com/recipes/list',
      params: {from: offset, size: size},
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'tasty.p.rapidapi.com',
        'x-rapidapi-key': config.RAPID_API_KEY
      }
    };
    console.log('options: ', options);
    const result = await axios(options);
    res.send(result.data);
  }
  catch (e) {
    console.error(e);
    res.send([]);
  }
});

module.exports = router;