var multer = require('multer');
var path = require('path');

module.exports = multer({
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', 'public/uploads/'),
    filename: function(req, file, cb) {
      cb(null, Date.now() + '_' + generateFilename(32) + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 1024 * 512 },
  fileFilter: function(req, file, cb) {
    var filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Only JPG and PNG image files are allowed.');
    }
  }
});

function generateFilename(length) {
  var ucase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var lcase = ucase.toLowerCase();
  var numbers = '0123456789';
  var charset = ucase + lcase + numbers;
  var result = '';

  for (var i = 0; i < length; i++) {
    randomChar = charset.charAt(Math.floor(Math.random() * charset.length));
    result += randomChar;
  }

  return result;
}