exports.homePage = (req, res) => {
  res.render('index', { title: 'Home' });
};
exports.tempSetup = (req, res) => {
  res.render('setup', { title: 'Temp' });
};
