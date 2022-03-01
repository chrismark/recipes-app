const express = require('express');

const usersRouter = require('./routes/users');
const recipesRouter = require('./routes/recipes');
const postsRouter = require('./routes/posts');

const app = express();
const port = 5000;

app.use(express.json());

app.use('/users', usersRouter);
app.user('/posts', postsRouter);
app.user('/recipes', recipesRouter);

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello from express.' });
});

app.get('/api/test', (req, res) => {
    res.send({
        message: 'This is a test.'
    });
});

// Recipes

app.post('/api/data', (req, res) => {
    console.log(req.body);
    res.send(`I received your POST request. This is what you sent me: ${req.body.post}`);
});

app.listen(port, () => console.log(`Listening on port ${port}`));