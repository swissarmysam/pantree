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
  res.render('donations', {
    title: 'Donations',
    id: req.params._id,
    account: req.cookies.account,
    establishmentType: req.cookies.establishmentType,
    donations: req.cookies.donations,
  });
};

exports.donationForm = (req, res) => {
  res.render('addDonation', {
    title: 'Add Donation',
    account: req.cookies.account,
  });
};

/** */
exports.validateDonationForm = (req, res, next) => {
  // console.log(req);
  req.sanitizeBody('tags');
  req.checkBody('tags', 'Some tags are required').notEmpty();
  req.sanitizeBody('description');
  req
    .checkBody('description', 'Please describe the contents of the donation')
    .notEmpty();
  req.checkBody('expiryDate', 'Please enter a date').notEmpty();
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
  // TODO: NEED TO FIX MOBILE PHONE VALIDATION
  // req
  //   .checkBody('contact[phoneNumber]', 'Please enter a valid mobile number')
  //   .isMobilePhone();

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
exports.getDonations = async (req, res) => {
  const page = req.params.page || 1;
  const limit = 10;
  const skip = page * limit - limit;

  // Query collection for a list of all donations sorted by expiring soonest first
  const donationsPromise = Donation.find()
    .skip(skip)
    .limit(limit)
    .sort({ expiryDate: 1 });

  // count records in collection to work out how many pages
  const countPromise = Donation.count();

  // resolve all promises
  const [donations, count] = await Promise.all([
    donationsPromise,
    countPromise,
  ]);

  // get total number of pages
  const pages = Math.ceil(count / limit);

  // if user tries to hit page that does not exist then redirect to last page
  if (!donations.length && skip) {
    req.flash('info', `Oops! That page doesn't exist so here is page ${pages}`);
    res.redirect(`/donations/page/${pages}`);
    return;
  }

  res.render('donations', {
    title: 'Donations',
    donations,
    page,
    pages,
    count,
  });
};

/** */
exports.getDonation = async (req, res) => {
  const donation = await Donation.find({
    _id: req.params.donation_id,
  });
  res.render('donation', { title: 'Donation Details', donation });
};

/** */
exports.claimDonation = async (req, res) => {
  const updates = {
    claimer: req.user._id,
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
  req.flash(
    'success',
    `You've claimed the donation. Don't forget to collect it!`
  );
  res.redirect('back'); // reload the page
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
exports.markDonationAsCollect = async (req, res) => {
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
};

/** */
const getNearbyDonations = async (user) => {
  // get fridge coordinates from signed in user
  const q = {
    account: user,
  };
  const fridge = await Fridge.findOne(q).select('location');
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
  const nearbyBusinesses = await Business.find(q2).select('account');

  // get all donations which belong to those businesses and are NOT claimed
  // UNCOMMENT @HRISTO
  // const q2 = {
  //   $and: [{ donor: nearbyBusinesses.account }, { claimed: false }]
  // };
  // const donations = await Donation.find(q3);

  // pass object to page
  // res.json(donations);
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
