const router = require('express').Router();

const authController = require('../controllers/auth.controllers');
const avatarUpload = require('../middlewares/user.avatar.upload');

router.route('/register').post(avatarUpload.single('avatar'), authController.register);


module.exports = router;