const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const businessSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.ObjectId,
      ref: 'Account',
      required: 'You must supply an account',
    },
    businessName: {
      type: String,
      trim: true,
      required: 'Please enter the business name!',
    },
    created: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: [
        {
          type: Number,
          required: 'You must supply coordinates!',
        },
      ],
      address: {
        type: String,
        required: 'You must supply an address!',
      },
    },
    openingHours: {
      mon: {
        open: {
          type: Boolean,
          default: false,
        },
        openTime: String,
        closeTime: String,
      },
      tues: {
        open: {
          type: Boolean,
          default: false,
        },
        openTime: String,
        closeTime: String,
      },
      weds: {
        open: {
          type: Boolean,
          default: false,
        },
        openTime: String,
        closeTime: String,
      },
      thurs: {
        open: {
          type: Boolean,
          default: false,
        },
        openTime: String,
        closeTime: String,
      },
      fri: {
        open: {
          type: Boolean,
          default: false,
        },
        openTime: String,
        closeTime: String,
      },
      sat: {
        open: {
          type: Boolean,
          default: false,
        },
        openTime: String,
        closeTime: String,
      },
      sun: {
        open: {
          type: Boolean,
          default: false,
        },
        openTime: String,
        closeTime: String,
      },
    },
    localAuthority: {
      council: {
        type: String,
        required: 'Please pick your local council!',
      },
      ratingPassed: {
        type: Boolean,
        default: false,
      },
    },
    photo: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Define our indexes
businessSchema.index({
  businessName: 'text',
});

businessSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Business', businessSchema);
