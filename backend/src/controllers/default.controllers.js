const { successResponse, errorResponse } = require('../configs/api.response');
const { SERVER_ERROR } = require('../../errors');
const { API_SUCCESS_MESSAGE } = require('../../constants');

class DefaultController {
    defaultController(_req, res) {
        try {
            res.status(200).json(successResponse(
                0,
                'SUCCESS',
                API_SUCCESS_MESSAGE
            ));
        } catch (err) {
            res.status(500).json(errorResponse(2, SERVER_ERROR, err));
        }
    }
};

module.exports = new DefaultController();