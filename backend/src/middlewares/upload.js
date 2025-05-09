const multer = require('multer');
const path = require('path');
const i18n = require('../config/i18n');
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp') {
    cb(null, true);
  } else {
    cb(new Error(i18n.__('Only image files are allowed')), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = {upload};
