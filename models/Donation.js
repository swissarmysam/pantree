/**
 * Fridge Schema
 * Model for
 */

/** Import wrapper for database connection */
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const slug = require('slugs');

// TODO Add optional associated details (name, number, email) in case it is different contact
const donationSchema = new mongoose.Schema(
  {
    id: String,
    details: {
      donatee: {
        type: mongoose.Schema.ObjectId,
        ref: 'Business',
        required: true,
      },
      claimer: {
        type: mongoose.Schema.ObjectId,
        ref: 'Fridge',
      },
      description: {
        type: String,
        trim: true,
        required: true,
      },
      tags: [String],
      available: {
        type: Boolean,
      },
      addedDate: {
        type: Date,
        default: Date.now,
      },
      expiryDate: {
        type: Date,
      },
      weight: {
        type: Number,
      },
      altContact: {
        name: {
          type: String,
        },
        phoneNumber: {
          type: Number,
        },
      },
      photo: String,
    },
  },
  {
    toJSON: { virtuals: true }, // serialize when JSON.stringify() is called
    toObject: { virtuals: true }, // convert the mongoose document into a JS object
  }
);

// Define the indexes for faster querying
donationSchema.index({
  name: 'text',
  description: 'text',
});

donationSchema.index({ location: '2dsphere' });

// find donations where the business _id property === donation donatee property
donationSchema.virtual('reviews', {
  ref: 'Business', // what model to link?
  localField: '_id', // which field on the store?
  foreignField: 'donatee', // which field on the review?
});

module.exports = mongoose.model('Donation', donationSchema);
