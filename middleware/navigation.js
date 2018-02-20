
var navigationLinks = [
  {url: '/', caption: 'Home'},
  {url: '/cashier', caption: 'Cashier'},
  {url: '/users', caption: 'User'}
];

function setTitle(title) {
  this.locals.title = 'StoreHelper - ' + title;
}

function setNavbarPage(url) {
  this.locals.navLinks.current = url;
}

module.exports = function (req, res, next) {
  // Title bar
  res.locals.title = 'StoreHelper';
  res.setTitle = setTitle;

  // Nav bar
  res.locals.navLinks = {
    all: navigationLinks,
    current: ''
  };
  res.setNavbarPage = setNavbarPage;

  next();
};