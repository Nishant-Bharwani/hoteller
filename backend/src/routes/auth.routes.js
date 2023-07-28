const router = require('express').Router();

const authController = require('../controllers/auth.controllers');
const avatarUpload = require('../middlewares/user.avatar.upload');
const { apiLimiter } = require('../middlewares/access.limiter');
const { isAuthenticatedUser, isBlocked, isRefreshTokenValid } = require('../middlewares/app.authentication');

router.route('/register').post(avatarUpload.single('avatar'), authController.register);
router.route('/login').post(apiLimiter, avatarUpload.none(), authController.login);
router.route('/logout').post(isAuthenticatedUser, authController.logout);

router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:token').post(authController.resetPassword);

router.route('/send-email-verification-link').post(isAuthenticatedUser, isBlocked, authController.sendEmailVerificationLink);
router.route('/verify-email/:token').post(authController.verifyEmail);

router.route('/refresh-token').get(isRefreshTokenValid, authController.refreshToken);

module.exports = router;