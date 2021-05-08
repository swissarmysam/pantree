/**
 * Presskit Controller code
 * Methods for presskit data such as posters
 * Data here will be from static files folder
 */

/** Display presskit pug file page */
exports.presskit = (req, res) => {
  res.render('presskit', { title: 'Presskit' });
};
