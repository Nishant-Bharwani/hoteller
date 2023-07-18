const app = require('./src/app/index');
const logger = require('./src/middlewares/winston.logger');
const { HOST, BASE_URL } = require('./config');
const PORT = process.env.PORT || 5000;
app.listen(PORT, HOST, () => {
    logger.info(`App running on ${BASE_URL}`);
});