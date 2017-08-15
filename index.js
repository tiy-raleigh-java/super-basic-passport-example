const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');

// require stuff for passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// configure passport
passport.use(
  new LocalStrategy((username, password, done) => {
    // is the username and password equal too dougeboy / test123?

    // this is the logic I need to authenticate my user!!
    if (username === 'dougeboy' && password === 'test123') {
      // this is an authenticated user
      done(null, username);
    } else {
      // this is not a valid user!!
      done(null, null);
    }
  })
);

// just store the username in the session.
// that's all I care about in this simple example
passport.serializeUser(function(username, done) {
  done(null, username);
});

// get the username from the session
passport.deserializeUser(function(username, done) {
  done(null, username);
});

// create express app
const app = express();

// tell express to use handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('views', './views');
app.set('view engine', 'handlebars');

// session boilerplate
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  })
);

// passport boilerplate
app.use(passport.initialize());
app.use(passport.session());

// tell express how to serve static files
app.use(express.static('public'));

//tell express to use the bodyParser middleware to parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// middleware that requires a user to be authenticated
const requireLogin = (req, res, next) => {
  console.log(req.user);
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// my endpoints

/**
 * This is a public endpoint. Anyone should be able to access it.
 */
app.get('/', (req, res) => {
  res.render('public', { username: req.user });
});

/**
 * This is a private endpoint. Only a logged in user should be able to access it.
 */
app.get('/private', requireLogin, (req, res) => {
  res.render('private', { username: req.user });
});

/**
 * This is the login form
 */
app.get('/login', (req, res) => {
  res.render('login', { username: req.user });
});

app.post(
  '/login/',
  passport.authenticate('local', {
    successRedirect: '/private',
    failureRedirect: '/login'
  })
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// start express
app.listen(3000, () => console.log('ready to roll!!'));
