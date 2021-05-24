/**
 * Dashboard Controller code
 * Methods for donation transactions and map rendering
 * Any data saved from here will be in Donation model
 */

/** Import required packages */
const mongoose = require('mongoose'); // database wrapper

/** Grab database collections */
const Donation = mongoose.model('Donation');
const Fridge = mongoose.model('Fridge');
const Business = mongoose.model('Business');

/** Display donations page and pass account ID */
exports.dashboard = async (req, res) => {
  let nearbyDonations;

  if(req.cookies.establishmentType === 'Fridge') {
    nearbyDonations = await getNearbyDonations(req.user._id);
  }

  res.render('donations', {
    title: 'Donations',
    nearbyDonations,
    id: req.params._id,
    account: req.cookies.account,
    establishmentType: req.cookies.establishmentType,
    donations: req.cookies.donations,
  });
};

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
  const nearbyBusinesses = await Business.find(q2).select('account establishmentName');
  const nearbyBusinessIds = nearbyBusinesses.map(business => business.account);
  const nearbyBusinessNames = nearbyBusinesses.map(business => business.establishmentName);

  // get all donations which belong to those businesses and are NOT claimed
  const q3 = {
    $and: [{ donor: { $in: nearbyBusinessIds } }, { claimed: false }]
  };
  const donations = await Donation.find(q3);

  // attach establishment name to the donation object
  donations.forEach(donation => {
    let donor = donation.donor;
    for(let i = 0; i < nearbyBusinessIds.length; i++) {
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
  req.checkBody('photo').isURL().contains('cloudinary.com');
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
  req
    .checkBody('contact[phoneNumber]', 'Please enter a valid mobile number')
    .isLength({ min: 10, max: 14 })
    .isNumeric();
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

// /** */
// exports.getDonations = async (req, res) => {
//   const page = req.params.page || 1;
//   const limit = 10;
//   const skip = page * limit - limit;

//   // Query collection for a list of all donations sorted by expiring soonest first
//   const donationsPromise = Donation.find()
//     .skip(skip)
//     .limit(limit)
//     .sort({ expiryDate: 1 });

//   // count records in collection to work out how many pages
//   const countPromise = Donation.count();

//   // resolve all promises
//   const [donations, count] = await Promise.all([
//     donationsPromise,
//     countPromise,
//   ]);

//   // get total number of pages
//   const pages = Math.ceil(count / limit);

//   // // if user tries to hit page that does not exist then redirect to last page
//   // if (!donations.length && skip) {
//   //   req.flash('info', `Oops! That page doesn't exist so here is page ${pages}`);
//   //   res.redirect(`/donations/page/${pages}`);
//   //   return;
//   // }

//   res.render('donations', {
//     title: 'Donations',
//     donations,
//     page,
//     pages,
//     count,
//   });
// };

/** */
exports.getDonation = async (req, res) => {
  const donation = await Donation.find({
    _id: req.params.donation_id,
  });
  res.render('singleDonation', {
    title: 'Donation Details',
    donation,
    account: req.cookies.account,
  });
};

/** */
exports.claimDonation = async (req, res) => {
  const updates = {
    claimer: req.user._id,
    claimed: true,
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
  res.redirect(`/donations/${req.user._id}`); // this will redirect to claimed donations
};

/** */
exports.cancelDonationClaim = async (req, res) => {
  const updates = {
    claimer: null,
    claimed: false,
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
  req.flash('success', `The donation was successfully cancelled.`);
  return res.send(200);
};

/** */
exports.removeDonation = async (req, res) => {
  const deletePromise = await Donation.findOneAndDelete({
    _id: req.params.donation_id,
  });
  req.flash('success', 'Donation has been removed.');
  res.redirect(`/donations/${req.user._id}`);
};

/**  */
exports.markDonationAsCollected = async (req, res) => {
  const update = {
    collected: true,
  };

  const claimDonation = await Donation.findOneAndUpdate(
    {
      _id: req.params.donation_id,
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
  req.flash('success', 'The donation is marked as collected');
  res.redirect('back');
};

/** */
exports.manageDonations = async (req, res) => {

  res.render('manageDonations', {
    title: 'Manage Donations',
  });
};

/** */
exports.claimedDonations = async (req, res) => {

  res.render('claimedDonations', {
    title: 'Claimed Donations',
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

// TODO: NEED TO HANDLE WAY TO DISPLAY ALL DONATIONS BELONGING TO BUSINESS AND CLAIMED BY FRIDGE
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
exports.getDonationInfo = async (req, res) => {
  const info = {
    collected: 0,
    claimed: 0,
    available: 0,
  };
  // res.json(info);
}