const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('./winston.logger');
const jimp = require('jimp');

const uploadPath = () => {
    const UPLOADS_FOLDER = './public/uploads/users';

    if (!fs.existsSync('./public/uploads')) {
        fs.mkdirSync('./public/uploads', {
            recursive: true
        });
    }

    if (!fs.existsSync(UPLOADS_FOLDER)) {
        fs.mkdirSync(UPLOADS_FOLDER, {
            recursive: true
        });
    }

    return UPLOADS_FOLDER;

};

const processImage = async (file) => {
    try {
        const jimpResp = await jimp.read(file);

    } catch (err) {

    }
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadPath());
    },
    filename: (_req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const filename = `${Date.now()}.${Math.round(Math.random() * 1e9)}`;
        cb(null, filename + fileExt);
    }
});

const avatarUpload = multer({
    storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: (_req, file, cb) => {
        if (file.fieldname === 'avatar') {
            if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
                cb(null, true);
            } else {
                cb(new Error('Only .jpg, .png or .jpeg format allowed!'));
            }
        } else {
            cb(new Error('There was an unknown error!'));
        }
    }
});

module.exports = avatarUpload;