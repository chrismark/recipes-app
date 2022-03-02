const express = require('express');
const bcrypt = require('bcryptjs');

const usersRouter = require('./routes/users');
const recipesRouter = require('./routes/recipes');
const postsRouter = require('./routes/posts');

const db = require('./models/connection');

const app = express();
const port = 5000;
const TOKEN_KEY = 'F13maYhjhA4m61oQxMJQh2Ufan';

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

        // Check if user already exists
        const oldUser = await db.select('*').from('users').where({ email: email });
        console.log(oldUser.length);

        if (oldUser.length > 0) {
            return res.status(409).send('User Already Exist. Please Login.');
        }

        // Encrypt user password
        let encryptedPassword = await bcrypt.hash(password, 10);

        // Create user 
        const user = await db('users').insert({
            firstname,
            lastname,
            email: email.toLowerCase(),
            password: encryptedPassword,
        }).returning(['id', 'firstname', 'lastname', 'username']);
        console.log(`user: ${user}`);

        res.status(201).json(user);
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