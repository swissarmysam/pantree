/**
 * App.js file
 * Server and middleware code
 */

/** Import all of the required packages */
const express = require('express'); // Node.js server framework
const mongoose = require('mongoose'); // MongoDB Wrapper
const session = require('express-session'); // get user session details
const MongoStore = require('connect-mongo')(session); // store user session details
const path = require('path'); // file path handler
const bodyParser = require('body-parser'); // handle raw requests and make available on the req.body
const expressValidator = require('express-validator'); // validation methods for forms etc
const cookieParser = require('cookie-parser'); // make cookie details available on req.cookie object
const flash = require('connect-flash'); // display flash messages on the frontend
const passport = require('passport'); // account detail authentication
const promisify = require('es6-promisify'); // turn callbacks into promises
const routes = require('./routes/index'); // all of the available application routes
const helpers = require('./helpers'); // methods that are useful across the application
const errorHandlers = require('./handlers/errorHandlers'); // custom error handlers
require('./handlers/passport'); // strategy details for passport authentication

const app = express(); // create express server

// set up view engine - PUG
app.set('views', path.join(__dirname, 'views')); // pug files directory
app.set('view engine', 'pug');
// serve any static files from the public folder i.e. images, styles, built JS
app.use(express.static(path.join(__dirname, 'public')));

// take raw requests and turn into usable properties on req.body
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// methods for validation on user forms
app.use(expressValidator());

// expose cookies in req.cookies that came along with any requests
app.use(cookieParser());

// set up sessions to store visitor data across requests and keep users logged in
// store details in a database collection name Sessions
app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

// set up Passport to handle logins
app.use(passport.initialize());
app.use(passport.session());

// The flash middleware let's us use req.flash('error', 'message'), which will then pass that message to the next page the user requests
app.use(flash());

// make variables available to all templates and requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// handle website routes
app.use('/', routes);

// handle any errors
// 404 if route not found
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// export to start the app in start.js
module.exports = app;
