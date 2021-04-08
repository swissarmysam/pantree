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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Define our indexes
donationSchema.index({
  name: 'text',
  description: 'text',
});

donationSchema.index({ location: '2dsphere' });

donationSchema.pre('save', async function(next) {
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

donationSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

donationSchema.statics.getTopStores = function() {
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
donationSchema.virtual('reviews', {
  ref: 'Review', // what model to link?
  localField: '_id', // which field on the store?
  foreignField: 'store', // which field on the review?
});

function autopopulate(next) {
  this.populate('reviews');
  next();
}

donationSchema.pre('find', autopopulate);
donationSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Donation', donationSchema);
