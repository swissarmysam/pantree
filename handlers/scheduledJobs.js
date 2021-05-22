/** Import required packages */
const mongoose = require('mongoose'); // database wrapper
const schedule = require('node-schedule'); // schedule cron-like jobs

/** Grab donation collection */
const Donation = mongoose.model('Donation');

/** Update expired status on out-of-date donations */
const rule = new schedule.RecurrenceRule();
rule.hour = 24;
rule.minute = 01;
const job = schedule.scheduleJob(rule, async () => {
  // if donation expiry date has passed and it is not claimed/collected
    // updated expired status to true
  const checkDonationExpiry = await Donation.updateMany(
    { $where: [ { expiryDate: { $lt: Date.now() } }, { $and: [ { claimed: false }, { collected: false } ] } ] },
    { $set: { expired: true } },
    { upsert: false }
  )
  .then(result => {
    const { matchedCount, modifiedCount } = result;
    console.log(`Successfully matched ${matchedCount} and modified ${modifiedCount} items.`)
  })
  .catch(err => console.error(`Failed to update items: ${err}`));
});
