const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('morgan'); 

const usersRouter = require('./routes/users');
const recipesRouter = require('./routes/recipes');
const postsRouter = require('./routes/posts');

const db = require('./models/db');
const User = require('./models/user');

const app = express();
const port = 5000;

app.use(logger('dev'));
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/recipes', recipesRouter);

async function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
}

// Register
app.post('/register', async function(req, res) {
    try {
        // Get user input
        const { firstname, lastname, email, password } = req.body;

        // Validate user input
        if (!(email && password && firstname && lastname)) {
            return res.status(200).send({errorMessage: 'All input is required.'});
        }

        if (await User.isEmailExists(email)) {
            return res.status(200).send({errorMessage: 'User Already Exist. Please Login.'});
        }
        
        let user = await User.createWithGeneratedToken({ 
            firstname,
            lastname,
            email,
            password
        });
        // TODO: remove after test
        await delay(3000);
        if (user) {
          res.status(201).json(user);
        }
        else {
          return res.status(200).send({errorMessage: 'There was a problem with registraion. Please try again later.'});
        }
    }
    catch (err) {
        console.error(err);
    }
});

// Login
app.post('/login', async function(req, res) {
    try {
        const { email, password } = req.body;
        console.log('req.body: ', req.body);

        if (!(email && password)) {
            return res.status(200).send({errorMessage: 'All input is required.'});
        }

        let user = await User.authenticate(email, password);
        // TODO: remove delay after test
        await delay(3000);
        console.log('user: ', JSON.stringify(user));
        if (user) {
            user = await User.updateWithGeneratedToken(user.id, user.email);
        }
        if (user) {
          res.status(200).json(user);
        }
        else {
            // Invalid username and/or password.
            res.status(200).send({errorMessage: 'Invalid username or password.'});
        }
    }
    catch (err) {
        console.error(err);
    }
});

// logout
app.post('/logout', function(req, res) {

});


app.listen(port, () => console.log(`Listening on port ${port}`));