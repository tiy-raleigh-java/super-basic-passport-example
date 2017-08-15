const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

// create express app
const app = express();

// tell express to use handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('views', './views');
app.set('view engine', 'handlebars');

// tell express how to serve static files
app.use(express.static('public'));

//tell express to use the bodyParser middleware to parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// my endpoints

/**
 * This is a public endpoint. Anyone should be able to access it.
 */
app.get('/', (req, res) => {
  res.render('public');
});

/**
 * This is a private endpoint. Only a logged in user should be able to access it.
 */
app.get('/private', (req, res) => {
  res.render('private');
});

/**
 * This is the login form
 */
app.get('/login', (req, res) => {
  res.render('login');
});

// start express
app.listen(3000, () => console.log('ready to roll!!'));
