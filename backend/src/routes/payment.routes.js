const paymentControllers = require('../controllers/payment.controllers');

const router = require('express').Router();
const { isAuthenticatedUser, isBlocked } = require('../middlewares/app.authentication');


router.route('/confirm-payment').post(isAuthenticatedUser, isBlocked, paymentControllers.confirmPayment);
router.route('/razorpay/getKey').get(isAuthenticatedUser, isBlocked, paymentControllers.getRazorpayKey);
module.exports = router;