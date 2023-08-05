const { APP_SERVICE_URL } = require("../../config");

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    APP_SERVICE_URL
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS origin'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = corsOptions;