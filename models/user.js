require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RETURN_FIELDS = ['id', 'email', 'token', 'username', 'firstname', 'lastname'];

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
  generateToken: function(payload) {
    return jwt.sign(
      // {
      //     user_id: user[0].id,
      //     email
      // }
      payload,
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h'
      }
    );
  },
  authenticate: async function(email, password) {
    const user = await this.findOne({ email });
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (user && isPasswordMatch) {
      return user;
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
    // Encrypt user password
    let encryptedPassword = await bcrypt.hash(password, 10);

    // Create user 
    let user = await db('users').insert({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: encryptedPassword,
    }).returning(
      returnFields || RETURN_FIELDS
    );
    console.log('create: ', user);
    return user[0];
  },
  /**
  * Creates new user from provided ${fields} and update's that user with new token.
  * @param {object} fields 
  * @param {string} firstname
  * @param {string} lastname
  * @param {string} email
  * @param {string} password
  * @returns 
  */
  createWithGeneratedToken: async function(fields) {
    let user = await this.create(fields, ['id', 'email']);
    return await this.updateWithGeneratedToken(user.id, user.email);
  },
  update: async function(id, fields, returnFields = null) {
    let user = await db.from('users').update(fields).where({id: id}).returning(
      returnFields || RETURN_FIELDS
    );
    return user[0];
  },
  /**
  * Updates user with a generated token.
  * @param {number} id 
  * @param {string} email 
  * @returns JSON with fields id, email, firstname, lastname, username, token
  */
  updateWithGeneratedToken: async function(id, email) {
    const token = this.generateToken({id, email});
    return await this.update(id, {token: token});
  }
};

