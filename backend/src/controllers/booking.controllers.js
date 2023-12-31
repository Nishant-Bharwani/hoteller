const AddonModel = require("../models/addon.model");
const RoomModel = require("../models/room.model");
const UserModel = require("../models/user.model");
const BookingModel = require('../models/booking.model');
const { SERVER_ERROR } = require("../../errors");
const { successResponse, errorResponse } = require("../configs/api.response");
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const razorpay = require('../configs/razorpay.config');
const PaymentModel = require("../models/payment.model");

class BookingController {
    async bookRoom(req, res) {
        try {
            const { roomId, checkIn, checkOut, numberOfGuests = 1, addons = [], status = 'pending' } = req.body;
            if (!roomId) {
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`roomId` field is required '
                ));
            }

            if (!checkIn) {
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`checkIn` field is required '
                ));
            }

            if (!checkOut) {
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`checkOut` field is required '
                ));
            }

            if (!numberOfGuests) {
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`numberOfGuests` field is required '
                ));
            }

            const user = await UserModel.findById(req.user._id);
            if (!user) {
                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'User does not exist'
                ));
            }

            const room = await RoomModel.findById(roomId);
            if (!room) {
                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'Room does not exist'
                ));
            }

            const checkInDate = moment(checkIn, 'DD-MM_YYYY').toDate();
            const checkOutDate = moment(checkOut, 'DD-MM_YYYY').toDate();

            // const existingBooking = await BookingModel.findOne({
            //     roomId,
            //     $or: [
            //       { checkIn: { $lte: checkInDate }, checkOut: { $gte: checkInDate } },
            //       { checkIn: { $lte: checkOutDate }, checkOut: { $gte: checkOutDate } },
            //       { checkIn: { $gte: checkInDate }, checkOut: { $lte: checkOutDate } },
            //     ],
            //   });

            const existingBooking = await BookingModel.findOne({
                roomId,
                $or: [
                    { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } },
                    { checkIn: { $gte: checkInDate, $lt: checkOutDate } },
                    { checkOut: { $gt: checkInDate, $lte: checkOutDate } },
                ],
            });

            if (existingBooking) {
                return res.status(409).json(errorResponse(
                    9,
                    'ALREADY EXIST',
                    'Sorry, Room is already booked for the requested dates'
                ));
            }



            const millisecondsPerDay = 24 * 60 * 60 * 1000;
            let numberOfDays = Math.ceil((checkOutDate - checkInDate) / (millisecondsPerDay));

            if (numberOfDays === 0) {
                numberOfDays = 1;
            }
            let total = numberOfDays * room.roomPrice;


            const selectedAddons = await AddonModel.find({ _id: { $in: addons } });

            for (const addon of selectedAddons) {
                total += (addon.price * numberOfDays);
            }
            const bookingData = {
                userId: user._id,
                roomId,
                checkIn: moment(checkIn, 'DD-MM_YYYY').toDate(),
                checkOut: moment(checkOut, 'DD-MM_YYYY').toDate(),
                numberOfGuests,
                status,
                addons,
                totalPrice: total,
                paymentStatus: 'pending'
            };

            const booking = await BookingModel.create(bookingData);
            // room.roomStatus = 'booked';
            // await room.save();

            const razorpayOrder = await razorpay.orders.create({
                amount: total * 100, // Amount in paise
                currency: 'INR',
                // receipt: orderId,
            });

            await PaymentModel.create({
                bookingId: booking._id,
                amount: total,
                transationId: uuidv4(),
                status: 'pending'
            });


            res.status(201).json(successResponse(
                0,
                'SUCCESS',
                'New booking created successfully',
                { booking, razorpayOrder }
            ));

        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }

    };

    async getBookingsByRoomId(req, res) {
        try {
            const roomId = req.params.roomId;

            if (!roomId) {
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`roomId` field is required '
                ));
            }

            const room = await RoomModel.findById(roomId);

            if (!room) {
                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'Room does not exist'
                ));
            }

            const bookings = await BookingModel.find({
                roomId,
                status: {
                    $in: ['approved']
                }
            });

            res.status(200).json(successResponse(
                0,
                'SUCCESS',
                'Bookings successfullly retrieved',
                bookings
            ));
        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }


    }

    async getBookingsByUserId(req, res) {
        try {
            const { user } = req;
            const userId = req.params.userId;

            if (!user) {
                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'Unauthorized access. Please login to continue'
                ));
            }

            if (user._id.toString() !== userId) {
                return res.status(403).json(errorResponse(
                    3,
                    'ACCESS FORBIDDEN',
                    'Accessing the page or resource you were trying to reach is forbidden'
                ));
            }

            const bookings = await BookingModel.find({
                userId,
                $or: [
                    { status: 'approved' },
                    { status: 'completed' }
                ]
            }).populate({
                path: 'roomId',
                populate: {
                    path: 'hotelId',
                    populate: {
                        path: 'city',
                        select: 'name state -_id'
                    }
                }
            });


            res.status(201).json(successResponse(
                0,
                'SUCCESS',
                'Bookings got successfully retrieved',
                bookings
            ));

        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }
    }

    async cancelBooking(req, res) {
        try {
            const { user } = req;
            const userId = user._id.toString();
            if (!user) {
                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'Unauthorized access. Please login to continue'
                ));
            }

            const bookingId = req.params.bookingId;
            const booking = await BookingModel.findById(bookingId);

            if (!booking) {
                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'Booking does not exist'
                ));
            }

            const room = await RoomModel.findById(booking.roomId);

            if (booking.userId.equals(userId) || room.addedBy.equals(userId)) {
                // await BookingModel.findByIdAndDelete(bookingId);
                booking.status = 'cancelled';
                booking.save();
                return res.status(201).json(successResponse(
                    0,
                    'SUCCESS',
                    'Booking cancelled successfully',
                ));
            } else {
                return res.status(406).json(errorResponse(
                    6,
                    'UNABLE TO ACCESS',
                    'Accessing the page or resource you were trying to reach is forbidden'
                ));
            }
        } catch (err) {
            return res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }

    }
};

module.exports = new BookingController();