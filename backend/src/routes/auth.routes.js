const router = require('express').Router();

const authController = require('../controllers/auth.controllers');
const avatarUpload = require('../middlewares/user.avatar.upload');
const {apiLimiter} = require('../middlewares/access.limiter');
const { isAuthenticatedUser } = require('../middlewares/app.authentication');

router.route('/register').post(avatarUpload.single('avatar'), authController.register);
router.route('/login').post(apiLimiter, avatarUpload.none(), authController.login);
router.route('/logout').post(isAuthenticatedUser, authController.logout);

router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:token').post(authController.resetPassword);



module.exports = router;