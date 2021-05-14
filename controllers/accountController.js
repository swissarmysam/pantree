/**
 * Account Controller code
 * Methods for registration and setup details
 * Any data saved from here will be in Account model
 */

/** Import wrapper for database connection */
const mongoose = require('mongoose');

/** Load models */
const Account = mongoose.model('Account');
const Business = mongoose.model('Business');
const Fridge = mongoose.model('Fridge');
const promisify = require('es6-promisify');
const e = require('express');

/** Display the Register pug form */
exports.registerForm = (req, res) => {
  res.render('register', {
    title: 'Register',
  });
};

/** Validate account registration form - uses express-validator middleware */
exports.validateRegister = (req, res, next) => {
  // validate the inputs before saving
  req.sanitizeBody('name');
  req.checkBody('name', 'Please enter your name!').notEmpty();
  req.checkBody('email', 'Please use a valid email!').isEmail();
  // allow users to use modifiers in email address i.e. john.doe+pantree@gmail.com
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  // ensure password is at least 8 characters
  req.checkBody('password', 'Minimum password length is 8 characters').notEmpty().isLength({ min: 8 });
  // check that confirmed password field has a length ...
  req
    .checkBody('password-confirm', 'Confirmed password cannot be blank!')
    .notEmpty();
  // finally ensure that the password fields are equal
  req
    .checkBody('password-confirm', 'Oops! Your passwords do not match!')
    .equals(req.body.password);

  // flash all validation errors on the register page
  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash(),
    });
    return; // stop the function from moving onto next()
  }
  next(); // move onto next step in route - accountController.register
};

/** Save the record to Account collection */
exports.register = async (req, res, next) => {
  // put req.body details to Account collection
  const account = new Account({
    email: req.body.email,
    name: req.body.name,
  });
  // turn callback into a promise to ensure that it resolves and saves account
  const register = promisify(Account.register, Account);
  await register(account, req.body.password);
  next(); // pass to accountController.setup
};

/** Display account pug view */
exports.account = (req, res) => {
  res.render('account', {
    title: 'Edit Account',
  });
};

/** Allow amendments to profile name and email - overwrite record in Account collection */
exports.updateAccount = async (req, res) => {
  // data to update
  const updates = {
    name: req.body.name,
    email: req.body.email,
  };

  // find record in collection from session id and update based on req.body input
  const account = await Account.findOneAndUpdate({
    _id: req.account._id,
  }, {
    $set: updates,
  }, {
    new: true,
    runValidators: true,
    context: 'query',
  });
  req.flash('success', 'Profile has been updated.'); // display a success message
  res.redirect('back'); // reload the page
};

/** Display the setup form to capture fridge/business details */
exports.setupForm = (req, res) => {
  res.render('setup', {
    title: 'Profile Setup',
    id: req.params._id, // get user id from URL
  });
};

/** Handler for setup form submission - save data to relevant collection with account ID association */
exports.setup = async (req, res, next) => {
  // data to store in database comes from formSectionHandler.js
  req.body.account = mongoose.Types.ObjectId(req.body.account); // get user ID from params and convert to Object ID for storage
  if (req.body.type === 'Business') {
    const business = await new Business(req.body).save();
    updateProfileComplete(req.body.account);
  } else {
    const fridge = await new Fridge(req.body).save();
    updateProfileComplete(req.body.account);
  }
  res.sendStatus(200);
}

/** Update the profileCompleted prop in Account collection to stop setup form being shown */
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

/** API endpoint for all businesses/fridges */
exports.getAllBusinesses = async (req, res) => {
  const businesses = await Business.find().select('establishmentName location openingHours');
  res.json(businesses);
}

exports.getAllFridges = async (req, res) => {
  const fridges = await Fridge.find().select('establishmentName location');
  res.json(fridges);
}

/** API endpoint for single business/fridge */
exports.getSingleBusiness = async (req, res) => {
  //query for
  const q = {
    account: req.params._id
  };

  const business = await Business.find(q).select('establishmentName location openingHours');
  res.json(business);
}

exports.getSingleFridge = async (req, res) => {
  //query for
  const q = {
    account: req.params._id
  };

  const fridge = await Fridge.find(q).select('establishmentName location');
  res.json(fridge);
}