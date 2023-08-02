const { SERVER_ERROR } = require("../../errors");
const { successResponse, errorResponse } = require("../configs/api.response");
const CityModel = require("../models/city.model");

class CityController {
    async getAllCities(req, res) {
        try {
            const cities = await CityModel.find({});
            res.status(201).json(successResponse(
                0,
                'SUCCESS',
                'All cities got successfully retrieved',
                cities
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


module.exports = new CityController();