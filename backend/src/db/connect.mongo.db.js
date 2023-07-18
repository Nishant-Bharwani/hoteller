const mongoose = require('mongoose');
const logger = require('../middlewares/winston.logger');

const { DB_URL } = require('../../config');

async function dbConnect() {
    try {
        await mongoose.connect(DB_URL).then(() => {
            logger.info('Connection establish to MongoDB database successful!');
        }).catch((error) => {
            logger.error('Error connecting to MongoDB: ', error);
        });
    } catch (err) {
        logger.error('Database connection error: ', err);
    }
}

module.exports = dbConnect;