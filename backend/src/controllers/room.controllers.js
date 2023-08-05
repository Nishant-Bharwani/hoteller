const HotelModel = require('../models/hotel.model');
const { successResponse, errorResponse } = require('../configs/api.response');
const { SERVER_ERROR } = require('../../errors');
const RoomModel = require('../models/room.model');
const QueryHelper = require('../configs/api.feature');
const fs = require('fs');
const appRoot = require('app-root-path');

class RoomController {
    async getRoomsByHotelSlug(req, res) {
        try {
            const hotelSlug = req.params.hotelSlug;

            const hotel = await HotelModel.find({ hotelSlug });
            if (!hotel) {
                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'Hotel does not exist'
                ));
            }

            const roomQuery = new QueryHelper(RoomModel.find({ hotelId: hotel[0]._id }).populate('addedBy', '-password').populate({
                path: 'roomReviews.userId',
                select: 'username fullname'
            }).populate({
                path: 'hotelId',
                select: 'name hotelSlug'
            }), req.query);

            const findRooms = await roomQuery.query;
            res.status(200).json(successResponse(
                0,
                'SUCCESS',
                'Rooms list data found successfully',
                // {
                //     rows: findRooms,
                //     total_rows: hotels.length,
                //     response_rows: findRooms.length,
                //     total_page: req?.query?.keyword ? Math.ceil(findRooms.length / req.query.limit) : Math.ceil(hotels.length / req.query.limit),
                //     current_page: req?.query?.page ? parseInt(req.query.page, 10) : 1
                // }
                findRooms
            ));




        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }
    }

    async createRoom(req, res) {
        try {
            const { hotelId, roomName, roomSlug, roomType, roomPrice, roomSize, roomCapacity, featuredRoom, roomDescription, extraFacilities = [], roomStatus } = req.body;

            const hotel = await HotelModel.findById(hotelId);
            if (!hotel) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/rooms/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }

                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'Hotel does not exist'
                ));
            }

            if (!roomName) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/rooms/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`roomName` filed is required '
                ));
            }

            if (!roomSlug) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/rooms/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`roomSlug` filed is required '
                ));
            }

            if (!roomType) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/rooms/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`roomType` filed is required '
                ));
            }

            if (!roomPrice) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/rooms/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`roomPrice` filed is required '
                ));
            }

            if (!roomSize) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/rooms/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`roomSize` filed is required '
                ));
            }

            if (!roomCapacity) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/rooms/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`roomCapacity` filed is required '
                ));
            }

            if (!roomDescription) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/rooms/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`roomDescription` filed is required '
                ));
            }

            if (!req.files[0]) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/rooms/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    'Minimum 1 `roomImage` filed is required '
                ));
            }

            const room1 = await RoomModel.findOne({ roomName });
            if (room1) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/rooms/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(409).json(errorResponse(
                    9,
                    'ALREADY EXIST',
                    'Sorry, this `roomName` already exists'
                ));
            }

            const room2 = await RoomModel.findOne({ roomSlug });
            if (room2) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/rooms/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(409).json(errorResponse(
                    9,
                    'ALREADY EXIST',
                    'Sorry, `room_slug` already exists'
                ));
            }

            const data = {
                hotelId,
                roomName,
                roomSlug,
                roomType,
                roomPrice,
                roomSize,
                roomCapacity,
                featuredRoom,
                roomDescription,
                extraFacilities,
                roomImages: req?.files?.map((file) => ({ url: `/public/uploads/rooms/${file.filename}` })),
                roomStatus,
                addedBy: req.user._id
            };

            const room = await RoomModel.create(data);
            res.status(201).json(successResponse(
                0,
                'SUCCESS',
                'New room create successful',
                room
            ));
        } catch (err) {
            for (const element of req.files) {
                fs.unlink(`${appRoot}/public/uploads/rooms/${element.filename}`, (err) => {
                    if (err) { logger.error(err); }
                });
            }

            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                error
            ));
        }

    }


    async getRoomByIdOrSlug(req, res) {
        try {
            let room = {};

            if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
                room = await RoomModel.findOne({
                    _id: req.params.id,
                    hotelId: req.params.hotelId
                }).populate('addedBy', '-password').populate({
                    path: 'roomReviews.userId',
                    select: 'username fullname'
                });
            } else {
                room = await RoomModel.findOne({
                    roomSlug: req.params.id,
                    hotelId: req.params.hotelId
                }).populate('addedBy', '-password').populate({
                    path: 'roomReviews.userId',
                    select: 'username fullname'
                });
            }

            if (!room) {
                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'Room does not exist'
                ));
            }

            res.status(200).json(successResponse(
                0,
                'SUCCESS',
                'Room information got successfullly retrieved',
                room
            ));
        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }
    }

};

module.exports = new RoomController();