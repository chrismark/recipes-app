const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersRouter = require('./routes/users');
const recipesRouter = require('./routes/recipes');
const postsRouter = require('./routes/posts');

const db = require('./models/db');
const User = require('./models/user');

const app = express();
const port = 5000;

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/recipes', recipesRouter);

// Register
app.post('/register', async function(req, res) {
    try {
        // Get user input
        const { firstname, lastname, email, password } = req.body;

        // Validate user input
        if (!(email && password && firstname && lastname)) {
            return res.status(400).send('All input is required.');
        }

        if (await User.isEmailExists(email)) {
            return res.status(409).send('User Already Exist. Please Login.');
        }
        
        let user = await User.createWithGeneratedToken({ 
            firstname,
            lastname,
            email,
            password
        });
        res.status(201).json(user);
    }
    catch (err) {
        console.error(err);
    }
});

// Login
app.post('/login', async function(req, res) {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).send('All input is required.');
        }

        let user = await User.authenticate(email, password);
        if (user) {
            user = await User.updateWithGeneratedToken(user.id, user.email);
            res.status(200).json(user);
        } 
        else {
            // Invalid username and/or password.
            res.status(200).send('Invalid username or password.');
        }
    }
    catch (err) {
        console.error(err);
    }
});

// app.get('/api/hello', (req, res) => {
//     res.send({ express: 'Hello from express.' });
// });

// app.get('/api/test', (req, res) => {
//     res.send({
//         message: 'This is a test.'
//     });
// });

// // Recipes

// app.post('/api/data', (req, res) => {
//     console.log(req.body);
//     res.send(`I received your POST request. This is what you sent me: ${req.body.post}`);
// });

app.listen(port, () => console.log(`Listening on port ${port}`));