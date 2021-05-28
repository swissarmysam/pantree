/* eslint-disable */

/**
 * Dashboard Controller code
 * Methods for donation transactions and map rendering
 * Any data saved from here will be in Donation model
 */

/** Import required packages */
const e = require('express');
const mongoose = require('mongoose'); // database wrapper

/** Grab database collections */
const Donation = mongoose.model('Donation');
const Fridge = mongoose.model('Fridge');
const Business = mongoose.model('Business');

/** Display donations page and pass account ID */
exports.dashboard = async (req, res) => {
  let nearbyDonations;
  let donations;

  if (req.cookies.establishmentType === 'Fridge') {
    nearbyDonations = await getNearbyDonations(req.user._id);
  } else {
    donations = await Donation.find({ donor: req.user._id });
  }

  const info = await getDonationInfo(req.user._id);

  res.render('donations', {
    title: 'Donations',
    info,
    nearbyDonations,
    id: req.params._id,
    account: req.cookies.account,
    establishmentType: req.cookies.establishmentType,
    donations,
  });
};

/** handler to set cookie from setup */
exports.setCookiesFromSetup = async (req, res) => {
    // set cookies if redirected from setup
    if(req.cookies.account === undefined) {
       const count = await Business.count({ account: req.user._id });
       const oneDayInMS = 24 * 60 * 60 * 1000; // 24 hours

       if (count > 0) {
         const account = await Business.findOne({ account: { $eq: req.user._id } });
         res.cookie('account', account, { maxAge: oneDayInMS }); // 24 hour cookie
         res.cookie('establishmentType', 'Business', { maxAge: oneDayInMS });
       } else {
         const account = await Fridge.findOne({ account: { $eq: req.user._id } });
         res.cookie('account', account, { maxAge: oneDayInMS }); // 24 hour cookie
         res.cookie('establishmentType', 'Fridge', { maxAge: oneDayInMS });
       }
    }
  res.redirect(`/donations/${req.user._id}`);
}

/** */
const getNearbyDonations = async (user) => {
  // get fridge coordinates from signed in user
  const q = {
    account: mongoose.Types.ObjectId(user),
  };

  const fridge = await Fridge.findOne(q).select('location').exec();
  const coordinates = [
    fridge.location.coordinates[0],
    fridge.location.coordinates[1],
  ].map(parseFloat);

  // search for businesses within 20km radius of fridge
  const q2 = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates,
        },
        $maxDistance: 20000, // 20km
      },
    },
  };
  const nearbyBusinesses = await Business.find(q2).select(
    'account establishmentName'
  );
  const nearbyBusinessIds = nearbyBusinesses.map(
    (business) => business.account
  );
  const nearbyBusinessNames = nearbyBusinesses.map(
    (business) => business.establishmentName
  );

  // get all donations which belong to those businesses and are NOT claimed
  const q3 = {
    $and: [{ donor: { $in: nearbyBusinessIds } }, { claimed: false }],
  };
  const donations = await Donation.find(q3);

  // attach establishment name to the donation object
  donations.forEach((donation) => {
    const { donor } = donation;
    for (let i = 0; i < nearbyBusinessIds.length; i++) {
      if (donor.toString() === nearbyBusinessIds[i].toString()) {
        donation.establishmentName = nearbyBusinessNames[i];
      }
    }
  });

  // pass object to page
  return donations;
};

exports.donationForm = (req, res) => {
  res.render('addDonation', {
    title: 'Add Donation',
    account: req.cookies.account,
  });
};

/** */
exports.validateDonationForm = (req, res, next) => {
  req.sanitizeBody('tags');
  req.checkBody('tags', 'Some tags are required').notEmpty();
  req.sanitizeBody('description');
  req
    .checkBody('description', 'Please describe the contents of the donation')
    .notEmpty();
  if (req.body.photo) {
    req.checkBody('photo').isURL().contains('cloudinary.com');
  }
  req
    .checkBody('expiryDate', 'Please enter a date in the future')
    .notEmpty()
    .isAfter();
  req.sanitizeBody('expiryDate').toDate();
  req
    .checkBody('weight', 'Please enter a weight as a decimal')
    .notEmpty()
    .isDecimal({ force_decimal: false, decimal_digits: '0,2' });
  req.sanitizeBody('weight');
  req.sanitizeBody('contact[name]');
  req.checkBody('contact[email]').isEmail();
  req.sanitizeBody('contact[email]').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  if (req.body.contact.phoneNumber) {
    req
    .checkBody('contact[phoneNumber]', 'Please enter a valid mobile number')
    .isLength({ min: 10, max: 14 })
    .isNumeric();
  }
  // flash all validation errors on the register page
  const errors = req.validationErrors();
  if (errors) {
    req.flash(
      'error',
      errors.map((err) => err.msg)
    );
    res.render('addDonation', {
      title: 'Add Donation',
      account: req.cookies.account,
      body: req.body,
      flashes: req.flash(),
    });
    return; // stop the function from moving onto next()
  }
  next(); // move onto next step in route - move onto saving data otherwise flash errors
};

