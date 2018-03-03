
function requireStyle(path) {
  this.locals.assets.styles.push(path);
}

function requireScript(path) {
  this.locals.assets.scripts.push(path);
}

module.exports = function (req, res, next) {
  res.locals.assets = {
    styles: [],
    scripts: []
  };
  res.requireStyle = requireStyle;
  res.requireScript = requireScript;

  next();
}