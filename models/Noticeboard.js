const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const noticeboardSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
    required: 'You must supply an owner!',
  },
  fridge: {
    type: mongoose.Schema.ObjectId,
    ref: 'Fridge',
    required: 'You must supply a fridge!',
  },
  embedLink: {
    type: String,
    required: 'Please supply the embed link!',
  },
  categories: [String],
});

function autopopulate(next) {
  this.populate('fridge');
  next();
}

noticeboardSchema.pre('find', autopopulate);
noticeboardSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Noticeboard', noticeboardSchema);
