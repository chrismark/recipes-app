const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('morgan'); 
const https = require('https');
const fs = require('fs');

const key = fs.readFileSync(process.env.SSL_KEY_FILE);
const cert = fs.readFileSync(process.env.SSL_CRT_FILE);

const usersRouter = require('./routes/users');
const recipesRouter = require('./routes/recipes');
const postsRouter = require('./routes/posts');
const tastyRouter = require('./routes/tasty');
const { loginHandler, logoutHandler, registerHandler } = require('./routes/auth');

const db = require('./models/db');
const User = require('./models/user');

const authToken = require('./middleware/auth');

const app = express();
const port = 5000;

app.use(logger('dev'));
app.use(express.json({limit: '25mb'}));

app.use('/api', authToken);
app.use('/logout', authToken);

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/tasty', tastyRouter);

app.post('/register', registerHandler);
app.post('/login', loginHandler);
app.get('/logout', logoutHandler);

app.use(function(err, req, res, next) {
  console.error(err);
  if (err && err.statusCode == 403) {
    return res.status(403).send({errorMessage: 'Permission denied.'})
  }
  next();
});

const server = https.createServer({ key, cert }, app);
server.listen(port, () => console.log(`Listening on port ${port}`));