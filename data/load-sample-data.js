require('dotenv').config({ path: `${__dirname}/../variables.env` });
const fs = require('fs');

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

// import all of our models - they need to be imported only once
const Donation = require('../models/Donation');
const Fridge = require('../models/Fridge');
const Business = require('../models/Business');
const Account = require('../models/Account');

const donation = JSON.parse(
  fs.readFileSync(`${__dirname}/donation.json`, 'utf-8')
);
const business = JSON.parse(
  fs.readFileSync(`${__dirname}/business.json`, 'utf-8')
);
const fridge = JSON.parse(fs.readFileSync(`${__dirname}/fridge.json`, 'utf-8'));
const account = JSON.parse(fs.readFileSync(`${__dirname}/account.json`, 'utf-8'));

async function deleteData() {
  console.log('😢😢 Goodbye Data...');
  await Donation.remove();
  await Fridge.remove();
  await Business.remove();
  await Account.remove();
  console.log(
    'Data Deleted. To load sample data, run\n\n\t npm run sample\n\n'
  );
  process.exit();
}

async function loadData() {
  try {
    await Donation.insertMany(donation);
    await Business.insertMany(business);
    await Fridge.insertMany(fridge);
    await Account.insertMany(account);
    console.log('Done!');
    process.exit();
  } catch (e) {
    console.log('Error');
    console.log(e);
    process.exit();
  }
}
if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}
