const { APP_SERVICE_URL, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require("../../config");
const { SERVER_ERROR } = require("../../errors");
const { successResponse, errorResponse } = require("../configs/api.response");
const BookingModel = require("../models/booking.model");
const PaymentModel = require("../models/payment.model");
const crypto = require('crypto');

// const stripe = require('../configs/stripe.config');
class PaymentController {
    async confirmPayment(req, res) {
        try {
            const bookingId = req.query.bookingId;
            const booking = await BookingModel.findById(bookingId);
            if (!booking) {
                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'Booking does not exist'
                ));
            }

            const { razorpay_payment_id: razorpayPaymentId, razorpay_order_id: razorpayOrderId, razorpay_signature: razorpaySignature } = req.body;

            const body = razorpayOrderId + "|" + razorpayPaymentId;
            const expectedSignature = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
            const isAuthentic = expectedSignature === razorpaySignature;


            const paymentData = await PaymentModel.findOne({
                bookingId
            });
            if (!isAuthentic) {

                paymentData.status = 'failed';
                paymentData.save();

                booking.status = 'rejected';
                booking.paymentStatus = 'failed';
                booking.save();

                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    'Request signature did not match. Please try again with a valid signature.'
                ));
            } else {
                paymentData.status = 'completed';
                paymentData.save();

                booking.status = 'approved';
                booking.razorpayPaymentId = razorpayPaymentId;
                booking.razorpayOrderId = razorpayOrderId;
                booking.paymentStatus = 'paid';
                booking.save();

                return res.status(201).json(successResponse(
                    0,
                    'SUCCESS',
                    "Payment done! Your room is booked"
                ));

            }
        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }


    }

    getRazorpayKey(req, res) {
        try {
            res.status(200).json(successResponse(
                0,
                'SUCCESS',
                'Razorpay key got successfully retrieved',
                // { booking, razorpayOrder }
                { key: RAZORPAY_KEY_ID }
            ));
        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }
    };

}

module.exports = new PaymentController();