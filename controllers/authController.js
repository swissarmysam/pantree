/**
 * Authentication Controller code
 * Methods for handling login and password resets
 * Any data saved from here will be in Account model
 */

/** Import required packages */
const passport = require('passport'); // authentication handler
const crypto = require('crypto'); // generate secure token for password reset
const mongoose = require('mongoose'); // database wrapper

const Account = mongoose.model('Account'); // load database collection
const promisify = require('es6-promisify'); // turn callback into promise
const mail = require('../handlers/mail'); // generate email template to send

/** Log in the user - uses passport authentication */
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    // authentication is done using a local strategy meaning a username/password combination is used
    if (err) {
      next(err); // pass error to route step
      return; // exit function
    }
    // if user doesn't pass authentication ...
    if (!user) {
      // flash error message and return to login page
      req.flash('error', 'Incorrect email or password');
      res.redirect('/login');
      return;
    }
    // if user passes authentication ...
    req.logIn(user, (err) => {
      if (err) {
        // errors from above are passed here and message displayed
        req.flash('error', 'Something went wrong.');
        next(err);
        return;
      }
      if (!req.user.profileCompleted) {
        // if the user has not completed profile setup
        res.redirect(`/setup/${req.user._id}`); // redirect to the setup form to collect details
      } else {
        res.redirect(`/donations/${req.user._id}`); // otherwise redirect to the dashboard
      }
      // exit function
    });
  })(req, res, next);
};

/** Log the user out and end the active session */
exports.logout = (req, res) => {
  res.clearCookie('establishmentType');
  res.clearCookie('account');
  res.clearCookie('donations');
  res.clearCookie('profesh');
  req.logout(); // end session
  req.flash('success', 'You are now logged out!');
  res.redirect('/'); // redirect to the home page
};

/** If somebody tries to hit a public route whilst logged in then redirect them to the dashboard otherwise allow them to proceed */
exports.notLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next(); // allow to proceed to requested page
    return;
  }
  res.redirect(`/donations/${req.user._id}`); // redirect logged in users back to the dashboard
};

/** Check that the user is logged in otherwise prompt login */
exports.isLoggedIn = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    next(); // allow user to proceed
    return;
  }
  req.flash('error', 'You must be logged in to do that.');
  res.redirect('/login'); // load login route
};

/** Display forgotten password form pug file */
exports.forgotPassword = (req, res) => {
  res.render('forgot', {
    title: 'Reset Password',
  });
};

/** Handle forgotten password requests */
exports.forgot = async (req, res) => {
  // see if a user with that email exists
  const account = await Account.findOne({
    email: req.body.email,
  });
  if (!account) {
    // otherwise display a message saying it does not exist
    req.flash('error', 'No account with that email exists.');
    return res.redirect('/login'); // redirect to login
  }
  // set a reset token and expiry on their account
  account.resetPasswordToken = crypto.randomBytes(20).toString('hex'); // generate a secure reset token
  account.resetPasswordExpires = Date.now() + 3600000; // set to expire in an hour from creation time
  await account.save(); // save to Account collection
  // send them an email with the token
  const resetURL = `http://${req.headers.host}/account/reset/${account.resetPasswordToken}`;
  await mail.send({
    account,
    filename: 'passwordReset', // from ./view/email folder
    subject: 'Password Reset',
    resetURL,
  });
  req.flash('success', `You have been emailed a password reset link.`);
  // redirect to login page
  res.redirect('/login');
};

/** Following reset link being followed - handle the password reset request */
exports.reset = async (req, res) => {
  // find the account with associated reset token
  const account = await Account.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  });
  // if an account can't be found ..
  if (!account) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }
  // if there is an account, show the rest password form
  res.render('reset', {
    title: 'Reset your Password',
  });
};

/** Check that the passwords match */
exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['confirm-password']) {
    next(); // move onto next step to update the password
    return;
  }
  req.flash('error', 'Passwords do not match!');
  res.redirect('back'); // reload the form
};

/** Update the password in the Account collection for the user */
exports.update = async (req, res) => {
  // find the account with associated reset token
  const account = await Account.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  });
  // if account does not exist then reload the login form
  if (!account) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }
  // otherwise update the password for the account and disable the reset link
  const setPassword = promisify(account.setPassword, account);
  await setPassword(req.body.password);
  account.resetPasswordToken = undefined;
  account.resetPasswordExpires = undefined;
  const updatedUser = await account.save();
  req.flash('success', 'Your password has been reset! You can now login!');
  return res.redirect('/login'); // redirect to login
};

/** Display the login form pug file */
exports.loginForm = (req, res) => {
  res.render('login', {
    title: 'Login',
  });
};
