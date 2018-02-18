
module.exports = {
  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.flash('error', 'Please login first.');
    res.redirect('/login');
  },
  navigation: function (req, res, next) {
    res.locals.navLinks = {
      all: [
        {url: '/', caption: 'Home'},
        {url: '/cashier', caption: 'Cashier'},
        {url: '/users', caption: 'Userz'},
      ],
      current: ''
    };
    res.setNavbarPage = function (url) {
      this.locals.navLinks.current = url;
    };
    next();
  }
};