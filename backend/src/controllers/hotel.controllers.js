const { SERVER_ERROR } = require('../../errors');
const { successResponse, errorResponse } = require('../configs/api.response');
const QueryHelper = require('../configs/api.feature');
const HotelModel = require('../models/hotel.model');
const CityModel = require('../models/city.model');

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
            const cityName = req.params.city;

            const city = await CityModel.findOne({ name: cityName });
            if (!city) {
                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'City does not exist'
                ));
            }

            const hotelQuery = new QueryHelper(HotelModel.find({ city: city._id }).populate('addedBy', '-password').populate({
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

    
};

module.exports = new HotelController();