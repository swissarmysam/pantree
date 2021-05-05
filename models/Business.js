const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const businessSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.ObjectId,
      ref: 'Account',
      required: 'You must supply an account',
    },
    establishmentName: {
      type: String,
      trim: true,
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
        },
      ],
      address: {
        type: String,
      },
      postcode: {
        type: String,
      }
    },
    openingHours: {
      mon: {
        open: {
          type: Boolean,
          default: false,
        },
        hours: {
          type: String,
        },
      },
      tues: {
        open: {
          type: Boolean,
          default: false,
        },
        hours: {
          type: String,
        },
      },
      weds: {
        open: {
          type: Boolean,
          default: false,
        },
        hours: {
          type: String,
        },
      },
      thurs: {
        open: {
          type: Boolean,
          default: false,
        },
        hours: {
          type: String,
        },
      },
      fri: {
        open: {
          type: Boolean,
          default: false,
        },
        hours: {
          type: String,
        },
      },
      sat: {
        open: {
          type: Boolean,
          default: false,
        },
        hours: {
          type: String,
        },
      },
      sun: {
        open: {
          type: Boolean,
          default: false,
        },
        hours: {
          type: String,
        },
      },
    },
    localAuthority: {
      council: {
        type: String,
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
