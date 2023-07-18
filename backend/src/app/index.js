// Dotenv
require('dotenv').config();

// Neccessary Modules
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const appRoot = require('app-root-path');
const helmet = require('helmet');

// Middlewares and routes

const morganLogger = require('../middlewares/morgan.logger');
const defaultController = require('../controllers/default.controller');
const { notFoundRoute, errorHandler } = require('../middlewares/error.handler');
const { limiter } = require('../middlewares/access.limiter');


const app = express();

app.use(limiter);
app.use(morganLogger());

const dbConnect = require('../db/connect.mongo.db');
dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', defaultController.defaultController);


// app.use('/api/v1/auth', authRoute);

app.use(notFoundRoute);
app.use(errorHandler);
module.exports = app;