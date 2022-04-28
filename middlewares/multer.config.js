const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images/articles');
    },
    filename: (req, file, callback) => {
        var name = Math.floor(Math.random() * Math.floor(15258652325)).toString();
        name += Math.floor(Math.random() * Math.floor(15258652325)).toString();
        name += Math.floor(Math.random() * Math.floor(15258652325)).toString();
        name += Math.floor(Math.random() * Math.floor(15258652325)).toString();
        name += Date.now() + ".";

        const extention = MIME_TYPES[file.mimetype];
        name += extention;

        callback(null, name);
    }
})

module.exports = multer({ storage }).single('image');