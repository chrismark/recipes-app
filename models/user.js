require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const PermsConfig = require('../middleware/permissions').PermissionsConfig;
const RETURN_FIELDS = ['id', 'uuid', 'email', 'username', 'firstname', 'lastname'];

module.exports = {
  find: async function(fields) {
    return await db('users').select('*').where(fields);
  },
  findOne: async function(fields) {
    const user = await this.find(fields);
    console.log(user);
    return user[0];
  },
  isEmailExists: async function(email) {
    const user = await this.findOne({ email });
    console.log(!!user);
    return  !!(user);
  },
  generateToken: function(user) {
    return jwt.sign(
      {
        email: user.email,
        scope: [
          PermsConfig.FetchAllPosts,
          PermsConfig.CreatePost, PermsConfig.UpdatePost, PermsConfig.FetchPost, PermsConfig.FetchAllUserPosts, 
          PermsConfig.CreateComment, PermsConfig.FetchAllComments, PermsConfig.UpdateComment,
          PermsConfig.FetchUser, PermsConfig.UpdateUser, 
          PermsConfig.CreateRecipe, PermsConfig.UpdateRecipe, PermsConfig.FetchAllRecipes,
          PermsConfig.CreateRecipeComment, PermsConfig.UpdateRecipeComment, PermsConfig.FetchAllRecipeComments,
          PermsConfig.CreateRating, PermsConfig.UpdateRating, PermsConfig.FetchAllRatings,
        ].join(' '),
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
        subject: user.uuid,
        audience: 'recipe-app-frontend',
        issuer: 'recipe-app-backend',
      }
    );
  },
  authenticate: async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        return user;
      }
    }
    return null;
  },
  /**
  * Create a new user entry in the users table.
  * @param {object} fields 
  * @param {string} fields.firstname
  * @param {string} fields.lastname
  * @param {string} fields.email
  * @param {string} fields.password
  */
  create: async function({firstname, lastname, email, password}, returnFields = null) {
    try {
      // Encrypt user password
      let encryptedPassword = await bcrypt.hash(password, 10);
      // Create user 
      let user = await db('users').insert({
        uuid: uuidv4(),
        firstname,
        lastname,
        email: email.toLowerCase(),
        password: encryptedPassword,
      }).returning(
        returnFields || RETURN_FIELDS
      );
      return user[0];
    }
    catch (e) {
      console.error(e);
      return null;
    }
  },
  update: async function(id, fields, returnFields = null) {
    try {
      let user = await db.from('users').update(fields).where({id: id}).returning(
        returnFields || RETURN_FIELDS
      );
      return user[0];
    }
    catch (e) {
      console.error(e);
      return null;
    }  
  },
};

