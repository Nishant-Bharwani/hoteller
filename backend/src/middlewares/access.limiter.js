const path = require('path');
const fs = require('fs');
const appRoot = require('app-root-path');
const rateLimit = require('express-rate-limit');
const rfs = require('rotating-file-stream');
const { errorResponse } = require('../configs/api.response');
const currentDateTime = require('../lib/current.date.time');
const logger = require('./winston.logger');

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 min.
    max: 1000,
    message: {
        message: 'Too many login attempts from this IP, please try again after a 60-second pause'
    },
    handler: async (req, res, _next, options) => {
        try {
            const LOGS_FOLDER = `${appRoot}/logs/limiter`;

            if (!fs.existsSync(`${appRoot}/logs`)) {
                fs.mkdirSync(`${appRoot}/logs`);
            }

            if (!fs.existsSync(LOGS_FOLDER)) {
                fs.mkdirSync(LOGS_FOLDER);
            }

            // const apiLimiterRotator = FileStreamRotator.getStream({
            //     date_format: 'YYYY-MM-DD',
            //     filename: path.join(LOGS_FOLDER, 'app-limiter-%DATE%.log'),
            //     frequency: 'daily',
            //     verbose: 'false'
            // });

            const apiLimiterRotator = rfs.createStream(path.join(LOGS_FOLDER, 'app-limiter-%DATE%.log'), {
                size: '3M',
                interval: '1d',
                compress: 'gzip'
            });

            const logMessage = `[${currentDateTime}]\tTITLE: TOO MANY REQUEST\tMETHOD: ${req.method}\tURL: ${req.url}\tCLIENT: ${req.headers['user-agent']}\n`;
            apiLimiterRotator.write(logMessage, 'utf-8');

        } catch (err) {
            logger.error('API limiter error: ', err);
        }

        res.status(options.statusCode).send(errorResponse(
            29,
            'TOO MANY REQUEST',
            options.message.message
        ));
    },

    standardHeaders: true,
    legacyHeaders: false
});



const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { message: 'Too many login attempts from this IP, please try again after a 60 second pause' },
    handler: async (req, res, _next, options) => {
        try {
            const LOGS_FOLDER = `${appRoot}/logs/limiter`;


            if (!fs.existsSync(`${appRoot}/logs`)) {
                fs.mkdirSync(`${appRoot}/logs`);
            }

            if (!fs.existsSync(LOGS_FOLDER)) {
                fs.mkdirSync(LOGS_FOLDER);
            }


            const apiLimiterRotator = rfs.createStream(path.join(LOGS_FOLDER, 'api-limiter-%DATE%.log'), {
                size: '3M',
                interval: '1d',
                compress: 'gzip'
            });

            const logMessage = `[${currentDateTime()}]\tTITLE: TOO MANY REQUEST\tMETHOD: ${req.method}\tURL: ${req.url}\tCLIENT: ${req.headers['user-agent']}\n`;

            apiLimiterRotator.write(logMessage, 'utf8');
        } catch (err) {
            logger.error('API limiter error: ', err);
        }

        res.status(options.statusCode).send(errorResponse(
            29,
            'TOO MANY REQUEST',
            options.message.message
        ));

    },

    standardHeaders: true,
    legacyHeaders: false

});

module.exports = { limiter, apiLimiter };