const fs = require('fs');
const path = require('path');
const appRoot = require('app-root-path');
// const FileStreamRotator = require('file-stream-rotator');
const rfs = require('rotating-file-stream');
const morgan = require('morgan');

function morganLogger() {
    const LOGS_FOLDER = `${appRoot}/logs/access`;

    if (!fs.existsSync(`${appRoot}/logs`)) {
        fs.mkdirSync(`${appRoot}/logs`);
    }

    if (!fs.existsSync(LOGS_FOLDER)) {
        fs.mkdirSync(LOGS_FOLDER);
    }

    // const accessLogStream = FileStreamRotator.getStream({
    //     date_format: 'YYYY-MM-DD',
    //     filename: path.join(LOGS_FOLDER, 'access-%DATE%.log'),
    //     frequency: 'daily',
    //     verbose: false
    // });



    const accessLogStream = rfs.createStream(path.join(LOGS_FOLDER, 'access-%DATE%.log'), {
        size: '3M',
        interval: '1d',
        compress: 'gzip',
    });

    return morgan('dev', {
        stream: accessLogStream
    });
};


module.exports = morganLogger;