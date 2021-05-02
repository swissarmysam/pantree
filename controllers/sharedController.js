exports.homePage = (req, res) => {
  res.render('index', { title: 'Home' });
};
// TODO Remove route @HRISTO
exports.tempSetup = (req, res) => {
  res.render('setup', { title: 'Temp' });
};
