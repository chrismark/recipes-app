const User = require('../models/user');

async function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
}

// GET /login
async function loginHandler(req, res) {
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
      let token = User.generateToken(user);
      user.token = token;
      res.status(200).json(user);
    }
    else {
      // Invalid username and/or password.
      res.status(200).send({errorMessage: 'Invalid username or password.'});
    }
  }
  catch (e) {
    console.error(e);
  }
};

async function registerHandler(req, res) {
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
    
    let user = await User.create({ 
      firstname,
      lastname,
      email,
      password
    });
    // TODO: remove after test
    await delay(3000);
    if (user) {
      let token = User.generateToken(user);
      user.token = token;
      res.status(201).json(user);
    }
    else {
      return res.status(200).send({errorMessage: 'There was a problem with registraion. Please try again later.'});
    }
  }
  catch (e) {
    console.error(e);
  }
};

function logoutHandler(req, res) {
  console.log(req.headers);
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
  }
}

module.exports = { loginHandler, logoutHandler, registerHandler };