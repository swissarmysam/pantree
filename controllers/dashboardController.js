const mongoose = require('mongoose');

const Donation = mongoose.model('Donations');
const Account = mongoose.model('Account');

exports.showDashboard = (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
};
