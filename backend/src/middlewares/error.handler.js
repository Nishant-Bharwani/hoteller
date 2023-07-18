const { errorResponse } = require('../configs/api.response');
const { SERVER_ERROR } = require('../../errors');

exports.notFoundRoute = (_req, res, next) => {
    res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'Sorry! Your request url was not found'
    ));
};

exports.errorHandler = (err, _req, res, next) => {
    if (res.headerNext) {
        return next('Something went wrong. App server error.');
    }

    if (err.message) {
        res.status(500).json(errorResponse(
            2,
            SERVER_ERROR,
            err.message
        ));
    } else {
        res.status(500).json(errorResponse(
            2,
            SERVER_ERROR,
            'Something went wrong. There was an error.'
        ));
    }
};