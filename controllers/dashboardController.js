/**
 * Dashboard Controller code
 * Methods for donation transactions and map rendering
 * Any data saved from here will be in Donation model
 */

/** Import required packages */
const mongoose = require('mongoose'); // database wrapper

/** Grab database collections */
const Donation = mongoose.model('Donation');
const Account = mongoose.model('Account');

/** Display donations page and pass account ID */
exports.showDonations = (req, res) => {
  res.render('donations', { title: 'Donations', id: req.params._id });
};
