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

  const account = await Account.findOneAndUpdate(
    {
      _id: req.account._id,
    },
    {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  );
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
    req.body.businessName = req.body.establishmentName;
    req.body.location.type = 'Point';
    // coordinates need populating from google maps - naming may change
    req.body.location.coordinates[0] = req.body.lng;
    req.body.location.coordinates[1] = req.body.lat;
    req.body.location.address = req.body.address;
    req.body.location.postcode = req.body.postcode;
    // depends on default behaviour of checkbox not submitting any value if false so checks this first
    // if checked then it will write data to table
    if(req.body.switchMonday) {
      req.body.openingHours.mon.open = req.body.switchMonday;
      req.body.openingHours.mon.openTime = req.body.startTimeMonday;
      req.body.openingHours.mon.closeTime = req.body.closeTimeMonday;
    }
    if(req.body.switchTuesday) {
      req.body.openingHours.tues.open = req.body.switchTuesday;
      req.body.openingHours.tues.openTime = req.body.startTimeTuesday;
      req.body.openingHours.tues.closeTime = req.body.closeTimeTuesday;
    }
    if(req.body.switchWednesday) {
      req.body.openingHours.weds.open = req.body.switchWednesday;
      req.body.openingHours.weds.openTime = req.body.startTimeWednesday;
      req.body.openingHours.weds.closeTime = req.body.closeTimeWednesday;
    }
    if(req.body.switchThursday) {
      req.body.openingHours.thur.open = req.body.switchThursday;
      req.body.openingHours.thur.openTime = req.body.startTimeThursday;
      req.body.openingHours.thur.closeTime = req.body.closeTimeThursday;
    }
    if(req.body.switchFriday) {
      req.body.openingHours.fri.open = req.body.switchFriday;
      req.body.openingHours.fri.openTime = req.body.startTimeFriday;
      req.body.openingHours.fri.closeTime = req.body.closeTimeFriday;
    }
    if(req.body.switchSaturday) {
      req.body.openingHours.sat.open = req.body.switchSaturday;
      req.body.openingHours.sat.openTime = req.body.startTimeSaturday;
      req.body.openingHours.sat.closeTime = req.body.closeTimeSaturday;
    }
    if(req.body.switchSunday) {
      req.body.openingHours.sun.open = req.body.switchSunday;
      req.body.openingHours.sun.openTime = req.body.startTimeSunday;
      req.body.openingHours.sun.closeTime = req.body.closeTimeSunday;
    }
    const business = await new Business(req.body).save();
  } else {
    req.body.fridgeName = req.body.establishmentName;
    req.body.location.type = 'Point';
    // coordinates need populating from google maps - naming may change
    req.body.location.coordinates[0] = req.body.lng;
    req.body.location.coordinates[1] = req.body.lat;
    req.body.location.address = req.body.address;
    req.body.location.postcode = req.body.postcode;
    // depends on default behaviour of checkbox not submitting any value if false so checks this first
    // if checked then it will write data to table
    if(req.body.switchMonday) {
      req.body.openingHours.mon.open = req.body.switchMonday;
      req.body.openingHours.mon.openTime = req.body.startTimeMonday;
      req.body.openingHours.mon.closeTime = req.body.closeTimeMonday;
    }
    if(req.body.switchTuesday) {
      req.body.openingHours.tues.open = req.body.switchTuesday;
      req.body.openingHours.tues.openTime = req.body.startTimeTuesday;
      req.body.openingHours.tues.closeTime = req.body.closeTimeTuesday;
    }
    if(req.body.switchWednesday) {
      req.body.openingHours.weds.open = req.body.switchWednesday;
      req.body.openingHours.weds.openTime = req.body.startTimeWednesday;
      req.body.openingHours.weds.closeTime = req.body.closeTimeWednesday;
    }
    if(req.body.switchThursday) {
      req.body.openingHours.thur.open = req.body.switchThursday;
      req.body.openingHours.thur.openTime = req.body.startTimeThursday;
      req.body.openingHours.thur.closeTime = req.body.closeTimeThursday;
    }
    if(req.body.switchFriday) {
      req.body.openingHours.fri.open = req.body.switchFriday;
      req.body.openingHours.fri.openTime = req.body.startTimeFriday;
      req.body.openingHours.fri.closeTime = req.body.closeTimeFriday;
    }
    if(req.body.switchSaturday) {
      req.body.openingHours.sat.open = req.body.switchSaturday;
      req.body.openingHours.sat.openTime = req.body.startTimeSaturday;
      req.body.openingHours.sat.closeTime = req.body.closeTimeSaturday;
    }
    if(req.body.switchSunday) {
      req.body.openingHours.sun.open = req.body.switchSunday;
      req.body.openingHours.sun.openTime = req.body.startTimeSunday;
      req.body.openingHours.sun.closeTime = req.body.closeTimeSunday;
    }
    const fridge = await new Fridge(req.body).save();
  }
}
