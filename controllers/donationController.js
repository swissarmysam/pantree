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
  const count = await Business.count({ account: req.user._id });
  let account;
  let establishmentType;

  if (count > 0) {
    account = await Business.findOne({ account: { $eq: req.user._id } });
    establishmentType = 'Business';
  } else {
    account = await Fridge.findOne({ account: { $eq: req.user._id } });
    establishmentType = 'Fridge';
  }

  res.render('donations', {
    title: 'Donations',
    id: req.params._id,
    account,
    establishmentType,
  });
};

exports.donationForm = (req, res) => {
  res.render('donationForm', { title: 'Add Donation' });
};

/** */
exports.addDonation = async (req, res) => {
  req.body.donor = req.user._id;
  const newDonation = await new Donation(req.body).save();
  req.flash('success', 'Thank you for adding a donation');
  res.redirect(`/donations/donation/${req.donation._id}`);
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
    available: false,
  };
  const claimDonation = await Donation.findOneAndUpdate(
    {
      _id: req.params.donation,
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
    _id: req.params.donation,
  });
  req.flash('success', 'Donation has been removed.');
  res.redirect(`/donations/${req.user._id}`);
};

// TODO: NEED TO HANDLE WAY TO DISPLAY ALL DONATIONS BELONGING TO BUSINESS AND CLAIMED BY FRIDGE
/** */
exports.getDonationsById = async (req, res) => {

};

/** API endpoints */
exports.getAllDonations = async (req, res) => {
  const donations = await Donation.find();
  res.json(donations);
}

exports.getSingleDonation = async (req, res) => {
  //query for
  const q = {
    _id: req.params._id
  };

  const donation = await Donation.find(q);
  res.json(donation);
}

exports.getAssociatedDonations = async (req, res) => {
  const donations = await Donation.find({
    $or: [ {donor: req.user._id}, {claimer: req.user._id} ]
  });
  res.json(donations);
}