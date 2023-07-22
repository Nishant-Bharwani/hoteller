const AddonModel = require("../models/addon.model");
const RoomModel = require("../models/room.model");
const UserModel = require("../models/user.model");
const BookingModel = require('../models/booking.model');
const { SERVER_ERROR } = require("../../errors");
const { successResponse, errorResponse } = require("../configs/api.response");
const moment = require('moment');

class BookingController {
    async bookRoom(req, res) {
        try {
            const { roomId, checkIn, checkOut, numberOfGuests, addons = [], status = 'pending' } = req.body;
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

            const checkInDate = moment(checkIn,'DD-MM_YYYY').toDate();
            const checkOutDate = moment(checkOut,'DD-MM_YYYY').toDate();
            
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


              
              console.log(checkIn, checkOut);
              const millisecondsPerDay = 24 * 60 * 60 * 1000;
              let numberOfDays = Math.ceil((checkOutDate - checkInDate) / (millisecondsPerDay));
              
              if (numberOfDays === 0) {
                numberOfDays = 1;
              }
              let total = numberOfDays * room.roomPrice;
              

              const selectedAddons = await AddonModel.find({ _id: { $in: addons } });

            for (const addon of selectedAddons) {
                total += addon.price;
            }
            console.log(total);
            const bookingData = {
                userId: user._id,
                roomId,
                checkIn: moment(checkIn, 'DD-MM_YYYY').toDate(),
                checkOut: moment(checkOut,'DD-MM_YYYY').toDate(),
                numberOfGuests,
                status,
                addons,
                totalPrice: total,
                paymentStatus: 'pending'
            };

            const booking = await BookingModel.create(bookingData);
            room.roomStatus = 'booked';
            await room.save();

            res.status(201).json(successResponse(
                0,
                'SUCCESS',
                'New booking created successfully',
                booking
            ));

        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }

    };
};

module.exports = new BookingController();