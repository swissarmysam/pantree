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

const { catchErrors } = require('../handlers/errorHandlers');

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

router.get('/setup/:id', accountController.setupForm); // display the setup form to collect profile details
router.post('/setup', accountController.setup); // handle the saving of profile details and update profile status so it doesn't show again

router.get('/logout', authController.logout); // end the session

router.get('/account', authController.isLoggedIn, accountController.account);
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
  donationController.setProfileCookies,
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
// delete the donation
router.post(
  '/donations/donation/:donation_id/remove',
  donationController.removeDonation
);
// show the donation form and handle data submissions
router.get(
  '/donations/donation/add/:id',
  authController.isLoggedIn,
  donationController.donationForm
);
router.post('/donations/donation/add', donationController.validateDonationForm, donationController.addDonation);

// TODO: NEED TO HANDLE WAY TO DISPLAY ALL DONATIONS BELONGING TO BUSINESS AND CLAIMED BY FRIDGE

/** API ENDPOINTS */
router.get('/api/donations/all', donationController.getAllDonations);
router.get('/api/donations/:id/single', donationController.getSingleDonation);
router.get('/api/donations/:id/owner', donationController.getAssociatedDonations);
router.get('/api/business/all', accountController.getAllBusinesses);
router.get('/api/business/:id/single', accountController.getSingleBusiness);
router.get('/api/fridge/all', accountController.getAllFridges);
router.get('/api/fridge/:id/single', accountController.getSingleFridge);

module.exports = router;
