const currentDataTime = require('../lib/current.date.time');

exports.successResponse = (resultCode, title, message, data, maintenance) => ({
    result_code: resultCode,
    time: currentDataTime(),
    maintenance_info: maintenance || null,
    result: {
        title,
        message,
        data
    }
});

exports.errorResponse = (resultCode, title, error, maintenance) => ({
    result_code: resultCode,
    time: currentDateTime(),
    maintenance_info: maintenance || null,
    result: {
        title,
        error
    }
});