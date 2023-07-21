const multer = require('multer');
const path = require('path');

const fs = require('fs');


const uploadPath = () => {
    const UPLOADS_FOLDER = './public/uploads/rooms';

    if (!fs.existsSync('./public/uploads')) {
        fs.mkdirSync('./public/uploads', { recursive: true });
    }

    if (!fs.existsSync(UPLOADS_FOLDER)) {
        fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
    }

    return UPLOADS_FOLDER;
};

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadPath());
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = `${file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-')}-${Date.now()}.${Math.round(Math.random() * 1e9)}`;

        cb(null, fileName + fileExt);
    }
});


const roomImageUpload = multer({
    storage,
    limits: {
        fileSize: 1000000 // 1MB
    },
    fileFilter: (_req, files, cb) => {
        if (files.fieldname === 'roomImages') {
            if (files.mimetype === 'image/png' || files.mimetype === 'image/jpg' || files.mimetype === 'image/jpeg') {
                cb(null, true);
            } else {
                cb(new Error('Only .jpg, .png or .jpeg format allowed!'));
            }
        } else {
            cb(new Error('There was an unknown error!'));
        }
    }
})

module.exports = roomImageUpload;