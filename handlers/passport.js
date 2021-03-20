const passport = require('passport');
const mongoose = require('mongoose');

const Account = mongoose.model('Account');

passport.use(Account.createStrategy());

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
