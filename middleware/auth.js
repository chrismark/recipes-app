const jwt = require('jsonwebtoken');
require('dotenv').config();
const config = process.env;

module.exports = (req, res, next) => {
  let token = null;
  const authorization = req.headers.authorization && req.headers.authorization.split(' ');

  if (authorization && authorization.length && authorization[0] == 'Bearer') {
    token = authorization[1];
  }
  console.log('verifyToken: ', token);

  if (!token) {
    return res.status(403).send({errorMessage: 'Authentication Token required.'});
  }
  try {
    req.user = jwt.verify(token, config.TOKEN_KEY);
  }
  catch (e) {
    console.error(e);
    return res.status(401).send({errorMessage: 'Invalid token.'});
  }
  
  return next();
};