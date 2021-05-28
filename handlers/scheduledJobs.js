/** Import required packages */
const mongoose = require('mongoose'); // database wrapper
const schedule = require('node-schedule'); // schedule cron-like jobs

/** Grab donation collection */
const Donation = mongoose.model('Donation');

/** Update expired status on out-of-date donations - run every 45 past the hours */
const setExpiredJob = schedule.scheduleJob('45 * * * *', async () => {
  // if donation expiry date has passed and it is not claimed/collected
  // updated expired status to true
  const checkDonationExpiry = await Donation.updateMany(
    { $and: [ { expiryDate: { $lt: Date.now() }}, { claimed: false }, { collected: false }] },
    { $set: { expired: true } },
    { upsert: false }
  )
  .then(result => {
    const { matchedCount, modifiedCount } = result;
    console.log(`Successfully matched ${matchedCount} and modified ${modifiedCount} items.`)
  })
  .catch(err => console.error(`Failed to update items: ${err}`));
});

/** Set donations that have not been collected back to unclaimed - runs at 30 past the hour */
const resetCollectionJob = schedule.scheduleJob('30 * * * *', async () => {
  let fromDate = new Date(Date.now() - 60 * 60 * 24 * 1000); // 24 hours ago
  const checkUncollectedStatus = await Donation.updateMany(
    { $and: [ { claimedDate: {$gte: fromDate } }, { collected: false }, { claimed: true } ] },
    { $set: [ { claimed: false }, { claimer: null } ] },
    { upsert: false }
  )
  .then(result => {
    const { matchedCount, modifiedCount } = result;
    console.log(`Successfully matched ${matchedCount} and modified ${modifiedCount} items.`)
  })
  .catch(err => console.error(`Failed to update items: ${err}`));
});

/** Set collected donations to expired so they do not show up - run every 15 minutes */
const setCollectedToExpiredJob = schedule.scheduleJob('*/15 * * * *', async () => {
  let fromDate = new Date(Date.now() - 60 * 60 * 24 * 1000); // 24 hours ago
  const checkDonationExpiry = await Donation.updateMany(
    { $and: [ { expiryDate: {$gte: fromDate } }, { claimed: true }, { collected: true } ] },
    { $set: { expired: true } },
    { upsert: false }
  )
  .then(result => {
    const { matchedCount, modifiedCount } = result;
    console.log(`Successfully matched ${matchedCount} and modified ${modifiedCount} items.`)
  })
  .catch(err => console.error(`Failed to update items: ${err}`));
});