/** */
exports.addDonation = async (req, res) => {
  req.body.donor = req.user._id;
  const donation = await new Donation(req.body).save();
  req.flash('success', 'Thank you for adding your donation');
  res.redirect(`/donations/${req.body.donor}`);
};

/** */
exports.getDonation = async (req, res) => {
  const donation = await Donation.find({
    _id: req.params.donation_id,
  });
  res.render('singleDonation', {
    title: 'Donation Details',
    donation,
    account: req.cookies.account,
    establishmentType: req.cookies.establishmentType,
  });
};

/** */
exports.claimDonation = async (req, res) => {
  const updates = {
    claimer: req.user._id,
    claimed: true,
    clamedDate: new Date(),
  };
  const claimDonation = await Donation.findOneAndUpdate(
    {
      _id: req.params.donation_id,
    },
    {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  ).exec();
  // display a success message
  req.flash(
    'success',
    `You've claimed the donation. Don't forget to collect it!`
  );
  res.redirect(`/donations/manage/${req.user._id}`); // this will redirect to claimed donations
};

/** */
exports.cancelDonationClaim = async (req, res) => {
  console.log(req.body);
  const updates = {
    claimer: null,
    claimed: false,
  };
  const claimDonation = await Donation.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(req.body.id),
    },
    {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  ).exec();
  res.sendStatus(200);
};

/** */
exports.removeDonation = async (req, res) => {
  const deletePromise = await Donation.deleteOne({
    _id: mongoose.Types.ObjectId(req.body.id),
  });
  res.sendStatus(200);
};

/**  */
exports.markDonationAsCollected = async (req, res) => {
  const update = {
    collected: true,
    collectedDate: new Date(),
  };

  const claimDonation = await Donation.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(req.body.id),
    },
    {
      $set: update,
    },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  ).exec();
  res.sendStatus(200);
};

/** */
exports.manageDonations = async (req, res) => {
  const donations = await Donation.find({
    $or: [{ donor: req.user._id }, { claimer: req.user._id }],
  });

  const user = req.user._id;
  let associated = [];
  for(let i = 0; i < donations.length; i++) {
    const { donor, claimer } = donations[i];
    let details = {};
    if(donor !== undefined && donor.toString() === user.toString()) {
      console.log(claimer);
      details.establishmentName = await Fridge.findOne({ account: claimer }).select(['establishmentName']);

      associated.push(details.establishmentName);
    } else if (claimer !== undefined && claimer.toString() === user.toString()) {
      details.establishmentName = await Business.findOne({ account: donor }).select('establishmentName');
      // details.donation = await Donation.findOne({ claimer: claimer });
      associated.push(details.establishmentName);
    }
  }
  console.log('manage object', associated);

  res.render('manageDonations', {
    title: 'Manage Donations',
    donations,
    associated,
    account: req.cookies.account,
    establishmentType: req.cookies.establishmentType
  });
};

/** API endpoints */
exports.getAllDonations = async (req, res) => {
  const donations = await Donation.find();
  res.json(donations);
};

exports.getSingleDonation = async (req, res) => {
  // query for
  const q = {
    _id: req.params._id,
  };

  const donation = await Donation.find(q);
  res.json(donation);
};

/** */
exports.getAssociatedDonations = async (req, res) => {
  const donations = await Donation.find({
    $or: [{ donor: req.user._id }, { claimer: req.user._id }],
  });
  res.json(donations);
};

/**  */
exports.getDonationsByBusiness = async (req, res) => {
  const donations = await Donation.find({
    donor: req.query.id,
  });
  res.json(donations);
};

/** */
exports.checkClaimStatus = async (req, res) => {
  // get all donations which are unclaimed
  const claimStatus = await Donation.find({
    $and: [{ donor: req.query.business }, { claimed: false }],
  }).select('_id');
  // return an object with donation ids
  res.json(claimStatus);
};

/**  */
const getDonationInfo = async (u) => {
  const user = mongoose.Types.ObjectId(u);
  const collected = await Donation.aggregate([
    {
      $match: {
        $and: [{ collected: true }, { $or: [{ claimer: user }, { donor: user }] }]
      }
    },
    {
      $count: 'no'
    }
  ]);

  const claimed = await Donation.aggregate([
    {
      $match: {
        $and: [{ claimed: true }, { $or: [{ claimer: user }, { donor: user }] }]
      }
    },
    {
      $count: 'no'
    }
  ]);

  const available = await Donation.aggregate([
    {
      $match: {
        $and: [{ claimed: false }, { collected: false }, { donor: user }]
      }
    },
    {
      $count: 'no'
    }
  ])


  const info = {
    collected,
    claimed,
    available // available for fridge user is counted from front-end
  };

   return info;
};
