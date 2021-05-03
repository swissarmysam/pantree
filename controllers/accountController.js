/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const Account = mongoose.model('Account');
const Business = mongoose.model('Business');
const Fridge = mongoose.model('Fridge');
const promisify = require('es6-promisify');
const e = require('express');

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
  req.body.account = req.params._id;
  if (req.body.type === 'Business') {
    req.body.businessName = req.body.name;
    req.body.location.type = 'Point';
    // coordinates need populating from google maps - naming may change
    req.body.location.coordinates[0] = req.body.lng;
    req.body.location.coordinates[1] = req.body.lat;
    req.body.location.address = req.body.address;
    req.body.location.postcode = req.body.postcode;
    req.body.localAuthority.council = req.body.council;
    // depends on default behaviour of checkbox not submitting any value if false so checks this first
    // if checked then it will write data to table
    if (req.body.mon !== 'closed') {
      req.body.openingHours.mon.open = true;
      req.body.openingHours.mon.hours = req.body.mon;
    }
    if (req.body.tues !== 'closed') {
      req.body.openingHours.tues.open = true;
      req.body.openingHours.tues.hours = req.body.tues;
    }
    if (req.body.wed !== 'closed') {
      req.body.openingHours.weds.open = true;
      req.body.openingHours.weds.hours = req.body.wed;
    }
    if (req.body.thur !== 'closed') {
      req.body.openingHours.thur.open = true;
      req.body.openingHours.thur.hours = req.body.thur;
    }
    if (req.body.fri !== 'closed') {
      req.body.openingHours.fri.open = true;
      req.body.openingHours.fri.hours = req.body.fri;
    }
    if (req.body.sat !== 'closed') {
      req.body.openingHours.sat.open = true;
      req.body.openingHours.sat.hours = req.body.sat;
    }
    if (req.body.sun !== 'closed') {
      req.body.openingHours.sun.open = true;
      req.body.openingHours.sun.hours = req.body.sun;
    }
    const business = await new Business(req.body).save();
    updateProfileComplete(req.params._id);
  } else {
    req.body.fridgeName = req.body.name;
    req.body.location.type = 'Point';
    // coordinates need populating from google maps - naming may change
    req.body.location.coordinates[0] = req.body.lng;
    req.body.location.coordinates[1] = req.body.lat;
    req.body.location.address = req.body.address;
    req.body.location.postcode = req.body.postcode;
    // depends on default behaviour of checkbox not submitting any value checks this first
    // if checked then it will write data to table
    if (req.body.mon !== 'closed') {
      req.body.openingHours.mon.open = true;
      req.body.openingHours.mon.hours = req.body.mon;
    }
    if (req.body.tues !== 'closed') {
      req.body.openingHours.tues.open = true;
      req.body.openingHours.tues.hours = req.body.tues;
    }
    if (req.body.wed !== 'closed') {
      req.body.openingHours.weds.open = true;
      req.body.openingHours.weds.hours = req.body.wed;
    }
    if (req.body.thur !== 'closed') {
      req.body.openingHours.thur.open = true;
      req.body.openingHours.thur.hours = req.body.thur;
    }
    if (req.body.fri !== 'closed') {
      req.body.openingHours.fri.open = true;
      req.body.openingHours.fri.hours = req.body.fri;
    }
    if (req.body.sat !== 'closed') {
      req.body.openingHours.sat.open = true;
      req.body.openingHours.sat.hours = req.body.sat;
    }
    if (req.body.sun !== 'closed') {
      req.body.openingHours.sun.open = true;
      req.body.openingHours.sun.hours = req.body.sun;
    }
    const fridge = await new Fridge(req.body).save();
    updateProfileComplete(req.params._id);
  }

  next();
}

const updateProfileComplete = async (account) => {
  const update = {
    profileCompleted: true
  }
  const profile = await Account.findOneAndUpdate({
    _id: account,
  }, {
    $set: update,
  });
}