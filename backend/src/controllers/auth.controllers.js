const fs = require('fs');
const { SERVER_ERROR } = require("../../errors");
const { errorResponse, successResponse } = require("../configs/api.response");
const UserModel = require("../models/user.model");
const hashService = require("../services/hash.service");
const logger = require('../middlewares/winston.logger');
const appRoot = require('app-root-path');
const moment = require('moment');
const loginResponse = require('../configs/login.response');

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


    async login(req, res) {
        try {
            const { usernameOrEmail, password } = req.body;
            const { loginType } = req.query;

            if (!usernameOrEmail || !password) {
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    'Please enter all necessary credentials'
                ));
            }

            const user = await UserModel.findOne({
                $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
            }).select('password');

            if (!user) {
                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'User does not exist'
                ));
            }

            if (loginType === 'admin') {
                if (user.role !== 'admin') {
                    return res.status(406).json(errorResponse(
                        6,
                        'UNABLE TO ACCESS',
                        'Accessing the page or resource you were trying to reach is forbidden'
                    ));
                }
            }

            if (user.status === 'blocked') {
                return res.status(406).json(errorResponse(
                    6,
                    'UNABLE TO ACCESS',
                    'Accessing the page or resource you were trying to reach is forbidden'
                ));
            }
            console.log(password, user.password);

            const isPasswordMatch = hashService.validateHashedPassword(password, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    'User credentials are incorrect'
                ));
            }

            const logUser = await UserModel.findByIdAndUpdate(
                user._id,
                { status: 'login' },
                { new: true }
            );

            loginResponse(res, logUser);
                
        } catch (err) {
            res.status(500).json(errorResponse(
                1,
                'FAILED',
                err
            ));
        }
    }
};

module.exports = new AuthController();