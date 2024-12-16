const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage

}).fields([
    { name: 'posts', maxCount: 1 },
    { name: 'reels', maxCount: 1 },
]);

module.exports = upload;
