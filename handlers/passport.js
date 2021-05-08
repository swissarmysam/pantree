/**
 * Passport Authentication Strategy
 * passport-local-mongoose strategy is installed
 * This is a username/password method
 */

/** Import required packages */
const passport = require('passport'); // user authentication package
const mongoose = require('mongoose'); // database wrapper

// acquire the Account collection
const Account = mongoose.model('Account');

// use local strategy for authentication
passport.use(Account.createStrategy());

passport.serializeUser(Account.serializeUser()); // determine the user details to be stored in the session
passport.deserializeUser(Account.deserializeUser()); // immediately make the user details available to the app as req.user object
