/* eslint-disable prettier/prettier */
/**
 * Application Routes
 */

/** Import express to get router */
const express = require('express');

/** Import the router */
const router = express.Router();

/** Import controllers to make methods available on the routes */
const sharedController = require('../controllers/sharedController');
const authController = require('../controllers/authController');
const accountController = require('../controllers/accountController');
const donationController = require('../controllers/donationController');
const presskitController = require('../controllers/presskitController');

/* GENERAL ROUTES */
router.get('/', authController.notLoggedIn, sharedController.homePage); // load public home page if no user is signed in

/* ACCOUNT AND AUTH ROUTES */
router.get('/login', authController.loginForm); // display the login form page
router.post('/login', authController.login); // handle login authentication with passport

router.get('/register', accountController.registerForm); // display the registration form (initial username/password collection)
/** Validate user registration, save details to Account and then redirect to login - this will handle profile setup */
router.post(
  '/register',
  accountController.validateRegister,
  accountController.register,
  authController.login
);

router.get('/logout', authController.logout); // end the session

router.get('/setup/:id', accountController.setupForm); // display the setup form to collect profile details
router.post('/setup', accountController.setup); // handle the saving of profile details and update profile status so it doesn't show again


router.get('/account', authController.isLoggedIn, accountController.editAccount);
router.post('/account', accountController.updateAccount);
router.get('/account/forgot', authController.forgotPassword);
router.post('/account/forgot', authController.forgot);
router.get('/account/reset/:token', authController.reset);
router.post(
  '/account/reset/:token',
  authController.confirmedPasswords,
  authController.update
);

/* DASHBOARD AND DONATIONS ROUTES */
// show main dashboard
router.get(
  '/donations/:id',
  authController.isLoggedIn,
  donationController.dashboard
);
// display a single donation
router.get(
  '/donations/donation/:donation_id',
  authController.isLoggedIn,
  donationController.getDonation
);
// claim a donation
router.post(
  '/donations/donation/:donation_id',
  donationController.claimDonation
);
// cancel a donation
router.post(
  '/donations/donation/:donation_id/cancel',
  donationController.cancelDonationClaim
);
// delete the donation
router.post(
  '/donations/donation/:donation_id/remove',
  donationController.removeDonation
);
// mark donation as collected
router.post(
  'donations/donation/:donation_id/collect',
  donationController.markDonationAsCollected
);
// show the donation form and handle data submissions
router.get(
  '/donations/donation/add/:id',
  authController.isLoggedIn,
  donationController.donationForm
);
router.post(
  '/donations/donation/add/:id',
  donationController.validateDonationForm,
  donationController.addDonation
);
// show the edit establishment form and handle data submissions
router.get(
  '/establishment/edit/:id',
  authController.isLoggedIn,
  accountController.editEstablishment
)
router.post('/establishment/edit', accountController.updateEstablishment);

/** FRIDGE ROUTES */
router.get('/presskit/:id', presskitController.presskit)

/** API ENDPOINTS */
router.get('/api/donations/all', donationController.getAllDonations); // query every donation in the database
router.get('/api/donations/:id/single', donationController.getSingleDonation); // get single donation based on the ID
router.get('/api/donations/:id/owner', donationController.getAssociatedDonations); // get donations that have an association with the signed in user (either donor or claimer)
router.get('/api/donations/status', donationController.checkClaimStatus); // a query to check if donation is available before rendering
router.get('/api/business/all', accountController.getAllBusinesses); // query every business in the database
router.get('/api/business/:id/single', accountController.getSingleBusiness); // get a single business details based on the business user id
router.get('/api/fridge/all', accountController.getAllFridges); // query every fridge in the database
router.get('/api/fridge/:id/single', accountController.getSingleFridge); // get a single fridge details based on a fridge user id
router.get('/api/donations/business', donationController.getDonationsByBusiness); // get donations belonging to the queried business id


module.exports = router;
