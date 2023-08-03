const { SERVER_ERROR } = require('../../errors');
const { successResponse, errorResponse } = require('../configs/api.response');
const QueryHelper = require('../configs/api.feature');
const HotelModel = require('../models/hotel.model');
const CityModel = require('../models/city.model');
const fs = require('fs');
const appRoot = require('app-root-path');

class HotelController {
    async getAllHotels(req, res) {
        try {
            const hotels = await HotelModel.find();

            const hotelQuery = new QueryHelper(HotelModel.find().populate('addedBy', '-password').populate({
                path: 'hotelReviews.userId',
                select: 'username fullname'
            }).populate('city'), req.query).search('name').sort().paginate();

            const findHotels = await hotelQuery.query;



            res.status(200).json(successResponse(
                0,
                'SUCCESS',
                'Hotels list data found successfully',
                {
                    rows: findHotels,
                    total_rows: hotels.length,
                    response_rows: findHotels.length,
                    total_page: req?.query?.keyword ? Math.ceil(findHotels.length / req.query.limit) : Math.ceil(hotels.length / req.query.limit),
                    current_page: req?.query?.page ? parseInt(req.query.page, 10) : 1
                }
            ));


        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }
    }

    async getHotelsByCityName(req, res) {
        try {
            const hotels = await HotelModel.find();
            const cityName = req.query.city;

            const city = await CityModel.findOne({ name: cityName });
            // if (!city) {
            //     return res.status(404).json(errorResponse(
            //         4,
            //         'UNKNOWN ACCESS',
            //         'City does not exist'
            //     ));
            // }

            // const hotelQuery = new QueryHelper(HotelModel.find().populate('addedBy', '-password').populate({
            //     path: 'hotelReviews.userId',
            //     select: 'username fullname'
            // }), req.query).search('city.name').sort().paginate();
            const hotelQuery = new QueryHelper(HotelModel.find({ city: city?._id }).populate('addedBy', '-password').populate({
                path: 'hotelReviews.userId',
                select: 'username fullname'
            }).populate('city'), req.query).search().sort().paginate();

            const findHotels = await hotelQuery.query;


            res.status(200).json(successResponse(
                0,
                'SUCCESS',
                `Hotels list data found successfully for city`,
                {
                    rows: findHotels,
                    total_rows: hotels.length,
                    response_rows: findHotels.length,
                    total_page: req?.query?.city ? Math.ceil(findHotels.length / req.query.limit) : Math.ceil(hotels.length / req.query.limit),
                    current_page: req?.query?.page ? parseInt(req.query.page, 10) : 1
                },
            ));




        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }
    }

    async getHotelByIdOrSlug(req, res) {
        try {
            let hotel = {};


            if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
                hotel = await HotelModel.findById(req.params.id).populate('addedBy', '-password').populate({
                    path: 'hotelReviews.userId',
                    select: 'username fullname'
                }).populate('city');
            } else {
                hotel = await HotelModel.findOne({ hotelSlug: req.params.id }).populate('addedBy', '-password').populate({
                    path: 'hotelReviews.userId',
                    select: 'username fullname'
                }).populate('city');
            }

            if (!hotel) {
                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'Hotel does not exist'
                ));
            }

            res.status(200).json(successResponse(
                0,
                'SUCCESS',
                'Hotel information got successfullly retrieved',
                hotel
            ));
        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }
    }

    async createHotel(req, res) {
        try {
            const { name, hotelSlug, address, city, description, facilities = [] } = req.body;
            if (!name) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/hotels/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`Name` filed is required '
                ));
            }


            if (!hotelSlug) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/hotels/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`hotelSlug` filed is required '
                ));
            }

            if (!address) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/hotels/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`address` filed is required '
                ));
            }

            if (!city) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/hotels/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`city` filed is required '
                ));
            }

            if (!description) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/hotels/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    '`description` filed is required '
                ));
            }

            if (!req.files[0]) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/hotels/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    'Minimum 1 `hotelImage` filed is required '
                ));
            }

            const hotel1 = await HotelModel.findOne({ hotelSlug });

            if (hotel1) {
                for (const element of req.files) {
                    fs.unlink(`${appRoot}/public/uploads/hotels/${element.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(409).json(errorResponse(
                    9,
                    'ALREADY EXIST',
                    'Sorry, this `hotelName` already exists'
                ));
            }

            const hotel = await HotelModel.create({
                name,
                // hotelSlug: hotelSlug.replace(/\s/g, '-'),
                hotelSlug,
                address,
                city,
                description,
                facilities,
                hotelImages: req?.files?.map((file) => ({ url: `/uploads/hotels/${file.filename}` })),
                addedBy: req?.user?._id

            });

            res.status(201).json(successResponse(
                0,
                'SUCCESS',
                'New Hotel created successfullly',
                hotel
            ));
        } catch (err) {
            for (const element of req.files) {
                fs.unlink(`${appRoot}/public/uploads/hotels/${element.filename}`, (err) => {
                    if (err) { logger.error(err); }
                });
            }

            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }
    }

};

module.exports = new HotelController();