const jwt = require('jsonwebtoken');
const config = process.env;

module.exports = (req, res, next) => {
  const token = req.headers.authorization &&
                req.headers.authorization.split(' ')[1];
  console.log('verifyToken: ', token);

  if (!token) {
    return res.status(403).send({errorMessage: 'Authentication Token required.'});
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.decoded_token = decoded;
  }
  catch (e) {
    console.error(e);
    return res.status(401).send({errorMessage: 'Invalid token.'});
  }
  
  return next();
};