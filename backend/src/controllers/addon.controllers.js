const { SERVER_ERROR } = require("../../errors");
const { successResponse } = require("../configs/api.response");
const AddonModel = require("../models/addon.model");

class AddonController {
    async getAllAddons(req, res) {
        try {
            const addons = await AddonModel.find();

            res.status(201).json(successResponse(
                0,
                'SUCCESS',
                'All addons got successfully retrieved',
                addons
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

module.exports = new AddonController();