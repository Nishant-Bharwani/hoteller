const fs = require('fs');
const { SERVER_ERROR } = require("../../errors");
const { errorResponse, successResponse } = require("../configs/api.response");
const UserModel = require("../models/user.model");
const hashService = require("../services/hash.service");
const logger = require('../middlewares/winston.logger');
const appRoot = require('app-root-path');
const moment = require('moment');

class AuthController {
    async register(req, res) {
        try {
            const { username, fullname, email, phone, password, dob, address, gender, role } = req.body;
            console.log(username);
            if (username && fullname && email && password && dob && address) {
                const usernameExists = await UserModel.findOne({ username });
                const emailExists = await UserModel.findOne({ email });
                const phoneExists = await UserModel.findOne({ phone });

                if (usernameExists) {
                    // Delete image
                    if (req?.file?.filename) {
                        fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
                            if (err) { logger.error(err); }
                        });
                    }

                    return res.status(409).json(errorResponse(
                        9,
                        'ALREADY EXISTS',
                        'Sorry, Username already exists'
                    ));
                }

                if (emailExists) {
                    if (req?.file?.filename) {
                        fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
                           if (err) { logger.error(err); }
                        });
                    }
                    return res.status(409).json(errorResponse(
                        9,
                        'ALREADY EXIST',
                        'Sorry, Email already exists'
                    ));
                }

                if (phoneExists) {
                    if (req?.file?.filename) {
                        fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
                            if (err) { logger.error(err); }
                        });
                    }
                    return res.status(409).json(errorResponse(
                        9,
                        'ALREADY EXIST',
                        'Sorry, Phone number already exists'
                    ));
                }

                const hashedPassword = await hashService.hashPassword(password);

                const user = await UserModel.create({
                    username,
                    fullname,
                    email,
                    phone,
                    password: hashedPassword,
                    avatar: req.file ? `/uploads/users/${req.file.filename}` : '/avatar.png',
                    gender,
                    dob: moment(dob, 'DD-MM_YYYY').toDate(),
                    address,
                    role
                });

                res.status(201).json(successResponse(
                    0,
                    'SUCCESS',
                    'User registered successful', {
                    userName: user.userName,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    avatar: process.env.APP_BASE_URL + user.avatar,
                    gender: user.gender,
                    dob: user.dob,
                    address: user.address,
                    role: user.role,
                    verified: user.verified,
                    status: user.status,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
                ));





            } else {
                // Delete image
                if (req?.file?.filename) {
                    fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    'Please enter all required fields'
                ));
            }
        } catch (err) {
            if (req?.file?.filename) {
                fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
                    if (err) { logger.error(err); }
                });
            }

            res.status(500).json(errorResponse(
                2,
                'SERVER SIDE ERROR',
                err
            ));
        }
    }
};

module.exports = new AuthController();