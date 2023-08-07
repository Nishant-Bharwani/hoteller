const paymentControllers = require('../controllers/payment.controllers');

const router = require('express').Router();

router.route('/create-payment').post(paymentControllers.createCheckout);

module.exports = router;