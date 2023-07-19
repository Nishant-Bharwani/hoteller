const router = require('express').Router();

const authController = require('../controllers/auth.controllers');
const avatarUpload = require('../middlewares/user.avatar.upload');
const {apiLimiter} = require('../middlewares/access.limiter');

router.route('/register').post(avatarUpload.single('avatar'), authController.register);
router.route('/login').post(apiLimiter, avatarUpload.none(), authController.login);


module.exports = router;