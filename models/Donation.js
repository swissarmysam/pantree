/**
 * Donation Schema
 * Model for storing donation details
 */

/** Import wrapper for database connection */
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.ObjectId,
      ref: 'Account',
      required: true,
    },
    claimer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Account',
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    addedDate: {
      type: Date,
      default: Date.now,
    },
    tags: [String],
    claimed: {
      type: Boolean,
      default: false,
    },
    collected: {
      type: Boolean,
      default: false,
    },
    expired: {
      type: Boolean,
      default: false,
    },
    expiryDate: {
      type: Date,
    },
    weight: {
      type: Number,
    },
    photo: String,
    contact: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phoneNumber: {
        type: Number,
      },
    },
  },
  {
    toJSON: { virtuals: true }, // serialize when JSON.stringify() is called
    toObject: { virtuals: true }, // convert the mongoose document into a JS object
  }
);

// Define the indexes for faster querying
donationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Donation', donationSchema);
