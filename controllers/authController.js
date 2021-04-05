const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');

const Account = mongoose.model('Account');
const promisify = require('es6-promisify');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Login failed!',
  successRedirect: '/dashboard',
  successFlash: 'You are now logged in!',
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out!');
  res.redirect('/');
};

exports.notLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
    return;
  }
  res.redirect('/dashboard');
}

exports.isLoggedIn = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on! They are logged in!
    return;
  }
  req.flash('error', 'Oops, you must be logged in to do that!');
  res.redirect('/login');
};

exports.forgotPassword = (req, res) => {
  res.render('forgot', { title: 'Reset Password' });
};

exports.forgot = async (req, res) => {
  // 1. See if a user with that email exists
  const account = await Account.findOne({ email: req.body.email });
  if (!account) {
    req.flash('error', 'No account with that email exists.');
    return res.redirect('/login');
  }
  // 2. Set reset tokens and expiry on their account
  account.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  account.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  await account.save();
  // 3. Send them an email with the token
  const resetURL = `http://${req.headers.host}/account/reset/${
    account.resetPasswordToken
  }`;
  await mail.send({
    account,
    filename: 'passwordReset',
    subject: 'Password Reset',
    resetURL,
  });
  req.flash('success', `You have been emailed a password reset link.`);
  // 4. redirect to login page
  res.redirect('/login');
};

exports.reset = async (req, res) => {
  const account = await Account.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!account) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }
  // if there is a user, show the rest password form
  res.render('reset', { title: 'Reset your Password' });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['confirm-password']) {
    next(); // keep it going!
    return;
  }
  req.flash('error', 'Passwords do not match!');
  res.redirect('back');
};

exports.update = async (req, res) => {
  const account = await Account.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!account) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }

  const setPassword = promisify(account.setPassword, account);
  await setPassword(req.body.password);
  account.resetPasswordToken = undefined;
  account.resetPasswordExpires = undefined;
  const updatedUser = await account.save();
  await req.login(updatedUser);
  req.flash('success', 'Your password has been reset! You are now logged in!');
  res.redirect('/dashboard');
};

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};
