// Dotenv
require('dotenv').config();

// Neccessary Modules
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const appRoot = require('app-root-path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const crossOrigin = require('cors');


// Middlewares and routes

const morganLogger = require('../middlewares/morgan.logger');
const defaultController = require('../controllers/default.controllers');
const { notFoundRoute, errorHandler } = require('../middlewares/error.handler');
const { limiter } = require('../middlewares/access.limiter');
const authRoute = require('../routes/auth.routes');
const hotelRoute = require('../routes/hotel.routes');
const roomRoute = require('../routes/room.routes');
const bookingRoute = require('../routes/booking.routes');
const cityRoute = require('../routes/city.routes');
const addonRoute = require('../routes/addon.routes');
const corsOptions = require('../configs/cors.config');


const app = express();

app.use(limiter);
// app.use(morganLogger());
app.use(cookieParser());

const dbConnect = require('../db/connect.mongo.db');
dbConnect();

app.use(crossOrigin(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', defaultController.defaultController);


app.use('/api/v1/auth', authRoute);
app.use('/api/v1/hotel', hotelRoute);
app.use('/api/v1/room', roomRoute);
app.use('/api/v1/booking', bookingRoute);
app.use('/api/v1/city', cityRoute);
app.use('/api/v1/addon', addonRoute);

app.use(notFoundRoute);
app.use(errorHandler);
module.exports = app;