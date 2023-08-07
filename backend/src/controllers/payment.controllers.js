const { APP_SERVICE_URL } = require("../../config");
const { successResponse, errorResponse } = require("../configs/api.response");
const PaymentModel = require("../models/payment.model");

// const stripe = require('../configs/stripe.config');
class PaymentController {
    async createCheckout(req, res) {
        try {
            const { bookingId, transactionId, amount } = req.body;
            const paymentData = {
                bookingId,
                paymentMethod: 'card',
                transactionId,
                amount,
                status: 'completed',
            };

            const payment = await PaymentModel.create(paymentData);
            const booking = await BookingModel.findById(bookingId);
            booking.paymentStatus = 'paid';
            await booking.save();

            res.status(200).json(successResponse(
                0,
                'SUCCESS',
                'Payment recorded successfully',
                payment
            ));
        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }
    }

}

module.exports = new PaymentController();