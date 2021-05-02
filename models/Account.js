const mongoose = require('mongoose');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const validator = require('validator');
// @ts-ignore
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

// DATA WE NEED TO STORE
// email, name and password

const accountSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please supply an email address',
  },
  name: {
    type: String,
    required: 'Please supply a name',
    trim: true,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  profileCompleted: {
    type: Boolean,
    default: false,
  },
});

accountSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
accountSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Account', accountSchema);
