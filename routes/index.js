const express = require('express');

const router = express.Router();
const sharedController = require('../controllers/sharedController');
const authController = require('../controllers/authController');
const accountController = require('../controllers/accountController');
const dashboardController = require('../controllers/dashboardController');

const { catchErrors } = require('../handlers/errorHandlers');

/* GENERAL ROUTES */
router.get('/', sharedController.homePage);

/* ACCOUNT AND AUTH ROUTES */
router.get('/login', authController.loginForm);
router.post('/login', authController.login);
router.get('/register', accountController.registerForm);

// 1. Validate the registration data
// 2. register the user
// 3. we need to log them in
router.post(
  '/register',
  accountController.validateRegister,
  accountController.register,
  authController.login
);

// router.get('/logout', authController.logout);

// router.get('/account', authController.isLoggedIn, accountController.account);
// router.post('/account', catchErrors(accountController.updateAccount));
// router.post('/account/forgot', catchErrors(authController.forgot));
// router.get('/account/reset/:token', catchErrors(authController.reset));
// router.post(
//   '/account/reset/:token',
//   authController.confirmedPasswords,
//   catchErrors(authController.update)
// );

/* DASHBOARD ROUTE */
// router.get(
//   '/dashboard/:id',
//   authController.isLoggedIn,
//   catchErrors(sharedController.showDashboard)
// );
router.get('/dashboard', dashboardController.showDashboard); // TEMP

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

// router.post(
//   '/add',
//   businessController.upload,
//   catchErrors(businessController.resize),
//   catchErrors(businessController.createBusiness)
// );

// router.post(
//   '/add/:id',
//   businessController.upload,
//   catchErrors(businessController.resize),
//   catchErrors(businessController.updateFridge)
// );

// router.get('/business/:id/edit', catchErrors(businessController.editBusiness));

// router.get(
//   '/business/:slug',
//   catchErrors(businessController.getBusinessBySlug)
// );

/* DONATION ROUTES */
// router.get('/map', donationController.mapPage);
// router.get('/tags', catchErrors(donationController.getDonationsByTag));
// router.get('/tags/:tag', catchErrors(donationController.getDonationsByTag));

/* NOTICEBOARD ROUTES */
// router.post(
//   '/reviews/:id',
//   authController.isLoggedIn,
//   catchErrors(noticeboardController.addNotice)
// );

/*
  API
*/

// router.get('/api/search', catchErrors(donationController.searchDonations));
// router.get('/api/donations/near', catchErrors(donationController.mapDonations));

module.exports = router;
