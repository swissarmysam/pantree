const mongoose = require('mongoose');

const Donation = mongoose.model('Donation');
const Account = mongoose.model('Account');

exports.showDonations = (req, res) => {
  res.render('donations', { title: 'Donations', id: req.params._id });
};
