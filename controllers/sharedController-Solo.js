/**
 * Shared Controller code
 * Methods for shared methods between public and authenticated users
 */

/** Display public homepage pug file */
exports.homePage = (req, res) => {
  res.render('index', { title: 'Home' });
};
