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
  const { offset, size } = req.params;   
  const result = await axios({
    url: `https://tasty.p.rapidapi.com/recipes/list?from=${offset}&size=${size}`,
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'tasty.p.rapidapi.com',
      'x-rapidapi-key': config.RAPID_API_KEY
    }
  });
  res.send(result.data);
});

module.exports = router;