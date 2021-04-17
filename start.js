const mongoose = require('mongoose');

// get secure variables for DB passwords etc
require('dotenv').config({ path: 'variables.env' });

// create connection to database - display error if any issues
mongoose.connect(process.env.DATABASE, {
  useMongoClient: true,
});
mongoose.Promise = global.Promise; // set Mongoose to use ES6 promises
mongoose.connection.on('error', err => {
  console.error(`${err.message}`);
});

// Import all database Models
require('./models/Account');
require('./models/Donation');
require('./models/Business');
require('./models/Fridge');

// start the server
const app = require('./app');

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.info(`Server running on PORT ${server.address().port}`);
});
