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
  // if donation expiry date has passed
  // updated expired status to true
  // const donations = await Donation.find({
  //   $or: [{ donor: req.user._id }, { claimer: req.user._id }],
  // });
  console.log(`Database updated at ${Date.now()}`);
});