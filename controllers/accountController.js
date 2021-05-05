/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const Account = mongoose.model('Account');
const Business = mongoose.model('Business');
const Fridge = mongoose.model('Fridge');
const promisify = require('es6-promisify');
const e = require('express');
const multer = require('multer');

exports.registerForm = (req, res) => {
  res.render('register', {
    title: 'Register',
  });
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'Please enter your name!').notEmpty();
  req.checkBody('email', 'Please use a valid email!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('password', 'A password is required!').notEmpty();
  req
    .checkBody('password-confirm', 'Confirmed password cannot be blank!')
    .notEmpty();
  req
    .checkBody('password-confirm', 'Oops! Your passwords do not match!')
    .equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash(),
    });
    return; // stop the fn from running
  }
  next(); // there were no errors!
};

exports.register = async (req, res, next) => {
  const account = new Account({
    email: req.body.email,
    name: req.body.name,
  });
  const register = promisify(Account.register, Account);
  await register(account, req.body.password);
  next(); // pass to accountController.setup
};

exports.account = (req, res) => {
  res.render('account', {
    title: 'Edit Account',
  });
};

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email,
  };

  const account = await Account.findOneAndUpdate({
    _id: req.account._id,
  }, {
    $set: updates,
  }, {
    new: true,
    runValidators: true,
    context: 'query',
  });
  req.flash('success', 'Updated the profile!');
  res.redirect('back');
};

exports.setupForm = async (req, res) => {
  res.render('setup', {
    title: 'Profile Setup',
    id: req.params._id,
  });
};

exports.setup = async (req, res, next) => {
  console.log(req.fields);
    // req.fields.account = mongoose.Types.ObjectId(req.fields.account);
    // if (req.fields.type === 'Business') {
    //   const business = await new (Business(req.fields)).save();
    //   updateProfileComplete(req.fields.account);
    // } else {
    //   const fridge = await new (Fridge(req.fields)).save();
    //   updateProfileComplete(req.fields.account);
    // }
    // res.redirect(`/dashboard/${req.fields.account}`);
}


const updateProfileComplete = async (account) => {
  const update = {
    profileCompleted: true
  }
  const profile = await Account.findOneAndUpdate({
    _id: account,
  }, {
    $set: update,
  }).exec();
}