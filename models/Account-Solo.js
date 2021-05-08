/**
 * Account Schema
 * Model to store user details - email, password, name, profile status and reset tokens
 */

/** Import DB wrapper */
const mongoose = require('mongoose');

const { Schema } = mongoose; // make mongoose methods available on Schema object
mongoose.Promise = global.Promise; // set promises to ES6 ones
const validator = require('validator'); // validate input fields
// @ts-ignore
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose'); // username/password authentication

/** Data stored is email, password, name and profile status (for setup route) */
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

// handle authentication and errors
accountSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
accountSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Account', accountSchema); // make available to the app
