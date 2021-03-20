const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const slug = require('slugs');

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
    slug: String,
    tags: [String],
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
        open: Boolean,
        openTime: Number,
        closeTime: Number,
      },
      tues: {
        open: Boolean,
        openTime: Number,
        closeTime: Number,
      },
      weds: {
        open: Boolean,
        openTime: Number,
        closeTime: Number,
      },
      thurs: {
        open: Boolean,
        openTime: Number,
        closeTime: Number,
      },
      fri: {
        open: Boolean,
        openTime: Number,
        closeTime: Number,
      },
      sat: {
        open: Boolean,
        openTime: Number,
        closeTime: Number,
      },
      sun: {
        open: Boolean,
        openTime: Number,
        closeTime: Number,
      },
    },
    localAuthority: {
      council: {
        type: String,
        required: 'Please pick your local council!',
      },
      ratingPassed: {
        type: Boolean,
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

businessSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  // find other stores that have a slug of wes, wes-1, wes-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
  // TODO make more resiliant so slugs are unique
});

businessSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

businessSchema.statics.getTopStores = function() {
  return this.aggregate([
    // Lookup Stores and populate their reviews
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'store',
        as: 'reviews',
      },
    },
    // filter for only items that have 2 or more reviews
    { $match: { 'reviews.1': { $exists: true } } },
    // Add the average reviews field
    {
      $project: {
        photo: '$$ROOT.photo',
        name: '$$ROOT.name',
        reviews: '$$ROOT.reviews',
        slug: '$$ROOT.slug',
        averageRating: { $avg: '$reviews.rating' },
      },
    },
    // sort it by our new field, highest reviews first
    { $sort: { averageRating: -1 } },
    // limit to at most 10
    { $limit: 10 },
  ]);
};

// find reviews where the stores _id property === reviews store property
businessSchema.virtual('reviews', {
  ref: 'Review', // what model to link?
  localField: '_id', // which field on the store?
  foreignField: 'store', // which field on the review?
});

function autopopulate(next) {
  this.populate('reviews');
  next();
}

businessSchema.pre('find', autopopulate);
businessSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Business', businessSchema);
