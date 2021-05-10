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

/* DASHBOARD ROUTE */
router.get(
  '/donations/:id',
  authController.isLoggedIn,
  donationController.dashboard
);

/* FRIDGE ROUTES */
// router.get('/fridge', catchErrors(fridgeController.getFridges));
// router.get('/fridge/page/:page', catchErrors(fridgeController.getFridge));
// router.get('/add', authController.isLoggedIn, fridgeController.addFridge);

// router.post(
//   '/add',
//   fridgeController.upload,
//   catchErrors(fridgeController.resize),
//   catchErrors(fridgeController.createFridge)
// );

// router.post(
//   '/add/:id',
//   fridgeController.upload,
//   catchErrors(fridgeController.resize),
//   catchErrors(fridgeController.updateFridge)
// );

// router.get('/fridge/:id/edit', catchErrors(fridgeController.editFridge));
// router.get('/fridge/:slug', catchErrors(fridgeController.getFridgeBySlug));

/* BUSINESS ROUTES */
// router.get('/business', catchErrors(businessController.getBusinesses));
// router.get(
//   '/business/page/:page',
//   catchErrors(businessController.getBusinesses)
// );
// router.get('/add', authController.isLoggedIn, businessController.addBusiness);

/* DONATION ROUTES */
// router.get('/map', donationController.mapPage);
// router.get('/tags', catchErrors(donationController.getDonationsByTag));
// router.get('/tags/:tag', catchErrors(donationController.getDonationsByTag));

/*
  API
*/

// router.get('/api/search', catchErrors(donationController.searchDonations));
// router.get('/api/donations/near', catchErrors(donationController.mapDonations));

module.exports = router;
